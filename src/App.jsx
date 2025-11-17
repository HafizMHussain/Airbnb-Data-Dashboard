import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import API_URL from './config';
import './App.css';

function App() {
  const [filters, setFilters] = useState({
    room_type: 'all',
    borough: 'all',
    cancellation_policy: 'all',
    price_min: '',
    price_max: '',
    min_reviews: '',
    instant_bookable: 'all'
  });

  const [filterOptions, setFilterOptions] = useState({
    room_types: [],
    boroughs: [],
    cancellation_policies: [],
    price_range: { min: 0, max: 10000 }
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Log API URL for debugging
    console.log('API URL:', API_URL);
    
    // Fetch filter options on mount
    fetch(`${API_URL}/api/filter-options`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Filter options loaded:', data);
        setFilterOptions(data);
      })
      .catch(err => {
        console.error('Error fetching filter options:', err);
        setError('Failed to connect to backend. Please check if backend is running.');
      });
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      room_type: 'all',
      borough: 'all',
      cancellation_policy: 'all',
      price_min: '',
      price_max: '',
      min_reviews: '',
      instant_bookable: 'all'
    });
  };

  return (
    <div className="app">
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#ff4444',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          zIndex: 9999
        }}>
          {error}
        </div>
      )}
      <Sidebar 
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <Dashboard 
        filters={filters} 
        sidebarOpen={sidebarOpen}
      />
    </div>
  );
}

export default App;
