import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

const defaultStore = () => ({
  users: [],
  orders: [],
  products: [],
  settings: {
    siteDiscountPercent: 50,
    promoBanner: 'PREMIUM EVENT — 50% OFF EVERYTHING',
    promoSubtext: 'Complimentary shipping on orders over $150 · Ends soon',
  },
});

export function readDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const initial = defaultStore();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

export function writeDb(data) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function updateDb(mutator) {
  const data = readDb();
  mutator(data);
  writeDb(data);
  return data;
}
