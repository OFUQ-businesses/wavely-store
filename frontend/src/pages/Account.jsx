import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const Account = () => {
  const { user, isAuthenticated, loading: authLoading, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [form, setForm] = useState({ fullName: '', phone: '', email: '' });
  const [cardForm, setCardForm] = useState({ cardholderName: '', cardNumber: '', expiry: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [deletingCardId, setDeletingCardId] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login', { replace: true });
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setForm({ fullName: user.fullName, phone: user.phone || '', email: user.email });
    }
  }, [user]);

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.updateMe({ fullName: form.fullName, phone: form.phone });
      await refreshUser();
      setMessage('Profile updated');
    } catch (err) {
      setMessage(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCard = async e => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.saveCard({
        cardholderName: cardForm.cardholderName,
        cardNumber: cardForm.cardNumber.replace(/\s/g, ''),
        expiry: cardForm.expiry,
      });
      await refreshUser();
      setCardForm({ cardholderName: '', cardNumber: '', expiry: '' });
      setMessage('Card saved successfully');
    } catch (err) {
      setMessage(err.message || 'Failed to save card');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async cardId => {
    setDeletingCardId(cardId);
    try {
      await api.deleteCard(cardId);
      await refreshUser();
      setMessage('Card deleted');
    } catch (err) {
      setMessage(err.message || 'Failed to delete card');
    } finally {
      setDeletingCardId(null);
    }
  };

  if (authLoading || !user) {
    return <p className="text-center py-24 font-wv-sans text-wv-muted">Loading account…</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-[var(--wv-space-page)] py-10 md:py-14">
      <div className="flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-56 shrink-0 rounded-[var(--wv-radius-lg)] border border-wv-border bg-[#111] text-wv-on-hero overflow-hidden md:sticky md:top-[calc(var(--wv-header-h)+var(--wv-promo-h)+1rem)] self-start">
          <div className="p-4 border-b border-white/10">
            <p className="font-wv-serif text-lg">{user.fullName}</p>
            <p className="text-xs text-white/60 font-wv-sans mt-1 truncate">{user.email}</p>
          </div>
          <nav className="flex flex-col p-2">
            {[
              { id: 'personal', label: 'Personal' },
              { id: 'payment', label: 'Payment Methods' },
              { id: 'orders', label: 'Orders', link: '/orders' },
              { id: 'track', label: 'Track order', link: '/track' },
            ].map(tab => (
              tab.link ? (
                <Link key={tab.id} to={tab.link} className="text-left px-4 py-3 rounded-[var(--wv-radius-md)] text-sm text-white/70 hover:bg-white/5">
                  {tab.label}
                </Link>
              ) : (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left px-4 py-3 rounded-[var(--wv-radius-md)] text-sm transition-colors ${
                    activeTab === tab.id ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              )
            ))}
            <button type="button" onClick={() => { logout(); navigate('/'); }} className="text-left px-4 py-3 text-sm text-white/50 hover:text-white mt-4">
              Sign out
            </button>
          </nav>
        </aside>

        <div className="flex-1 rounded-[var(--wv-radius-lg)] border border-wv-border bg-wv-elevated p-6 md:p-8">
          {activeTab === 'personal' && (
            <>
              <h2 className="font-wv-serif text-2xl text-wv-text mb-2">Welcome back, {user.fullName.split(' ')[0]}.</h2>
              <p className="text-sm text-wv-muted font-wv-sans mb-8">Manage your member profile.</p>
              <form onSubmit={handleSave} className="space-y-6 max-w-md font-wv-sans">
                <div>
                  <label className="text-xs uppercase tracking-wide text-wv-muted block mb-2">Full name</label>
                  <input
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    className="w-full px-4 py-3 border border-wv-border rounded-[var(--wv-radius-md)] text-sm outline-none focus:border-wv-gold-muted"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-wv-muted block mb-2">Email</label>
                  <input value={form.email} disabled className="w-full px-4 py-3 border border-wv-border rounded-[var(--wv-radius-md)] text-sm bg-wv-page text-wv-muted" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-wv-muted block mb-2">Phone</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-wv-border rounded-[var(--wv-radius-md)] text-sm outline-none focus:border-wv-gold-muted"
                  />
                </div>
                {message && <p className="text-sm text-wv-muted">{message}</p>}
                <button type="submit" disabled={saving} className="px-6 py-3 bg-wv-forest text-wv-on-hero text-xs uppercase tracking-[0.12em] rounded-[var(--wv-radius-md)] disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </form>
            </>
          )}

          {activeTab === 'payment' && (
            <>
              <h2 className="font-wv-serif text-2xl text-wv-text mb-2">Payment Methods</h2>
              <p className="text-sm text-wv-muted font-wv-sans mb-8">Manage your saved cards for faster checkout.</p>

              <div className="space-y-8">
                {/* Saved Cards */}
                {user?.savedCards && user.savedCards.length > 0 && (
                  <div>
                    <h3 className="text-lg font-wv-serif text-wv-text mb-4">Your cards</h3>
                    <div className="space-y-3">
                      {user.savedCards.map(card => (
                        <div key={card.id} className="flex items-center justify-between p-4 border border-wv-border rounded-[var(--wv-radius-md)] bg-wv-page">
                          <div className="flex-1">
                            <p className="font-wv-sans text-sm text-wv-text">{card.cardholderName}</p>
                            <p className="font-wv-sans text-xs text-wv-muted mt-1">•••• •••• •••• {card.lastFour}</p>
                            <p className="font-wv-sans text-xs text-wv-muted">Expires {card.expiry}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteCard(card.id)}
                            disabled={deletingCardId === card.id}
                            className="ml-4 p-2 text-wv-muted hover:text-red-500 transition-colors disabled:opacity-50"
                            aria-label="Delete card"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Card */}
                <div className="border-t border-wv-border pt-6">
                  <h3 className="text-lg font-wv-serif text-wv-text mb-4 flex items-center gap-2">
                    <Plus size={20} /> Add new card
                  </h3>
                  <form onSubmit={handleAddCard} className="space-y-4 max-w-md font-wv-sans">
                    <div>
                      <label className="text-xs uppercase tracking-wide text-wv-muted block mb-2">Cardholder name</label>
                      <input
                        value={cardForm.cardholderName}
                        onChange={e => setCardForm(c => ({ ...c, cardholderName: e.target.value }))}
                        required
                        placeholder="Full name on card"
                        className="w-full px-4 py-3 border border-wv-border rounded-[var(--wv-radius-md)] text-sm outline-none focus:border-wv-gold-muted"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wide text-wv-muted block mb-2">Card number</label>
                      <input
                        value={cardForm.cardNumber}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                          setCardForm(c => ({ ...c, cardNumber: formatted }));
                        }}
                        required
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-3 border border-wv-border rounded-[var(--wv-radius-md)] text-sm outline-none focus:border-wv-gold-muted font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wide text-wv-muted block mb-2">Expiry date</label>
                      <input
                        value={cardForm.expiry}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          const formatted = val.length >= 2 ? val.slice(0, 2) + '/' + val.slice(2) : val;
                          setCardForm(c => ({ ...c, expiry: formatted }));
                        }}
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-wv-border rounded-[var(--wv-radius-md)] text-sm outline-none focus:border-wv-gold-muted"
                      />
                    </div>
                    {message && <p className="text-sm text-wv-muted">{message}</p>}
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-wv-forest text-wv-on-hero text-xs uppercase tracking-[0.12em] rounded-[var(--wv-radius-md)] disabled:opacity-60"
                    >
                      {saving ? 'Saving…' : 'Save card'}
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
