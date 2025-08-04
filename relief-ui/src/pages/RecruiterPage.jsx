// src/pages/RecruiterPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { downloadCsv } from '../utils/downloadCsv';

export default function RecruiterPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const [filters, setFilters] = useState({
    positionId:    '',
    email:         '',
    submittedBy:   '',
    positionTitle: ''
  });

  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  // 1) Fetch candidates from relative path
  useEffect(() => {
    setLoading(true);
    fetch('/candidates')                  // <-- RELATIVE URL
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        setCandidates(data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // 2) Filtering logic
  const lower = str => (str || '').toString().toLowerCase();
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // 3) Sorting logic
  const handleSort = col => {
    setSortConfig(prev => ({
      key: col,
      direction: prev.key === col && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // 4) Memoized filtered & sorted array
  const filteredAndSorted = useMemo(() => {
    let data = [...candidates];
    // filters
    data = data.filter(r =>
      lower(r.position_id).includes(lower(filters.positionId)) &&
      lower(r.email).includes(lower(filters.email)) &&
      lower(r.submitted_by).includes(lower(filters.submittedBy)) &&
      lower(r.position_title).includes(lower(filters.positionTitle))
    );
    // sort
    if (sortConfig.key) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.key], bVal = b[sortConfig.key];
        if (!isNaN(aVal) && !isNaN(bVal)) {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return (
          lower(aVal).localeCompare(lower(bVal)) *
          (sortConfig.direction === 'asc' ? 1 : -1)
        );
      });
    }
    return data;
  }, [candidates, filters, sortConfig]);

  // 5) Expose for downloads
  RecruiterPage.getData = () => filteredAndSorted;

  // 6) Render & download
  if (loading) return <p>Loading candidates…</p>;
  if (error)   return <p className="error">Error: {error}</p>;
  if (!candidates.length) return <p>No candidates found.</p>;

  const cols = Object.keys(candidates[0]);
  const colLabels = {
    position_id:    'Position ID',
    email:          'Email',
    submitted_by:   'Submitted By',
    position_title: 'Position Title'
  };

  const SortArrow = ({ colKey }) => {
    if (sortConfig.key !== colKey) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const handleDownload = () => {
    if (!filteredAndSorted.length) return alert('No data to download');
    downloadCsv('Overall Report.csv', cols, filteredAndSorted);
  };

  return (
    <div className="recruiter-page">
      <h2>Candidates / Overall Report</h2>
      <button onClick={handleDownload} style={{ marginBottom: '1rem' }}>
        Download "Overall Report"
      </button>

      <div className="filters">
        <input
          name="positionId"
          placeholder="Filter by Position ID"
          value={filters.positionId}
          onChange={handleFilterChange}
        />
        <input
          name="email"
          placeholder="Filter by Email"
          value={filters.email}
          onChange={handleFilterChange}
        />
        <input
          name="submittedBy"
          placeholder="Filter by Submitted By"
          value={filters.submittedBy}
          onChange={handleFilterChange}
        />
        <input
          name="positionTitle"
          placeholder="Filter by Position Title"
          value={filters.positionTitle}
          onChange={handleFilterChange}
        />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {cols.map(col => (
              <th key={col} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
                {colLabels[col] || col}
                <SortArrow colKey={col} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAndSorted.map((cand, i) => (
            <tr key={i}>
              {cols.map(col => (
                <td key={col}>{cand[col] ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
