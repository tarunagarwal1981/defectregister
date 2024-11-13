import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import DataTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: defects, error } = await supabase.from('defects').select('*');
        if (error) throw error;
        console.log("Data fetched:", defects);
        setData(defects);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  const handleAddDefect = () => {
    // Implement your add defect logic here
    console.log("Add Defect button clicked");
    // For example, you might open a modal or navigate to a defect form page.
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error);
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#132337', color: '#f4f4f4' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#132337', minHeight: '100vh', color: '#f4f4f4', fontFamily: 'Nunito, sans-serif' }}>
      {user ? (
        <>
          <button onClick={handleLogout} style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px 20px', backgroundColor: '#FF4D4D', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
            Logout
          </button>
          <DataTable data={data} onAddDefect={handleAddDefect} />
        </>
      ) : (
        <Auth onLogin={setUser} />
      )}
    </div>
  );
}

export default App;
