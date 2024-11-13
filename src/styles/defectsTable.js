// src/styles/defectsTable.js
export const styles = {
  pageContainer: {
    background: 'linear-gradient(145deg, #132337 0%, #0a1622 100%)',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#f4f4f4',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    padding: '20px',
    background: 'linear-gradient(145deg, #1a2c42 0%, #152638 100%)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#f4f4f4',
    margin: 0,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  tableWrapper: {
    background: 'linear-gradient(145deg, #1a2c42 0%, #152638 100%)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    padding: '1px',  // For gradient border effect
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    fontSize: '13px',
  },
  tableHeader: {
    padding: '12px 16px',
    background: 'linear-gradient(180deg, #243b55 0%, #1a2c42 100%)',
    color: '#f4f4f4',
    fontWeight: '500',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
    '&:first-child': {
      borderTopLeftRadius: '12px',
    },
    '&:last-child': {
      borderTopRightRadius: '12px',
    },
    '&:hover': {
      background: 'linear-gradient(180deg, #2c4760 0%, #1f334d 100%)',
    },
  },
  tableCell: {
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '12px',
    transition: 'all 0.3s ease',
  },
  tableRow: {
    background: 'linear-gradient(145deg, #1a2c42 0%, #152638 100%)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(145deg, #1d2f45 0%, #18293b 100%)',
    },
    '&:last-child td': {
      borderBottom: 'none',
    },
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '500',
    color: '#f4f4f4',
    display: 'inline-block',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '500',
    background: 'linear-gradient(145deg, #243b55 0%, #1a2c42 100%)',
    color: '#f4f4f4',
    display: 'inline-block',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    background: 'linear-gradient(145deg, #3b82f6 0%, #2563eb 100%)',
    color: '#f4f4f4',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    },
  },
  addButton: {
    display: 'block',
    margin: '20px auto',
    padding: '12px 24px',
    borderRadius: '8px',
    background: 'linear-gradient(145deg, #3b82f6 0%, #2563eb 100%)',
    color: '#f4f4f4',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
    },
  },
  logoutButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    background: 'linear-gradient(145deg, #ef4444 0%, #dc2626 100%)',
    color: '#f4f4f4',
    border: 'none',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
    },
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    background: 'linear-gradient(145deg, #1a2c42 0%, #152638 100%)',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    color: '#f4f4f4',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    padding: '0 0 16px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  form: {
    display: 'grid',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#f4f4f4',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#f4f4f4',
    fontSize: '13px',
    transition: 'all 0.3s ease',
    '&:focus': {
      outline: 'none',
      border: '1px solid rgba(59, 130, 246, 0.5)',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.25)',
    },
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    color: '#f4f4f4',
  },
  loadingSpinner: {
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
};