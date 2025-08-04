// backend/index.js

const express = require('express');
const cors    = require('cors');
const initDb  = require('./initDb');
const db      = require('./config/db');
const logDb   = require('./config/logDb');
const { setupQueueSSE } = require('./auditQueue');
const sessionRoutes = require('./routes/sessions');
const authRoutes = require('./routes/auth');
const employeeRoutes  = require('./routes/employees');
const positionRoutes  = require('./routes/positions');
const candidateRoutes = require('./routes/candidates');
const skillRoutes     = require('./routes/skills');
const auditLogRoutes  = require('./routes/auditLogs');
const interviewRoutes = require('./routes/interviews');
const session = require('./routes/sessions');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Initialize both data.db and logs.db
initDb();

// Health check
app.get('/', (req, res) =>
  res.send('Recruiter backend is running.')
);

// Mount routes
app.use('/employees',  employeeRoutes);
app.use('/positions',  positionRoutes);
app.use('/candidates', candidateRoutes);
app.use('/skills',     skillRoutes);
app.use('/audit_logs', auditLogRoutes);
app.use('/sessions',   sessionStore);
app.use('/auth', authRoutes);
app.use('/interviews', interviewRoutes);

// SSE endpoint for in‑memory audit queue
setupQueueSSE(app);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'changeme',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // secure:true if HTTPS
  })
);

app.use((req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
});

// Global error handler — logs to separate logs.db then responds 500
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  const actorId     = req.user?.id || req.headers['x-user-id'] || null;
  const candidateId = req.body.candidate_id || null;
  const reqId       = req.body.req_id       || null;

  const sql = `
    INSERT INTO logs
      (event_type, message, actor_id, candidate_id, req_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  logDb.run(
    sql,
    ['ERROR', (err.stack || err.message), actorId, candidateId, reqId],
    logErr => {
      if (logErr) {
        console.error('Failed to write to logs table:', logErr.message);
      }
      // Respond after attempting to log
      res.status(500).json({ error: 'Internal Server Error' });
    }
  );
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
