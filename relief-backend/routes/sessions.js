// backend/routes/sessions.js
const express = require('express');
const { v4: uuid } = require('uuid');

const {
  createSession,
  endSession,
  heartbeat,
  getActiveSessions
} = require('../sessionStore');
const router = express.Router();

// POST /sessions/login
// router.post('/login', (req, res) => {
//   const { userId } = req.body;
//   if (!userId) return res.status(400).json({ error: 'userId required' });
//   const sessionId = uuid();
//   createSession(sessionId, userId);
//   res.json({ sessionId });
// });

router.post('/login', (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  // Lookup the user in the employee table
  db.get(
    `SELECT id, name, role_id AS roleId
     FROM employee
     WHERE id = ?`,
    [userId],
    (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      req.session.user = user;    
      // Create a new session for this user object
      const sessionId = uuid();
      createSession(sessionId, user);

      // Return both the sessionId and user info
      res.json({
        sessionId,
        user
      });
    }
  );
});

// POST /sessions/heartbeat
router.post('/heartbeat', (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
  heartbeat(sessionId);
  res.json({ ok: true });
});

// POST /sessions/logout
router.post('/logout', (req, res) => {
  const { sessionId } = req.body;
  if (sessionId) endSession(sessionId);
  res.json({ ok: true });
});

// GET /sessions/active
router.get('/active', (req, res) => {
  res.json(getActiveSessions());
});

module.exports = router;
