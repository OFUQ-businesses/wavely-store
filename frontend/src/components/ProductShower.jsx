import { ShoppingBag, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import DiscountBadge from './DiscountBadge';

const ProductShower = ({ product, gridView = true, compact = false }) => {
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(0);
  const [added, setAdded] = useState(false);
  const discount = product.discountPercent ?? 50;

  const handleProductClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleAddToCart = e => {
    e.stopPropagation();
    addToCart(product, 1, selectedColor);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1600);
  };

  if (!gridView) {
    return (
      <button
        type="button"
        onClick={handleProductClick}
        className="w-[95%] bg-wv-elevated rounded-[var(--wv-radius-lg)] border border-wv-border overflow-hidden flex flex-row items-stretch gap-6 text-left cursor-pointer hover:shadow-wv-drawer transition-shadow duration-300"
      >
        <div className="shrink-0 w-[28%] min-h-[10rem] bg-wv-card overflow-hidden">
          <img src={product.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 py-6 pr-6 flex flex-col justify-center">
          <h3 className="font-wv-serif text-2xl text-wv-text mb-2">{product.name}</h3>
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="font-wv-sans text-lg text-wv-text tabular-nums">${product.price.toFixed(2)}</p>
            {product.compareAtPrice > product.price && (
              <p className="font-wv-sans text-sm text-wv-muted line-through tabular-nums">
                ${product.compareAtPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </button>
    );
  }

  const pad = compact ? 'p-3' : 'p-4';
  const titleClass = compact
    ? 'font-wv-serif text-[15px] leading-snug text-wv-text line-clamp-2 min-h-[2.5rem]'
    : 'font-wv-serif text-lg text-wv-text line-clamp-2';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleProductClick}
      onKeyDown={e => e.key === 'Enter' && handleProductClick()}
      className={`bg-wv-elevated rounded-[var(--wv-radius-lg)] border border-wv-border overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-wv-drawer transition-shadow duration-300 outline-none focus-visible:ring-2 focus-visible:ring-wv-gold ${compact ? 'min-h-0' : ''}`}
    >
      <div className={`relative w-full bg-wv-card ${compact ? 'aspect-[4/5]' : 'aspect-square'} overflow-hidden`}>
        <DiscountBadge percent={discount} />
        {product.isBestseller && (
          <span className="absolute top-3 right-3 z-10 wv-caption text-[9px] px-2 py-1 bg-wv-text text-wv-on-hero rounded-[var(--wv-radius-sm)]">
            Best seller
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-12 right-3 z-10 wv-caption text-[9px] px-2 py-1 border border-wv-border bg-wv-elevated text-wv-text rounded-[var(--wv-radius-sm)]">
            New
          </span>
        )}
        <img src={product.image} alt="" className="w-full h-full object-cover" />
      </div>

      <div className={`${pad} flex flex-col flex-1 gap-2`}>
        <h3 className={titleClass}>{product.name}</h3>
        <div className="flex items-baseline gap-2 flex-wrap">
          <p className="font-wv-sans text-sm font-medium text-wv-text tabular-nums">${product.price.toFixed(2)}</p>
          {product.compareAtPrice > product.price && (
            <p className="font-wv-sans text-xs text-wv-muted line-through tabular-nums">
              ${product.compareAtPrice.toFixed(2)}
            </p>
          )}
        </div>

        {product.colors && product.colors.length > 1 && !compact && (
          <div className="flex gap-1.5 pt-1" onClick={e => e.stopPropagation()}>
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setSelectedColor(idx);
                }}
                className={`size-4 rounded-full border ${selectedColor === idx ? 'border-wv-text ring-1 ring-wv-text' : 'border-wv-border'}`}
                style={{ backgroundColor: color }}
                title={product.colorNames?.[idx]}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-auto w-full py-2.5 font-wv-sans text-[11px] uppercase tracking-[0.14em] flex items-center justify-center gap-2 border border-wv-border-strong rounded-[var(--wv-radius-sm)] transition-colors ${
            added ? 'bg-wv-forest text-wv-on-hero border-wv-forest' : 'bg-transparent text-wv-text hover:bg-wv-page'
          }`}
        >
          {added ? (
            <>
              <Check size={16} strokeWidth={1.5} /> Added
            </>
          ) : (
            <>
              <ShoppingBag size={16} strokeWidth={1.25} /> Add to bag
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductShower;
