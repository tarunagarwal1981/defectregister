// src/components/DefectsTable.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DefectsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRow, setNewRow] = useState({
    'S.No': '',
    'Vessel Name': '',
    Equipments: '',
    Description: '',
    'Action Planned': '',
    Criticality: '',
    'Date reported': '',
    'Date Completed': '',
    'Status (Vessel)': '',
    Comments: '',
    'Item Type': '',
    Path: '',
  });

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
      setNewRow({
        'S.No': '',
        'Vessel Name': '',
        Equipments: '',
        Description: '',
        'Action Planned': '',
        Criticality: '',
        'Date reported': '',
        'Date Completed': '',
        'Status (Vessel)': '',
        Comments: '',
        'Item Type': '',
        Path: '',
      });
    }
  };

  const handleLogout = () => {
    // Implement logout logic if needed
  };

  return (
    <div style={styles.pageContainer}>
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      <h1 style={styles.heading}>Defects Register</h1>
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
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={index} style={styles.tableRow}>
                    {columns.map((col) => (
                      <td key={col} style={styles.tableCell}>{row[col]}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={styles.tableCell}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={styles.addRowContainer}>
            <h3 style={styles.addRowHeading}>Add New Row</h3>
            {columns.map((col) => (
              <div key={col} style={styles.inputContainer}>
                <label style={styles.label}>{col}:</label>
                <input
                  type="text"
                  placeholder={col}
                  value={newRow[col]}
                  onChange={(e) => setNewRow({ ...newRow, [col]: e.target.value })}
                  style={styles.input}
                />
              </div>
            ))}
            <button onClick={handleAddRow} style={styles.addButton}>Add Row</button>
          </div>
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
  heading: {
    fontSize: '36px',
    color: '#f4f4f4',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '14px',
    color: '#f4f4f4',
  },
  logoutButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: '#f4f4f4',
    color: '#132337',
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
    marginBottom: '20px',
  },
  tableHeader: {
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '10px',
    backgroundColor: '#1b3a57',
    color: '#f4f4f4',
    borderBottom: '1px solid #f4f4f4',
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
  addRowContainer: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#1b3a57',
    borderRadius: '8px',
  },
  addRowHeading: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#f4f4f4',
  },
  inputContainer: {
    marginBottom: '10px',
  },
  label: {
    fontSize: '14px',
    marginRight: '10px',
  },
  input: {
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #f4f4f4',
    backgroundColor: '#132337',
    color: '#f4f4f4',
    width: '100%',
  },
  addButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#f4f4f4',
    color: '#132337',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default DefectsTable;
