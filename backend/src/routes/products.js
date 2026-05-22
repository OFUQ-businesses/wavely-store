import { Router } from 'express';
import { readDb } from '../db.js';
import { listProductSummary, withDiscount } from '../utils/pricing.js';

const router = Router();

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: '$0 - $100', min: 0, max: 100 },
  { label: '$100 - $300', min: 100, max: 300 },
  { label: '$300 - $600', min: 300, max: 600 },
  { label: '$600+', min: 600, max: Infinity },
];

router.get('/meta/filters', (_req, res) => {
  const db = readDb();
  const categories = ['All', ...new Set(db.products.map(p => p.category))];
  res.json({ categories, priceRanges, settings: db.settings });
});

router.get('/settings', (_req, res) => {
  const db = readDb();
  res.json(db.settings);
});

router.get('/', (req, res) => {
  const db = readDb();
  const sitePercent = db.settings?.siteDiscountPercent ?? 50;
  let items = [...db.products];

  const q = (req.query.q || req.query.search || '').trim().toLowerCase();
  if (q) {
    items = items.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }

  const category = req.query.category;
  if (category && category !== 'All') {
    items = items.filter(p => p.category === category);
  }

  if (req.query.bestseller === 'true' || req.query.bestseller === '1') {
    items = items.filter(p => p.isBestseller);
  }

  if (req.query.newArrivals === 'true' || req.query.newArrivals === '1') {
    items = items.filter(p => p.isNew);
  }

  const min = Number(req.query.minPrice);
  const max = Number(req.query.maxPrice);
  if (!Number.isNaN(min)) items = items.filter(p => p.price >= min);
  if (!Number.isNaN(max) && max > 0) items = items.filter(p => p.price <= max);

  const sortBy = req.query.sortBy || req.query.sort;
  switch (sortBy) {
    case 'price-asc':
      items.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      items.sort((a, b) => b.price - a.price);
      break;
    case 'rating-desc':
      items.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case 'popular':
    case 'bestseller':
      items.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
      break;
    default:
      break;
  }

  res.json({
    products: items.map(p => listProductSummary(p, sitePercent)),
    total: items.length,
    settings: db.settings,
  });
});

router.get('/:id', (req, res) => {
  const db = readDb();
  const sitePercent = db.settings?.siteDiscountPercent ?? 50;
  const id = req.params.id;
  const product = db.products.find(
    p => String(p.id) === id || p.slug === id
  );
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const priced = withDiscount(product, sitePercent);
  const related = db.products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4)
    .map(p => listProductSummary(p, sitePercent));

  res.json({
    product: {
      ...priced,
      reviewCount: product.reviewCount ?? product.reviews?.length ?? 0,
      benefits: product.benefits || [],
      features: product.features || [],
      techSpecs: product.techSpecs || {},
      boxContents: product.boxContents || [],
      reviews: product.reviews || [],
      gallery: product.gallery?.length ? product.gallery : [product.image],
    },
    related,
  });
});

export default router;
