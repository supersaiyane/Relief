// backend/routes/auth.js
const express = require('express');
const { v4: uuid } = require('uuid');
const db            = require('../config/db');
const { createSession } = require('../sessionStore');
const router        = express.Router();

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  const sql = `
    SELECT id, name, role_id
    FROM employee
    WHERE email = ? AND password = ?
  `;
  db.get(sql, [email, password], (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const sessionId = uuid();
    createSession(sessionId, user.id);

    res.json({
      sessionId,
      user: {
        id: user.id,
        name: user.name,
        roleId: user.role_id
      }
    });
  });
});

module.exports = router;
