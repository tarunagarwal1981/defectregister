// src/components/DefectModal.js
import React, { useState, useEffect } from 'react';
import { styles } from '../styles/defectsTable';

const DefectModal = ({ isOpen, mode, initialData, onClose, onSubmit, columns }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
    setErrors({});
  }, [mode, initialData]);

  const validateForm = () => {
    const newErrors = {};
    columns.forEach(col => {
      if (!formData[col] && col !== 'Comments') {
        newErrors[col] = 'This field is required';
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (col, value) => {
    setFormData(prev => ({ ...prev, [col]: value }));
    if (errors[col]) {
      setErrors(prev => ({ ...prev, [col]: undefined }));
    }
  };

  const getInputType = (col) => {
    if (col.toLowerCase().includes('date')) return 'date';
    if (col === 'Criticality') return 'select';
    if (col === 'Status (Vessel)') return 'select';
    return 'text';
  };

  const getCriticalityOptions = () => ['High', 'Medium', 'Low'];
  const getStatusOptions = () => ['Open', 'In Progress', 'Completed', 'Pending'];

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>
            {mode === 'edit' ? 'Edit Defect' : 'Add New Defect'}
          </h2>
          <button 
            onClick={onClose}
            style={{ ...styles.editButton, padding: '4px 8px' }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {columns.map((col) => (
            <div key={col} style={styles.formGroup}>
              <label style={styles.label}>{col}</label>
              {getInputType(col) === 'select' ? (
                <select
                  value={formData[col] || ''}
                  onChange={(e) => handleChange(col, e.target.value)}
                  style={styles.input}
                >
                  <option value="">Select {col}</option>
                  {col === 'Criticality' 
                    ? getCriticalityOptions().map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))
                    : getStatusOptions().map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))
                  }
                </select>
              ) : (
                <input
                  type={getInputType(col)}
                  value={formData[col] || ''}
                  onChange={(e) => handleChange(col, e.target.value)}
                  style={{
                    ...styles.input,
                    borderColor: errors[col] ? '#ef4444' : undefined
                  }}
                  placeholder={`Enter ${col}`}
                />
              )}
              {errors[col] && (
                <span style={{ 
                  color: '#ef4444', 
                  fontSize: '12px', 
                  marginTop: '4px' 
                }}>
                  {errors[col]}
                </span>
              )}
            </div>
          ))}

          <div style={styles.modalFooter}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                ...styles.editButton,
                background: 'linear-gradient(145deg, #64748b 0%, #475569 100%)'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={styles.editButton}
            >
              {mode === 'edit' ? 'Update' : 'Add'} Defect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DefectModal;
