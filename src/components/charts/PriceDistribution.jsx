import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

const PriceDistribution = ({ filters }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, v]) => v && v !== 'all')
      ).toString();
      
      const response = await fetch(`http://localhost:5000/api/price-distribution?bins=20&${queryParams}`);
      const result = await response.json();
      
      // Transform data for chart
      const chartData = result.bins.map((bin, index) => ({
        range: bin,
        count: result.counts[index]
      }));
      
      setData(chartData);
    } catch (error) {
      console.error('Error fetching price distribution:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].payload.range}</p>
          <p>Listings: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <BarChart3 size={20} />
        <h3>Price Distribution</h3>
      </div>
      <div className="chart-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
              <XAxis 
                dataKey="range" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#3498db" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PriceDistribution;
