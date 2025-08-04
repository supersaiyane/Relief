// backend/routes/employees.js

const express = require('express');
const db      = require('../config/db');
const router  = express.Router();
const {
  enqueueLog,
  enqueueFieldLog
} = require('../auditQueue');



// Verify imports
console.log(
  '✅ employees.js loaded:',
  'enqueueLog='      + typeof enqueueLog,
  'enqueueFieldLog=' + typeof enqueueFieldLog
);

// GET /employees
router.get('/', (req, res, next) => {
  const sql = `
    SELECT 
      e.id, e.name, e.email, e.employee_code,
      e.status_id, s.name AS status,
      e.manager_id, e.role_id, r.name AS role
    FROM employee e
    LEFT JOIN employee_status s ON e.status_id = s.status_id
    LEFT JOIN roles r             ON e.role_id   = r.id
    ORDER BY e.id
  `;
  db.all(sql, (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

// POST /employees
router.post('/', (req, res, next) => {
  const { name, email, employee_code, status_id, manager_id, role_id } = req.body;
  const sql = `
    INSERT INTO employee
      (name, email, employee_code, status_id, manager_id, role_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(sql,
    [name, email, employee_code, status_id, manager_id, role_id],
    function(err) {
      if (err) return next(err);

      const newId = this.lastID;
      //const userId = req.user?.id || req.headers['x-user-id'] || null;
      const userId = req.user.id;

      console.log(
        '🔔 enqueueLog CREATE:',
        { userId, tableName:'employee', recordId:newId, operation:'CREATE', changes:{ name, email, employee_code, status_id, manager_id, role_id }}
      );
      enqueueLog(
        userId,
        'employee',
        newId,
        'CREATE',
        { name, email, employee_code, status_id, manager_id, role_id }
      );

      res.status(201).json({ id: newId });
    }
  );
});

// PUT /employees/:id
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const updates = {
    name:           req.body.name,
    email:          req.body.email,
    employee_code:  req.body.employee_code,
    status_id:      req.body.status_id,
    manager_id:     req.body.manager_id,
    role_id:        req.body.role_id
  };

  // 1) Fetch existing row
  db.get(`SELECT * FROM employee WHERE id = ?`, [id], (err, oldRow) => {
    if (err) return next(err);
    if (!oldRow) return res.status(404).json({ error: 'Employee not found' });

    // 2) Compute diffs
    const diffs = [];
    for (const [col, newVal] of Object.entries(updates)) {
      const oldVal = oldRow[col];
      if (String(newVal) !== String(oldVal)) {
        diffs.push({ column: col, prev: oldVal, curr: newVal });
      }
    }
    if (diffs.length === 0) {
      return res.json({ updated: 0, message: 'No changes detected' });
    }

    // 3) Apply update
    const sqlUpdate = `
      UPDATE employee
      SET name = ?, email = ?, employee_code = ?,
          status_id = ?, manager_id = ?, role_id = ?
      WHERE id = ?
    `;
    db.run(sqlUpdate,
      [
        updates.name, updates.email, updates.employee_code,
        updates.status_id, updates.manager_id, updates.role_id,
        id
      ],
      function(err) {
        if (err) return next(err);

        //const userId = req.user?.id || req.headers['x-user-id'] || null;
        const userId = req.user.id;

        // 4) Log each field change
        diffs.forEach(d => {
          console.log(
            '🔔 enqueueFieldLog UPDATE:',
            {
              userId,
              tableName: 'employee',
              recordId: id,
              columnName: d.column,
              prevValue: d.prev,
              newValue:  d.curr
            }
          );
          enqueueFieldLog(
            userId,
            'employee',
            id,
            d.column,
            d.prev,
            d.curr
          );
        });

        res.json({ updated: this.changes, changes: diffs });
      }
    );
  });
});

// DELETE /employees/:id
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  // Fetch old row for audit
  db.get(`SELECT * FROM employee WHERE id = ?`, [id], (err, oldRow) => {
    if (err) return next(err);
    if (!oldRow) return res.status(404).json({ error: 'Employee not found' });

    db.run(`DELETE FROM employee WHERE id = ?`, [id], function(err) {
      if (err) return next(err);

      //const userId = req.user?.id || req.headers['x-user-id'] || null;
      const userId = req.user.id;
      console.log(
        '🔔 enqueueLog DELETE:',
        { userId, tableName:'employee', recordId:id, operation:'DELETE', changes:oldRow }
      );
      enqueueLog(userId, 'employee', id, 'DELETE', oldRow);

      res.json({ deleted: this.changes });
    });
  });
});

module.exports = router;
