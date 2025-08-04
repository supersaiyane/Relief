// src/pages/AuditLogPage.jsx

import React, { useState, useEffect } from 'react';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/audit_logs')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        setLogs(data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading audit logs…</p>;
  if (error)   return <p className="error">Error: {error}</p>;
  if (!logs.length) return <p>No audit log entries found.</p>;

  const cols = [
    'created_at',
    'user_id',
    'table_name',
    'record_id',
    'column_name',
    'prev_value',
    'new_value',
    'operation'
  ];

  return (
    <div className="audit-log-page">
      <h2>Audit Log</h2>
      <table className="data-table">
        <thead>
          <tr>
            {cols.map(col => (
              <th key={col}>{col.replace('_', ' ').toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((row, idx) => (
            <tr key={idx}>
              {cols.map(col => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
