// src/App.js
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import DataTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#132337',
        color: '#f4f4f4',
        fontFamily: 'Nunito, sans-serif',
      }}>
        {Loading}
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#132337',
      minHeight: '100vh',
      color: '#f4f4f4',
      fontFamily: 'Nunito, sans-serif',
      padding: '20px',
    }}>
      {user ? <DataTable userId={user.id} /> : <Auth onLogin={() => setUser(supabase.auth.user())} />}
    </div>
  );
}

export default App;
