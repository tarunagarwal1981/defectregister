import React, { useState } from 'react';

const DataTable = ({ data, onAddDefect, onSaveDefect }) => {
  const [editingRowId, setEditingRowId] = useState(null); // Track only the row being edited
  const [newRow, setNewRow] = useState(null); // Track the new row for adding
  const [editedData, setEditedData] = useState({}); // Track the data being edited
  const [error, setError] = useState('');

  // Start editing an existing row
  const handleEditClick = (defect) => {
    setEditingRowId(defect.id); // Set the specific row for editing
    setEditedData({ ...defect });
    setNewRow(null); // Ensure new row is reset if editing an existing row
  };

  // Start adding a new row
  const handleAddRowClick = () => {
    setNewRow({
      id: Date.now(), // Temporary ID until saved
      "Vessel Name": "",
      Equipments: "",
      Description: "",
      "Action Planned": "",
      Criticality: "",
      "Date Reported": "",
      "Date Completed": "",
      "Status (Vessel)": "",
    });
    setEditingRowId(null); // Ensure no other rows are in edit mode
    setEditedData({});
    setError('');
  };

  // Handle input changes in the editing row
  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle input changes in the new row
  const handleNewRowChange = (field, value) => {
    setNewRow((prev) => ({ ...prev, [field]: value }));
  };

  // Save edited row data
  const handleSaveClick = () => {
    if (!validateData(editedData)) {
      setError('Please fill out required fields.');
      return;
    }

    onSaveDefect(editedData);
    setEditingRowId(null);
    setEditedData({});
    setError('');
  };

  // Save new row data
  const handleSaveNewRowClick = () => {
    if (!validateData(newRow)) {
      setError('Please fill out required fields.');
      return;
    }

    onSaveDefect(newRow); // Save new row to database
    setNewRow(null); // Reset new row
    setError('');
  };

  // Validate data to ensure all required fields are filled before saving
  const validateData = (data) => {
    // Modify this based on required fields
    return data["Vessel Name"] && data.Equipments && data.Description;
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#132337', minHeight: '100vh', color: '#f4f4f4' }}>
      <h2 style={{ color: '#f4f4f4' }}>Defects Table</h2>
      <button
        onClick={handleAddRowClick}
        style={{
          padding: '10px 20px',
          margin: '10px 0',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        Add Defect
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px',
          backgroundColor: '#1b2a3a',
          color: '#f4f4f4',
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>S.No</th>
            <th style={headerStyle}>Vessel Name</th>
            <th style={headerStyle}>Equipments</th>
            <th style={headerStyle}>Description</th>
            <th style={headerStyle}>Action Planned</th>
            <th style={headerStyle}>Criticality</th>
            <th style={headerStyle}>Date Reported</th>
            <th style={headerStyle}>Date Completed</th>
            <th style={headerStyle}>Status (Vessel)</th>
            <th style={headerStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Render new row if being added */}
          {newRow && (
            <tr style={{ textAlign: 'center' }}>
              {Object.keys(newRow).map((field, index) => (
                field !== "id" && (
                  <td key={index} style={cellStyle}>
                    <input
                      type={field.includes("Date") ? "date" : "text"}
                      value={newRow[field]}
                      onChange={(e) => handleNewRowChange(field, e.target.value)}
                    />
                  </td>
                )
              ))}
              <td style={cellStyle}>
                <button onClick={handleSaveNewRowClick} style={actionButtonStyle}>Save</button>
              </td>
            </tr>
          )}

          {/* Render existing rows */}
          {data && data.length > 0 ? (
            data.map((defect, index) => (
              <tr key={defect.id || index} style={{ textAlign: 'center' }}>
                <td style={cellStyle}>{index + 1}</td>
                {editingRowId === defect.id ? (
                  <>
                    {Object.keys(editedData).map((field, i) => (
                      field !== "id" && (
                        <td key={i} style={cellStyle}>
                          <input
                            type={field.includes("Date") ? "date" : "text"}
                            value={editedData[field] || ""}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                          />
                        </td>
                      )
                    ))}
                    <td style={cellStyle}>
                      <button onClick={handleSaveClick} style={actionButtonStyle}>Save</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={cellStyle}>{defect["Vessel Name"]}</td>
                    <td style={cellStyle}>{defect.Equipments}</td>
                    <td style={cellStyle}>{defect.Description}</td>
                    <td style={cellStyle}>{defect["Action Planned"]}</td>
                    <td style={cellStyle}>{defect.Criticality}</td>
                    <td style={cellStyle}>{defect["Date Reported"]}</td>
                    <td style={cellStyle}>{defect["Date Completed"]}</td>
                    <td style={cellStyle}>{defect["Status (Vessel)"]}</td>
                    <td style={cellStyle}>
                      <button onClick={() => handleEditClick(defect)} style={actionButtonStyle}>Edit</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const headerStyle = {
  padding: '10px',
  backgroundColor: '#3A5F81',
  color: '#FFFFFF',
  fontWeight: 'bold',
};

const cellStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

const actionButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '4px',
};

export default DataTable;
