// src/components/DataTable.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const DataTable = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: tableData, error } = await supabase
        .from('defects') // Replace 'defects' with your actual table name
        .select('id, vessel_name, equipment, description, action_planned, criticality, date_reported, date_completed, status');

      if (error) console.error('Error fetching data:', error);
      else setData(tableData);
    };

    fetchData();
  }, []);

  // Inline styling for the table and table elements
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      backgroundColor: '#f4f4f4',
    },
    header: {
      backgroundColor: '#132337',
      color: '#f4f4f4',
      textAlign: 'left',
      padding: '12px',
    },
    cell: {
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    row: {
      backgroundColor: '#f9f9f9',
    },
    rowAlternate: {
      backgroundColor: '#ffffff',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Defects Register</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>S.No</th>
            <th style={styles.header}>Vessel Name</th>
            <th style={styles.header}>Equipments</th>
            <th style={styles.header}>Description</th>
            <th style={styles.header}>Action Planned</th>
            <th style={styles.header}>Criticality</th>
            <th style={styles.header}>Date Reported</th>
            <th style={styles.header}>Date Completed</th>
            <th style={styles.header}>Status (Vessel)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              style={index % 2 === 0 ? styles.row : styles.rowAlternate}
            >
              <td style={styles.cell}>{index + 1}</td>
              <td style={styles.cell}>{item.vessel_name}</td>
              <td style={styles.cell}>{item.equipment}</td>
              <td style={styles.cell}>{item.description}</td>
              <td style={styles.cell}>{item.action_planned}</td>
              <td style={styles.cell}>{item.criticality}</td>
              <td style={styles.cell}>{item.date_reported}</td>
              <td style={styles.cell}>{item.date_completed}</td>
              <td style={styles.cell}>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
