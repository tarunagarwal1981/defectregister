// src/components/DefectsTable.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AddDefectModal from './AddDefectModal';
import { styles } from '../styles/defectsTable';
import { SearchIcon, PlusIcon, LogoutIcon } from 'lucide-react';

const DefectsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const columns = [
    'S.No',
    'Vessel Name',
    'Equipments',
    'Description',
    'Action Planned',
    'Criticality',
    'Date reported',
    'Date Completed',
    'Status (Vessel)',
    'Comments',
    'Item Type',
    'Path',
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: tableData, error } = await supabase
        .from('defects register')
        .select('*');

      if (error) throw error;
      setData(tableData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddDefect = async (defectData) => {
    try {
      const { data: newData, error } = await supabase
        .from('defects register')
        .insert([defectData]);

      if (error) throw error;
      setData([...data, ...newData]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding defect:', error);
    }
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = sortedData.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getCriticalityColor = (criticality) => {
    const colors = {
      'High': '#ef4444',
      'Medium': '#f59e0b',
      'Low': '#10b981',
    };
    return colors[criticality] || '#6b7280';
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Defects Register</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogoutIcon size={16} />
          <span>Logout</span>
        </button>
      </div>

      <div style={styles.toolbarContainer}>
        <div style={styles.searchContainer}>
          <SearchIcon size={20} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search defects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          style={styles.addButton}
        >
          <PlusIcon size={20} />
          <span>Add New Defect</span>
        </button>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner} />
          <p>Loading data...</p>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th 
                    key={col} 
                    style={styles.tableHeader}
                    onClick={() => handleSort(col)}
                  >
                    {col}
                    {sortConfig.key === col && (
                      <span style={styles.sortIndicator}>
                        {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} style={styles.tableRow}>
                  {columns.map((col) => (
                    <td key={col} style={styles.tableCell}>
                      {col === 'Criticality' ? (
                        <span style={{
                          ...styles.badge,
                          backgroundColor: getCriticalityColor(row[col])
                        }}>
                          {row[col]}
                        </span>
                      ) : col === 'Status (Vessel)' ? (
                        <span style={styles.statusBadge}>
                          {row[col]}
                        </span>
                      ) : row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddDefectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddDefect}
        columns={columns}
      />
    </div>
  );
};
