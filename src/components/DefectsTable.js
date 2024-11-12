import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DefectsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRow, setNewRow] = useState(null); // Track the new row being added

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
    const { data: tableData, error } = await supabase
      .from('defects register')
      .select('*');

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(tableData || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRow = async () => {
    const { data: newData, error } = await supabase
      .from('defects register')
      .insert([newRow]);

    if (error) {
      console.error('Error adding row:', error);
    } else {
      setData([...data, ...newData]);
      setNewRow(null); // Clear new row fields after adding
    }
  };

  const handleLogout = () => {
    // Implement logout logic if needed
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Defects Register</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      {loading ? (
        <p style={styles.loadingText}>Loading data...</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} style={styles.tableHeader}>{col}</th>
                ))}
                <th style={styles.tableHeader}>
                  <button onClick={() => setNewRow({})} style={styles.addButton}>+</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} style={styles.tableRow}>
                  {columns.map((col) => (
                    <td key={col} style={styles.tableCell}>{row[col]}</td>
                  ))}
                </tr>
              ))}
              {newRow && (
                <tr>
                  {columns.map((col) => (
                    <td key={col} style={styles.tableCell}>
                      <input
                        type="text"
                        placeholder={col}
                        value={newRow[col] || ''}
                        onChange={(e) => setNewRow({ ...newRow, [col]: e.target.value })}
                        style={styles.input}
                      />
                    </td>
                  ))}
                  <td style={styles.tableCell}>
                    <button onClick={handleAddRow} style={styles.saveButton}>Save</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: '#132337',
    fontFamily: 'Nunito, sans-serif',
    color: '#f4f4f4',
    minHeight: '100vh',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: '36px',
    color: '#f4f4f4',
  },
  logoutButton: {
    backgroundColor: '#4a90e2',
    color: '#f4f4f4',
    border: 'none',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  tableContainer: {
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '10px',
    backgroundColor: '#1b3a57',
    color: '#f4f4f4',
    borderBottom: '1px solid #f4f4f4',
    textAlign: 'left',
  },
  tableRow: {
    backgroundColor: '#132337',
    color: '#f4f4f4',
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #f4f4f4',
    textAlign: 'left',
    fontSize: '14px',
  },
  addButton: {
    backgroundColor: '#4a90e2',
    color: '#f4f4f4',
    border: 'none',
    fontSize: '16px',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '50%',
  },
  input: {
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #f4f4f4',
    backgroundColor: '#1b3a57',
    color: '#f4f4f4',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    color: '#f4f4f4',
    border: 'none',
    fontSize: '14px',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default DefectsTable;
