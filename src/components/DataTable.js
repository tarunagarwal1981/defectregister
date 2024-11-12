import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from Supabase
    const fetchData = async () => {
      const user = supabase.auth.user();
      let { data: rows } = await supabase
        .from('stakeholder_data')
        .select('*')
        .eq('user_id', user.id);
      setData(rows);
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Render table here with data */}
    </div>
  );
};

export default DataTable;
