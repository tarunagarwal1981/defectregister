import React from 'react';

const DataTable = ({ data, onAddDefect }) => {
  // Log data to ensure it's being received correctly
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
                <td style={cellStyle}>{index + 1}</td>
                <td style={cellStyle}>{defect.vesselName}</td>
                <td style={cellStyle}>{defect.equipments}</td>
                <td style={cellStyle}>{defect.description}</td>
                <td style={cellStyle}>{defect.actionPlanned}</td>
                <td style={cellStyle}>{defect.criticality}</td>
                <td style={cellStyle}>{defect.dateReported}</td>
                <td style={cellStyle}>{defect.dateCompleted}</td>
                <td style={cellStyle}>{defect.status}</td>
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
