import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_URL from '../../config';
import { Calendar } from 'lucide-react';

const AvailabilityTrends = ({ filters }) => {
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
      
      const response = await fetch(`${API_URL}/api/availability-trends?${queryParams}`);
      const result = await response.json();
      
      setData(result);
    } catch (error) {
      console.error('Error fetching availability trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{data.availability_range}</p>
          <p>Listings: {data.count}</p>
          <p>Avg Price: ${data.avg_price.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card full-width">
      <div className="chart-header">
        <Calendar size={20} />
        <h3>Availability Trends (Days Available per Year)</h3>
      </div>
      <div className="chart-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
              <XAxis dataKey="availability_range" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" fill="#16a085" name="Number of Listings" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AvailabilityTrends;
