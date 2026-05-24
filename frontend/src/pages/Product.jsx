import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import DiscountBadge from '../components/DiscountBadge';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const startX = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    setLoading(true);
    setImgIndex(0);
    setSelectedColor(0);
    api
      .getProduct(id)
      .then(data => {
        setProduct(data.product);
        setRelated(data.related || []);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const slides = product ? [product.image, ...(product.gallery || [])] : [];

  const onPointerDown = e => {
    dragging.current = true;
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  };

  const onPointerUp = e => {
    if (!dragging.current || !slides.length) return;
    dragging.current = false;
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const dx = x - startX.current;
    if (dx < -40) setImgIndex(i => (i + 1) % slides.length);
    else if (dx > 40) setImgIndex(i => (i - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return <p className="text-center py-24 font-wv-sans text-wv-muted">Loading piece…</p>;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-6">
        <p className="font-wv-serif text-xl text-wv-muted mb-6">Piece not found</p>
        <Link to="/" className="wv-caption text-wv-text border-b border-wv-text pb-1">Return shop</Link>
      </div>
    );
  }

  const discount = product.discountPercent ?? 50;

  return (
    <div className="bg-wv-page">
      <div className="max-w-[90rem] mx-auto px-[var(--wv-space-page)] py-8 md:py-12">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-wv-sans text-wv-muted hover:text-wv-text uppercase tracking-[0.12em] mb-8"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div
              className="aspect-[4/5] bg-wv-card border border-wv-border overflow-hidden rounded-[var(--wv-radius-md)] relative"
              onTouchStart={onPointerDown}
              onTouchEnd={onPointerUp}
              onMouseDown={onPointerDown}
              onMouseUp={onPointerUp}
              onMouseLeave={() => { dragging.current = false; }}
            >
              <DiscountBadge percent={discount} className="top-4 left-4" />
              <img src={slides[imgIndex]} alt={product.name} className="w-full h-full object-cover" draggable={false} />
            </div>
            <div className="flex justify-center gap-12 mt-6 text-wv-text">
              <button type="button" className="text-2xl font-light px-2 hover:opacity-50" onClick={() => setImgIndex(i => (i - 1 + slides.length) % slides.length)}>‹</button>
              <button type="button" className="text-2xl font-light px-2 hover:opacity-50" onClick={() => setImgIndex(i => (i + 1) % slides.length)}>›</button>
            </div>
          </div>

          <div className="flex flex-col">
            {product.isBestseller && (
              <span className="wv-caption text-wv-gold-deep mb-3 inline-block w-fit">Best seller</span>
            )}
            <h1 className="font-wv-serif text-3xl md:text-4xl text-wv-text leading-tight">{product.name}</h1>
            <div className="flex items-baseline gap-3 mt-4 flex-wrap">
              <p className="font-wv-serif text-2xl tabular-nums">${product.price.toFixed(2)}</p>
              {product.compareAtPrice > product.price && (
                <>
                  <p className="font-wv-sans text-lg text-wv-muted line-through tabular-nums">
                    ${product.compareAtPrice.toFixed(2)}
                  </p>
                  <span className="text-xs font-wv-sans uppercase tracking-wide text-wv-gold-deep font-semibold">
                    Save ${product.savings?.toFixed(2) ?? (product.compareAtPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={14}
                    className={i <= Math.floor(product.rating) ? 'fill-wv-gold-deep text-wv-gold-deep' : 'text-wv-border'}
                  />
                ))}
              </div>
              <span className="text-sm text-wv-muted font-wv-sans">
                {product.rating} · {product.reviewCount} reviews
              </span>
            </div>

            <p className="mt-6 font-wv-sans text-wv-muted leading-relaxed">{product.description}</p>

            {product.benefits?.length > 0 && (
              <div className="mt-10 border-t border-wv-border pt-8">
                <h2 className="font-wv-serif text-lg mb-4">Benefits</h2>
                <ul className="space-y-3">
                  {product.benefits.map(b => (
                    <li key={b} className="flex gap-3 text-sm font-wv-sans text-wv-muted">
                      <span className="text-wv-gold-deep shrink-0">◆</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.colors?.length > 1 && (
              <div className="mt-8">
                <p className="wv-caption text-wv-muted mb-3">Finish</p>
                <div className="flex gap-2">
                  {product.colors.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(idx)}
                      className={`size-8 rounded-full border-2 ${selectedColor === idx ? 'border-wv-text' : 'border-wv-border'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                addToCart(product, 1, selectedColor);
                openCart();
              }}
              className="mt-10 w-full py-4 bg-[#ebe4d8] border border-wv-border-strong text-wv-text font-wv-sans text-[13px] uppercase tracking-[0.14em] hover:opacity-90"
            >
              Add to bag
            </button>
          </div>
        </div>

        {product.reviews?.length > 0 && (
          <section className="mt-20 border-t border-wv-border pt-12">
            <h2 className="font-wv-serif text-2xl mb-8">Client reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map(rev => (
                <article key={rev.id} className="p-6 bg-wv-elevated border border-wv-border rounded-[var(--wv-radius-lg)]">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <p className="font-wv-serif text-wv-text">{rev.author}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={12} className={i <= rev.rating ? 'fill-wv-gold-deep text-wv-gold-deep' : 'text-wv-border'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm font-wv-sans text-wv-muted leading-relaxed">{rev.comment}</p>
                  {rev.verified && (
                    <p className="mt-2 text-[10px] uppercase tracking-wide text-wv-soft">Verified purchase</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-wv-serif text-2xl mb-6">Related pieces</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(rel => (
                <Link key={rel.id} to={`/product/${rel.id}`} className="group block">
                  <div className="aspect-square bg-wv-card border border-wv-border overflow-hidden rounded-[var(--wv-radius-sm)] mb-2 relative">
                    <DiscountBadge percent={rel.discountPercent ?? 50} className="scale-90 origin-top-left" />
                    <img src={rel.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="font-wv-sans text-xs text-wv-text truncate">{rel.name}</p>
                  <p className="font-wv-sans text-xs text-wv-muted tabular-nums">${rel.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
