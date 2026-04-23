'use strict';

const path = require('path');
const fs   = require('fs');

const DB_PATH  = path.join(__dirname, '../data/db.json');
const MAX_LOGS = 300;

function readDb()      { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
function writeDb(data) { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8'); }

function log(action, label, user, details) {
  try {
    const db = readDb();
    if (!db.logs) db.logs = [];

    db.logs.unshift({
      id:        `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      action,
      label,
      user:      user    || 'système',
      details:   details || null,
      createdAt: new Date().toISOString()
    });

    if (db.logs.length > MAX_LOGS) db.logs = db.logs.slice(0, MAX_LOGS);
    writeDb(db);
  } catch (err) {
    console.error('[LOGGER]', err.message);
  }
}

module.exports = { log };
