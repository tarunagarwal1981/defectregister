import React, { useState, useEffect, useCallback } from 'react';
import Auth from './components/Auth';
import DataTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [assignedVessels, setAssignedVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);

      const [vesselsResponse, defectsResponse] = await Promise.all([
        supabase
          .from('user_vessels')
          .select('vessel_id, vessel_names(vessel_name)')
          .eq('user_id', user.id),
        supabase
          .from('defects_register')
          .select('*')
          .in('vessel_id', assignedVessels.map((v) => v.vessel_id))
      ]);

      if (vesselsResponse.error) throw vesselsResponse.error;
      if (defectsResponse.error) throw defectsResponse.error;

      setAssignedVessels(
        vesselsResponse.data.map((v) => ({
          vessel_id: v.vessel_id,
          vessel_name: v.vessel_names.vessel_name,
        }))
      );

      setData(defectsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [user, fetchUserData]);

  const handleAddDefect = useCallback(() => {
    const newDefect = {
      id: `temp-${Date.now()}`,
      vessel_id: '',
      Equipments: '',
      Description: '',
      Action_Planned: '',
      Criticality: '',
      Date_Reported: '',
      Date_Completed: '',
      Status_Vessel: '',
    };
    setData((prevData) => [...prevData, newDefect]);
  }, [data.length]);

  const handleSaveDefect = useCallback(async (updatedDefect) => {
    try {
      setError(null);
      const isNewDefect = updatedDefect.id?.startsWith('temp-');

      if (!isNewDefect) {
        const { error } = await supabase
          .from('defects_register')
          .update(updatedDefect)
          .eq('id', updatedDefect.id);

        if (error) throw error;
      } else {
        const { data: newDefect, error } = await supabase
          .from('defects_register')
          .insert(updatedDefect)
          .select()
          .single();

        if (error) throw error;
        
        setData((prevData) => 
          prevData.map((d) => (d.id === updatedDefect.id ? { ...newDefect } : d))
        );
      }
    } catch (error) {
      console.error("Error saving defect:", error);
      setError(error.message);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setData([]);
      setAssignedVessels([]);
    } catch (error) {
      console.error("Error logging out:", error);
      setError(error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#132337', minHeight: '100vh', color: '#f4f4f4', fontFamily: 'Nunito, sans-serif' }}>
      {error && <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#FF4D4D', padding: '10px 20px', borderRadius: '4px', zIndex: 1000 }}>{error}</div>}
      
      {user ? (
        <>
          <button onClick={handleLogout} style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px 20px', backgroundColor: '#FF4D4D', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Logout</button>
          <DataTable
            data={data}
            onAddDefect={handleAddDefect}
            onSaveDefect={handleSaveDefect}
            vessels={assignedVessels}
            loading={loading}
          />
        </>
      ) : (
        <Auth onLogin={setUser} />
      )}
    </div>
  );
}

export default App;
