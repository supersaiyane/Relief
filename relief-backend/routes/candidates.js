const express = require('express');
const db = require('../config/db');
const router = express.Router();

// GET /candidates
router.get('/', (req, res) => {
  const sql = `
    SELECT
      c.candidate_id, c.position_id, pos.title AS position_title,
      c.name, c.email, c.phone, c.experience_years,
      c.current_company, c.current_ctc, c.notice_period,
      c.resume_path, c.submitted_by_id, sub.name AS submitted_by,
      c.status_id, cs.name AS status,
      c.date_submitted, c.last_updated
    FROM candidate c
    LEFT JOIN position_details pos ON c.position_id = pos.req_id
    LEFT JOIN employee sub ON c.submitted_by_id = sub.id
    LEFT JOIN candidate_status cs ON c.status_id = cs.status_id
    ORDER BY c.candidate_id
  `;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /candidates
router.post('/', (req, res) => {
  const {
    candidate_id, position_id, name, email, phone,
    experience_years, current_company, current_ctc,
    notice_period, resume_path, submitted_by_id, status_id
  } = req.body;
  const sql = `
    INSERT INTO candidate
      (candidate_id, position_id, name, email, phone,
       experience_years, current_company, current_ctc,
       notice_period, resume_path, submitted_by_id, status_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql,
    [candidate_id, position_id, name, email, phone,
     experience_years, current_company, current_ctc,
     notice_period, resume_path, submitted_by_id, status_id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ candidate_id });
    }
  );
});

// PUT /candidates/:id
router.put('/:id', (req, res) => {
  const {
    position_id, name, email, phone,
    experience_years, current_company, current_ctc,
    notice_period, resume_path, submitted_by_id, status_id, date_closed
  } = req.body;
  const sql = `
    UPDATE candidate
    SET position_id = ?, name = ?, email = ?, phone = ?,
        experience_years = ?, current_company = ?, current_ctc = ?,
        notice_period = ?, resume_path = ?, submitted_by_id = ?,
        status_id = ?
    WHERE candidate_id = ?
  `;
  db.run(sql,
    [position_id, name, email, phone,
     experience_years, current_company, current_ctc,
     notice_period, resume_path, submitted_by_id, status_id,
     req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Candidate not found' });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE /candidates/:id
router.delete('/:id', (req, res) => {
  db.run(
    `DELETE FROM candidate WHERE candidate_id = ?`,
    [req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Candidate not found' });
      res.json({ deleted: this.changes });
    }
  );
});

module.exports = router;
