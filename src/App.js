import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import DataTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

function App() {import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import DataTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is already logged in
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    // Listen for changes in authentication
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Clean up the listener on component unmount
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="App" style={styles.appContainer}>
      {user ? (
        <DataTable userId={user.id} handleLogout={handleLogout} />
      ) : (
        <Auth onLogin={() => setUser(supabase.auth.user())} />
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    backgroundColor: '#132337',
    color: '#f4f4f4',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Nunito, sans-serif',
  },
};

export default App;

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is already logged in
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    // Listen for changes in authentication
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Clean up the listener on component unmount
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="App">
      <h1>Stakeholder Data Collection</h1>
      {user ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <DataTable userId={user.id} />
        </>
      ) : (
        <Auth onLogin={() => setUser(supabase.auth.user())} />
      )}
    </div>
  );
}

export default App;
