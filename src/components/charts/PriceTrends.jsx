import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_URL from '../../config';
import { TrendingUp } from 'lucide-react';

const PriceTrends = ({ filters }) => {
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
      
      const response = await fetch(`${API_URL}/api/price-trends?${queryParams}`);
      const result = await response.json();
      
      // Transform data for chart
      const chartData = result.years.map((year, index) => ({
        year: year,
        avgPrice: result.avg_prices[index],
        count: result.counts[index]
      }));
      
      setData(chartData);
    } catch (error) {
      console.error('Error fetching price trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">Year: {payload[0].payload.year}</p>
          <p>Avg Price: ${payload[0].value.toFixed(2)}</p>
          <p>Listings: {payload[0].payload.count}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <TrendingUp size={20} />
        <h3>Price Trends by Construction Year</h3>
      </div>
      <div className="chart-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="avgPrice" 
                stroke="#2ecc71" 
                strokeWidth={3}
                dot={{ fill: '#2ecc71', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PriceTrends;
