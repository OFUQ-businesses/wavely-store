import { Search, ShoppingBag, UserRound, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
// import { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import WavelyLogo from './WavelyLogo';

const Navbar = () => {
  const { cartCount, openCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [heroScrollPast, setHeroScrollPast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  // const searchRef = useRef(null);

  useEffect(() => {
    // if (!isHome) return undefined;
    const update = () => setHeroScrollPast(window.scrollY > window.innerHeight * 0.45);
    const initId = window.setTimeout(update, 0);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.clearTimeout(initId);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    async function closeMobileMenu() {
      setMobileOpen(false);
    }
    closeMobileMenu();
  }, [location.pathname]);

  const onDarkHero = isHome && !heroScrollPast;
  const deskLink = `wv-nav-label transition-colors border-b border-transparent hover:border-wv-text/80 pb-0.5 ${
    onDarkHero ? 'text-wv-on-hero/90 hover:text-wv-on-hero' : 'text-wv-text/85 hover:text-wv-text'
  }`;

  const submitSearch = e => {
    e?.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}#shop` : '/#shop');
    setMobileOpen(false);
    if (q) {
      setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[120] transition-colors duration-500 border-b ${
          onDarkHero ? 'border-transparent bg-transparent' : 'border-wv-border bg-wv-page/95 backdrop-blur-md'
        }`}
        style={{ height: 'var(--wv-header-h)' }}
      >
        <div className="h-full max-w-[90rem] mx-auto px-[var(--wv-space-page)] flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0 flex items-center" aria-label="Wavely Home">
            <WavelyLogo variant={onDarkHero ? 'onDark' : 'default'} className="h-8 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <Link to="/#shop" className={deskLink}>Shop</Link>
            <Link to="/#collections" className={deskLink}>Collections</Link>
            <Link to="/about" className={deskLink}>About</Link>
            <Link to="/contact" className={deskLink}>Contact</Link>
          </nav>

          <div className="flex items-center gap-3 lg:gap-5 shrink-0">
            {/* <form
              onSubmit={submitSearch}
              className={`hidden md:flex items-center gap-2 min-w-[10rem] lg:min-w-[14rem] px-3 py-1.5 rounded-[var(--wv-radius-md)] border ${
                onDarkHero ? 'border-wv-on-hero/30 bg-wv-on-hero/10' : 'border-wv-border bg-wv-elevated/80'
              }`}
            >
              <Search size={16} className={onDarkHero ? 'text-wv-on-hero/70' : 'text-wv-muted'} strokeWidth={1.25} />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search collection"
                className={`flex-1 bg-transparent text-sm outline-none font-wv-sans min-w-0 ${
                  onDarkHero ? 'text-wv-on-hero placeholder:text-wv-on-hero/50' : 'text-wv-text placeholder:text-wv-muted'
                }`}
              />
            </form> */}

            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className={`hidden sm:flex p-1 transition-opacity hover:opacity-70 ${onDarkHero ? 'text-wv-on-hero' : 'text-wv-text'}`}
              aria-label="Account"
              title={user?.fullName || 'Account'}
            >
              <UserRound size={21} strokeWidth={1.25} />
            </Link>

            <button
              type="button"
              onClick={() => openCart()}
              className={`relative p-1 transition-opacity hover:opacity-70 flex items-center gap-2 ${onDarkHero ? 'text-wv-on-hero' : 'text-wv-text'}`}
              aria-label="Open shopping bag"
            >
              <ShoppingBag size={21} strokeWidth={1.25} />
              <span className="hidden md:inline wv-nav-label">Bag ({cartCount})</span>
              {cartCount > 0 && (
                <span className="md:hidden absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-wv-gold text-[10px] text-wv-elevated flex items-center justify-center font-wv-sans font-medium tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`lg:hidden p-2 -mr-1 ${onDarkHero ? 'text-wv-on-hero' : 'text-wv-text'}`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={22} strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-wv-text/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[min(88vw,340px)] bg-wv-elevated shadow-wv-drawer flex flex-col animate-[wv-sheet-enter_0.35s_ease-out]">
            <div className="flex justify-between items-center px-5 py-4 border-b border-wv-border shrink-0">
              <span className="wv-caption text-wv-text">Menu</span>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={submitSearch} className="px-5 py-4 border-b border-wv-border shrink-0">
              <div className="flex items-center gap-2 border border-wv-border rounded-[var(--wv-radius-md)] px-3 py-2.5 bg-wv-page">
                <Search size={18} className="text-wv-muted shrink-0" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products"
                  className="flex-1 bg-transparent text-sm outline-none font-wv-sans"
                />
              </div>
            </form>

            <nav className="flex flex-col p-5 gap-1 overflow-y-auto flex-1 font-wv-sans">
              {[
                ['/#shop', 'Shop'],
                ['/#collections', 'Collections'],
                ['/about', 'About'],
                ['/contact', 'Contact'],
                ['/orders', 'My orders'],
                ['/track', 'Track order'],
              ].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base font-wv-serif text-wv-text border-b border-wv-border/60"
                >
                  {label}
                </Link>
              ))}
              <hr className="border-wv-border my-2" />
              <Link to={isAuthenticated ? '/account' : '/login'} onClick={() => setMobileOpen(false)} className="py-3 text-sm uppercase tracking-wide">
                {isAuthenticated ? `Hi, ${user?.fullName?.split(' ')[0] || 'Member'}` : 'Sign in / Register'}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
