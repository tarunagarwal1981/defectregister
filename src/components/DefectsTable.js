// DataTable.js
import React, { useState } from 'react';

const DataTable = ({ data, onAddDefect, onSaveDefect }) => {
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  const handleEditClick = (defect) => {
    setEditingRow(defect.id);
    setEditedData({ ...defect });
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = () => {
    onSaveDefect(editedData);
    setEditingRow(null);
    setEditedData({});
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#132337', minHeight: '100vh', color: '#f4f4f4' }}>
      <h2 style={{ color: '#f4f4f4' }}>Defects Table</h2>
      <button
        onClick={onAddDefect}
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
          {data && data.length > 0 ? (
            data.map((defect, index) => (
              <tr key={index} style={{ textAlign: 'center' }}>
                <td style={cellStyle}>{index + 1}</td>
                {editingRow === defect.id ? (
                  <>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={editedData['Vessel Name']}
                        onChange={(e) => handleInputChange('Vessel Name', e.target.value)}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={editedData.Equipments}
                        onChange={(e) => handleInputChange('Equipments', e.target.value)}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={editedData.Description}
                        onChange={(e) => handleInputChange('Description', e.target.value)}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={editedData['Action Planned']}
                        onChange={(e) => handleInputChange('Action Planned', e.target.value)}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={editedData.Criticality}
                        onChange={(e) => handleInputChange('Criticality', e.target.value)}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={editedData['Date Reported']}
                        onChange={(e) => handleInputChange('Date Reported', e.target.value)}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={editedData['Date Completed']}
                        onChange={(e) => handleInputChange('Date Completed', e.target.value)}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={editedData['Status (Vessel)']}
                        onChange={(e) => handleInputChange('Status (Vessel)', e.target.value)}
                      />
                    </td>
                    <td style={cellStyle}>
                      <button onClick={handleSaveClick} style={actionButtonStyle}>
                        Save
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={cellStyle}>{defect['Vessel Name']}</td>
                    <td style={cellStyle}>{defect.Equipments}</td>
                    <td style={cellStyle}>{defect.Description}</td>
                    <td style={cellStyle}>{defect['Action Planned']}</td>
                    <td style={cellStyle}>{defect.Criticality}</td>
                    <td style={cellStyle}>{defect['Date Reported']}</td>
                    <td style={cellStyle}>{defect['Date Completed']}</td>
                    <td style={cellStyle}>{defect['Status (Vessel)']}</td>
                    <td style={cellStyle}>
                      <button onClick={() => handleEditClick(defect)} style={actionButtonStyle}>
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
