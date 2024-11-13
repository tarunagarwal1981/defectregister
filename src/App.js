// src/App.js
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import DataTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#132337',
          color: '#f4f4f4',
          fontFamily: 'Nunito, sans-serif'
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div 
      style={{
        backgroundColor: '#132337',
        minHeight: '100vh',
        color: '#f4f4f4',
        fontFamily: 'Nunito, sans-serif',
        padding: '20px'
      }}
    >
      {user ? (
        <DataTable userId={user.id} />
      ) : (
        <Auth onLogin={(user) => setUser(user)} />
      )}
    </div>
  );
}

export default App;
