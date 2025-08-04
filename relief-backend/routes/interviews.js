// backend/routes/interviews.js
const express = require('express');
const db      = require('../config/db');
const router  = express.Router();

// GET /interviews
router.get('/', (req, res, next) => {
  db.all(
    `SELECT
       interview_id, candidate_id, interviewer_id,
       scheduled_at, mode, feedback, outcome, created_at
     FROM interview
     ORDER BY interview_id`,
    (err, rows) => {
      if (err) return next(err);
      res.json(rows);
    }
  );
});

// POST /interviews
router.post('/', (req, res, next) => {
  const { candidate_id, interviewer_id, scheduled_at, mode, feedback, outcome } = req.body;
  const sql = `
    INSERT INTO interview
      (candidate_id, interviewer_id, scheduled_at, mode, feedback, outcome)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(
    sql,
    [candidate_id, interviewer_id, scheduled_at, mode, feedback, outcome],
    function(err) {
      if (err) return next(err);
      // return the newly created record’s ID and created_at
      db.get(
        `SELECT interview_id, created_at FROM interview WHERE interview_id = ?`,
        [this.lastID],
        (err2, row) => {
          if (err2) return next(err2);
          res.status(201).json(row);
        }
      );
    }
  );
});

module.exports = router;
