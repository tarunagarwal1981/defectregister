import React from 'react';

const DataTable = ({ data, onAddDefect }) => {
  console.log('Data received by DataTable:', data);

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
          borderRadius: '4px'
        }}
      >
        Add Defect
      </button>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: '#1b2a3a', color: '#f4f4f4' }}>
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
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((defect, index) => (
              <tr key={index} style={{ textAlign: 'center' }}>
                <td style={cellStyle}>{defect.SNo}</td>
                <td style={cellStyle}>{defect['Vessel Name']}</td>
                <td style={cellStyle}>{defect.Equipments}</td>
                <td style={cellStyle}>{defect.Description}</td>
                <td style={cellStyle}>{defect['Action Planned']}</td>
                <td style={cellStyle}>{defect.Criticality}</td>
                <td style={cellStyle}>{defect['Date Reported']}</td>
                <td style={cellStyle}>{defect['Date Completed']}</td>
                <td style={cellStyle}>{defect['Status (Vessel)']}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ ...cellStyle, textAlign: 'center', fontStyle: 'italic' }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Inline styles for table headers and cells
const headerStyle = {
  padding: '10px',
  backgroundColor: '#3A506B',
  color: '#ffffff',
  borderBottom: '1px solid #4a4a4a',
};

const cellStyle = {
  padding: '8px',
  borderBottom: '1px solid #4a4a4a',
};

export default DataTable;
