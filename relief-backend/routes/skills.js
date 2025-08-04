const express = require('express');
const db = require('../config/db');
const router = express.Router();

// GET /skills
router.get('/', (req, res) => {
  db.all(`SELECT * FROM skill ORDER BY skill_id`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /skills
router.post('/', (req, res) => {
  const { name } = req.body;
  db.run(
    `INSERT INTO skill (name) VALUES (?)`,
    [name],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ skill_id: this.lastID });
    }
  );
});

// PUT /skills/:id
router.put('/:id', (req, res) => {
  const { name } = req.body;
  db.run(
    `UPDATE skill SET name = ? WHERE skill_id = ?`,
    [name, req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Skill not found' });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE /skills/:id
router.delete('/:id', (req, res) => {
  db.run(
    `DELETE FROM skill WHERE skill_id = ?`,
    [req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Skill not found' });
      res.json({ deleted: this.changes });
    }
  );
});

module.exports = router;
