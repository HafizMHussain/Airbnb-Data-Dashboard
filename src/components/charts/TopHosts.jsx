import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_URL from '../../config';
import { Users } from 'lucide-react';

const TopHosts = ({ filters }) => {
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
      
      const response = await fetch(`${API_URL}/api/top-hosts?limit=10&${queryParams}`);
      const result = await response.json();
      
      // Truncate long host names
      const formattedData = result.map(host => ({
        ...host,
        displayName: host.host_name.length > 15 
          ? host.host_name.substring(0, 15) + '...' 
          : host.host_name
      }));
      
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching top hosts:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{data.host_name || 'Unknown Host'}</p>
          <p>Listings: {data.listing_count}</p>
          <p>Avg Price: ${data.avg_price.toFixed(2)}</p>
          <p>Total Reviews: {data.total_reviews}</p>
          <p>Avg Rating: {data.avg_rating.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <Users size={20} />
        <h3>Top Hosts by Listing Count</h3>
      </div>
      <div className="chart-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
              <XAxis type="number" />
              <YAxis 
                dataKey="displayName" 
                type="category" 
                width={120}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="listing_count" fill="#e67e22" name="Listings" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TopHosts;
