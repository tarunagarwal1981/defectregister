import React, { useState } from 'react';

const DataTable = ({ data, onSaveDefect }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const handleEdit = (row) => {
    setEditingId(row.id);
    setEditedData({ ...row });
  };

  const handleSave = () => {
    onSaveDefect(editedData);
    setEditingId(null);
    setEditedData({});
  };

  const handleChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderCell = (row, field, type = "text") => {
    const isEditing = editingId === row.id;
    
    if (isEditing) {
      return (
        <input
          type={type}
          value={editedData[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          style={inputStyle}
        />
      );
    }
    return row[field];
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#132337', minHeight: '100vh', color: '#f4f4f4' }}>
      <h2 style={{ color: '#f4f4f4' }}>Defects Table</h2>
      
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
        backgroundColor: '#1b2a3a',
        color: '#f4f4f4',
      }}>
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
          {data.map((row, index) => (
            <tr key={row.id}>
              <td style={cellStyle}>{index + 1}</td>
              <td style={cellStyle}>{renderCell(row, "Vessel Name")}</td>
              <td style={cellStyle}>{renderCell(row, "Equipments")}</td>
              <td style={cellStyle}>{renderCell(row, "Description")}</td>
              <td style={cellStyle}>{renderCell(row, "Action Planned")}</td>
              <td style={cellStyle}>{renderCell(row, "Criticality")}</td>
              <td style={cellStyle}>{renderCell(row, "Date Reported", "date")}</td>
              <td style={cellStyle}>{renderCell(row, "Date Completed", "date")}</td>
              <td style={cellStyle}>{renderCell(row, "Status (Vessel)")}</td>
              <td style={cellStyle}>
                {editingId === row.id ? (
                  <button onClick={handleSave} style={actionButtonStyle}>
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEdit(row)} style={actionButtonStyle}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
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

const inputStyle = {
  width: '100%',
  padding: '5px',
  backgroundColor: '#2a3f5f',
  color: '#f4f4f4',
  border: '1px solid #4a5f81',
  borderRadius: '4px'
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
