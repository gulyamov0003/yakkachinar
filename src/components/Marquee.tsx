import './Marquee.css';

/** Slow, decorative ribbon of words. Hidden from assistive tech — the same words appear as real copy nearby. */
export function Marquee({ items, className = '' }: { items: readonly string[]; className?: string }) {
  const group = (copy: number) => (
    <div className="marquee__group" key={copy}>
      {items.map((item, index) => (
        <span key={index} className={`marquee__item${index % 2 === 1 ? ' is-outline' : ''}`}>
          {item}
          <span className="marquee__separator" />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee__track">
        {group(0)}
        {group(1)}
      </div>
    </div>
  );
}
