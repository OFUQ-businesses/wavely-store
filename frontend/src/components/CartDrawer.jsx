import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const {
    cartOpen,
    closeCart,
    cart,
    cartCount,
    cartSubtotal,
    removeFromCart,
    updateQuantity,
    freeShippingRemaining,
    freeShippingProgress,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[140] bg-wv-text/35 transition-opacity duration-300 lg:bg-wv-text/25 ${
          cartOpen ? 'opacity-100 pointer-events-auto wv-drawer-overlay' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden={!cartOpen}
      />

      <aside
        className={`fixed top-0 right-0 bottom-0 z-[150] w-full max-w-md bg-wv-elevated shadow-wv-drawer flex flex-col border-l border-wv-border transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          cartOpen ? 'translate-x-0 wv-drawer-sheet' : 'translate-x-full'
        }`}
        aria-hidden={!cartOpen}
        aria-modal={cartOpen}
        role="dialog"
      >
        <header className="shrink-0 px-6 pt-6 pb-4 border-b border-wv-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-wv-serif text-2xl font-medium text-wv-text tracking-tight">
                Shopping Bag
                <span className="block text-sm font-wv-sans font-normal text-wv-muted mt-1 tracking-normal normal-case">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 -mr-2 text-wv-text hover:opacity-60 transition-opacity"
              aria-label="Close bag"
            >
              <X size={22} strokeWidth={1.25} />
            </button>
          </div>

          <div className="mt-5">
            <div className="relative h-[2px] bg-wv-border rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-wv-gold rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress * 100}%` }}
              />
              <div
                className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-wv-gold border border-wv-elevated"
                style={{ left: `${Math.min(100, Math.max(0, freeShippingProgress * 100))}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] font-wv-sans text-wv-muted tracking-wide uppercase">
              Complimentary shipping ·{' '}
              {cartSubtotal >= 150 ? (
                <span className="text-wv-text">You qualify</span>
              ) : (
                <span>${freeShippingRemaining.toFixed(0)} from complimentary shipping</span>
              )}
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto wv-hide-scrollbar px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-20">
              <p className="font-wv-serif text-xl text-wv-text">Your bag is resting</p>
              <p className="text-sm text-wv-muted font-wv-sans max-w-xs">
                Curate pieces that elevate your sanctuary — browse the collection anytime.
              </p>
              <Link
                to="/#shop"
                onClick={closeCart}
                className="wv-caption text-wv-text border-b border-wv-text pb-0.5"
              >
                Explore the collection
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.map(item => (
                <li key={item._cartId} className="flex gap-4">
                  <div className="size-[4.75rem] shrink-0 rounded-[var(--wv-radius-sm)] overflow-hidden bg-wv-card">
                    <img
                      src={item.image}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex justify-between gap-2 items-start">
                      <p className="font-wv-serif text-[15px] leading-snug text-wv-text">{item.name}</p>
                      <p className="text-sm font-wv-sans text-wv-text whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-[12px] text-wv-soft font-wv-sans">
                      {[item.colorNames?.[item.selectedColor], item.sizes?.[item.selectedColor]]
                        .filter(Boolean)
                        .join(' · ') || 'One size'}
                    </p>
                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-3 text-sm font-wv-sans text-wv-text">
                        <button
                          type="button"
                          className="opacity-70 hover:opacity-100 disabled:opacity-30"
                          onClick={() =>
                            item.quantity <= 1
                              ? removeFromCart(item._cartId)
                              : updateQuantity(item._cartId, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="min-w-[1ch] text-center tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          className="opacity-70 hover:opacity-100"
                          onClick={() => updateQuantity(item._cartId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-[11px] uppercase tracking-wide text-wv-muted underline underline-offset-2"
                        onClick={() => removeFromCart(item._cartId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="shrink-0 border-t border-wv-border px-6 py-5 bg-wv-elevated">
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-sm uppercase tracking-wide text-wv-muted font-wv-sans">Subtotal</span>
            <span className="font-wv-sans text-lg text-wv-text tabular-nums">${cartSubtotal.toFixed(2)}</span>
          </div>
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full py-3.5 bg-wv-olive text-wv-on-hero font-wv-sans text-[13px] uppercase tracking-[0.12em] font-medium rounded-[var(--wv-radius-sm)] hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Checkout
          </button>
        </footer>
      </aside>
    </>
  );
};

export default CartDrawer;
