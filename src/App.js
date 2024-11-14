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
  const [editingId, setEditingId] = useState(null);
  const [editedDefect, setEditedDefect] = useState(null);

  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // First get the user's assigned vessels
      const { data: userVessels, error: vesselsError } = await supabase
        .from('user_vessels')
        .select('vessel_id')
        .eq('user_id', user.id);

      if (vesselsError) throw vesselsError;

      // Get vessel names for the assigned vessels
      const vesselIds = userVessels.map(v => v.vessel_id);
      
      const [defectsResponse, vesselsResponse] = await Promise.all([
        supabase
          .from('defects register')
          .select('*')
          .in('vessel_id', vesselIds),
        supabase
          .from('vessels')
          .select('vessel_id, vessel_name')
          .in('vessel_id', vesselIds)
      ]);

      if (defectsResponse.error) throw defectsResponse.error;
      if (vesselsResponse.error) throw vesselsResponse.error;

      setAssignedVessels(vesselIds);
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
    } else {
      // Clear data when user logs out
      setData([]);
      setAssignedVessels([]);
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
  }, [data.length]);

  const handleSaveDefect = useCallback(async (updatedDefect) => {
    try {
      setError(null);
      const isNewDefect = updatedDefect.id?.startsWith('temp-');
      const defectData = {
        vessel_id: updatedDefect.vessel_id,
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
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setData([]);
      setAssignedVessels([]);
      setEditingId(null);
      setEditedDefect(null);
    } catch (error) {
      console.error("Error logging out:", error);
      setError(error.message);
    }
  }, []);

  return (
    <div className="app-container">
      {error && (
        <div className="error-message">
          {error}
        </div>
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
          animation: slideIn 0.3s ease-out;
        }

        .logout-button {
          position: absolute;
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
        }

        .logout-button:hover {
          background-color: #ff3333;
          transform: translateY(-1px);
        }

        @keyframes slideIn {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
