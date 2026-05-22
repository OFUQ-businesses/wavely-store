import ProductShower from './ProductShower';
import HeroProductCarousel from './HeroProductCarousel';

const ProductGrid = ({ products, gridView = true, artistic = true }) => {
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[20rem]">
        <p className="font-wv-serif text-lg text-wv-muted">No pieces match this moment.</p>
      </div>
    );
  }

  if (!gridView) {
    return (
      <div className="space-y-4 flex flex-col items-center max-w-4xl mx-auto">
        {products.map(product => (
          <ProductShower key={product.id} product={product} gridView={false} />
        ))}
      </div>
    );
  }

  if (!artistic || products.length < 2) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductShower key={product.id} product={product} gridView />
        ))}
      </div>
    );
  }

  const [hero, ...rest] = products;
  const side = rest.slice(0, 4);
  const lower = rest.slice(4);

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        <div className="lg:col-span-7 min-h-0">
          <HeroProductCarousel product={hero} />
        </div>
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 content-start">
          {side.map(product => (
            <ProductShower key={product.id} product={product} gridView compact />
          ))}
        </div>
      </div>

      {lower.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lower.map(product => (
            <ProductShower key={product.id} product={product} gridView />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
