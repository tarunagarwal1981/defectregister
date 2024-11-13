// src/components/DefectsTable.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import DefectModal from './AddDefectModal';
import { styles } from '../styles/defectsTable';

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
    'Actions'
  ];

  useEffect(() => {
    fetchData();
  }, []);

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
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
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
                      style={styles.tableHeader}
                      onClick={() => col !== 'Actions' && handleSort(col)}
                    >
                      {col}
                      {sortConfig.key === col && (
                        <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row) => (
                  <tr key={row['S.No']} style={styles.tableRow}>
                    {columns.map((col) => (
                      <td key={col} style={styles.tableCell}>
                        {col === 'Actions' ? (
                          <button 
                            style={styles.editButton}
                            onClick={() => setModalState({ 
                              isOpen: true, 
                              mode: 'edit', 
                              data: row 
                            })}
                          >
                            Edit
                          </button>
                        ) : col === 'Criticality' ? (
                          <span style={{
                            ...styles.badge,
                            background: row[col]?.toLowerCase() === 'high' 
                              ? 'linear-gradient(145deg, #ef4444 0%, #dc2626 100%)'
                              : row[col]?.toLowerCase() === 'medium'
                              ? 'linear-gradient(145deg, #f59e0b 0%, #d97706 100%)'
                              : 'linear-gradient(145deg, #10b981 0%, #059669 100%)'
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
        columns={columns.filter(col => col !== 'Actions')}
      />
    </div>
  );
};

export default DefectsTable;
