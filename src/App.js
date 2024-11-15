import React, { useState, useEffect, useCallback } from 'react';
import Auth from './components/Auth';
import DataTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

// Utility function for fetching user's vessels
const getUserVessels = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_vessels')
      .select(`
        vessel_id,
        vessels!inner (
          vessel_id,
          vessel_name
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user vessels:', error);
    throw error;
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [assignedVessels, setAssignedVessels] = useState([]);
  const [vesselNames, setVesselNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedDefect, setEditedDefect] = useState(null);

  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching data for user:', user.id); // Debug log

      // Get user's vessels with names
      const userVessels = await getUserVessels(user.id);
      console.log('User vessels:', userVessels); // Debug log

      // Extract vessel IDs and names
      const vesselIds = userVessels.map(v => v.vessel_id);
      const vesselsMap = userVessels.reduce((acc, v) => {
        if (v.vessels) {
          acc[v.vessel_id] = v.vessels.vessel_name;
        }
        return acc;
      }, {});

      console.log('Vessel IDs:', vesselIds); // Debug log
      console.log('Vessel Names:', vesselsMap); // Debug log

      // Fetch defects for assigned vessels
      const { data: defects, error: defectsError } = await supabase
        .from('defects register')
        .select('*')
        .in('vessel_id', vesselIds);

      if (defectsError) throw defectsError;

      console.log('Fetched defects:', defects); // Debug log

      setAssignedVessels(vesselIds);
      setVesselNames(vesselsMap);
      setData(defects || []);
      
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
    } else {
      setData([]);
      setAssignedVessels([]);
      setVesselNames({});
      setError(null);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [user, fetchUserData]);

  const handleAddDefect = useCallback(() => {
    if (assignedVessels.length === 0) {
      setError("No vessels assigned to you. Contact administrator.");
      return;
    }

    const newDefect = {
      id: `temp-${Date.now()}`,
      SNo: data.length + 1,
      vessel_id: '',
      Equipments: '',
      Description: '',
      'Action Planned': '',
      Criticality: '',
      'Date Reported': new Date().toISOString().split('T')[0],
      'Date Completed': '',
      'Status (Vessel)': 'Open',
    };

    setData(prevData => [...prevData, newDefect]);
    setEditingId(newDefect.id);
    setEditedDefect(newDefect);
  }, [data.length, assignedVessels.length]);

  const handleSaveDefect = useCallback(async (updatedDefect) => {
    try {
      setError(null);

      if (!assignedVessels.includes(updatedDefect.vessel_id)) {
        throw new Error("Not authorized for this vessel");
      }

      const isNewDefect = updatedDefect.id?.startsWith('temp-');
      const defectData = {
        vessel_id: updatedDefect.vessel_id,
        vessel_name: vesselNames[updatedDefect.vessel_id], // Add vessel_name from vesselNames mapping
        Equipments: updatedDefect.Equipments,
        Description: updatedDefect.Description,
        'Action Planned': updatedDefect['Action Planned'],
        Criticality: updatedDefect.Criticality,
        'Date Reported': updatedDefect['Date Reported'],
        'Date Completed': updatedDefect['Date Completed'],
        'Status (Vessel)': updatedDefect['Status (Vessel)'],
      };

      if (!isNewDefect) {
        const { error } = await supabase
          .from('defects register')
          .update(defectData)
          .eq('id', updatedDefect.id);

        if (error) throw error;

        setData(prevData =>
          prevData.map(d => d.id === updatedDefect.id ? { ...d, ...defectData } : d)
        );
      } else {
        const { data: newDefect, error } = await supabase
          .from('defects register')
          .insert(defectData)
          .select()
          .single();

        if (error) throw error;

        setData(prevData =>
          prevData.map(d => d.id === updatedDefect.id ? { ...newDefect, SNo: d.SNo } : d)
        );
      }

      setEditingId(null);
      setEditedDefect(null);
    } catch (error) {
      console.error("Error saving defect:", error);
      setError(error.message);
    }
  }, [assignedVessels, vesselNames]); // Added vesselNames to dependencies

  const handleLogout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
      setError(error.message);
    }
  }, []);

  return (
    <div className="app-container">
      {error && (
        <div className="error-message">{error}</div>
      )}

      {user ? (
        <>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
          <DataTable
            data={data}
            onAddDefect={handleAddDefect}
            onSaveDefect={handleSaveDefect}
            vessels={assignedVessels}
            vesselNames={vesselNames}
            loading={loading}
            editingId={editingId}
            editedDefect={editedDefect}
            setEditingId={setEditingId}
            setEditedDefect={setEditedDefect}
          />
        </>
      ) : (
        <Auth onLogin={setUser} />
      )}

      <style jsx>{`
        .app-container {
          background-color: #132337;
          min-height: 100vh;
          color: #f4f4f4;
          font-family: 'Nunito', sans-serif;
          position: relative;
          padding-top: 60px;
        }

        .error-message {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #FF4D4D;
          padding: 10px 20px;
          border-radius: 4px;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .logout-button {
          position: fixed;
          top: 10px;
          right: 10px;
          padding: 10px 20px;
          background-color: #FF4D4D;
          color: #fff;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
          z-index: 1000;
        }

        .logout-button:hover {
          background-color: #ff3333;
        }
      `}</style>
    </div>
  );
}

export default App;
