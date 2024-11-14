import React from 'react';

const DefectsTable = ({
  data,
  onAddDefect,
  onSaveDefect,
  vessels,
  vesselNames,
  loading,
  editingId,
  editedDefect,
  setEditingId,
  setEditedDefect
}) => {
  const handleEdit = (defect) => {
    setEditingId(defect.id);
    setEditedDefect({ ...defect });
  };

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
    if (!editedDefect?.vessel_id) {
      alert('Please select a vessel');
      return;
    }
    await onSaveDefect(editedDefect);
  };

  if (loading) {
    return (
      <div className="table-wrapper">
        <div className="loading-state">Loading defects...</div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <h1 className="title">Defects Register</h1>

      {vessels.length === 0 ? (
        <div className="no-vessels-message">
          No vessels are assigned to you. Please contact your administrator.
        </div>
      ) : (
        <>
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
                        vesselNames[defect.vessel_id] || 'Unknown Vessel'
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
                        <div className="description-cell">{defect.Description}</div>
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
                        <div className="action-cell">{defect['Action Planned']}</div>
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
                        <span className={`criticality ${defect.Criticality?.toLowerCase()}`}>
                          {defect.Criticality}
                        </span>
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
                        <span className={`status ${defect['Status (Vessel)']?.toLowerCase().replace(' ', '-')}`}>
                          {defect['Status (Vessel)']}
                        </span>
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

          <div className="footer">
            <button 
              onClick={onAddDefect}
              className="add-button"
              disabled={loading || vessels.length === 0}
            >
              Add Defect
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        .table-wrapper {
          padding: 20px;
          margin-top: 40px;
        }

        .title {
          margin-bottom: 20px;
          font-size: 24px;
        }

        .loading-state,
        .no-vessels-message {
          text-align: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin: 20px 0;
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
          white-space: nowrap;
        }

        tr.editing {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .description-cell,
        .action-cell {
          max-width: 200px;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .form-input {
          width: 100%;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        textarea.form-input {
          min-height: 80px;
          resize: vertical;
        }

        .form-input:focus {
          outline: none;
          border-color: #1a73e8;
        }

        .criticality,
        .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .criticality.high,
        .status.open {
          background-color: rgba(244, 67, 54, 0.2);
          color: #ff7875;
        }

        .criticality.medium,
        .status.in-progress {
          background-color: rgba(255, 193, 7, 0.2);
          color: #ffd666;
        }

        .criticality.low,
        .status.completed {
          background-color: rgba(76, 175, 80, 0.2);
          color: #95de64;
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

        .action-buttons {
          display: flex;
          gap: 5px;
        }

        .edit-button,
        .save-button,
        .cancel-button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          white-space: nowrap;
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
