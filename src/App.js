import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import DataTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [vessels, setVessels] = useState([]); // List of vessels assigned to the user
  const [loading, setLoading] = useState(true);

  // Fetch assigned vessels for the logged-in user
  const fetchAssignedVessels = async () => {
    try {
      const { data: assignedVessels, error } = await supabase
        .from('user_vessels')
        .select('vessel_name')
        .eq('user_id', user.id);
      if (error) throw error;

      setVessels(assignedVessels.map(v => v.vessel_name)); // Set vessel names for dropdown
    } catch (error) {
      console.error("Error fetching vessels:", error);
    }
  };

  // Fetch defect data for assigned vessels only
  const fetchData = async () => {
    try {
      const { data: defects, error } = await supabase
        .from('defects register')
        .select('*');
      if (error) throw error;

      setData(defects); // Supabase policies will filter data based on assigned vessels
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Combined fetch operations on login
  useEffect(() => {
    if (user) {
      fetchAssignedVessels();
      fetchData();
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      if (authListener) authListener.unsubscribe();
    };
  }, [user]);

  // Handle adding a new defect
  const handleAddDefect = () => {
    const newDefect = {
      id: null,
      SNo: data.length + 1,
      'Vessel Name': '',
      Equipments: '',
      Description: '',
      'Action Planned': '',
      Criticality: '',
      'Date Reported': '',
      'Date Completed': '',
      'Status (Vessel)': '',
    };
    setData([...data, newDefect]);
  };

  // Save defect to the database
  const handleSaveDefect = async (updatedDefect) => {
    try {
      if (updatedDefect.id) {
        const { error } = await supabase
          .from('defects register')
          .update({
            'Vessel Name': updatedDefect['Vessel Name'],
            Equipments: updatedDefect.Equipments,
            Description: updatedDefect.Description,
            'Action Planned': updatedDefect['Action Planned'],
            Criticality: updatedDefect.Criticality,
            'Date Reported': updatedDefect['Date Reported'],
            'Date Completed': updatedDefect['Date Completed'],
            'Status (Vessel)': updatedDefect['Status (Vessel)'],
          })
          .eq('id', updatedDefect.id);
        if (error) throw error;
      } else {
        const { data: newDefect, error } = await supabase
          .from('defects register')
          .insert({
            'Vessel Name': updatedDefect['Vessel Name'],
            Equipments: updatedDefect.Equipments,
            Description: updatedDefect.Description,
            'Action Planned': updatedDefect['Action Planned'],
            Criticality: updatedDefect.Criticality,
            'Date Reported': updatedDefect['Date Reported'],
            'Date Completed': updatedDefect['Date Completed'],
            'Status (Vessel)': updatedDefect['Status (Vessel)'],
          })
          .single();
        if (error) throw error;
        updatedDefect.id = newDefect.id;
      }
      fetchData(); // Refresh data after saving
    } catch (error) {
      console.error("Error saving defect:", error);
    }
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
          <DataTable data={data} vessels={vessels} onAddDefect={handleAddDefect} onSaveDefect={handleSaveDefect} />
        </>
      ) : (
        <Auth onLogin={setUser} />
      )}
    </div>
  );
}

export default App;
