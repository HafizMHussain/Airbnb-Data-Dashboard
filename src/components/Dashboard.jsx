import React, { useState, useEffect } from 'react';
import API_URL from '../config';
import KPICards from './KPICards';
import PriceDistribution from './charts/PriceDistribution';
import PriceTrends from './charts/PriceTrends';
import RoomTypeComparison from './charts/RoomTypeComparison';
import MapVisualization from './charts/MapVisualization';
import TopHosts from './charts/TopHosts';
import NeighbourhoodAnalysis from './charts/NeighbourhoodAnalysis';
import CancellationPolicies from './charts/CancellationPolicies';
import AvailabilityTrends from './charts/AvailabilityTrends';

const Dashboard = ({ filters, sidebarOpen }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [filters]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, v]) => v && v !== 'all')
      ).toString();
      
      const response = await fetch(`${API_URL}/api/summary?${queryParams}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`dashboard ${!sidebarOpen ? 'expanded' : ''}`}>
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Comprehensive analysis of Airbnb listings data</p>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard data...</div>
      ) : (
        <>
          <KPICards summary={summary} />

          <div className="charts-grid">
            <PriceDistribution filters={filters} />
            <PriceTrends filters={filters} />
          </div>

          <div className="charts-grid">
            <RoomTypeComparison filters={filters} />
            <CancellationPolicies filters={filters} />
          </div>

          <MapVisualization filters={filters} />

          <div className="charts-grid">
            <TopHosts filters={filters} />
            <NeighbourhoodAnalysis filters={filters} />
          </div>

          <div className="chart-card full-width">
            <AvailabilityTrends filters={filters} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
