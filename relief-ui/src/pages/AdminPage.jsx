import React, { useState, useEffect, useMemo } from 'react';
import Tabs from '../components/Tabs';
import TabPanel from '../components/TabPanel';

// Map endpoints and keys
const endpointMap = {
  employee: 'employees',
  position_details: 'positions',
  candidate: 'candidates',
  skill: 'skills'
};

// Filter config per table
const filterConfig = {
  employee: { field: 'email', label: 'Filter by Email' },
  position_details: { field: 'req_id', label: 'Filter by Req ID' },
  candidate: { field: 'email', label: 'Filter by Email' },
  skill: { field: 'name', label: 'Filter by Skill' }
};

// Primary key per table
const idKeyMap = {
  employee: 'id',
  position_details: 'req_id',
  candidate: 'candidate_id',
  skill: 'skill_id'
};

export default function AdminPage() {
  const tables = ['employee', 'position_details', 'candidate', 'skill'];
  const [activeTable, setActiveTable] = useState('employee');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filterVal, setFilterVal] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Fetch data on table change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/${endpointMap[activeTable]}`);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setRows(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    setFilterVal('');
    setSortConfig({ key: '', direction: 'asc' });
  }, [activeTable]);

  // Filter and sort logic
  const filteredAndSorted = useMemo(() => {
    let data = [...rows];
    // Filter
    const cfg = filterConfig[activeTable];
    if (cfg && filterVal) {
      data = data.filter(r =>
        String(r[cfg.field] || '')
          .toLowerCase()
          .includes(filterVal.toLowerCase())
      );
    }
    // Sort
    if (sortConfig.key) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        const cmp = isNaN(aVal) || isNaN(bVal)
          ? String(aVal).localeCompare(String(bVal))
          : aVal - bVal;
        return sortConfig.direction === 'asc' ? cmp : -cmp;
      });
    }
    return data;
  }, [rows, filterVal, sortConfig, activeTable]);

  // Handlers
  const handleFilterChange = e => setFilterVal(e.target.value);
  const handleSort = key => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  // Modal helpers
  const openAddModal = () => {
    const initial = {};
    (rows[0] ? Object.keys(rows[0]) : []).forEach(col => {
      initial[col] = '';
    });
    setFormData(initial);
    setModalMode('add');
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = row => {
    setFormData({ ...row });
    setModalMode('edit');
    setEditingId(row[idKeyMap[activeTable]]);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const endpoint = endpointMap[activeTable];
      const url = modalMode === 'add'
        ? `http://localhost:3000/${endpoint}`
        : `http://localhost:3000/${endpoint}/${editingId}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(res.statusText);
      // Refresh data
      const refresh = await fetch(`http://localhost:3000/${endpoint}`);
      const data = await refresh.json();
      setRows(data);
      closeModal();
    } catch (err) {
      alert(`${modalMode === 'add' ? 'Add' : 'Update'} failed: ${err.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  const cols = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <div className="admin-page">
      <h2>Admin: Manage Tables</h2>
      <Tabs tabs={tables} activeTab={activeTable} onChange={setActiveTable} />
      <TabPanel isActive>
        {/* Toolbar */}
        <div className="table-toolbar">
          <input
            placeholder={filterConfig[activeTable]?.label}
            value={filterVal}
            onChange={handleFilterChange}
          />
          <button onClick={openAddModal}>Add {activeTable}</button>
        </div>
        {/* Data Table */}
        <table className="data-table">
          <thead>
            <tr>
              {cols.map(col => (
                <th key={col} onClick={() => handleSort(col)}>
                  {col}{sortConfig.key === col ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((r, i) => (
              <tr key={i}>
                {cols.map(col => (
                  <td key={col}>{String(r[col])}</td>
                ))}
                <td>
                  <button onClick={() => openEditModal(r)}>Edit</button>
                  <button onClick={() => {/* TODO: delete */}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal for Add/Edit */}
        {showModal && (
          <div style={overlayStyle}>
            <div style={modalStyle}>
              <h3>{modalMode === 'add' ? 'Add new' : 'Edit'} {activeTable}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' }}>
                {cols.map(col => (
                  <input
                    key={col}
                    name={col}
                    placeholder={col}
                    value={formData[col] || ''}
                    onChange={handleFormChange}
                    style={{ flex: '1 1 45%', padding: '0.5rem' }}
                  />
                ))}
              </div>
              <div style={{ textAlign: 'right' }}>
                <button onClick={handleSubmit} style={{ marginRight: '0.5rem' }}>
                  {modalMode === 'add' ? 'Add' : 'Update'}
                </button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </TabPanel>
    </div>
  );
}

// Inline modal styles
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modalStyle = {
  background: '#fff', padding: '1.5rem', borderRadius: '8px',
  width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto'
};
