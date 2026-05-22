import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrdersContext';

const TrackLookup = () => {
  const { trackOrder } = useOrders();
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await trackOrder(orderNumber.trim(), email.trim());
      navigate(`/track/${encodeURIComponent(orderNumber.trim())}`, { state: { email: email.trim() } });
    } catch (err) {
      setError(err.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-[var(--wv-space-page)] py-16 md:py-24">
      <p className="wv-caption text-wv-muted mb-3 text-center">Concierge logistics</p>
      <h1 className="font-wv-serif text-3xl text-wv-text text-center mb-4">Track your order</h1>
      <p className="text-sm text-wv-muted font-wv-sans text-center mb-10">
        Enter your order number and email used at checkout.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-wv-elevated border border-wv-border rounded-[var(--wv-radius-lg)] p-8">
        <div>
          <label className="block text-xs uppercase tracking-wide text-wv-muted mb-2">Order number</label>
          <input
            required
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            placeholder="WCV-123456"
            className="w-full px-4 py-3 border border-wv-border rounded-[var(--wv-radius-md)] font-wv-sans text-sm outline-none focus:border-wv-gold-muted"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-wv-muted mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-wv-border rounded-[var(--wv-radius-md)] font-wv-sans text-sm outline-none focus:border-wv-gold-muted"
          />
        </div>
        {error && <p className="text-sm text-red-600 font-wv-sans">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-wv-teal text-wv-on-hero text-xs uppercase tracking-[0.14em] rounded-[var(--wv-radius-md)] disabled:opacity-60"
        >
          {loading ? 'Searching…' : 'View journey'}
        </button>
      </form>
    </div>
  );
};

export default TrackLookup;
