// backend/config/logDb.js
const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

const logDb = new sqlite3.Database(
  path.resolve(__dirname, '../logs.db'),
  err => {
    if (err) console.error('❌ Log DB connect:', err.message);
    else console.log('✅ Log DB connected.');
  }
);

logDb.serialize(() => {
  logDb.run('PRAGMA journal_mode = WAL;');
  logDb.run('PRAGMA busy_timeout = 5000;');
});

module.exports = logDb;
