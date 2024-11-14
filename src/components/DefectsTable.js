import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DefectsTable = ({ 
  data, 
  onAddDefect, 
  onSaveDefect, 
  vessels, 
  loading,
  editingId,
  editedDefect,
  setEditingId,
  setEditedDefect 
}) => {
  const [vesselNames, setVesselNames] = useState({});

  // Fetch vessel names for the assigned vessels
  useEffect(() => {
    const fetchVesselNames = async () => {
      try {
        if (vessels.length === 0) return;
        
        const { data: vesselData, error } = await supabase
          .from('vessels')
          .select('vessel_id, vessel_name')
          .in('vessel_id', vessels);
        
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
  }, [vessels]);

  const handleChange = (field, value) => {
    if (editedDefect) {
      setEditedDefect({ ...editedDefect, [field]: value });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedDefect(null);
  };

  const handleSave = async () => {
    if (editedDefect) {
      await onSaveDefect(editedDefect);
      setEditingId(null);
      setEditedDefect(null);
    }
  };

  return (
    <div className="table-wrapper">
      <h1 className="title">Defects Register</h1>

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
                      className="form-input"
                    >
                      <option value="">Select Vessel</option>
                      {Object.entries(vesselNames).map(([id, name]) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    vesselNames[defect.vessel_id] || 'Loading...'
                  )}
                </td>
                <td>
                  {editingId === defect.id ? (
                    <input
                      type="text"
                      value={editedDefect?.Equipments || ''}
                      onChange={(e) => handleChange('Equipments', e.target.value)}
                      required
                      className="form-input"
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
                      className="form-input"
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
                      className="form-input"
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
                      className="form-input"
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
                      className="form-input"
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
                      className="form-input"
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
                      className="form-input"
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
                    <button onClick={() => {
                      setEditingId(defect.id);
                      setEditedDefect({ ...defect });
                    }} className="edit-button">
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="footer">
        <button 
          onClick={onAddDefect}
          className="add-button"
          disabled={loading}
        >
          Add Defect
        </button>
      </div>

      <style jsx>{`
        .table-wrapper {
          padding: 20px;
          margin-top: 40px;
        }

        .title {
          margin-bottom: 20px;
          font-size: 24px;
        }

        .table-container {
          overflow-x: auto;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1200px;
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

        tr.editing {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .form-input {
          width: 100%;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #1a73e8;
        }

        textarea.form-input {
          min-height: 80px;
          resize: vertical;
        }

        .footer {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .add-button {
          padding: 12px 24px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .add-button:hover:not(:disabled) {
          background-color: #45a049;
          transform: translateY(-1px);
        }

        .action-buttons {
          display: flex;
          gap: 5px;
        }

        .edit-button, .save-button, .cancel-button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
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

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .table-wrapper {
            padding: 10px;
          }
          
          .form-input {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default DefectsTable;
