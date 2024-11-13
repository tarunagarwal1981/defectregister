import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DefectsTable = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: tableData, error } = await supabase
        .from('defects_register') // Replace with your actual table name
        .select('*');

      if (error) console.error('Error fetching data:', error);
      else setData(tableData);
    };

    fetchData();
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Inline DefectModal component
  const DefectModal = ({ onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl">Add New Defect</h2>
        {/* Additional modal content can go here */}
        <button onClick={onClose} className="mt-4 text-blue-500">Close</button>
      </div>
    </div>
  );

  return (
    <div>
      {showModal && <DefectModal onClose={closeModal} />}
      <table className="w-full">
        <thead>
          <tr>
            {/* Render table headers */}
            {data[0] && Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
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
      <button onClick={openModal} className="bg-blue-500 text-white p-2 rounded mt-4">
        + Add Row
      </button>
    </div>
  );
};

export default DefectsTable;
