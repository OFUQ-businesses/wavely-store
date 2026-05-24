import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  const inputClass =
    'w-full px-4 py-3 border border-wv-border rounded-[var(--wv-radius-md)] font-wv-sans text-sm text-wv-text outline-none focus:border-wv-gold-muted bg-wv-elevated';

  return (
    <div className="max-w-6xl mx-auto px-[var(--wv-space-page)] py-14 md:py-20">
      <p className="wv-caption text-wv-muted mb-3">Concierge</p>
      <h1 className="font-wv-serif text-4xl text-wv-text mb-4">Contact</h1>
      <p className="font-wv-sans text-wv-muted max-w-xl mb-14">We typically reply within one business day.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-wv-elevated border border-wv-border rounded-[var(--wv-radius-lg)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-full border border-wv-border flex items-center justify-center text-wv-muted">
              <Mail size={22} strokeWidth={1.25} />
            </div>
            <h3 className="font-wv-serif text-xl text-wv-text">Email</h3>
          </div>
          <p className="font-wv-sans text-wv-text">eyadahmedp5f@gmail.com</p>
          <p className="font-wv-sans text-sm text-wv-muted mt-1">Within 24 hours</p>
        </div>
        <div className="bg-wv-elevated border border-wv-border rounded-[var(--wv-radius-lg)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-full border border-wv-border flex items-center justify-center text-wv-muted">
              <Phone size={22} strokeWidth={1.25} />
            </div>
            <h3 className="font-wv-serif text-xl text-wv-text">Phone</h3>
          </div>
          <p className="font-wv-sans text-wv-text">+20 1066288016</p>
          <p className="font-wv-sans text-sm text-wv-muted mt-1">Mon–Fri 9–6 EST</p>
        </div>
        <div className="bg-wv-elevated border border-wv-border rounded-[var(--wv-radius-lg)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-full border border-wv-border flex items-center justify-center text-wv-muted">
              <MapPin size={22} strokeWidth={1.25} />
            </div>
            <h3 className="font-wv-serif text-xl text-wv-text">Studio</h3>
          </div>
          <p className="font-wv-sans text-wv-text">An online place for creative collaboration</p>
        </div>
      </div>

      <div className="bg-wv-elevated border border-wv-border rounded-[var(--wv-radius-lg)] p-8 md:p-10 max-w-3xl">
        <h2 className="font-wv-serif text-2xl text-wv-text mb-8">Send a note</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-wv-sans uppercase tracking-wide text-wv-muted mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-wv-sans uppercase tracking-wide text-wv-muted mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-wv-sans uppercase tracking-wide text-wv-muted mb-2">
              Subject
            </label>
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block text-xs font-wv-sans uppercase tracking-wide text-wv-muted mb-2">
              Message
            </label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows={6} className={`${inputClass} resize-none`} required />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-wv-forest text-wv-on-hero font-wv-sans text-xs uppercase tracking-[0.14em] rounded-[var(--wv-radius-md)] hover:opacity-95 transition-opacity"
          >
            <Send size={18} strokeWidth={1.25} />
            Send message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
