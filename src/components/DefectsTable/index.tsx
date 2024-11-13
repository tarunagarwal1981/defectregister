// File: src/components/DefectsTable/index.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface DefectRow {
  'S.No': number;
  'Vessel Name': string;
  'Equipments': string;
  'Description': string;
  'Action Planned': string;
  'Criticality': string;
  'Date reported': string;
  'Date Completed': string;
  'Status (Vessel)': string;
  'Comments': string;
  'Item Type': string;
  'Path': string;
}

const DefectsTable = () => {
  const [data, setData] = useState<DefectRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('defects register')
        .select('*');

      if (error) throw error;
      setData(result || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Defects Register</h1>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <table className="min-w-full bg-[#1a2c42] divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Vessel Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Equipments
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Criticality
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((row) => (
              <tr 
                key={row['S.No']} 
                className="hover:bg-[#243b55] transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {row['S.No']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {row['Vessel Name']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {row['Equipments']}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {row['Description']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row['Criticality'].toLowerCase() === 'high' 
                        ? 'bg-red-900 text-red-200' 
                        : row['Criticality'].toLowerCase() === 'medium'
                        ? 'bg-yellow-900 text-yellow-200'
                        : 'bg-green-900 text-green-200'
                    }`}
                  >
                    {row['Criticality']}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded-full bg-blue-900 text-blue-200 text-xs font-medium">
                    {row['Status (Vessel)']}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DefectsTable;
