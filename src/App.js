// App.js
import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import DataTable from './components/DefectsTable';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data here
    const fetchData = async () => {
      const { data, error } = await supabase.from('defects register').select('*');
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(data);
      }
    };

    fetchData();
  }, []);

  const handleAddDefect = () => {
    // Logic for handling "Add Defect" button click, like opening a modal or redirecting
    alert('Add Defect button clicked');
  };

  return (
    <div>
      {user ? (
        <DataTable data={data} onAddDefect={handleAddDefect} />
      ) : (
        <Auth onLogin={setUser} />
      )}
    </div>
  );
}

export default App;
