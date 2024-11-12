// src/Auth.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        onLogin();
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Login</h1>
      {error && <p style={styles.errorText}>{error}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <label style={styles.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="Enter your email"
          />
        </label>
        <label style={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter your password"
          />
        </label>
        <button type="submit" style={styles.loginButton}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#132337',
    color: '#f4f4f4',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Nunito, sans-serif',
    padding: '20px',
  },
  heading: {
    fontSize: '36px',
    color: '#f4f4f4',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  label: {
    color: '#f4f4f4',
    fontSize: '16px',
    alignSelf: 'flex-start',
    marginBottom: '8px',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #4a90e2',
    backgroundColor: '#1b3a57',
    color: '#f4f4f4',
    marginBottom: '20px',
    boxSizing: 'border-box',
  },
  loginButton: {
    backgroundColor: '#4a90e2',
    color: '#f4f4f4',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '4px',
    width: '100%',
    maxWidth: '400px',
  },
  errorText: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center',
  },
};

export default Auth;
