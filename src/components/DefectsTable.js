// DataTable.js
import React from 'react';

const DataTable = ({ data, onAddDefect }) => {
  return (
    <div>
      <h2>Defects Table</h2>
      <button onClick={onAddDefect} style={{ padding: '10px 20px', margin: '10px 0', backgroundColor: '#4CAF50', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Add Defect
      </button>
      {/* Your existing table rendering logic */}
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Vessel Name</th>
            <th>Equipments</th>
            <th>Description</th>
            <th>Action Planned</th>
            <th>Criticality</th>
            <th>Date Reported</th>
            <th>Date Completed</th>
            <th>Status (Vessel)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((defect, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{defect.vesselName}</td>
              <td>{defect.equipments}</td>
              <td>{defect.description}</td>
              <td>{defect.actionPlanned}</td>
              <td>{defect.criticality}</td>
              <td>{defect.dateReported}</td>
              <td>{defect.dateCompleted}</td>
              <td>{defect.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
