import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { X } from 'lucide-react';

const PromoBar = () => {
  const [settings, setSettings] = useState({
    promoBanner: 'PREMIUM EVENT — 50% OFF EVERYTHING',
    promoSubtext: 'Limited allocation · Ends soon',
    siteDiscountPercent: 50,
  });

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  function hideBar() {
    document.getElementById('promo-bar').style.display = 'none';

  }

  return (
    <div
      className="fixed left-0 right-0 z-[115] border-b border-wv-gold-deep/30 h-fit bg-gradient-to-r from-[#2d3e40] via-[#3d4f52] to-[#2d3e40] text-wv-on-hero"
      style={{ top: 'var(--wv-header-h)'}}
      role="region"
      aria-label="Promotion"
      id="promo-bar"
    >
      <div className="max-w-[90rem] mx-auto px-[var(--wv-space-page)] py-2.5 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-6 text-center">
        <p className="font-wv-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium flex items-center gap-2 flex-wrap justify-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-wv-gold-deep text-[#1a1a1a] text-[10px] font-bold tracking-wider">
            {settings.siteDiscountPercent}% OFF
          </span>
          <span>{settings.promoBanner}</span>
        </p>
        <span className="hidden sm:block w-px h-3 bg-wv-on-hero/30" aria-hidden />
        <p className="font-wv-sans text-[10px] sm:text-[11px] tracking-[0.14em] text-wv-on-hero/75 uppercase">
          {settings.promoSubtext}
        </p>
      <X size={18} onClick={hideBar}/>
      </div>
    </div>
  );
};

export default PromoBar;
