import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, RefreshCcw, Headphones, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Egypt',
  'Saudi Arabia',
  'UAE',
];

const STEP_LABELS = ['Shipping', 'Payment', 'Review'];

function OrderSummarySection({ cart, cartSubtotal, shippingCost, tax, total }) {
  return (
    <>
      <h2 className="font-wv-serif text-xl text-wv-text mb-5 pb-4 border-b border-wv-gold-muted/50">
        Your order summary
      </h2>

      <div className="space-y-3 mb-5 max-h-48 overflow-y-auto wv-hide-scrollbar">
        {cart.map(item => (
          <div key={item._cartId} className="flex items-center gap-3">
            <div className="size-12 rounded-[var(--wv-radius-sm)] overflow-hidden bg-wv-card border border-wv-border shrink-0">
              <img src={item.image} alt="" className="size-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-wv-sans text-wv-text leading-snug line-clamp-2">{item.name}</p>
            </div>
            <p className="text-sm font-wv-sans tabular-nums shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-wv-gold-muted/40 pt-4 mb-5 font-wv-sans text-sm">
        <div className="flex justify-between text-wv-muted">
          <span>Subtotal</span>
          <span className="text-wv-text tabular-nums">${cartSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-wv-muted">
          <span>Shipping</span>
          <span className="text-wv-text tabular-nums">
            {shippingCost === 0 ? 'Complimentary' : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-wv-muted">
          <span>Tax</span>
          <span className="text-wv-text tabular-nums">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-wv-sans text-base font-medium text-wv-text border-t border-wv-gold-muted/40 pt-3">
          <span>Total</span>
          <span className="tabular-nums">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2 font-wv-sans text-xs">
        <button
          type="button"
          className="w-full py-3 rounded-[var(--wv-radius-md)] bg-wv-text text-wv-on-hero font-medium"
        >
          Apple Pay
        </button>
        <button
          type="button"
          className="w-full py-3 rounded-[var(--wv-radius-md)] border border-wv-border bg-wv-elevated text-wv-text"
        >
          Credit card · Visa · MC · Amex
        </button>
        <button
          type="button"
          className="w-full py-3 rounded-[var(--wv-radius-md)] border border-wv-border bg-wv-elevated text-wv-text"
        >
          PayPal
        </button>
      </div>

      <div className="flex justify-around mt-6 pt-4 border-t border-wv-border">
        <div className="flex flex-col items-center gap-1 text-center">
          <Shield size={18} className="text-wv-muted" strokeWidth={1.25} />
          <span className="text-[10px] font-wv-sans text-wv-muted uppercase tracking-wide">Secure</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <RefreshCcw size={18} className="text-wv-muted" strokeWidth={1.25} />
          <span className="text-[10px] font-wv-sans text-wv-muted uppercase tracking-wide">Easy returns</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <Headphones size={18} className="text-wv-muted" strokeWidth={1.25} />
          <span className="text-[10px] font-wv-sans text-wv-muted uppercase tracking-wide">Concierge</span>
        </div>
      </div>
    </>
  );
}

const Checkout = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [saveCard, setSaveCard] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isAddingNewCard, setIsAddingNewCard] = useState(true);
  const [cardSaving, setCardSaving] = useState(false);
  const [cardMessage, setCardMessage] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const shippingCost = deliveryMethod === 'standard' ? 0 : deliveryMethod === 'express' ? 10 : 25;
  const tax = cartSubtotal * 0.06;
  const total = cartSubtotal + shippingCost + tax;

  useEffect(() => {
    if (cart.length === 0) navigate('/', { replace: true });
  }, [cart.length, navigate]);

  useEffect(() => {
    document.body.style.overflow = summaryOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [summaryOpen]);

  // If user has saved cards and hasn't explicitly chosen to add new, default to using saved
  useEffect(() => {
    if (user?.savedCards?.length > 0 && isAddingNewCard) {
      setIsAddingNewCard(false);
      setSelectedCardId(user.savedCards[0].id);
    }
  }, [user?.savedCards]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      // Save card if checkbox is checked and user is logged in and adding new card
      if (saveCard && user && isAddingNewCard) {
        // Validate card fields
        if (!form.cardNumber || !form.expiry) {
          setCardMessage('Please fill in all card details');
          return;
        }

        setCardSaving(true);
        setCardMessage('');
        
        try {
          await api.saveCard({
            cardholderName: form.fullName,
            cardNumber: form.cardNumber.replace(/\s/g, ''),
            expiry: form.expiry,
          });
          await refreshUser();
          setCardMessage('Card saved successfully');
          setSaveCard(false); // Reset checkbox after successful save
        } catch (err) {
          setCardMessage(err.message || 'Failed to save card');
          return; // Don't proceed with order if card save failed
        } finally {
          setCardSaving(false);
        }
      }

      const { orderId } = await placeOrder(cart, form, deliveryMethod);
      clearCart();
      navigate(`/track/${orderId}`, { state: { email: form.email } });
    } catch (err) {
      alert(err.message || 'Could not place order. Is the API running?');
    }
  };

  const fieldClass = name =>
    `w-full px-4 py-3.5 rounded-[var(--wv-radius-md)] border font-wv-sans text-sm text-wv-text outline-none transition-[box-shadow,border-color] bg-wv-elevated ${
      focusedField === name
        ? 'border-wv-gold-muted shadow-[0_0_0_3px_rgba(191,163,126,0.25)]'
        : 'border-[#d1d1d1] focus:border-wv-gold-muted'
    }`;

  if (cart.length === 0) return null;

  return (
    <div className="bg-[#f9f9f9] min-h-full pb-28">
      <div className="border-b border-wv-border bg-wv-elevated/80">
        <div className="max-w-4xl mx-auto px-[var(--wv-space-page)] py-6">
          <nav className="flex items-center justify-center gap-6 md:gap-10 flex-wrap" aria-label="Checkout progress">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const active = step === n;
              return (
                <div key={label} className="flex flex-col items-center min-w-[5.5rem]">
                  <span
                    className={`text-xs font-wv-sans uppercase tracking-[0.14em] ${active ? 'text-wv-text' : 'text-wv-muted'}`}
                  >
                    {n}. {label}
                  </span>
                  <span
                    className={`mt-2 h-1 w-full rounded-full ${active ? 'bg-wv-gold-muted' : 'bg-wv-border'}`}
                  />
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-[var(--wv-space-page)] py-10">
        <h1 className="font-wv-serif text-2xl md:text-3xl text-wv-text mb-8">Shipping information</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
            <div className="flex-1 min-w-0 space-y-8">
              <div className="space-y-4">
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="Full name"
                  className={fieldClass('fullName')}
                />
                <input
                  name="address1"
                  value={form.address1}
                  onChange={handleChange}
                  required
                  placeholder="Address line 1"
                  className={fieldClass('address1')}
                  onFocus={() => setFocusedField('address1')}
                  onBlur={() => setFocusedField(null)}
                />
                <input
                  name="address2"
                  value={form.address2}
                  onChange={handleChange}
                  placeholder="Address line 2 (optional)"
                  className={fieldClass('address2')}
                  onFocus={() => setFocusedField('address2')}
                  onBlur={() => setFocusedField(null)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                    className={fieldClass('city')}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <input
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    required
                    placeholder="Postal code"
                    className={fieldClass('zip')}
                    onFocus={() => setFocusedField('zip')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className={fieldClass('country')}
                  onFocus={() => setFocusedField('country')}
                  onBlur={() => setFocusedField(null)}
                >
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone"
                    className={fieldClass('phone')}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    type="email"
                    placeholder="Email"
                    className={fieldClass('email')}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <div>
                <h2 className="font-wv-serif text-lg mb-4">Delivery</h2>
                <div className="space-y-3">
                  {[
                    { id: 'standard', label: 'Standard — complimentary, 3–5 days', cost: 0 },
                    { id: 'express', label: 'Express — $10, 1–2 days', cost: 10 },
                    { id: 'overnight', label: 'Overnight — $25', cost: 25 },
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-4 rounded-[var(--wv-radius-md)] border cursor-pointer font-wv-sans text-sm transition-colors ${
                        deliveryMethod === opt.id ? 'border-wv-gold-muted bg-wv-summary/50' : 'border-wv-border bg-wv-elevated'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={opt.id}
                        checked={deliveryMethod === opt.id}
                        onChange={() => setDeliveryMethod(opt.id)}
                        className="accent-wv-forest"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-wv-serif text-lg mb-4">Payment</h2>
                <div className="space-y-4">
                  {/* Show saved cards if user is logged in */}
                  {user?.savedCards && user.savedCards.length > 0 && (
                    <>
                      <div>
                        <label className="text-xs uppercase tracking-wide text-wv-muted block mb-3">Saved cards</label>
                        <div className="space-y-3">
                          {user.savedCards.map(card => (
                            <label
                              key={card.id}
                              className={`flex items-center gap-3 p-3 rounded-[var(--wv-radius-md)] border cursor-pointer transition-colors ${
                                selectedCardId === card.id && !isAddingNewCard
                                  ? 'border-wv-gold-muted bg-wv-summary/50'
                                  : 'border-wv-border bg-wv-elevated'
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                checked={selectedCardId === card.id && !isAddingNewCard}
                                onChange={() => {
                                  setSelectedCardId(card.id);
                                  setIsAddingNewCard(false);
                                  setSaveCard(false);
                                }}
                                className="accent-wv-forest"
                              />
                              <div className="flex-1">
                                <p className="font-wv-sans text-sm text-wv-text">{card.cardholderName}</p>
                                <p className="font-wv-sans text-xs text-wv-muted">•••• •••• •••• {card.lastFour} · Expires {card.expiry}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewCard(!isAddingNewCard);
                          setSelectedCardId(null);
                        }}
                        className="text-sm text-wv-gold-muted hover:text-wv-gold-muted/80 font-wv-sans underline"
                      >
                        {isAddingNewCard ? 'Use saved card' : 'Add new card'}
                      </button>
                    </>
                  )}

                  {/* Show card input fields if adding new card or no saved cards */}
                  {(isAddingNewCard || !user?.savedCards?.length) && (
                    <>
                      <input
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                          handleChange({ target: { name: 'cardNumber', value: formatted } });
                        }}
                        required
                        placeholder="Card number"
                        maxLength={19}
                        className={fieldClass('cardNumber')}
                        onFocus={() => setFocusedField('cardNumber')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          name="expiry"
                          value={form.expiry}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            const formatted = val.length >= 2 ? val.slice(0, 2) + '/' + val.slice(2) : val;
                            handleChange({ target: { name: 'expiry', value: formatted } });
                          }}
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                          className={fieldClass('expiry')}
                          onFocus={() => setFocusedField('expiry')}
                          onBlur={() => setFocusedField(null)}
                        />
                        <input
                          name="cvc"
                          value={form.cvc}
                          onChange={handleChange}
                          required
                          placeholder="CVC"
                          maxLength={4}
                          className={fieldClass('cvc')}
                          onFocus={() => setFocusedField('cvc')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                      {user && (
                        <>
                          <label className="flex items-center gap-2 cursor-pointer font-wv-sans text-sm text-wv-muted">
                            <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} className="accent-wv-forest" disabled={cardSaving} />
                            Save card for future visits
                          </label>
                          {cardMessage && (
                            <p className={`text-xs ${cardMessage.includes('saved successfully') ? 'text-green-600' : 'text-red-500'}`}>
                              {cardMessage}
                            </p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={cardSaving}
                className="w-full py-4 rounded-[var(--wv-radius-md)] bg-wv-forest text-wv-on-hero font-wv-sans text-[13px] uppercase tracking-[0.14em] hover:opacity-95 transition-opacity disabled:opacity-60"
              >
                {cardSaving ? 'Saving card...' : 'Place order'}
              </button>
              <p className="flex items-center justify-center gap-2 text-xs font-wv-sans text-wv-muted">
                <Shield size={14} /> Secure checkout
              </p>
            </div>

            <div className="hidden lg:block w-full lg:w-[22rem] shrink-0">
              <div className="sticky top-[calc(var(--wv-header-h)+1.5rem)] bg-wv-summary border border-wv-gold-muted rounded-[var(--wv-radius-lg)] p-6">
                <OrderSummarySection
                  cart={cart}
                  cartSubtotal={cartSubtotal}
                  shippingCost={shippingCost}
                  tax={tax}
                  total={total}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <button
        type="button"
        className="lg:hidden fixed bottom-6 right-6 z-[90] px-5 py-3 rounded-full bg-wv-forest text-wv-on-hero text-xs font-wv-sans uppercase tracking-[0.12em] shadow-wv-drawer"
        onClick={() => setSummaryOpen(true)}
      >
        Summary · ${total.toFixed(0)}
      </button>

      {summaryOpen && (
        <>
          <div className="fixed inset-0 z-[130] bg-wv-text/40 lg:hidden" onClick={() => setSummaryOpen(false)} />
          <aside className="fixed top-0 right-0 bottom-0 z-[135] w-full max-w-md bg-wv-summary border-l border-wv-gold-muted p-6 overflow-y-auto lg:hidden shadow-wv-drawer">
            <div className="flex justify-between items-center mb-4">
              <span className="font-wv-serif text-lg">Order summary</span>
              <button type="button" onClick={() => setSummaryOpen(false)} aria-label="Close">
                <X size={22} strokeWidth={1.25} />
              </button>
            </div>
            <OrderSummarySection
              cart={cart}
              cartSubtotal={cartSubtotal}
              shippingCost={shippingCost}
              tax={tax}
              total={total}
            />
          </aside>
        </>
      )}
    </div>
  );
};

export default Checkout;
