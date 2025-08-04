import React, { useState, useEffect } from 'react';
import '../styles/ActiveUsersPage.css';

export default function ActiveUsersPage() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/sessions/active')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => setSessions(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="active-users-page">
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="active-users-page">
      <h2>Active Users ({sessions.length})</h2>
      <div className="table-container">
        <table className="active-users-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Session ID</th>
              <th>User ID</th>
              <th>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, idx) => (
              <tr key={idx}>
                <td><span className="dot" title="Active">●</span></td>
                <td>{s.sessionId}</td>
                <td>{s.userId}</td>
                <td>{new Date(s.lastActivity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sessions.length === 0 && <p>No active sessions.</p>}
      </div>
    </div>
  );
}
