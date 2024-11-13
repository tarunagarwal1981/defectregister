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
      "Status (Vessel)": ""
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
              <td style={cellStyle}>
                <input
                  type="text"
                  value={newRow["Vessel Name"]}
                  onChange={(e) => handleNewRowChange("Vessel Name", e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td style={cellStyle}>
                <input
                  type="text"
                  value={newRow.Equipments}
                  onChange={(e) => handleNewRowChange("Equipments", e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td style={cellStyle}>
                <input
                  type="text"
                  value={newRow.Description}
                  onChange={(e) => handleNewRowChange("Description", e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td style={cellStyle}>
                <input
                  type="text"
                  value={newRow["Action Planned"]}
                  onChange={(e) => handleNewRowChange("Action Planned", e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td style={cellStyle}>
                <input
                  type="text"
                  value={newRow.Criticality}
                  onChange={(e) => handleNewRowChange("Criticality", e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td style={cellStyle}>
                <input
                  type="date"
                  value={newRow["Date Reported"]}
                  onChange={(e) => handleNewRowChange("Date Reported", e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td style={cellStyle}>
                <input
                  type="date"
                  value={newRow["Date Completed"]}
                  onChange={(e) => handleNewRowChange("Date Completed", e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td style={cellStyle}>
                <input
                  type="text"
                  value={newRow["Status (Vessel)"]}
                  onChange={(e) => handleNewRowChange("Status (Vessel)", e.target.value)}
                  style={inputStyle}
                />
              </td>
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
                <td style={cellStyle}>
                  {editingRowId === defect.id ? (
                    <input
                      type="text"
                      value={editedData["Vessel Name"] || ""}
                      onChange={(e) => handleInputChange("Vessel Name", e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    defect["Vessel Name"]
                  )}
                </td>
                <td style={cellStyle}>
                  {editingRowId === defect.id ? (
                    <input
                      type="text"
                      value={editedData.Equipments || ""}
                      onChange={(e) => handleInputChange("Equipments", e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    defect.Equipments
                  )}
                </td>
                <td style={cellStyle}>
                  {editingRowId === defect.id ? (
                    <input
                      type="text"
                      value={editedData.Description || ""}
                      onChange={(e) => handleInputChange("Description", e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    defect.Description
                  )}
                </td>
                <td style={cellStyle}>
                  {editingRowId === defect.id ? (
                    <input
                      type="text"
                      value={editedData["Action Planned"] || ""}
                      onChange={(e) => handleInputChange("Action Planned", e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    defect["Action Planned"]
                  )}
                </td>
                <td style={cellStyle}>
                  {editingRowId === defect.id ? (
                    <input
                      type="text"
                      value={editedData.Criticality || ""}
                      onChange={(e) => handleInputChange("Criticality", e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    defect.Criticality
                  )}
                </td>
                <td style={cellStyle}>
                  {editingRowId === defect.id ? (
                    <input
                      type="date"
                      value={editedData["Date Reported"] || ""}
                      onChange={(e) => handleInputChange("Date Reported", e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    defect["Date Reported"]
                  )}
                </td>
                <td style={cellStyle}>
                  {editingRowId === defect.id ? (
                    <input
                      type="date"
                      value={editedData["Date Completed"] || ""}
                      onChange={(e) => handleInputChange("Date Completed", e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    defect["Date Completed"]
                  )}
                </td>
                <td style={cellStyle}>
                  {editingRowId === defect.id ? (
                    <input
                      type="text"
                      value={editedData["Status (Vessel)"] || ""}
                      onChange={(e) => handleInputChange("Status (Vessel)", e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    defect["Status (Vessel)"]
                  )}
                </td>
                <td style={cellStyle}>
                  {editingRowId === defect.id ? (
                    <button onClick={handleSaveClick} style={actionButtonStyle}>
                      Save
                    </button>
                  ) : (
                    <button onClick={() => handleEditClick(defect)} style={actionButtonStyle}>
                      Edit
                    </button>
                  )}
                </td>
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
