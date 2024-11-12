// src/components/DefectsTable.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DefectsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRow, setNewRow] = useState({
    'SNo': '',
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
  const [editingRow, setEditingRow] = useState(null);

  const columns = [
    'SNo',
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

  const handleEditRow = (row) => {
    setEditingRow(row); // Set the row to be edited
  };

  const handleSaveEdit = async () => {
    const { data: updatedData, error } = await supabase
      .from('defects register')
      .update(editingRow)
      .eq('S.No', editingRow['S.No']); // Assuming 'S.No' is a unique identifier

    if (error) {
      console.error('Error saving row:', error);
    } else {
      setData((prevData) =>
        prevData.map((row) =>
          row['S.No'] === editingRow['S.No'] ? editingRow : row
        )
      );
      setEditingRow(null); // Exit edit mode
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null); // Exit edit mode without saving
  };

  const handleEditChange = (field, value) => {
    setEditingRow({ ...editingRow, [field]: value });
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col}>
                      {editingRow && editingRow['S.No'] === row['S.No'] ? (
                        <input
                          type="text"
                          value={editingRow[col]}
                          onChange={(e) => handleEditChange(col, e.target.value)}
                        />
                      ) : (
                        row[col]
                      )}
                    </td>
                  ))}
                  <td>
                    {editingRow && editingRow['S.No'] === row['S.No'] ? (
                      <>
                        <button onClick={handleSaveEdit}>Save</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => handleEditRow(row)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1}>No data available</td>
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
