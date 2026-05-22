import {
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Tags,
  Palette,
  Award,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const DEFAULT_PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: '$0 - $100', min: 0, max: 100 },
  { label: '$100 - $300', min: 100, max: 300 },
  { label: '$300 - $600', min: 300, max: 600 },
  { label: '$600+', min: 600, max: Infinity },
];

const FilterSection = ({
  gridView,
  setGridView,
  filters,
  setFilters,
  artistic,
  setArtistic,
  categories = ['All'],
  priceRanges = DEFAULT_PRICE_RANGES,
}) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const close = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleCategoryChange = category => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handlePriceChange = range => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  const handleSortChange = sortBy => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const rows = [
    {
      key: 'category',
      label: 'Category',
      icon: LayoutGrid,
      content: (
        <div className="py-2 space-y-1">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat === 'All' ? '' : cat)}
              className={`w-full text-left px-3 py-2 rounded-[var(--wv-radius-sm)] text-sm font-wv-sans transition-colors ${
                (cat === 'All' && !filters.category) || filters.category === cat
                  ? 'bg-wv-page text-wv-text'
                  : 'text-wv-muted hover:bg-wv-page/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price range',
      icon: Tags,
      content: (
        <div className="py-2 space-y-1">
          {priceRanges.map((range, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePriceChange(range)}
              className={`w-full text-left px-3 py-2 rounded-[var(--wv-radius-sm)] text-sm font-wv-sans ${
                range.min === filters.priceRange.min && range.max === filters.priceRange.max
                  ? 'bg-wv-page text-wv-text'
                  : 'text-wv-muted hover:bg-wv-page/80'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      ),
    },
    {
      key: 'sort',
      label: 'Sort',
      icon: SlidersHorizontal,
      content: (
        <div className="py-2 space-y-1">
          {[
            { label: 'Featured', value: '' },
            { label: 'Newest', value: 'newest' },
            { label: 'Price: Low → High', value: 'price-asc' },
            { label: 'Price: High → Low', value: 'price-desc' },
          ].map(opt => (
            <button
              key={opt.value || 'featured'}
              type="button"
              onClick={() => handleSortChange(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-[var(--wv-radius-sm)] text-sm font-wv-sans ${
                (filters.sortBy || '') === opt.value ? 'bg-wv-page text-wv-text' : 'text-wv-muted hover:bg-wv-page/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="relative z-40 mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between" ref={panelRef}>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--wv-radius-md)] bg-wv-elevated border border-wv-border shadow-lg font-wv-sans text-xs uppercase tracking-[0.16em] text-wv-text hover:border-wv-gold-muted transition-colors"
          >
            <SlidersHorizontal size={16} strokeWidth={1.25} />
            Filter &amp; refine
          </button>

          {open && (
            <div className="absolute left-0 bottom-full mb-3 w-[min(92vw,20rem)] bg-wv-elevated border border-wv-border rounded-[var(--wv-radius-lg)] shadow-wv-drawer p-2 font-wv-sans">
              {rows.map(row => {
                const Icon = row.icon;
                return (
                  <details key={row.key} className="group border-b border-wv-border last:border-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-3 text-sm text-wv-text">
                      <span className="flex items-center gap-2">
                        <Icon size={16} strokeWidth={1.25} className="text-wv-muted" />
                        {row.label}
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-wv-muted transition-transform group-open:rotate-90"
                      />
                    </summary>
                    <div className="px-2 pb-2">{row.content}</div>
                  </details>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setFilters(prev => ({ ...prev, newArrivals: !prev.newArrivals, bestseller: false }))}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--wv-radius-md)] border text-xs uppercase tracking-[0.16em] font-wv-sans transition-colors ${
            filters.newArrivals
              ? 'border-wv-text bg-wv-text text-wv-on-hero'
              : 'border-wv-border bg-wv-elevated text-wv-text hover:border-wv-gold-muted'
          }`}
        >
          <Palette size={16} strokeWidth={1.25} />
          New arrivals
        </button>

        <button
          type="button"
          onClick={() => setFilters(prev => ({ ...prev, bestseller: !prev.bestseller, newArrivals: false }))}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--wv-radius-md)] border text-xs uppercase tracking-[0.16em] font-wv-sans transition-colors ${
            filters.bestseller
              ? 'border-wv-gold-deep bg-wv-gold-deep text-[#1a1a1a]'
              : 'border-wv-border bg-wv-elevated text-wv-text hover:border-wv-gold-muted'
          }`}
        >
          <Award size={16} strokeWidth={1.25} />
          Best sellers
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {typeof setArtistic === 'function' && (
          <div className="flex items-center gap-3">
            <span
              className={`text-xs uppercase tracking-[0.16em] font-wv-sans ${artistic ? 'text-wv-text' : 'text-wv-muted'}`}
            >
              Artistic grid
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={!artistic}
              onClick={() => setArtistic(!artistic)}
              className={`relative h-8 w-14 rounded-full border border-wv-border transition-colors ${artistic ? 'bg-wv-page' : 'bg-wv-text'}`}
            >
              <span
                className={`absolute top-1 size-6 rounded-full bg-wv-elevated border border-wv-border shadow transition-transform ${artistic ? 'left-1' : 'left-7'}`}
              />
            </button>
            <span
              className={`text-xs uppercase tracking-[0.16em] font-wv-sans ${!artistic ? 'text-wv-text' : 'text-wv-muted'}`}
            >
              Detailed list
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 border border-wv-border rounded-[var(--wv-radius-md)] p-1 bg-wv-elevated">
          <button
            type="button"
            onClick={() => setGridView(true)}
            className={`p-2 rounded-[var(--wv-radius-sm)] transition-colors ${gridView ? 'bg-wv-page text-wv-text' : 'text-wv-muted'}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={18} strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={() => setGridView(false)}
            className={`p-2 rounded-[var(--wv-radius-sm)] transition-colors ${!gridView ? 'bg-wv-page text-wv-text' : 'text-wv-muted'}`}
            aria-label="List view"
          >
            <List size={18} strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
