import React from 'react';
import { Home, DollarSign, MessageSquare, Star } from 'lucide-react';

const KPICards = ({ summary }) => {
  if (!summary) return null;

  const kpis = [
    {
      title: 'Total Listings',
      value: summary.total_listings.toLocaleString(),
      icon: <Home size={24} />,
      color: 'blue'
    },
    {
      title: 'Average Price',
      value: `$${summary.average_price.toLocaleString()}`,
      icon: <DollarSign size={24} />,
      color: 'green'
    },
    {
      title: 'Total Reviews',
      value: summary.total_reviews.toLocaleString(),
      icon: <MessageSquare size={24} />,
      color: 'orange'
    },
    {
      title: 'Average Rating',
      value: summary.average_rating.toFixed(2),
      icon: <Star size={24} />,
      color: 'purple'
    }
  ];

  return (
    <div className="kpi-grid">
      {kpis.map((kpi, index) => (
        <div key={index} className="kpi-card">
          <div className="kpi-header">
            <div className={`kpi-icon ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div className="kpi-info">
              <h3>{kpi.title}</h3>
            </div>
          </div>
          <div className="kpi-value">{kpi.value}</div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
