// src/components/DefectsTable.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTable } from 'react-table';

const DefectsTable = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      const { data: defects, error } = await supabase.from('defects').select('*');
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(defects);
      }
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div>
      <h3>Defects Register</h3>
      <table {...getTableProps()} style={{ border: '1px solid #4a90e2', width: '100%', marginTop: '20px' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} style={{ borderBottom: '2px solid #4a90e2', padding: '10px' }}>
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
