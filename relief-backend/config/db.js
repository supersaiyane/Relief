// config/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Opens (or creates) data.db in project root
const db = new sqlite3.Database(path.resolve(__dirname, '../data.db'), err => {
  if (err) {
    console.error('❌ Failed to connect to SQLite:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
  }
});

// Enable Write‑Ahead Logging for better concurrency
db.serialize(() => {
  db.run('PRAGMA journal_mode = WAL;');
  db.run('PRAGMA busy_timeout = 5000;');  // wait up to 5s for locks
});

module.exports = db;
