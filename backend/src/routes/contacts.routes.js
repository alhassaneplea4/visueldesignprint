'use strict';

const express  = require('express');
const router   = express.Router();
const path     = require('path');
const fs       = require('fs');
const { v4: uuidv4 } = require('uuid');
const auth     = require('../middleware/auth.middleware');
const { log }  = require('../utils/logger');

const DB_PATH  = path.join(__dirname, '../data/db.json');

function readDb()      { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
function writeDb(data) { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8'); }

// POST /api/contacts — public
router.post('/', (req, res) => {
  const { name, phone, email, service, message } = req.body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, message: 'Nom, email et message sont requis.' });
  }

  const db = readDb();
  if (!db.contacts) db.contacts = [];

  const contact = {
    id:        `c_${Date.now()}_${uuidv4().slice(0, 8)}`,
    name:      name.trim(),
    phone:     (phone    || '').trim(),
    email:     email.trim(),
    service:   (service  || '').trim(),
    message:   message.trim(),
    read:      false,
    createdAt: new Date().toISOString()
  };

  db.contacts.unshift(contact);
  writeDb(db);
  log('SUBMIT_CONTACT', `Nouvelle demande de devis de ${contact.name} (${contact.email})`, 'public', { service: contact.service });
  res.status(201).json({ success: true, data: contact });
});

// GET /api/contacts — protégé
router.get('/', auth, (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.contacts || [] });
});

// PUT /api/contacts/:id — protégé (marquer lu / non lu)
router.put('/:id', auth, (req, res) => {
  const db = readDb();
  if (!db.contacts) db.contacts = [];

  const idx = db.contacts.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Demande introuvable.' });

  db.contacts[idx] = { ...db.contacts[idx], read: req.body.read };
  writeDb(db);
  const status = req.body.read ? 'marquée lue' : 'marquée non lue';
  log('UPDATE_CONTACT', `Demande de ${db.contacts[idx].name} ${status}`, req.user?.username, { id: req.params.id });
  res.json({ success: true, data: db.contacts[idx] });
});

// DELETE /api/contacts/:id — protégé
router.delete('/:id', auth, (req, res) => {
  const db = readDb();
  if (!db.contacts) db.contacts = [];

  const idx = db.contacts.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Demande introuvable.' });

  const deleted = db.contacts[idx];
  db.contacts.splice(idx, 1);
  writeDb(db);
  log('DELETE_CONTACT', `Demande supprimée — ${deleted.name} (${deleted.email})`, req.user?.username, { id: req.params.id });
  res.json({ success: true, message: 'Demande supprimée.' });
});

module.exports = router;
