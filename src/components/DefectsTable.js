import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DefectsTable = ({ data, onAddDefect, onSaveDefect, vessels, loading }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedDefect, setEditedDefect] = useState(null);
  const [vesselNames, setVesselNames] = useState({});

  // Fetch vessel names when component mounts
  useEffect(() => {
    const fetchVesselNames = async () => {
      try {
        const { data: vesselData, error } = await supabase
          .from('vessels')
          .select('vessel_id, vessel_name');
        
        if (error) throw error;
        
        const namesMap = vesselData.reduce((acc, vessel) => {
          acc[vessel.vessel_id] = vessel.vessel_name;
          return acc;
        }, {});
        
        setVesselNames(namesMap);
      } catch (error) {
        console.error('Error fetching vessel names:', error);
      }
    };

    fetchVesselNames();
  }, []);

  const handleEdit = (defect) => {
    setEditingId(defect.id);
    setEditedDefect({ ...defect });
  };

  const handleSave = async () => {
    if (editedDefect) {
      await onSaveDefect(editedDefect);
      setEditingId(null);
      setEditedDefect(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedDefect(null);
  };

  const handleChange = (field, value) => {
    if (editedDefect) {
      setEditedDefect({ ...editedDefect, [field]: value });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Defects Table</h1>
        <button 
          onClick={onAddDefect}
          className="add-button"
          disabled={loading}
        >
          Add Defect
        </button>
      </div>

      <div className="table-container">
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((defect) => (
              <tr key={defect.id}>
                <td>{defect.SNo}</td>
                <td>
                  {editingId === defect.id ? (
                    <select
                      value={editedDefect?.vessel_id || ''}
                      onChange={(e) => handleChange('vessel_id', e.target.value)}
                    >
                      <option value="">Select Vessel</option>
                      {vessels.map((vesselId) => (
                        <option key={vesselId} value={vesselId}>
                          {vesselNames[vesselId] || vesselId}
                        </option>
                      ))}
                    </select>
                  ) : (
                    vesselNames[defect.vessel_id] || defect.vessel_id
                  )}
                </td>
                <td>
                  {editingId === defect.id ? (
                    <input
                      type="text"
                      value={editedDefect?.Equipments || ''}
                      onChange={(e) => handleChange('Equipments', e.target.value)}
                    />
                  ) : (
                    defect.Equipments
                  )}
                </td>
                <td>
                  {editingId === defect.id ? (
                    <textarea
                      value={editedDefect?.Description || ''}
                      onChange={(e) => handleChange('Description', e.target.value)}
                    />
                  ) : (
                    defect.Description
                  )}
                </td>
                <td>
                  {editingId === defect.id ? (
                    <textarea
                      value={editedDefect?.['Action Planned'] || ''}
                      onChange={(e) => handleChange('Action Planned', e.target.value)}
                    />
                  ) : (
                    defect['Action Planned']
                  )}
                </td>
                <td>
                  {editingId === defect.id ? (
                    <select
                      value={editedDefect?.Criticality || ''}
                      onChange={(e) => handleChange('Criticality', e.target.value)}
                    >
                      <option value="">Select Criticality</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  ) : (
                    defect.Criticality
                  )}
                </td>
                <td>
                  {editingId === defect.id ? (
                    <input
                      type="date"
                      value={editedDefect?.['Date Reported'] || ''}
                      onChange={(e) => handleChange('Date Reported', e.target.value)}
                    />
                  ) : (
                    defect['Date Reported']
                  )}
                </td>
                <td>
                  {editingId === defect.id ? (
                    <input
                      type="date"
                      value={editedDefect?.['Date Completed'] || ''}
                      onChange={(e) => handleChange('Date Completed', e.target.value)}
                    />
                  ) : (
                    defect['Date Completed']
                  )}
                </td>
                <td>
                  {editingId === defect.id ? (
                    <select
                      value={editedDefect?.['Status (Vessel)'] || ''}
                      onChange={(e) => handleChange('Status (Vessel)', e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    defect['Status (Vessel)']
                  )}
                </td>
                <td>
                  {editingId === defect.id ? (
                    <div className="action-buttons">
                      <button onClick={handleSave} className="save-button">
                        Save
                      </button>
                      <button onClick={handleCancel} className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleEdit(defect)} className="edit-button">
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .add-button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .add-button:hover:not(:disabled) {
          background-color: #45a049;
        }

        .add-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255, 255, 255, 0.05);
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        th {
          background-color: rgba(255, 255, 255, 0.1);
          font-weight: bold;
        }

        tr:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        input, select, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .action-buttons {
          display: flex;
          gap: 5px;
        }

        .edit-button, .save-button, .cancel-button {
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .edit-button {
          background-color: #4CAF50;
          color: white;
        }

        .edit-button:hover {
          background-color: #45a049;
        }

        .save-button {
          background-color: #2196F3;
          color: white;
        }

        .save-button:hover {
          background-color: #1976D2;
        }

        .cancel-button {
          background-color: #f44336;
          color: white;
        }

        .cancel-button:hover {
          background-color: #d32f2f;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default DefectsTable;
