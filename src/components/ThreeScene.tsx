import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BackSide,
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NoColorSpace,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  WebGLRenderer,
  type Texture,
} from 'three';
import { publicUrl } from '../lib/image';

interface ThreeSceneProps {
  className?: string;
  /** When false a single still frame is rendered (reduced motion). */
  animate?: boolean;
  onReady?: () => void;
  onError?: () => void;
}

/** Maps generated from the official logo file by scripts/build-logo.py. */
const TEXTURES = {
  color: publicUrl('brand/yakkachinar-medallion-color.webp'),
  gold: publicUrl('brand/yakkachinar-logo-gold-512.webp'),
  orm: publicUrl('brand/yakkachinar-medallion-orm.webp'),
  bump: publicUrl('brand/yakkachinar-medallion-bump.webp'),
} as const;

const FACE_RADIUS = 1;
const HALF_DEPTH = 0.07;
const RIM_WIDTH = 0.05;
/** Height of the face's convexity at its centre. */
const DOME = 0.05;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/** Rounded medallion edge: a half-round profile turned around the medallion's axis. */
function createRimGeometry(): LatheGeometry {
  const profile: Vector2[] = [];
  const steps = 20;
  for (let index = 0; index <= steps; index += 1) {
    const angle = -Math.PI / 2 + (index / steps) * Math.PI;
    profile.push(new Vector2(FACE_RADIUS + RIM_WIDTH * Math.cos(angle), HALF_DEPTH * Math.sin(angle)));
  }
  const geometry = new LatheGeometry(profile, 180);
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

/**
 * A dark photographic studio used only for reflections: warm grey walls give the gold its body and
 * three soft strip lights give it highlights. A bright room would mirror its white ceiling panels
 * across the black enamel at some tilts; here a reflection is never more than a soft band.
 */
function createStudio(): { scene: Scene; dispose: () => void } {
  const scene = new Scene();
  const walls = new BoxGeometry(14, 14, 14);
  const wallMaterial = new MeshBasicMaterial({ color: new Color(0.5, 0.44, 0.37), side: BackSide });
  scene.add(new Mesh(walls, wallMaterial));

  const panel = new PlaneGeometry(1, 1);
  const materials = [wallMaterial];
  const addLight = (width: number, height: number, intensity: number, x: number, y: number, z: number) => {
    const material = new MeshBasicMaterial({ color: new Color(1, 0.9, 0.76).multiplyScalar(intensity), side: DoubleSide });
    const light = new Mesh(panel, material);
    light.scale.set(width, height, 1);
    light.position.set(x, y, z);
    light.lookAt(0, 0, 0);
    scene.add(light);
    materials.push(material);
  };
  addLight(5, 0.7, 6, 0, 5.5, 1.5); // long overhead strip
  addLight(0.8, 5, 4, -6, 0.6, 2.5); // tall strip, left
  addLight(2.6, 2.6, 3, 5.2, 2.2, 4.2); // soft box, front right

  return {
    scene,
    dispose: () => {
      walls.dispose();
      panel.dispose();
      materials.forEach((material) => material.dispose());
    },
  };
}

/**
 * The face as a very shallow dome (planar UVs, so the artwork is not distorted): reflections glide
 * across the enamel as a soft gradient instead of flashing over the whole disc at once.
 */
function createFaceGeometry(): RingGeometry {
  const geometry = new RingGeometry(0, FACE_RADIUS, 160, 28);
  const position = geometry.attributes.position;
  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    position.setZ(index, DOME * (1 - (x * x + y * y) / (FACE_RADIUS * FACE_RADIUS)));
  }
  geometry.computeVertexNormals();
  return geometry;
}

function createShadowTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.36)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

const SWEEP_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** A soft diagonal band of warm light that only touches the gold artwork. */
const SWEEP_FRAGMENT = /* glsl */ `
  uniform sampler2D uGold;
  uniform float uProgress;
  uniform float uStrength;
  varying vec2 vUv;
  void main() {
    float gold = texture2D(uGold, vUv).a;
    float offset = (vUv.x * 0.82 + vUv.y * 0.58) - uProgress;
    float band = exp(-(offset * offset) / 0.006);
    float light = band * gold * uStrength;
    gl_FragColor = vec4(vec3(1.0, 0.9, 0.7) * light, 1.0);
  }
`;

/**
 * The official Yakkachinar crest as a physical medallion: glossy black enamel, gold artwork with
 * relief, a bevelled gold rim, a slowly orbiting key light and an occasional light sweep.
 * Motion is deliberately slow; the pointer adds a gentle tilt. Paused whenever it is off-screen.
 */
export default function ThreeScene({ className, animate = true, onReady, onError }: ThreeSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReady, onError });

  useLayoutEffect(() => {
    callbacks.current = { onReady, onError };
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      callbacks.current.onError?.();
      return;
    }

    const device = navigator as Navigator & { deviceMemory?: number };
    const lowPower = (device.hardwareConcurrency ?? 8) <= 4 || (device.deviceMemory ?? 8) <= 4;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.25 : 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setClearColor(0x000000, 0);
    // Shader diagnostics are for development; in production they only add synchronous GL calls
    // and surface harmless ANGLE/D3D compiler notes in the console on Windows.
    renderer.debug.checkShaderErrors = import.meta.env.DEV;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    const studio = createStudio();
    const environment = pmrem.fromScene(studio.scene, 0.04).texture;
    studio.dispose();
    scene.environment = environment;

    const camera = new PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0, 5.7);

    const stage = new Group();
    const medallion = new Group();
    stage.add(medallion);
    scene.add(stage);

    const shadowTexture = createShadowTexture();
    const shadowMaterial = new MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, toneMapped: false, opacity: 0 });
    const shadowGeometry = new PlaneGeometry(3.1, 3.1);
    const shadow = new Mesh(shadowGeometry, shadowMaterial);
    shadow.position.set(0.05, -0.2, -0.95);
    scene.add(shadow);

    const key = new DirectionalLight(new Color('#ffe0b5'), 2.2);
    const fill = new DirectionalLight(new Color('#a7b8ff'), 0.35);
    fill.position.set(-4, -1.5, 2.5);
    scene.add(key, fill, new AmbientLight(0xffffff, 0.08));

    const disposables: { dispose: () => void }[] = [shadowTexture, shadowMaterial, shadowGeometry];
    const sweepUniforms = {
      uGold: { value: null as Texture | null },
      uProgress: { value: -1 },
      uStrength: { value: 0 },
    };

    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let startedAt = performance.now();
    let last = startedAt;
    let frame = 0;
    let running = false;
    let inView = true;
    let loaded = false;
    let disposed = false;

    const renderFrame = (now: number) => {
      const delta = Math.min(0.1, Math.max(0, (now - last) / 1000));
      last = now;
      const time = animate ? (now - startedAt) / 1000 : 0;
      const follow = 1 - Math.exp(-delta * 3.5);
      eased.x += (pointer.x - eased.x) * follow;
      eased.y += (pointer.y - eased.y) * follow;

      const intro = animate ? easeOutCubic(clamp01(time / 2.6)) : 1;
      // The face turns gently toward the pointer on both axes.
      medallion.rotation.y = (1 - intro) * -0.75 + Math.sin(time * 0.16) * 0.16 + eased.x * 0.24;
      medallion.rotation.x = Math.sin(time * 0.12 + 1.3) * 0.06 + eased.y * 0.16;
      medallion.rotation.z = Math.sin(time * 0.09) * 0.02;
      const float = Math.sin(time * 0.55) * 0.035;
      stage.position.set(eased.x * 0.07, float - eased.y * 0.05, 0);
      stage.scale.setScalar(0.88 + 0.12 * intro);
      shadow.position.set(0.05 - eased.x * 0.14, -0.2 - float * 0.4 + eased.y * 0.05, -0.95);
      shadowMaterial.opacity = (0.72 - float * 1.4) * intro;

      key.position.set(Math.cos(time * 0.2) * 3.4, 2.3 + Math.sin(time * 0.13) * 0.9, 4.6);

      const cycle = 8;
      const sweepDuration = 1.8;
      const local = time - 1.6;
      if (animate && local > 0 && local % cycle < sweepDuration) {
        const progress = (local % cycle) / sweepDuration;
        sweepUniforms.uProgress.value = -0.3 + easeInOutSine(progress) * 2;
        sweepUniforms.uStrength.value = Math.sin(progress * Math.PI) * 0.7;
      } else {
        sweepUniforms.uStrength.value = 0;
      }

      renderer.render(scene, camera);
    };

    const loop = (now: number) => {
      renderFrame(now);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || !loaded || !animate || !inView || document.hidden) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (loaded && !running) renderFrame(performance.now());
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const loader = new TextureLoader();
    const load = (url: string) => new Promise<Texture>((resolve, reject) => loader.load(url, resolve, undefined, reject));

    Promise.all([load(TEXTURES.color), load(TEXTURES.gold), load(TEXTURES.orm), load(TEXTURES.bump)])
      .then(([color, gold, orm, bump]) => {
        if (disposed) {
          [color, gold, orm, bump].forEach((texture) => texture.dispose());
          return;
        }
        const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        color.colorSpace = SRGBColorSpace;
        color.anisotropy = anisotropy;
        for (const texture of [gold, orm, bump]) {
          texture.colorSpace = NoColorSpace;
          texture.anisotropy = anisotropy;
        }

        const faceMaterial = new MeshPhysicalMaterial({
          map: color,
          metalnessMap: orm,
          roughnessMap: orm,
          metalness: 1,
          roughness: 1,
          bumpMap: bump,
          bumpScale: 2.2,
          // Restrained reflections keep the enamel black at every tilt; the gold stays fully metallic.
          specularIntensity: 0.6,
          clearcoat: 0.5,
          clearcoatRoughness: 0.2,
          envMapIntensity: 0.8,
          emissive: new Color('#ffffff'),
          emissiveMap: color,
          emissiveIntensity: 0.12,
        });
        const rimMaterial = new MeshPhysicalMaterial({
          color: new Color('#caa66a'),
          metalness: 1,
          roughness: 0.26,
          clearcoat: 0.35,
          clearcoatRoughness: 0.2,
          envMapIntensity: 1.25,
          side: DoubleSide,
        });
        const backMaterial = new MeshPhysicalMaterial({ color: new Color('#15120e'), metalness: 0.7, roughness: 0.38 });
        sweepUniforms.uGold.value = gold;
        const sweepMaterial = new ShaderMaterial({
          uniforms: sweepUniforms,
          vertexShader: SWEEP_VERTEX,
          fragmentShader: SWEEP_FRAGMENT,
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
          toneMapped: false,
        });

        const faceGeometry = createFaceGeometry();
        const face = new Mesh(faceGeometry, faceMaterial);
        face.position.z = HALF_DEPTH + 0.0005;
        const sweep = new Mesh(faceGeometry, sweepMaterial);
        sweep.position.z = HALF_DEPTH + 0.002;
        const backGeometry = new CircleGeometry(FACE_RADIUS, 160);
        const back = new Mesh(backGeometry, backMaterial);
        back.rotation.y = Math.PI;
        back.position.z = -HALF_DEPTH - 0.0005;
        const rimGeometry = createRimGeometry();
        const rim = new Mesh(rimGeometry, rimMaterial);
        medallion.add(face, sweep, back, rim);

        disposables.push(
          color,
          gold,
          orm,
          bump,
          faceMaterial,
          rimMaterial,
          backMaterial,
          sweepMaterial,
          faceGeometry,
          backGeometry,
          rimGeometry,
        );
        loaded = true;
        startedAt = performance.now();
        last = startedAt;
        renderFrame(startedAt);
        start();
        callbacks.current.onReady?.();
      })
      .catch(() => {
        if (!disposed) callbacks.current.onError?.();
      });

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = host.getBoundingClientRect();
      pointer.x = Math.tanh((event.clientX - (rect.left + rect.width / 2)) / (rect.width * 1.1));
      pointer.y = Math.tanh((event.clientY - (rect.top + rect.height / 2)) / (rect.height * 1.1));
    };
    const onLeave = (event: MouseEvent) => {
      if (event.relatedTarget) return;
      pointer.x = 0;
      pointer.y = 0;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('mouseout', onLeave);

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    intersection.observe(host);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      stop();
      intersection.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('mouseout', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      disposables.forEach((item) => item.dispose());
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [animate]);

  return <div ref={hostRef} className={className} />;
}
