import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import DataTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth session
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#132337', color: '#f4f4f4' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="App" style={{ backgroundColor: '#132337', minHeight: '100vh', color: '#f4f4f4', fontFamily: 'Nunito, sans-serif' }}>
      {user ? (
        <>
          <button 
            onClick={handleLogout} 
            style={{ 
              backgroundColor: '#4a90e2', 
              color: '#f4f4f4', 
              border: 'none', 
              padding: '10px 20px', 
              fontSize: '16px', 
              cursor: 'pointer', 
              borderRadius: '4px', 
              margin: '10px' 
            }}
          >
            Logout
          </button>
          <DataTable userId={user.id} />
        </>
      ) : (
        <Auth onLogin={setUser} />
      )}
    </div>
  );
}

export default App;
