// backend/auditQueue.js

const logDb    = require('./config/logDb');
const FLUSH_INTERVAL = 1000;   // ms

// In‑memory queue
let queue = [];

/**
 * Enqueue a full‑row audit log (CREATE or DELETE).
 */
function enqueueLog(userId, tableName, recordId, operation, changes) {
  console.log('📝 enqueueLog:', { userId, tableName, recordId, operation, changes });
  queue.push({ type: 'FULL', userId, tableName, recordId, operation, changes });
}

/**
 * Enqueue a single‑field audit log (UPDATE).
 */
function enqueueFieldLog(userId, tableName, recordId, columnName, prevValue, newValue) {
  console.log('📝 enqueueFieldLog:', {
    userId,
    tableName,
    recordId,
    columnName,
    prevValue,
    newValue
  });
  queue.push({
    type:      'FIELD',
    userId,
    tableName,
    recordId,
    columnName,
    prevValue: prevValue == null ? null : String(prevValue),
    newValue:  newValue   == null ? null : String(newValue)
  });
}

/**
 * Expose the raw queue for debugging.
 */
function getQueue() {
  return queue;
}

/**
 * SSE endpoint to stream the queue state.
 */
function setupQueueSSE(app) {
  app.get('/_debug/audit_queue/stream', (req, res) => {
    res.set({
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection:      'keep-alive'
    });
    res.flushHeaders();

    const send = () => res.write(`data: ${JSON.stringify(queue)}\n\n`);
    send();
    const iv = setInterval(send, FLUSH_INTERVAL);
    req.on('close', () => { clearInterval(iv); res.end(); });
  });
}

// Background flush
setInterval(() => {
  if (queue.length === 0) return;
  const items = queue.splice(0, queue.length);

  logDb.serialize(() => {
    items.forEach(item => {
      if (item.type === 'FULL') {
        // CREATE or DELETE: store JSON in new_value
        const sql = `
          INSERT INTO audit_logs
            (user_id, table_name, record_id, column_name, prev_value, new_value, operation)
          VALUES (?, ?, ?, NULL, NULL, ?, ?)
        `;
        logDb.run(sql, [
          item.userId,
          item.tableName,
          item.recordId,
          JSON.stringify(item.changes),
          item.operation
        ], err => {
          if (err) console.error('AuditQueue FULL error:', err.message);
        });
      } else {
        // UPDATE: one row per field change
        const sql = `
          INSERT INTO audit_logs
            (user_id, table_name, record_id, column_name, prev_value, new_value, operation)
          VALUES (?, ?, ?, ?, ?, ?, 'UPDATE')
        `;
        logDb.run(sql, [
          item.userId,
          item.tableName,
          item.recordId,
          item.columnName,
          item.prevValue,
          item.newValue
        ], err => {
          if (err) console.error('AuditQueue FIELD error:', err.message);
        });
      }
    });
  });
}, FLUSH_INTERVAL);

module.exports = {
  enqueueLog,
  enqueueFieldLog,
  getQueue,
  setupQueueSSE
};
