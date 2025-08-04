// backend/sessionStore.js
const SESSION_TIMEOUT = 1000 * 60 * 5; // 5 minutes

// { sessionId: { userId, lastActivity: timestamp } }
const sessions = new Map();

// Create a new session
function createSession(sessionId, userId) {
  sessions.set(sessionId, { userId, lastActivity: Date.now() });
}

// Remove a session
function endSession(sessionId) {
  sessions.delete(sessionId);
}

// Heartbeat: update lastActivity
function heartbeat(sessionId) {
  const s = sessions.get(sessionId);
  if (s) s.lastActivity = Date.now();
}

// Return array of active sessions (not timed out)
function getActiveSessions() {
  const now = Date.now();
  const active = [];
  for (const [sessionId, { userId, lastActivity }] of sessions) {
    if (now - lastActivity <= SESSION_TIMEOUT) {
      active.push({ sessionId, userId, lastActivity });
    } else {
      sessions.delete(sessionId);
    }
  }
  return active;
}

module.exports = { createSession, endSession, heartbeat, getActiveSessions };
