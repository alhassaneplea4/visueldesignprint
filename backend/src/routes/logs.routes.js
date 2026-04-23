'use strict';

const express  = require('express');
const router   = express.Router();
const path     = require('path');
const fs       = require('fs');
const auth     = require('../middleware/auth.middleware');
const { log }  = require('../utils/logger');

const DB_PATH  = path.join(__dirname, '../data/db.json');
function readDb()      { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
function writeDb(data) { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8'); }

// GET /api/logs — protégé
router.get('/', auth, (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.logs || [] });
});

// DELETE /api/logs — protégé (effacer tout le journal)
router.delete('/', auth, (req, res) => {
  const db  = readDb();
  db.logs   = [];
  writeDb(db);
  log('CLEAR_LOGS', 'Journal d\'activités effacé', req.user?.username);
  res.json({ success: true, message: 'Journal effacé.' });
});

module.exports = router;
