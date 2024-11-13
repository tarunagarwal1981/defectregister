// src/components/AddDefectModal.js
import React, { useState } from 'react';

const AddDefectModal = ({ isOpen, onClose, onAdd, columns }) => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({});
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2>Add New Defect</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          {columns.map((col) => (
            <div key={col} style={styles.formGroup}>
              <label style={styles.label}>{col}</label>
              <input
                type={col.includes('Date') ? 'date' : 'text'}
                value={formData[col] || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  [col]: e.target.value
                })}
                style={styles.input}
                required
              />
            </div>
          ))}
          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Add Defect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDefectModal;
