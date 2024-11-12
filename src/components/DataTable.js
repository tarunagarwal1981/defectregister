import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({ vessel_name: '', /* other fields */ });
  const [loading, setLoading] = useState(true);

  // Fetch data for the logged-in user
  const fetchData = async () => {
    setLoading(true);
    const user = supabase.auth.user();
    if (user) {
      let { data: rows, error } = await supabase
        .from('stakeholder_data')
        .select('*')
        .eq('user_id', user.id);
      if (error) console.error("Error fetching data:", error);
      else setData(rows);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add a new row to the database
  const handleAddRow = async () => {
    const user = supabase.auth.user();
    if (user) {
      const { data: newData, error } = await supabase.from('stakeholder_data').insert([
        { ...newRow, user_id: user.id }
      ]);
      if (error) console.error("Error adding row:", error);
      else setData([...data, ...newData]);
      setNewRow({ vessel_name: '', /* reset other fields */ });
    }
  };

  // Update a row in the database
  const handleUpdateRow = async (id, updatedRow) => {
    const { data: updatedData, error } = await supabase
      .from('stakeholder_data')
      .update(updatedRow)
      .eq('id', id);
    if (error) console.error("Error updating row:", error);
    else setData(data.map(row => (row.id === id ? updatedData[0] : row)));
  };

  // Delete a row from the database
  const handleDeleteRow = async (id) => {
    const { error } = await supabase.from('stakeholder_data').delete().eq('id', id);
    if (error) console.error("Error deleting row:", error);
    else setData(data.filter(row => row.id !== id));
  };

  return (
    <div>
      <h2>Data Table</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Vessel Name</th>
              {/* Add other column headers here */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.vessel_name}</td>
                {/* Map other fields here */}
                <td>
                  <button onClick={() => handleUpdateRow(row.id, {/* updatedRow data */})}>Edit</button>
                  <button onClick={() => handleDeleteRow(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <h3>Add New Row</h3>
        <input
          type="text"
          value={newRow.vessel_name}
          onChange={(e) => setNewRow({ ...newRow, vessel_name: e.target.value })}
          placeholder="Vessel Name"
        />
        {/* Add other input fields here */}
        <button onClick={handleAddRow}>Add Row</button>
      </div>
    </div>
  );
};

export default DataTable;
