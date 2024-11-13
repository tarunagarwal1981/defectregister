import React, { useState } from 'react';

const DataTable = ({ data, onAddDefect, onSaveDefect }) => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [newRow, setNewRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState('');

  const handleEditClick = (defect) => {
    setEditingRowId(defect.id);
    setEditedData({ ...defect });
    setNewRow(null);
  };

  const handleAddRowClick = () => {
    setNewRow({
      id: Date.now(),
      "Vessel Name": "",
      Equipments: "",
      Description: "",
      "Action Planned": "",
      Criticality: "",
      "Date Reported": "",
      "Date Completed": "",
      "Status (Vessel)": "",
    });
    setEditingRowId(null);
    setEditedData({});
    setError('');
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleNewRowChange = (field, value) => {
    setNewRow(prev => ({ ...prev, [field]: value }));
  };

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

  const handleSaveNewRowClick = () => {
    if (!validateData(newRow)) {
      setError('Please fill out required fields.');
      return;
    }
    onSaveDefect(newRow);
    setNewRow(null);
    setError('');
  };

  const validateData = (data) => {
    return data["Vessel Name"] && data.Equipments && data.Description;
  };

  const renderTableCell = (fieldName, value, isEditing, handleChange) => {
    if (isEditing) {
      return (
        <td style={cellStyle}>
          <input
            type={fieldName.includes("Date") ? "date" : "text"}
            value={value || ""}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            style={{
              width: '100%',
              padding: '5px',
              backgroundColor: '#2a3f5f',
              color: '#f4f4f4',
              border: '1px solid #4a5f81',
              borderRadius: '4px'
            }}
          />
        </td>
      );
    }
    return <td style={cellStyle}>{value}</td>;
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
          {newRow && (
            <tr>
              <td style={cellStyle}>New</td>
              {Object.keys(newRow).filter(key => key !== 'id').map((field) => (
                renderTableCell(field, newRow[field], true, handleNewRowChange)
              ))}
              <td style={cellStyle}>
                <button onClick={handleSaveNewRowClick} style={actionButtonStyle}>
                  Save
                </button>
              </td>
            </tr>
          )}

          {data && data.length > 0 ? (
            data.map((defect, index) => (
              <tr key={defect.id}>
                <td style={cellStyle}>{index + 1}</td>
                {editingRowId === defect.id ? (
                  <>
                    {Object.keys(defect)
                      .filter(key => key !== 'id')
                      .map((field) => renderTableCell(
                        field,
                        editedData[field],
                        true,
                        handleInputChange
                      ))}
                    <td style={cellStyle}>
                      <button onClick={handleSaveClick} style={actionButtonStyle}>
                        Save
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    {Object.keys(defect)
                      .filter(key => key !== 'id')
                      .map((field) => renderTableCell(
                        field,
                        defect[field],
                        false,
                        null
                      ))}
                    <td style={cellStyle}>
                      <button
                        onClick={() => handleEditClick(defect)}
                        style={actionButtonStyle}
                      >
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                No data available
              </td>
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
