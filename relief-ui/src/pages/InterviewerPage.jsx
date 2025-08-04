// src/pages/InterviewPage.jsx

import React, { useState, useEffect } from 'react';

import '../styles/InterviewPage.css';

export default function InterviewPage() {
  const [form, setForm] = useState({
    candidate_id: '',
    interviewer_id: '',
    scheduled_at: '',
    mode: '',
    feedback: '',
    outcome: ''
  });
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]       = useState(null);

  // Load existing interviews
  useEffect(() => {
    fetch('/interviews')
      .then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(data => setInterviews(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Handle form input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Add a new interview
  const handleAdd = () => {
    // basic validation
    if (!form.candidate_id || !form.interviewer_id || !form.scheduled_at) {
      return alert('Please fill candidate, interviewer and scheduled_at');
    }
    fetch('/interviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(newRec => {
        // append created item (server should return it)
        setInterviews(iv => [...iv, { ...form, interview_id: newRec.interview_id, created_at: newRec.created_at }]);
        // reset form
        setForm({
          candidate_id: '',
          interviewer_id: '',
          scheduled_at: '',
          mode: '',
          feedback: '',
          outcome: ''
        });
      })
      .catch(err => alert('Add failed: ' + err.message));
  };

  if (loading) return <p>Loading interviews…</p>;
  if (error)   return <p className="error">Error: {error}</p>;

  return (
    <div className="interview-page">
      <h2>Manage Interviews</h2>

      <div className="interview-form">
        <label>
          Candidate ID  
          <input
            name="candidate_id"
            value={form.candidate_id}
            onChange={handleChange}
            placeholder="e.g. CAND001"
          />
        </label>
        <label>
          Interviewer ID  
          <input
            name="interviewer_id"
            type="number"
            value={form.interviewer_id}
            onChange={handleChange}
            placeholder="e.g. 3"
          />
        </label>
        <label>
          Scheduled At  
          <input
            name="scheduled_at"
            type="datetime-local"
            value={form.scheduled_at}
            onChange={handleChange}
          />
        </label>
        <label>
          Mode  
          <input
            name="mode"
            value={form.mode}
            onChange={handleChange}
            placeholder="Zoom / In-person"
          />
        </label>
        <label>
          Feedback  
          <input
            name="feedback"
            value={form.feedback}
            onChange={handleChange}
          />
        </label>
        <label>
          Outcome  
          <input
            name="outcome"
            value={form.outcome}
            onChange={handleChange}
            placeholder="Pending / Passed / Failed"
          />
        </label>
        <button type="button" onClick={handleAdd}>
          Add Interview
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Candidate</th>
            <th>Interviewer</th>
            <th>Scheduled At</th>
            <th>Mode</th>
            <th>Feedback</th>
            <th>Outcome</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map(iv => (
            <tr key={iv.interview_id}>
              <td>{iv.interview_id}</td>
              <td>{iv.candidate_id}</td>
              <td>{iv.interviewer_id}</td>
              <td>{iv.scheduled_at}</td>
              <td>{iv.mode}</td>
              <td>{iv.feedback}</td>
              <td>{iv.outcome}</td>
              <td>{iv.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
