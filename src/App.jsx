import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
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

  useEffect(() => {
    // Fetch filter options on mount
    fetch('http://localhost:5000/api/filter-options')
      .then(res => res.json())
      .then(data => setFilterOptions(data))
      .catch(err => console.error('Error fetching filter options:', err));
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
