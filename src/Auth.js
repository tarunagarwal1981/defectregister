import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(supabase.auth.user());

  const handleLogin = async () => {
    const { error } = await supabase.auth.signIn({ email, password });
    if (error) console.error('Error logging in:', error);
    else setIsLoggedIn(true);
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) console.error('Error signing up:', error);
    else setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
    else setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <div>
        <p>Welcome! You are logged in.</p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Login or Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default Auth;
