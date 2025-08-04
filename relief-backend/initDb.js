// backend/initDb.js
const db    = require('./config/db');
const logDb = require('./config/logDb');

function init() {
  // --- MAIN DB TABLES & SEEDS ---
  const mainCreates = [
    `CREATE TABLE IF NOT EXISTS position_status (
       status_id INTEGER PRIMARY KEY,
       name TEXT NOT NULL UNIQUE
     );`,
    `CREATE TABLE IF NOT EXISTS candidate_status (
       status_id INTEGER PRIMARY KEY,
       name TEXT NOT NULL UNIQUE
     );`,
    `CREATE TABLE IF NOT EXISTS employee_status (
       status_id INTEGER PRIMARY KEY,
       name TEXT NOT NULL UNIQUE
     );`,
    `CREATE TABLE IF NOT EXISTS role_lookup (
       role_id INTEGER PRIMARY KEY,
       name TEXT NOT NULL UNIQUE
     );`,

  `CREATE TABLE IF NOT EXISTS employee (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    employee_code TEXT UNIQUE,
    status_id INTEGER NOT NULL DEFAULT 1,
    manager_id INTEGER,
    password TEXT NOT NULL,
    role_id INTEGER NOT NULL DEFAULT 3,  -- default to User
    FOREIGN KEY(status_id) REFERENCES employee_status(status_id),
    FOREIGN KEY(manager_id) REFERENCES employee(id),
    FOREIGN KEY(role_id) REFERENCES roles(id)
  );`,

    `CREATE TABLE IF NOT EXISTS position_details (
       req_id TEXT PRIMARY KEY,
       title TEXT NOT NULL,
       client TEXT NOT NULL,
       department TEXT,
       location TEXT,
       salary_range TEXT,
       jd TEXT,
       stakeholder_id INTEGER,
       status_id INTEGER NOT NULL DEFAULT 1,
       date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
       date_closed DATETIME,
       FOREIGN KEY(stakeholder_id) REFERENCES employee(id),
       FOREIGN KEY(status_id) REFERENCES position_status(status_id)
     );`,

    `CREATE TABLE IF NOT EXISTS candidate (
       candidate_id TEXT PRIMARY KEY,
       position_id TEXT NOT NULL,
       name TEXT NOT NULL,
       email TEXT NOT NULL,
       phone TEXT,
       experience_years REAL,
       current_company TEXT,
       current_ctc REAL,
       notice_period TEXT,
       resume_path TEXT,
       submitted_by_id INTEGER,
       status_id INTEGER NOT NULL DEFAULT 1,
       date_submitted DATETIME DEFAULT CURRENT_TIMESTAMP,
       last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY(position_id) REFERENCES position_details(req_id),
       FOREIGN KEY(submitted_by_id) REFERENCES employee(id),
       FOREIGN KEY(status_id) REFERENCES candidate_status(status_id)
     );`,

    `CREATE TABLE IF NOT EXISTS skill (
       skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL UNIQUE
     );`,

    `CREATE TABLE IF NOT EXISTS candidate_skill (
       candidate_id TEXT NOT NULL,
       skill_id INTEGER NOT NULL,
       PRIMARY KEY (candidate_id, skill_id),
       FOREIGN KEY(candidate_id) REFERENCES candidate(candidate_id),
       FOREIGN KEY(skill_id) REFERENCES skill(skill_id)
     );`,

    `CREATE TABLE IF NOT EXISTS interview (
       interview_id INTEGER PRIMARY KEY AUTOINCREMENT,
       candidate_id TEXT NOT NULL,
       interviewer_id INTEGER NOT NULL,
       scheduled_at DATETIME NOT NULL,
       mode TEXT,
       feedback TEXT,
       outcome TEXT,
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY(candidate_id) REFERENCES candidate(candidate_id),
       FOREIGN KEY(interviewer_id) REFERENCES employee(id)
     );`,

    `CREATE TABLE IF NOT EXISTS notification (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       candidate_id TEXT,
       req_id TEXT,
       sent_to TEXT NOT NULL,
       notification_type TEXT,
       sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
       status TEXT,
       FOREIGN KEY(candidate_id) REFERENCES candidate(candidate_id),
       FOREIGN KEY(req_id) REFERENCES position_details(req_id)
     );`
     
  ];

  const mainSeeds = [
    `INSERT OR IGNORE INTO position_status(name) VALUES
       ('Open'),('Closed'),('On Hold');`,
    `INSERT OR IGNORE INTO candidate_status(name) VALUES
       ('Applied'),('Interviewing'),('Offered'),('Rejected');`,
    `INSERT OR IGNORE INTO employee_status(name) VALUES
       ('Active'),('Inactive'),('On Leave');`,
    `INSERT OR IGNORE INTO role_lookup(name) VALUES
       ('Admin'),('Interviewer'),('Recruiter');`
  ];

  const roleSeed = `
  INSERT OR IGNORE INTO roles (id,name) VALUES
    (1,'Admin'),
    (2,'Manager'),
    (3,'User');
`;

  db.serialize(() => {
    mainCreates.forEach(sql =>
      db.run(sql, err => err && console.error('MainDB Create Error:', err.message))
    );
    mainSeeds.forEach(sql =>
      db.run(sql, err => err && console.error('MainDB Seed Error:', err.message))
    );
    db.run(roleSeed, err => err && console.error('Role seed error:', err.message));
    console.log('✅ Main database tables created and seeded.');
  });

  // --- LOG DB TABLES ---
  const logCreates = [
    `CREATE TABLE IF NOT EXISTS logs (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       event_type TEXT NOT NULL,
       message TEXT,
       actor_id INTEGER,
       candidate_id TEXT,
       req_id TEXT,
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
     );`,
    `CREATE TABLE IF NOT EXISTS audit_logs (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       user_id INTEGER,
       table_name TEXT NOT NULL,
       record_id TEXT,
       column_name TEXT,
       prev_value TEXT,
       new_value TEXT,
       operation TEXT NOT NULL,
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
     );`
  ];

  logDb.serialize(() => {
    logCreates.forEach(sql =>
      logDb.run(sql, err => err && console.error('LogDB Create Error:', err.message))
    );
    console.log('✅ Log database tables created.');
  });
}

// Run initialization when this script is invoked
init();

module.exports = init;
