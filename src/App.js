// src/App.js
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import DataTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth status
    const checkAuth = async () => {
      try {
        const session = supabase.auth.session();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  // Loading screen while checking auth state
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
          fontFamily: 'Nunito, sans-serif',
        }}
      >
        Loading...
      </div>
    );
  }

  // Main app content with conditional rendering based on user auth state
  return (
    <div
      style={{
        backgroundColor: '#132337',
        minHeight: '100vh',
        color: '#f4f4f4',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      {user ? <DataTable userId={user.id} /> : <Auth onLogin={setUser} />}
    </div>
  );
}

export default App;
