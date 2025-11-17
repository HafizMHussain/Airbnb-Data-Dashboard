import React from 'react';
import { Home, Filter, X, RotateCcw } from 'lucide-react';

const Sidebar = ({ filters, filterOptions, onFilterChange, onResetFilters, isOpen, onToggle }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isOpen ? <X size={20} /> : <Filter size={20} />}
      </button>
      
      <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
        <div className="sidebar-header">
          <h1>
            <Home size={28} />
            Airbnb Analytics
          </h1>
          <p>Interactive Data Dashboard</p>
        </div>

        <div className="filters-section">
          <h3>
            <Filter size={18} />
            Filters
          </h3>

          <div className="filter-group">
            <label>Room Type</label>
            <select 
              value={filters.room_type}
              onChange={(e) => handleInputChange('room_type', e.target.value)}
            >
              <option value="all">All Room Types</option>
              {filterOptions.room_types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Borough</label>
            <select 
              value={filters.borough}
              onChange={(e) => handleInputChange('borough', e.target.value)}
            >
              <option value="all">All Boroughs</option>
              {filterOptions.boroughs.map(borough => (
                <option key={borough} value={borough}>{borough}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Cancellation Policy</label>
            <select 
              value={filters.cancellation_policy}
              onChange={(e) => handleInputChange('cancellation_policy', e.target.value)}
            >
              <option value="all">All Policies</option>
              {filterOptions.cancellation_policies.map(policy => (
                <option key={policy} value={policy}>{policy}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Instant Bookable</label>
            <select 
              value={filters.instant_bookable}
              onChange={(e) => handleInputChange('instant_bookable', e.target.value)}
            >
              <option value="all">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range ($)</label>
            <div className="price-range-inputs">
              <input 
                type="number" 
                placeholder="Min"
                value={filters.price_min}
                onChange={(e) => handleInputChange('price_min', e.target.value)}
                min={0}
              />
              <input 
                type="number" 
                placeholder="Max"
                value={filters.price_max}
                onChange={(e) => handleInputChange('price_max', e.target.value)}
                min={0}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Minimum Reviews</label>
            <input 
              type="number" 
              placeholder="e.g., 10"
              value={filters.min_reviews}
              onChange={(e) => handleInputChange('min_reviews', e.target.value)}
              min={0}
            />
          </div>

          <button className="reset-button" onClick={onResetFilters}>
            <RotateCcw size={16} />
            Reset Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
