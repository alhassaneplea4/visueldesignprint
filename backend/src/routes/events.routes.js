'use strict';

const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const { v4: uuidv4 } = require('uuid');
const auth     = require('../middleware/auth.middleware');
const { log }  = require('../utils/logger');
const router   = express.Router();

const DB_PATH = path.join(__dirname, '../data/db.json');

// ── Helpers DB ──────────────────────────────────────────────
function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// ── Multer : upload images ──────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Type de fichier non autorisé'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// ── GET /api/events — Public ────────────────────────────────
router.get('/', (req, res) => {
  const db = readDB();
  const events = db.events.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ success: true, data: events });
});

// ── GET /api/events/:id — Public ───────────────────────────
router.get('/:id', (req, res) => {
  const db = readDB();
  const event = db.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Événement introuvable' });
  res.json({ success: true, data: event });
});

// ── POST /api/events — Auth ────────────────────────────────
router.post('/', auth, (req, res) => {
  const { title, excerpt, category, date, image } = req.body;

  if (!title || !excerpt || !date) {
    return res.status(400).json({ success: false, message: 'Titre, extrait et date sont requis' });
  }

  const db    = readDB();
  const event = {
    id        : String(Date.now()),
    title     : title.trim(),
    excerpt   : excerpt.trim(),
    category  : category || 'Actualité',
    date,
    image     : image || '',
    createdAt : new Date().toISOString()
  };

  db.events.push(event);
  writeDB(db);

  log('CREATE_EVENT', `Publication créée : "${event.title}"`, req.user?.username, { id: event.id, category: event.category });
  res.status(201).json({ success: true, data: event });
});

// ── PUT /api/events/:id — Auth ─────────────────────────────
router.put('/:id', auth, (req, res) => {
  const db  = readDB();
  const idx = db.events.findIndex(e => e.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Événement introuvable' });
  }

  const { title, excerpt, category, date, image } = req.body;
  db.events[idx] = {
    ...db.events[idx],
    title    : (title   || db.events[idx].title).trim(),
    excerpt  : (excerpt || db.events[idx].excerpt).trim(),
    category : category || db.events[idx].category,
    date     : date     || db.events[idx].date,
    image    : image    !== undefined ? image : db.events[idx].image,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  log('UPDATE_EVENT', `Publication modifiée : "${db.events[idx].title}"`, req.user?.username, { id: db.events[idx].id });
  res.json({ success: true, data: db.events[idx] });
});

// ── DELETE /api/events/:id — Auth ──────────────────────────
router.delete('/:id', auth, (req, res) => {
  const db  = readDB();
  const idx = db.events.findIndex(e => e.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Événement introuvable' });
  }

  const event = db.events[idx];
  if (event.image && event.image.startsWith('/uploads/')) {
    const imgPath = path.join(__dirname, '..', event.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  db.events.splice(idx, 1);
  writeDB(db);

  log('DELETE_EVENT', `Publication supprimée : "${event.title}"`, req.user?.username, { id: event.id });
  res.json({ success: true, message: 'Événement supprimé' });
});

// ── POST /api/events/upload — Auth ─────────────────────────
router.post('/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Aucun fichier reçu' });
  }
  log('UPLOAD_IMAGE', `Image uploadée : ${req.file.filename}`, req.user?.username, { filename: req.file.filename, size: req.file.size });
  res.json({ success: true, url: `/uploads/${req.file.filename}` });
});

// ── Gestion erreur Multer ───────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

module.exports = router;
