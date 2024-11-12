import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Auth = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    setError(null);
    setSuccess(null);
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

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (isRegister && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRegister) {
        // Handle Registration
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data?.user) {
          setSuccess('Registration successful! Please check your email for verification.');
          setIsRegister(false);
        }
      } else {
        // Handle Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data?.user) {
          onLogin(data.user);
          setSuccess('Login successful!');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError(null);
    setSuccess(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>{isRegister ? 'Register' : 'Login'}</h1>
        
        {error && (
          <div style={styles.errorAlert}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {success && (
          <div style={styles.successAlert}>
            <p style={styles.successText}>{success}</p>
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

          {isRegister && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Confirm your password"
                  disabled={loading}
                  required
                />
              </label>
            </div>
          )}

          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <span>{isRegister ? 'Register' : 'Login'}</span>
            )}
          </button>
        </form>

        <button 
          onClick={toggleMode} 
          style={styles.toggleButton}
          disabled={loading}
        >
          {isRegister 
            ? 'Already have an account? Login' 
            : 'Need an account? Register'}
        </button>
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
    ':hover': {
      backgroundColor: '#357abd',
    },
    ':disabled': {
      backgroundColor: '#2c5c8f',
      cursor: 'not-allowed',
    },
  },
  toggleButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4a90e2',
    marginTop: '16px',
    padding: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    transition: 'color 0.2s',
    ':hover': {
      color: '#357abd',
    },
    ':disabled': {
      color: '#2c5c8f',
      cursor: 'not-allowed',
    },
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
  },
  successAlert: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '20px',
  },
  successText: {
    color: '#22c55e',
    fontSize: '14px',
    margin: 0,
  },
};

export default Auth;
