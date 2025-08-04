import React, { useState, useRef } from 'react';

const tableOptions = [
  { value: 'employee', label: 'Employee' },
  { value: 'position_details', label: 'Position Details' },
  { value: 'candidate', label: 'Candidate' },
  { value: 'skill', label: 'Skill' }
];

const endpointMap = {
  employee: 'employees',
  position_details: 'positions',
  candidate: 'candidates',
  skill: 'skills'
};

export default function BulkUploadPage() {
  const [table, setTable] = useState('employee');
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleTableChange = e => setTable(e.target.value);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target.result;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, idx) => {
          obj[h] = values[idx] ? values[idx].trim() : '';
        });
        return obj;
      });
      setPreview(data);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleAdd = async () => {
    if (!preview.length) return;
    setUploading(true);
    try {
      const endpoint = endpointMap[table];
      for (const row of preview) {
        const res = await fetch(`http://localhost:3000/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(row)
        });
        if (!res.ok) throw new Error(`Row failed: ${JSON.stringify(row)}`);
      }
      alert('Bulk upload successful');
      setPreview([]);
      fileInputRef.current.value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    setPreview([]);
    fileInputRef.current.value = '';
    setError(null);
  };

  return (
    <div className="bulk-page">
      <h2>Upload Bulk Data</h2>
      <div className="bulk-toolbar">
        <select value={table} onChange={handleTableChange}>
          {tableOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <button onClick={handleAdd} disabled={uploading || !preview.length}>
          {uploading ? 'Uploading...' : 'Add'}
        </button>
        <button onClick={handleDelete} disabled={!preview.length}>
          Delete
        </button>
      </div>

      {error && <p className="error">Error: {error}</p>}

      {preview.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              {Object.keys(preview[0]).map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
