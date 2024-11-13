// src/components/Auth.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      setError(error.message);
    } else {
      onLogin(user);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '20px', padding: '10px' }}
        />
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>
    </div>
  );
};

export default Auth;
