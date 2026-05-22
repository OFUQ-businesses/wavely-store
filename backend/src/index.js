import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import { readDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  const db = readDb();
  res.json({ ok: true, products: db.products.length, orders: db.orders.length });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const dataFile = path.join(__dirname, '../data/store.json');
if (!fs.existsSync(dataFile)) {
  console.warn('No database found. Run: npm run seed --prefix backend');
} else {
  const db = readDb();
  if (!db.products?.length) {
    console.warn('Database empty. Run: npm run seed --prefix backend');
  }
}

app.use((err, _req, res, _next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Wavely API running at http://localhost:${PORT}`);
});
