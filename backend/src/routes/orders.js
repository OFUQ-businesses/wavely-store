import { Router } from 'express';
import { customAlphabet } from 'nanoid';
import { readDb, updateDb } from '../db.js';
import { authRequired, authOptional } from '../middleware/auth.js';

const router = Router();
const orderIdGen = customAlphabet('0123456789', 6);

const TRACKING_STEPS = [
  { key: 'curation', label: 'In curation', subtext: 'Hand-selecting your pieces' },
  { key: 'enroute', label: 'En route', subtext: 'Crossing to your region' },
  { key: 'customs', label: 'Customs clearance', subtext: 'Expedited processing' },
  { key: 'delivery', label: 'Final delivery', subtext: 'Estimated arrival soon' },
];

function buildTimeline(statusIndex = 1) {
  return TRACKING_STEPS.map((step, i) => ({
    ...step,
    active: i === statusIndex,
    completed: i < statusIndex,
  }));
}

function sanitizeOrder(order, includeItems = true) {
  const base = {
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.date,
    status: order.status,
    statusIndex: order.statusIndex ?? 1,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    deliveryMethod: order.deliveryMethod,
    shippingDetails: order.shippingDetails,
    timeline: order.timeline || buildTimeline(order.statusIndex ?? 1),
    estimatedArrival: order.estimatedArrival,
    trackingLocation: order.trackingLocation,
  };
  if (includeItems) base.items = order.items;
  return base;
}

router.post('/', authOptional, (req, res) => {
  try {
    const { items, shippingDetails, deliveryMethod, email } = req.body || {};
    console.log('Order request received:', { items: items?.length, deliveryMethod, email });
    
    if (!items?.length) return res.status(400).json({ error: 'Cart is empty' });

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = deliveryMethod === 'express' ? 10 : deliveryMethod === 'overnight' ? 25 : subtotal >= 150 ? 0 : 12;
    const tax = Math.round(subtotal * 0.06 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    const orderNumber = `WCV-${orderIdGen()}`;
    const userId = req.user?.id || null;
    const orderEmail = email || shippingDetails?.email || req.user?.email;

    const order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      userId,
      email: orderEmail?.toLowerCase(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      status: 'Processing',
      statusIndex: 1,
      subtotal,
      shipping,
      tax,
      total,
      items,
      shippingDetails,
      deliveryMethod: deliveryMethod || 'standard',
      timeline: buildTimeline(1),
      estimatedArrival: new Date(Date.now() + 10 * 86400000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      trackingLocation: 'Atlantic corridor',
      events: [
        { label: 'Order placed', at: new Date().toISOString(), location: 'Wavely atelier' },
        { label: 'In curation', at: new Date().toISOString(), location: 'Quality studio' },
      ],
    };

    updateDb(d => {
      d.orders.unshift(order);
    });

    console.log('Order created:', orderNumber);
    res.status(201).json({ order: sanitizeOrder(order), orderNumber });
  } catch (err) {
    console.error('Error creating order:', err.message);
    throw err;
  }
});

router.get('/my', authRequired, (req, res) => {
  const db = readDb();
  const mine = db.orders.filter(
    o => o.userId === req.user.id || o.email === req.user.email
  );
  res.json({ orders: mine.map(o => sanitizeOrder(o)) });
});

router.get('/track/:orderNumber', (req, res) => {
  const { orderNumber } = req.params;
  const email = (req.query.email || '').trim().toLowerCase();
  const db = readDb();
  const order = db.orders.find(
    o =>
      o.orderNumber.toUpperCase() === orderNumber.toUpperCase() ||
      o.id === orderNumber
  );
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (email && order.email && order.email !== email) {
    return res.status(403).json({ error: 'Email does not match this order' });
  }
  res.json({ order: sanitizeOrder(order) });
});

router.get('/:orderNumber', authOptional, (req, res) => {
  const db = readDb();
  const order = db.orders.find(
    o => o.orderNumber === req.params.orderNumber || o.id === req.params.orderNumber
  );
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.userId && req.user?.id !== order.userId && order.email !== req.user?.email) {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.json({ order: sanitizeOrder(order) });
});

export default router;
