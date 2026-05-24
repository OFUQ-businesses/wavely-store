import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FilterSection from '../components/FilterSection';
import ProductGrid from '../components/ProductGrid';
import { api } from '../lib/api';

const SCROLL_ARROW_SVG = (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
    <circle cx="22" cy="22" r="21" stroke="currentColor" strokeWidth="1" opacity="0.85" />
    <path d="M22 14v14M16 26l6 6 6-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Home = () => {
  const [searchParams] = useSearchParams();
  const [gridView, setGridView] = useState(true);
  const [artistic, setArtistic] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMeta, setFilterMeta] = useState({ categories: ['All'], priceRanges: [] });
  const heroRef = useRef(null);

  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: 0, max: Infinity },
    newArrivals: false,
    bestseller: false,
    sortBy: '',
    q: searchParams.get('q') || '',
  });

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setFilters(prev => (prev.q === q ? prev : { ...prev, q }));
  }, [searchParams]);

  useEffect(() => {
    api.getFilterMeta().then(meta => {
      setFilterMeta({
        categories: meta.categories || ['All'],
        priceRanges: meta.priceRanges || [],
      });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = {
      q: filters.q || undefined,
      category: filters.category || undefined,
      bestseller: filters.bestseller ? 'true' : undefined,
      newArrivals: filters.newArrivals ? 'true' : undefined,
      sortBy: filters.sortBy || undefined,
      minPrice: filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
      maxPrice:
        filters.priceRange.max !== Infinity && filters.priceRange.max > 0
          ? filters.priceRange.max
          : undefined,
    };

    api
      .getProducts(params)
      .then(data => {
        if (!cancelled) setProducts(data.products || []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  useEffect(() => {
    const { hash } = window.location;
    if (hash === '#shop' || hash === '#collections') {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [loading]);

  return (
    <div className="flex flex-col bg-wv-page">
      <section
        ref={heroRef}
        className="-mt-[calc(var(--wv-header-h)+var(--wv-promo-h))] min-h-[100svh] relative flex flex-col justify-end md:justify-center pb-16 md:pb-0 px-[var(--wv-space-page)]"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(26,24,21,0.55) 0%, rgba(26,24,21,0.25) 45%, rgba(26,24,21,0.5) 100%), url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=85&w=2400&auto=format&fit=crop)`,
          }}
        />
        <div className="relative z-[1] max-w-[90rem] mx-auto w-full text-center pt-[calc(var(--wv-header-h)+var(--wv-promo-h)+3rem)]">
          <p className="wv-caption text-wv-on-hero/90 mb-6">Luxury essentials</p>
          <h1 className="font-wv-serif text-[clamp(2.25rem,6vw,3.75rem)] font-medium tracking-[0.04em] text-wv-on-hero uppercase mb-6">
            Elevate your sanctuary
          </h1>
          <p className="font-wv-sans text-wv-on-hero/90 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Discover curated luxury for modern living
          </p>
          <a
            href="#shop"
            className="inline-block px-10 py-3.5 border border-wv-on-hero text-wv-on-hero wv-caption hover:bg-wv-on-hero hover:text-wv-text transition-colors duration-300"
          >
            Explore the collection
          </a>
        </div>
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-wv-on-hero animate-bounce">{SCROLL_ARROW_SVG}</div> */}
      </section>

      <section id="collections" className="py-20 md:py-28 px-[var(--wv-space-page)] max-w-[90rem] mx-auto w-full scroll-mt-[calc(var(--wv-header-h)+var(--wv-promo-h))]">
        <h2 className="font-wv-serif text-center text-2xl md:text-3xl uppercase tracking-[0.08em] text-wv-text mb-14">
          Curated collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <article className="flex flex-col gap-5 text-center">
            <div className="aspect-[4/3] overflow-hidden rounded-[var(--wv-radius-md)] border border-wv-border bg-wv-card">
              <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200&auto=format&fit=crop" alt="modern cups" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-wv-serif text-xl uppercase tracking-[0.06em]">The coastal table</h3>
            <a href="#shop" className="wv-caption text-wv-text underline underline-offset-4">View collection</a>
          </article>
          <article className="flex flex-col gap-5 text-center">
            <div className="aspect-[4/3] overflow-hidden rounded-[var(--wv-radius-md)] border border-wv-border bg-wv-card">
              <img src="https://images.unsplash.com/photo-1571140891192-42cae59c69ea?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="organic textiles" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-wv-serif text-xl uppercase tracking-[0.06em]">Organic textiles</h3>
            <a href="#shop" className="wv-caption text-wv-text underline underline-offset-4">View collection</a >
          </article>
        </div>
      </section>

      <section id="shop" className="px-[var(--wv-space-page)] max-w-[90rem] mx-auto w-full pb-24 scroll-mt-[calc(var(--wv-header-h)+var(--wv-promo-h))]">
        <div className="mb-12 text-center md:text-left border-t border-wv-border pt-12">
          <h2 className="font-wv-serif text-3xl md:text-4xl text-wv-text">Wavely premium boutique shop</h2>
          <p className="mt-3 font-wv-sans text-wv-muted max-w-xl">
            {filters.q ? `Results for “${filters.q}”` : 'A considered edit — objects and apparel for intentional spaces.'}
          </p>
        </div>

        <FilterSection
          gridView={gridView}
          setGridView={setGridView}
          filters={filters}
          setFilters={setFilters}
          artistic={artistic}
          setArtistic={setArtistic}
          categories={filterMeta.categories}
          priceRanges={filterMeta.priceRanges}
        />

        {loading ? (
          <p className="text-center font-wv-sans text-wv-muted py-20">Curating pieces…</p>
        ) : (
          <ProductGrid products={products} gridView={gridView} artistic={artistic && gridView} />
        )}
      </section>
    </div>
  );
};

export default Home;
