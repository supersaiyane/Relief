// backend/routes/auditLogs.js

const express = require('express');
const logDb   = require('../config/logDb');
const router  = express.Router();

/**
 * GET /audit_logs
 * Returns all audit log entries from the logs.db, newest first.
 */
router.get('/', (req, res) => {
  const sql = `
    SELECT
      id,
      user_id,
      table_name,
      record_id,
      column_name,
      prev_value,
      new_value,
      operation,
      created_at
    FROM audit_logs
    ORDER BY created_at DESC
  `;
  
  logDb.all(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching audit_logs:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;
