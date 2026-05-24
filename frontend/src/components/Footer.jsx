import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="mt-auto border-t border-wv-border bg-wv-page">
    <div className="max-w-[90rem] mx-auto px-[var(--wv-space-page)] py-12 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-x-10 gap-y-3">
        {[
          ['/contact', 'Contact'],
          ['/contact', 'Shipping & returns'],
          ['/contact', 'Privacy'],
        ].map(([to, label]) => (
          <Link key={label} to={to} className="wv-caption text-wv-muted hover:text-wv-text transition-colors">
            {label}
          </Link>
        ))}
      </div>

      <form
        className="flex flex-col gap-3 w-full lg:max-w-sm"
        onSubmit={e => e.preventDefault()}
      >
        <label htmlFor="footer-email" className="sr-only">
          Newsletter
        </label>
        <div className="relative border-b border-wv-text pb-2 flex items-center">
          <input
            id="footer-email"
            type="email"
            placeholder="Sign up your email here"
            className="flex-1 bg-transparent text-sm font-wv-sans text-wv-text placeholder:text-wv-muted outline-none min-w-0 pr-10"
          />
          <button
            type="submit"
            aria-label="Submit email"
            className="absolute right-0 p-1 text-wv-text hover:opacity-60"
          >
            <span className="text-lg leading-none">→</span>
          </button>
        </div>
      </form>
    </div>
    <div className="text-center pb-8 text-[12px] font-wv-sans text-wv-muted">© {new Date().getFullYear()} Wavely</div>
    <div className="text-center pb-8 text-[12px] font-wv-sans text-wv-muted">©OFUQ . The creator of the Wavely experience</div>
  </footer>
);

export default Footer;
