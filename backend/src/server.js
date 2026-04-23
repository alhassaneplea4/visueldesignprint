'use strict';

require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const path     = require('path');

const authRoutes     = require('./routes/auth.routes');
const eventsRoutes   = require('./routes/events.routes');
const contactsRoutes = require('./routes/contacts.routes');
const logsRoutes     = require('./routes/logs.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globaux ──────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:4400', 'http://127.0.0.1:4400'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les images uploadées de façon statique
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes API ───────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/events',   eventsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/logs',     logsRoutes);

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Visuel Design Print API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} introuvable` });
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne'
  });
});

// ── Démarrage ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🖨️  Visuel Design Print API`);
  console.log(`✅  Serveur démarré sur http://localhost:${PORT}`);
  console.log(`🔑  Admin: ${process.env.ADMIN_USER} / ${process.env.ADMIN_PASS}`);
  console.log(`📁  Base de données: src/data/db.json\n`);
});

module.exports = app;
