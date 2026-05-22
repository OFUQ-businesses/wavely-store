import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readDb, updateDb } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName },
    process.env.JWT_SECRET || 'wavely-dev-secret',
    { expiresIn: '30d' }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone || '',
    createdAt: user.createdAt,
    savedCards: user.savedCards || [],
  };
}

router.post('/register', async (req, res) => {
  const { email, password, fullName, phone } = req.body || {};
  if (!email?.trim() || !password || password.length < 6) {
    return res.status(400).json({ error: 'Email and password (min 6 chars) required' });
  }
  const db = readDb();
  if (db.users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return res.status(409).json({ error: 'Account already exists' });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: `usr_${Date.now()}`,
    email: email.trim().toLowerCase(),
    fullName: fullName?.trim() || 'Wavely Member',
    phone: phone?.trim() || '',
    passwordHash: hash,
    savedCards: [],
    createdAt: new Date().toISOString(),
  };
  updateDb(d => {
    d.users.push(user);
  });
  const token = signToken(user);
  res.status(201).json({ token, user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const db = readDb();
  const user = db.users.find(u => u.email === email.trim().toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

router.get('/me', authRequired, (req, res) => {
  const db = readDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: publicUser(user) });
});

router.patch('/me', authRequired, async (req, res) => {
  const { fullName, phone } = req.body || {};
  let updated = null;
  updateDb(d => {
    const idx = d.users.findIndex(u => u.id === req.user.id);
    if (idx === -1) return;
    if (fullName) d.users[idx].fullName = fullName.trim();
    if (phone !== undefined) d.users[idx].phone = phone.trim();
    updated = publicUser(d.users[idx]);
  });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json({ user: updated });
});

router.post('/me/cards', authRequired, (req, res) => {
  const { cardNumber, expiry, cardholderName } = req.body || {};
  if (!cardNumber || !expiry || !cardholderName) {
    return res.status(400).json({ error: 'Card details required' });
  }
  const lastFour = cardNumber.slice(-4);
  const card = {
    id: `card_${Date.now()}`,
    cardholderName,
    lastFour,
    expiry,
    createdAt: new Date().toISOString(),
  };
  let updated = null;
  updateDb(d => {
    const idx = d.users.findIndex(u => u.id === req.user.id);
    if (idx === -1) return;
    if (!d.users[idx].savedCards) d.users[idx].savedCards = [];
    d.users[idx].savedCards.push(card);
    updated = publicUser(d.users[idx]);
  });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json({ user: updated, card });
});

router.delete('/me/cards/:cardId', authRequired, (req, res) => {
  const { cardId } = req.params;
  let updated = null;
  updateDb(d => {
    const idx = d.users.findIndex(u => u.id === req.user.id);
    if (idx === -1) return;
    if (!d.users[idx].savedCards) d.users[idx].savedCards = [];
    d.users[idx].savedCards = d.users[idx].savedCards.filter(c => c.id !== cardId);
    updated = publicUser(d.users[idx]);
  });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json({ user: updated });
});

export default router;
