// src/components/DataTable.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const DataTable = () => {
  const [data, setData] = useState([]);
  const columnHeaders = [
    'S.No',
    'Vessel Name',
    'Equipments',
    'Description',
    'Action Planned',
    'Criticality',
    'Date Reported',
    'Date Completed',
    'Status (Vessel)',
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: tableData, error } = await supabase.from('your_table_name').select('*');
      if (error) console.error("Error fetching data:", error);
      else setData(tableData);
    };

    fetchData();
  }, []);

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columnHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index}>
              <td>{index + 1}</td>
              <td>{row.vessel_name}</td>
              <td>{row.equipments}</td>
              <td>{row.description}</td>
              <td>{row.action_planned}</td>
              <td>{row.criticality}</td>
              <td>{row.date_reported}</td>
              <td>{row.date_completed}</td>
              <td>{row.status_vessel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
