const express = require('express');
const db = require('../config/db');
const router = express.Router();

// GET /positions
router.get('/', (req, res) => {
  const sql = `
    SELECT
      p.req_id, p.title, p.client, p.department, p.location,
      p.salary_range, p.jd, p.stakeholder_id, stk.name AS stakeholder,
      p.status_id, ps.name AS status,
      p.date_created, p.date_closed
    FROM position_details p
    LEFT JOIN employee stk ON p.stakeholder_id = stk.id
    LEFT JOIN position_status ps ON p.status_id = ps.status_id
    ORDER BY p.req_id
  `;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /positions
router.post('/', (req, res) => {
  const {
    req_id, title, client, department, location,
    salary_range, jd, stakeholder_id, status_id
  } = req.body;
  const sql = `
    INSERT INTO position_details
      (req_id, title, client, department, location,
       salary_range, jd, stakeholder_id, status_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql,
    [req_id, title, client, department, location,
     salary_range, jd, stakeholder_id, status_id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ req_id });
    }
  );
});

// PUT /positions/:reqId
router.put('/:reqId', (req, res) => {
  const {
    title, client, department, location,
    salary_range, jd, stakeholder_id, status_id, date_closed
  } = req.body;
  const sql = `
    UPDATE position_details
    SET title = ?, client = ?, department = ?, location = ?,
        salary_range = ?, jd = ?, stakeholder_id = ?, status_id = ?, date_closed = ?
    WHERE req_id = ?
  `;
  db.run(sql,
    [title, client, department, location,
     salary_range, jd, stakeholder_id, status_id, date_closed,
     req.params.reqId],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Position not found' });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE /positions/:reqId
router.delete('/:reqId', (req, res) => {
  db.run(
    `DELETE FROM position_details WHERE req_id = ?`,
    [req.params.reqId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Position not found' });
      res.json({ deleted: this.changes });
    }
  );
});

module.exports = router;
