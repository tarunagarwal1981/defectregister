// src/components/DefectsTable.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DefectsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    // Fetch data from the "defects register" table in the "public" schema
    const { data: tableData, error } = await supabase
      .from('defects register') // Table name only, no headers needed
      .select('*', { head: true })
      .headers({
        Prefer: 'schema=public', // Specify the schema here
      });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(tableData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Defects Register</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DefectsTable;
