// src/components/DefectsTable.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DefectsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRow, setNewRow] = useState({
    vessel_name: '',
    defect_description: '',
    status: '',
    reported_date: '',
    assigned_to: '',
    priority: '',
  });

  // Define columns based on the actual CSV structure
  const columns = ['id', 'vessel_name', 'defect_description', 'status', 'reported_date', 'assigned_to', 'priority'];

  // Fetch data from the defects register table
  const fetchData = async () => {
    setLoading(true);
    const { data: tableData, error } = await supabase
      .from('defects register') // Use exact table name
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

  // Function to add a new row to the table
  const handleAddRow = async () => {
    const { data: newData, error } = await supabase
      .from('defects register') // Ensure this matches the exact table name
      .insert([newRow]);

    if (error) {
      console.error('Error adding row:', error);
    } else {
      setData([...data, ...newData]); // Update the data array with the new row
      // Reset the form after successful insertion
      setNewRow({
        vessel_name: '',
        defect_description: '',
        status: '',
        reported_date: '',
        assigned_to: '',
        priority: '',
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
        <input
          type="text"
          placeholder="Vessel Name"
          value={newRow.vessel_name}
          onChange={(e) => setNewRow({ ...newRow, vessel_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Defect Description"
          value={newRow.defect_description}
          onChange={(e) =>
            setNewRow({ ...newRow, defect_description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Status"
          value={newRow.status}
          onChange={(e) => setNewRow({ ...newRow, status: e.target.value })}
        />
        <input
          type="date"
          placeholder="Reported Date"
          value={newRow.reported_date}
          onChange={(e) => setNewRow({ ...newRow, reported_date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Assigned To"
          value={newRow.assigned_to}
          onChange={(e) => setNewRow({ ...newRow, assigned_to: e.target.value })}
        />
        <input
          type="text"
          placeholder="Priority"
          value={newRow.priority}
          onChange={(e) => setNewRow({ ...newRow, priority: e.target.value })}
        />
        <button onClick={handleAddRow}>Add Row</button>
      </div>
    </div>
  );
};

export default DefectsTable;
