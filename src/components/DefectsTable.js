// src/components/DefectsTable.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DefectsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the defects register table
  const fetchData = async () => {
    setLoading(true);
    const { data: tableData, error } = await supabase
      .from('defects.defects%20register')
      .select('*'); // Fetches all rows and columns

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
