import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DefectsTable = ({ data, onAddDefect, onSaveDefect, vessels, loading }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedDefect, setEditedDefect] = useState(null);
  const [vesselNames, setVesselNames] = useState({});

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

  useEffect(() => {
    // When a new defect is added (it will have a temp id), set it to editing mode
    const tempDefect = data.find(d => d.id?.startsWith('temp-'));
    if (tempDefect) {
      setEditingId(tempDefect.id);
      setEditedDefect(tempDefect);
    }
  }, [data]);

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
    <div className="table-wrapper">
      <div className="header">
        <h1>Defects Register</h1>
        <div className="header-buttons">
          <button 
            onClick={onAddDefect}
            className="add-button"
            disabled={loading}
          >
            Add Defect
          </button>
        </div>
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
              <tr key={defect.id} className={editingId === defect.id ? 'editing' : ''}>
                <td>{defect.SNo}</td>
                <td>
                  {editingId === defect.id ? (
                    <select
                      value={editedDefect?.vessel_id || ''}
                      onChange={(e) => handleChange('vessel_id', e.target.value)}
                      required
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
                      required
                      placeholder="Enter equipment"
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
                      required
                      placeholder="Enter description"
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
                      required
                      placeholder="Enter planned action"
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
                      required
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
                      required
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
                      required
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
        .table-wrapper {
          padding: 20px;
          max-width: 100%;
          overflow-x: auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 0 20px;
          position: sticky;
          top: 0;
          background: #132337;
          z-index: 10;
        }

        .header-buttons {
          display: flex;
          gap: 10px;
        }

        .add-button {
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .add-button:hover:not(:disabled) {
          background-color: #45a049;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        }

        .table-container {
          overflow-x: auto;
          margin-top: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1200px;
        }

        th, td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        th {
          background-color: rgba(255, 255, 255, 0.1);
          font-weight: bold;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        tr.editing {
          background-color: rgba(255, 255, 255, 0.05);
        }

        tr:hover:not(.editing) {
          background-color: rgba(255, 255, 255, 0.03);
        }

        input, select, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 14px;
        }

        textarea {
          min-height: 80px;
          resize: vertical;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #1a73e8;
          box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
        }

        .action-buttons {
          display: flex;
          gap: 5px;
        }

        .edit-button, .save-button, .cancel-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .edit-button {
          background-color: #4CAF50;
          color: white;
        }

        .save-button {
          background-color: #2196F3;
          color: white;
        }

        .cancel-button {
          background-color: #f44336;
          color: white;
        }

        button:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
          
          .add-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default DefectsTable;
