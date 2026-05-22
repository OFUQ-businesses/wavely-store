import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hero tile with swipe gestures and directional arrows (matches boutique grid spec).
 */

const HeroProductCarousel = ({ product }) => {
  const navigate = useNavigate();
  const slides =
    product.gallery && product.gallery.length > 1
      ? product.gallery
      : [product.image, product.image, product.image];

  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const dragging = useRef(false);

  const go = delta => {
    setIndex(i => {
      const n = slides.length;
      return (i + delta + n) % n;
    });
  };

  const onPointerDown = e => {
    dragging.current = true;
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  };

  const onPointerUp = e => {
    if (!dragging.current) return;
    dragging.current = false;
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const dx = x - startX.current;
    if (dx < -40) go(1);
    else if (dx > 40) go(-1);
  };

  return (
    <div className="flex flex-col h-full bg-wv-card rounded-[var(--wv-radius-lg)] overflow-hidden border border-wv-border">
      <button
        type="button"
        onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
        className="relative flex-1 min-h-[clamp(260px,42vw,480px)] text-left group outline-none focus-visible:ring-2 focus-visible:ring-wv-gold focus-visible:ring-offset-2"
      >
        <div
          className="absolute inset-0 bg-wv-card"
          onTouchStart={onPointerDown}
          onTouchEnd={onPointerUp}
          onMouseDown={onPointerDown}
          onMouseUp={onPointerUp}
          onMouseLeave={() => {
            dragging.current = false;
          }}
        >
          <img
            key={`${product.id}-${index}`}
            src={slides[index]}
            alt=""
            className="w-full h-full object-cover select-none"
            draggable={false}
          />
        </div>
        <span className="absolute bottom-4 right-4 px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-wv-sans bg-wv-elevated/90 text-wv-text border border-wv-border rounded-[var(--wv-radius-sm)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Quick view
        </span>
      </button>

      <div className="shrink-0 px-6 py-5 bg-wv-elevated border-t border-wv-border flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="font-wv-serif text-xl lg:text-2xl text-wv-text">{product.name}</p>
          <p className="font-wv-sans text-sm text-wv-muted mt-1 tabular-nums">${product.price.toFixed(2)}</p>
        </div>
        <div className="flex gap-10 text-wv-text pb-1">
          <button
            type="button"
            aria-label="Previous image"
            className="text-2xl font-light hover:opacity-50 transition-opacity leading-none px-2"
            onClick={e => {
              e.stopPropagation();
              go(-1);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            className="text-2xl font-light hover:opacity-50 transition-opacity leading-none px-2"
            onClick={e => {
              e.stopPropagation();
              go(1);
            }}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroProductCarousel;
