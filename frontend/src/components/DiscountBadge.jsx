const DiscountBadge = ({ percent = 50, className = '' }) => (
  <span
    className={`absolute top-3 left-3 z-10 px-2.5 py-1 bg-wv-gold-deep text-[#1a1a1a] text-[10px] font-wv-sans font-bold uppercase tracking-[0.12em] rounded-[var(--wv-radius-sm)] shadow-sm ${className}`}
  >
    −{percent}%
  </span>
);

export default DiscountBadge;
