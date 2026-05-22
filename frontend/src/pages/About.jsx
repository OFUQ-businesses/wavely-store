const About = () => {
  return (
    <div className="max-w-3xl mx-auto px-[var(--wv-space-page)] py-16 md:py-24">
      <p className="wv-caption text-wv-muted mb-4">Philosophy</p>
      <h1 className="font-wv-serif text-4xl md:text-5xl text-wv-text mb-6">About Wavely</h1>
      <p className="font-wv-sans text-wv-muted text-lg leading-relaxed mb-14 max-w-2xl">
        We curate objects and essentials for calm, modern living — bridging craft, material honesty, and serene
        silhouettes.
      </p>

      <div className="space-y-12 font-wv-sans text-wv-muted leading-relaxed">
        <section>
          <h2 className="font-wv-serif text-2xl text-wv-text mb-4">Our mission</h2>
          <p>
            Connect discerning clients with dependable makers and responsive service — so every arrival feels
            considered, from first unboxing to everyday use.
          </p>
        </section>
        <section>
          <h2 className="font-wv-serif text-2xl text-wv-text mb-4">Why Wavely</h2>
          <ul className="space-y-3 list-disc list-inside marker:text-wv-gold">
            <li>Thoughtful product selection and transparent logistics</li>
            <li>Secure checkout with concierge support</li>
            <li>Editorial presentation — shop, bag, and checkout stay in one continuous flow</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
