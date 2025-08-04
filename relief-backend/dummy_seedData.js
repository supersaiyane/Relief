// seedData.js
const db = require('./config/db');

function seed() {
  db.serialize(() => {
    // 1) Employees
    // const empStmt = db.prepare(`
    //   INSERT OR IGNORE INTO employee 
    //     (name, email, employee_code, status_id, manager_id, role_id)
    //   VALUES (?, ?, ?, ?, ?, ?)
    // `);
    // for (let i = 1; i <= 20; i++) {
    //   empStmt.run(
    //     `Employee ${i}`,
    //     `employee${i}@example.com`,
    //     `EMP${String(i).padStart(3, '0')}`,
    //     ((i - 1) % 3) + 1,    // status_id ∈ {1,2,3}
    //     null,                 // no manager for simplicity
    //     ((i - 1) % 3) + 1     // role_id ∈ {1,2,3} (Admin,Interviewer,Recruiter)
    //   );
    // }
    // empStmt.finalize();

    // 2) Position details
    const posStmt = db.prepare(`
      INSERT OR IGNORE INTO position_details
        (req_id, title, client, department, location, salary_range, jd, stakeholder_id, status_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (let i = 1; i <= 20; i++) {
      posStmt.run(
        `REQ${String(i).padStart(3, '0')}`,
        `Job Title ${i}`,
        `Client ${((i - 1) % 5) + 1}`,
        `Dept ${((i - 1) % 4) + 1}`,
        `Location ${((i - 1) % 4) + 1}`,
        `${50000 + i * 1000}-${60000 + i * 1000}`,
        `Job description for position ${i}`,
        ((i - 1) % 20) + 1,   // stakeholder_id ∈ [1..20]
        ((i - 1) % 3) + 1     // status_id ∈ {1,2,3}
      );
    }
    posStmt.finalize();

    // 3) Candidates
    const candStmt = db.prepare(`
      INSERT OR IGNORE INTO candidate
        (candidate_id, position_id, name, email, phone,
         experience_years, current_company, current_ctc,
         notice_period, resume_path, submitted_by_id, status_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (let i = 1; i <= 20; i++) {
      const posId = `REQ${String(((i - 1) % 20) + 1).padStart(3, '0')}`;
      candStmt.run(
        `CAND${String(i).padStart(3, '0')}`,
        posId,
        `Candidate ${i}`,
        `candidate${i}@example.com`,
        `555-010${String(i).padStart(2, '0')}`,
        (Math.random() * 10).toFixed(1),          // 0.0–10.0 yrs
        `Company ${((i - 1) % 5) + 1}`,
        (300000 + i * 10000).toFixed(2),          // salary
        `${30 + ((i - 1) % 3) * 15} days`,        // notice
        `/uploads/resume${i}.pdf`,
        ((i - 1) % 20) + 1,                       // submitted_by_id ∈ [1..20]
        ((i - 1) % 4) + 1                         // status_id ∈ {1..4}
      );
    }
    candStmt.finalize();

    console.log('✅ Seeded 20 rows each into employee, position_details, and candidate.');
  });
}

seed();
