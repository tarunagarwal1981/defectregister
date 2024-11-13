// src/App.js
import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import DefectsTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {user ? (
        <>
          <button onClick={handleLogout} style={{ alignSelf: 'flex-end', margin: '20px' }}>Logout</button>
          <DefectsTable userId={user.id} />
        </>
      ) : (
        <Auth onLogin={(user) => setUser(user)} />
      )}
    </div>
  );
}

export default App;
