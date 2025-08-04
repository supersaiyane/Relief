// backend/seedEmployees.js
// ---------------------------------------------------
// Clears the employee table and inserts 10 fresh records
// Usage: `node seedEmployees.js`
// ---------------------------------------------------

const initDb = require('./initDb');   // ensure tables (and roles) exist
const db     = require('./config/db'); // reuse the same data.db connection

function seedEmployees() {
  db.serialize(() => {
    // 1) Clear out existing employees
    db.run('DELETE FROM employee;', err => {
      if (err) {
        console.error('❌ Error clearing employee table:', err.message);
      } else {
        console.log('✅ Cleared employee table');
      }
    });

    // 2) Prepare insert (no IGNORE, we want exactly these 10)
    const stmt = db.prepare(`
      INSERT INTO employee
        (name, email, password, employee_code, status_id, manager_id, role_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, err => {
      if (err) console.error('❌ Prepare error:', err.message);
    });

    // 3) Define your 10 human‑readable employees
    const employees = [
      { name: 'Alice Johnson',  email: 'alice.johnson@example.com',  password: 'Passw0rd!',  employee_code: 'EMP001', status_id: 1, manager_id: null, role_id: 1 },
      { name: 'Bob Smith',      email: 'bob.smith@example.com',      password: 'Secret123',  employee_code: 'EMP002', status_id: 1, manager_id: 1,    role_id: 2 },
      { name: 'Carol Williams', email: 'carol.williams@example.com', password: 'Password1',  employee_code: 'EMP003', status_id: 1, manager_id: 2,    role_id: 3 },
      { name: 'David Brown',    email: 'david.brown@example.com',    password: 'MyPass123',  employee_code: 'EMP004', status_id: 1, manager_id: 2,    role_id: 3 },
      { name: 'Eva Martinez',   email: 'eva.martinez@example.com',   password: 'Eva2025!',   employee_code: 'EMP005', status_id: 1, manager_id: 2,    role_id: 3 },
      { name: 'Frank Garcia',   email: 'frank.garcia@example.com',   password: 'Frank#1',    employee_code: 'EMP006', status_id: 2, manager_id: 2,    role_id: 3 },
      { name: 'Grace Lee',      email: 'grace.lee@example.com',      password: 'GraceLee7',  employee_code: 'EMP007', status_id: 1, manager_id: 2,    role_id: 3 },
      { name: 'Henry Wilson',   email: 'henry.wilson@example.com',   password: 'Henry2025',  employee_code: 'EMP008', status_id: 3, manager_id: 2,    role_id: 3 },
      { name: 'Ivy Clark',      email: 'ivy.clark@example.com',      password: 'IvyPass!',   employee_code: 'EMP009', status_id: 1, manager_id: 2,    role_id: 2 },
      { name: 'Jack Lewis',     email: 'jack.lewis@example.com',     password: 'JackL3wis',  employee_code: 'EMP010', status_id: 1, manager_id: 9,    role_id: 3 }
    ];

    // 4) Run inserts
    employees.forEach(emp => {
      stmt.run(
        emp.name,
        emp.email,
        emp.password,
        emp.employee_code,
        emp.status_id,
        emp.manager_id,
        emp.role_id,
        function(err) {
          if (err) {
            console.error(`❌ Insert error for ${emp.email}:`, err.message);
          } else {
            console.log(`✅ Inserted ${emp.email} (id=${this.lastID})`);
          }
        }
      );
    });

    // 5) Finalize and report count
    stmt.finalize(err => {
      if (err) {
        console.error('❌ Finalize error:', err.message);
      } else {
        db.get('SELECT COUNT(*) AS cnt FROM employee;', (err, row) => {
          if (err) {
            console.error('❌ Count query error:', err.message);
          } else {
            console.log(`🎉 employee table now has ${row.cnt} rows.`);
          }
          db.close();
        });
      }
    });
  });
}

// Ensure tables exist, then seed
initDb();
seedEmployees();
