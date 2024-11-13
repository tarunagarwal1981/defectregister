// src/components/DefectsTable.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Modal Component
const DefectModal = ({ isOpen, mode, initialData, onClose, onSubmit, columns }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [mode, initialData]);

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#f4f4f4' }}>
            {mode === 'edit' ? 'Edit Defect' : 'Add New Defect'}
          </h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }} style={styles.form}>
          {columns.map((col) => (
            <div key={col} style={styles.formGroup}>
              <label style={styles.label}>{col}</label>
              {col === 'Criticality' ? (
                <select
                  value={formData[col] || ''}
                  onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Select Criticality</option>
                  {['High', 'Medium', 'Low'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : col === 'Status (Vessel)' ? (
                <select
                  value={formData[col] || ''}
                  onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Select Status</option>
                  {['Open', 'In Progress', 'Completed', 'Pending'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={col.toLowerCase().includes('date') ? 'date' : 'text'}
                  value={formData[col] || ''}
                  onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
                  style={styles.input}
                  placeholder={`Enter ${col}`}
                />
              )}
            </div>
          ))}

          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              {mode === 'edit' ? 'Update' : 'Add'} Defect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
const DefectsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', data: null });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const columns = [
    'S.No',
    'Vessel Name',
    'Equipments',
    'Description',
    'Action Planned',
    'Criticality',
    'Date reported',
    'Date Completed',
    'Status (Vessel)',
    'Comments',
    'Item Type',
    'Path',
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: tableData, error } = await supabase
        .from('defects register')
        .select('*')
        .order('S.No', { ascending: true });

      if (error) throw error;
      setData(tableData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDefectSubmit = async (defectData) => {
    try {
      if (modalState.mode === 'edit') {
        const { error } = await supabase
          .from('defects register')
          .update(defectData)
          .eq('S.No', defectData['S.No']);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('defects register')
          .insert([defectData]);
        
        if (error) throw error;
      }
      
      fetchData();
      setModalState({ isOpen: false, mode: 'add', data: null });
    } catch (error) {
      console.error('Error saving defect:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Defects Register</h1>
        <button onClick={() => supabase.auth.signOut()} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner} />
          <p>Loading defects...</p>
        </div>
      ) : (
        <>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th 
                      key={col} 
                      onClick={() => handleSort(col)}
                      style={styles.tableHeader}
                    >
                      {col}
                      {sortConfig.key === col && (
                        <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                      )}
                    </th>
                  ))}
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row) => (
                  <tr key={row['S.No']} style={styles.tableRow}>
                    {columns.map((col) => (
                      <td key={col} style={styles.tableCell}>
                        {col === 'Criticality' ? (
                          <span style={{
                            ...styles.badge,
                            backgroundColor: 
                              row[col]?.toLowerCase() === 'high' ? '#ef4444' :
                              row[col]?.toLowerCase() === 'medium' ? '#f59e0b' : '#10b981'
                          }}>
                            {row[col]}
                          </span>
                        ) : col === 'Status (Vessel)' ? (
                          <span style={styles.statusBadge}>
                            {row[col]}
                          </span>
                        ) : row[col]}
                      </td>
                    ))}
                    <td style={styles.tableCell}>
                      <button 
                        onClick={() => setModalState({ 
                          isOpen: true, 
                          mode: 'edit', 
                          data: row 
                        })}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button 
            onClick={() => setModalState({ isOpen: true, mode: 'add', data: null })} 
            style={styles.addButton}
          >
            Add New Defect
          </button>
        </>
      )}

      <DefectModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialData={modalState.data}
        onClose={() => setModalState({ isOpen: false, mode: 'add', data: null })}
        onSubmit={handleDefectSubmit}
        columns={columns}
      />
    </div>
  );
};

const styles = {
  pageContainer: {
    background: 'linear-gradient(145deg, #132337 0%, #0a1622 100%)',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#f4f4f4',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    padding: '20px',
    background: 'linear-gradient(145deg, #1a2c42 0%, #152638 100%)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#f4f4f4',
    margin: 0,
  },
  tableWrapper: {
    background: 'linear-gradient(145deg, #1a2c42 0%, #152638 100%)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    fontSize: '13px',
  },
  tableHeader: {
    padding: '12px 16px',
    background: 'linear-gradient(180deg, #243b55 0%, #1a2c42 100%)',
    color: '#f4f4f4',
    fontWeight: '500',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'background-color 0.2s',
  },
  tableCell: {
    padding: '8px 16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '12px',
  },
  tableRow: {
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#1d2d3d',
    },
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    color: '#f4f4f4',
    display: 'inline-block',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    backgroundColor: '#243b55',
    color: '#f4f4f4',
    display: 'inline-block',
  },
  editButton: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    backgroundColor: '#3b82f6',
    color: '#f4f4f4',
    border: 'none',
    cursor: 'pointer',
  },
  addButton: {
    display: 'block',
    margin: '20px auto',
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#3b82f6',
    color: '#f4f4f4',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  logoutButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: '#ef4444',
    color: '#f4f4f4',
    border: 'none',
    fontSize: '13px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    background: '#1a2c42',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#f4f4f4',
    fontSize: '24px',
    cursor: 'pointer',
  },
  form: {
    display: 'grid',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    color: '#f4f4f4',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #2a4365',
    backgroundColor: '#1a365d',
    color: '#f4f4f4',
    fontSize: '13px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  cancelButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: '#4b5563',
    color: '#f4f4f4',
    border: 'none',
    fontSize: '13px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: '#3b82f6',
    color: '#f4f4f4',
    border: 'none',
    fontSize: '13px',
    cursor: 'pointer',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    color: '#f4f4f4',
  },
  loadingSpinner: {
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  sortIndicator: {
    marginLeft: '4px',
    color: '#3b82f6',
  },
  // Media queries for responsiveness
  '@media (max-width: 768px)': {
    tableWrapper: {
      overflowX: 'auto',
    },
    modalContent: {
      width: '95%',
      margin: '10px',
      padding: '16px',
    },
    heading: {
      fontSize: '20px',
    },
    tableCell: {
      padding: '6px 12px',
      fontSize: '11px',
    },
    tableHeader: {
      padding: '8px 12px',
      fontSize: '12px',
    },
  }
};

// Add keyframes for loading spinner animation
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Add the keyframes to the document
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

export default DefectsTable;
