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

  // Define columns to display headers correctly
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

  // Fetch data from the defects register table
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

  // Handle adding a new row
  const handleAddRow = async () => {
    const { data: newData, error } = await supabase
      .from('defects register')
      .insert([newRow]);

    if (error) {
      console.error('Error adding row:', error);
    } else {
      setData([...data, ...newData]);
      // Reset newRow fields
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

  return (
    <div>
      <h2>Defects Register</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col}>{row[col]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Add New Row</h3>
        {columns.map((col) => (
          <div key={col} style={{ marginBottom: '10px' }}>
            <label>{col}: </label>
            <input
              type="text"
              placeholder={col}
              value={newRow[col]}
              onChange={(e) => setNewRow({ ...newRow, [col]: e.target.value })}
            />
          </div>
        ))}
        <button onClick={handleAddRow}>Add Row</button>
      </div>
    </div>
  );
};

export default DefectsTable;
