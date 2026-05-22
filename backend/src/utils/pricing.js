/** Apply site-wide fake 50% discount display on all products */
export function withDiscount(product, sitePercent = 50) {
  const salePrice = Number(product.price);
  const compareAtPrice = Number(
    product.compareAtPrice ?? Math.round(salePrice * (100 / (100 - sitePercent)) * 100) / 100
  );
  const discountPercent = product.discountPercent ?? sitePercent;
  return {
    ...product,
    price: salePrice,
    compareAtPrice,
    discountPercent,
    savings: Math.round((compareAtPrice - salePrice) * 100) / 100,
  };
}

export function listProductSummary(product, sitePercent) {
  const p = withDiscount(product, sitePercent);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    discountPercent: p.discountPercent,
    savings: p.savings,
    rating: p.rating,
    reviews: p.reviewCount ?? p.reviews ?? 0,
    reviewCount: p.reviewCount ?? p.reviews ?? 0,
    image: p.image,
    gallery: p.gallery,
    category: p.category,
    colors: p.colors,
    colorNames: p.colorNames,
    isNew: p.isNew,
    isBestseller: p.isBestseller,
    freeShipping: p.freeShipping,
    stock: p.stock,
  };
}
