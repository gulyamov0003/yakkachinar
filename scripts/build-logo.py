"""
Builds the web assets for the official Yakkachinar logo from the supplied source file.

Source: assets/brand/logo_yakkachinar.jpg (150 x 150 JPEG) - the circular black-and-gold crest
(crown, laurel, monogram, "SINCE 1985") on a dark-grey square. The artwork is never redrawn:
this script only isolates the circle and resamples it.

  1. pad the square with black (the crest touches the image edge)
  2. crop the measured circle and upscale it with Lanczos resampling
  3. cut the circle out with an anti-aliased mask computed at the output resolution,
     slightly inside the grey edge so no background fringe remains

Outputs (public/brand/, regenerated from scratch on every run):
  yakkachinar-logo-{128,256,512,1024}.webp   isolated crest with transparency
  yakkachinar-logo-gold-{256,512}.webp       alpha = gold artwork (mask for light sweeps)
  yakkachinar-medallion-color.webp           opaque colour map for the 3D medallion
  yakkachinar-medallion-orm.webp             occlusion / roughness / metalness map (glTF packing)
  yakkachinar-medallion-bump.webp            relief map (gold artwork raised, enamel flat)
  ../favicon.png, ../apple-touch-icon.png

Run:  npm run logo   (requires Python 3 with Pillow)
"""

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets" / "brand" / "logo_yakkachinar.jpg"
OUT = ROOT / "public" / "brand"
PUBLIC = ROOT / "public"

# Measured on the source by scanning rays from the centre: the black badge meets the grey
# corners at r ~ 75.7 around (74.5, 75.2). Cutting at 74.6 keeps the edge free of grey fringe.
CENTER = (74.5, 75.2)
RADIUS = 74.6
PAD = 4
SIZES = (128, 256, 512, 1024)
MASK_SUPERSAMPLE = 4


def circle_mask(size: int) -> Image.Image:
    big = size * MASK_SUPERSAMPLE
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, big - 1, big - 1), fill=255)
    return mask.resize((size, size), Image.LANCZOS)


def crest_rgb(size: int, sharpen: bool) -> tuple[Image.Image, Image.Image]:
    """Crest pixels (black outside the circle) and the matching circular mask."""
    source = Image.open(SOURCE).convert("RGB")
    padded = ImageOps.expand(source, border=PAD, fill=(0, 0, 0))
    cx, cy = CENTER[0] + PAD, CENTER[1] + PAD
    box = (cx - RADIUS, cy - RADIUS, cx + RADIUS, cy + RADIUS)
    rgb = padded.resize((size, size), Image.LANCZOS, box=box)
    if sharpen and size >= 256:
        rgb = rgb.filter(ImageFilter.UnsharpMask(radius=size / 300, percent=55, threshold=3))
    mask = circle_mask(size)
    rgb = Image.composite(rgb, Image.new("RGB", rgb.size, (0, 0, 0)), mask)
    return rgb, mask


def crest(size: int, sharpen: bool) -> Image.Image:
    rgb, mask = crest_rgb(size, sharpen)
    rgba = rgb.convert("RGBA")
    rgba.putalpha(mask)
    return rgba


def gold_alpha(image: Image.Image) -> Image.Image:
    """Alpha that follows the bright gold artwork (black badge = transparent)."""
    rgb = image.convert("RGB")
    value = ImageChops.lighter(ImageChops.lighter(rgb.getchannel("R"), rgb.getchannel("G")), rgb.getchannel("B"))
    gold = value.point(lambda v: 0 if v < 45 else min(255, int((v - 45) * 255 / 115)))
    if image.mode == "RGBA":
        gold = ImageChops.multiply(gold, image.getchannel("A"))
    return gold


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for stale in OUT.iterdir():
        stale.unlink()

    for size in SIZES:
        crest(size, sharpen=True).save(OUT / f"yakkachinar-logo-{size}.webp", quality=92, method=6)

    for size in (256, 512):
        mask = Image.new("RGBA", (size, size), (255, 255, 255, 0))
        mask.putalpha(gold_alpha(crest(size, sharpen=False)))
        mask.save(OUT / f"yakkachinar-logo-gold-{size}.webp", lossless=True, method=6)

    # 3D medallion maps.
    color, _ = crest_rgb(1024, sharpen=True)
    color.save(OUT / "yakkachinar-medallion-color.webp", quality=92, method=6)
    base = crest(512, sharpen=False)
    gold = gold_alpha(base)
    occlusion = Image.new("L", base.size, 255)
    roughness = gold.point(lambda g: int(255 * (0.2 + 0.16 * g / 255)))
    Image.merge("RGB", (occlusion, roughness, gold)).save(OUT / "yakkachinar-medallion-orm.webp", lossless=True, method=6)
    # Relief follows the gold artwork only, so the black enamel stays perfectly smooth; the JPEG's
    # noise in the dark areas would otherwise read as a leathery surface under the clearcoat.
    gold.filter(ImageFilter.GaussianBlur(1.1)).save(OUT / "yakkachinar-medallion-bump.webp", lossless=True, method=6)

    # Favicons: the crest on the site's ink; iOS icons cannot be transparent.
    crest(256, sharpen=False).resize((64, 64), Image.LANCZOS).save(PUBLIC / "favicon.png", optimize=True)
    touch = Image.new("RGBA", (180, 180), (12, 11, 9, 255))
    touch.alpha_composite(crest(512, sharpen=True).resize((160, 160), Image.LANCZOS), (10, 10))
    touch.convert("RGB").save(PUBLIC / "apple-touch-icon.png", optimize=True)

    for path in sorted(OUT.iterdir()):
        print(f"{path.relative_to(ROOT)}  {path.stat().st_size / 1024:.1f} KB")
    print("public/favicon.png, public/apple-touch-icon.png written")


if __name__ == "__main__":
    main()
