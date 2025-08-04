// backend/seedLogs.js
const logDb = require('./config/logDb');

function seedLogs() {
  logDb.serialize(() => {
    // 1) Seed the logs table
    const logStmt = logDb.prepare(`
      INSERT INTO logs
        (event_type, message, actor_id, candidate_id, req_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    const eventTypes = ['INFO', 'WARN', 'ERROR'];
    for (let i = 1; i <= 20; i++) {
      const eventType   = eventTypes[i % eventTypes.length];
      const message     = `${eventType} log message ${i}`;
      const actorId     = (i % 5) + 1;                                           // users 1–5
      const candidateId = `CAND${String(((i - 1) % 20) + 1).padStart(3, '0')}`;   // CAND001–CAND020
      const reqId       = `REQ${String(((i - 1) % 20) + 1).padStart(3, '0')}`;    // REQ001–REQ020

      logStmt.run(eventType, message, actorId, candidateId, reqId);
    }
    logStmt.finalize();

    // 2) Seed the audit_logs table
    const auditStmt = logDb.prepare(`
      INSERT INTO audit_logs
        (user_id, table_name, record_id,
         column_name, prev_value, new_value, operation)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const tables  = ['employee', 'position_details', 'candidate', 'skill'];
    const columns = ['name', 'email', 'status_id', 'location', 'jd'];

    for (let i = 1; i <= 20; i++) {
      const userId     = (i % 5) + 1;
      const tableName  = tables[i % tables.length];
      // derive record_id based on table
      let recordId;
      if (tableName === 'employee') {
        recordId = String(((i - 1) % 20) + 1);
      } else if (tableName === 'position_details') {
        recordId = `REQ${String(((i - 1) % 20) + 1).padStart(3, '0')}`;
      } else if (tableName === 'candidate') {
        recordId = `CAND${String(((i - 1) % 20) + 1).padStart(3, '0')}`;
      } else {
        recordId = String(((i - 1) % 20) + 1);
      }
      const columnName = columns[i % columns.length];
      const prevValue  = `old_${columnName}_${i}`;
      const newValue   = `new_${columnName}_${i}`;
      const operation  = 'UPDATE';

      auditStmt.run(
        userId,
        tableName,
        recordId,
        columnName,
        prevValue,
        newValue,
        operation
      );
    }
    auditStmt.finalize();

    console.log('✅ Seeded 20 rows each into logs and audit_logs.');
  });
}

seedLogs();
