// src/components/DefectsTable.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTable } from 'react-table';

const DefectsTable = ({ userId }) => {
  const [data, setData] = useState([]);

  const columns = React.useMemo(
    () => [
      { Header: 'Vessel Name', accessor: 'vessel_name' },
      { Header: 'Description', accessor: 'description' },
      { Header: 'Status', accessor: 'status' },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data: defects, error } = await supabase.from('defects').select('*');
      if (!error) setData(defects);
    };

    fetchData();
  }, [userId]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div>
      <h3>Defects Register</h3>
      <table {...getTableProps()} style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} style={{ padding: '10px', borderBottom: '2px solid #4a90e2' }}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} style={{ backgroundColor: '#1b3a57' }}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} style={{ padding: '10px', borderBottom: '1px solid #4a90e2' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DefectsTable;
