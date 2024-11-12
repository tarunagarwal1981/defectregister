import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Auth = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signIn({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data?.user) {
        onLogin(data.user);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Login</h1>
        
        {error && (
          <div style={styles.errorAlert}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </label>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
            </label>
          </div>

          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#132337',
    padding: '20px',
  },
  card: {
    backgroundColor: '#1b3a57',
    borderRadius: '8px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    color: '#f4f4f4',
    marginBottom: '24px',
    textAlign: 'center',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#f4f4f4',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    backgroundColor: '#132337',
    border: '1px solid #4a90e2',
    borderRadius: '4px',
    color: '#f4f4f4',
    marginTop: '4px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    color: '#f4f4f4',
    border: 'none',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  errorAlert: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid rgba(220, 38, 38, 0.2)',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '20px',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '14px',
    margin: 0,
  }
};

export default Auth;
