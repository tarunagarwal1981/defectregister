// src/App.js
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import DataTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  }

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#132337',
    color: '#f4f4f4',
    fontFamily: 'Nunito, sans-serif'
  };

  const containerStyle = {
    backgroundColor: '#132337',
    minHeight: '100vh',
    color: '#f4f4f4',
    fontFamily: 'Nunito, sans-serif',
    padding: '20px'
  };

  if (loading) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  return (
    <div style={containerStyle}>
      {user ? (
        <DataTable userId={user.id} />
      ) : (
        <Auth onLogin={user => setUser(user)} />
      )}
    </div>
  );
}

export default App;
