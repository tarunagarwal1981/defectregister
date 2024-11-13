// src/components/AddRowButton.js
import React from 'react';
import { supabase } from '../supabaseClient';

const AddRowButton = ({ fetchData }) => {
  const handleAddRow = async () => {
    const { error } = await supabase.from('defects').insert([{ vessel_name: 'New Vessel', description: 'New Defect', status: 'Pending' }]);
    if (error) console.error('Error adding row:', error);
    else fetchData();
  };

  return <button onClick={handleAddRow}>Add Row</button>;
};

export default AddRowButton;
