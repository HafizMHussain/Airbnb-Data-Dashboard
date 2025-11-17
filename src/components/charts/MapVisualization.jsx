import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import API_URL from '../../config';
import 'leaflet/dist/leaflet.css';

// Component to auto-fit map bounds
const MapBoundsController = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (data && data.length > 0) {
      try {
        const latlngs = data.map(item => [item.lat, item.lng]);
        const bounds = L.latLngBounds(latlngs);
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (e) {
        console.log('Could not fit bounds:', e);
      }
    }
  }, [data, map]);

  return null;
};

const MapVisualization = ({ filters }) => {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMapData();
  }, [filters]);

  const loadMapData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build URL with filters
      const params = new URLSearchParams();
      params.set('limit', '2000');

      // Add active filters
      if (filters?.room_type && filters.room_type !== 'all') {
        params.set('room_type', filters.room_type);
      }
      if (filters?.borough && filters.borough !== 'all') {
        params.set('borough', filters.borough);
      }
      if (filters?.cancellation_policy && filters.cancellation_policy !== 'all') {
        params.set('cancellation_policy', filters.cancellation_policy);
      }
      if (filters?.price_min) {
        params.set('price_min', filters.price_min);
      }
      if (filters?.price_max) {
        params.set('price_max', filters.price_max);
      }
      if (filters?.min_reviews) {
        params.set('min_reviews', filters.min_reviews);
      }
      if (filters?.instant_bookable && filters.instant_bookable !== 'all') {
        params.set('instant_bookable', filters.instant_bookable);
      }

      const url = `${API_URL}/api/map-data?${params.toString()}`;
      console.log('Map URL:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Map data loaded:', data.length, 'listings');
      setMapData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading map data:', err);
      setError(err.message);
      setMapData([]);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (price) => {
    if (price < 100) return '#2ecc71';      // Green
    if (price < 200) return '#f39c12';      // Orange
    if (price < 500) return '#e67e22';      // Dark orange
    return '#e74c3c';                       // Red
  };

  return (
    <div className="chart-card full-width">
      <div className="chart-header">
        <MapPin size={20} />
        <h3>Geographical Distribution ({mapData.length.toLocaleString()} listings)</h3>
      </div>
      <div className="chart-content">
        {loading && (
          <div className="loading">Loading map data...</div>
        )}
        {error && (
          <div className="error">Error: {error}</div>
        )}
        {!loading && !error && mapData.length === 0 && (
          <div className="error">No listings found matching the filters</div>
        )}
        {!loading && !error && mapData.length > 0 && (
          <div className="map-container">
            <MapContainer
              center={[40.7128, -74.0060]}
              zoom={11}
              scrollWheelZoom={true}
              style={{ height: '500px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapBoundsController data={mapData} />
              {mapData.map((listing) => (
                <CircleMarker
                  key={listing.id}
                  center={[listing.lat, listing.lng]}
                  radius={6}
                  fillColor={getMarkerColor(listing.price)}
                  fillOpacity={0.7}
                  color="#fff"
                  weight={2}
                >
                  <Popup>
                    <div style={{ minWidth: '200px' }}>
                      <strong>{listing.name}</strong>
                      <br />
                      <small>
                        <strong>Price:</strong> ${listing.price.toLocaleString()}<br />
                        <strong>Type:</strong> {listing.room_type}<br />
                        <strong>Borough:</strong> {listing.borough}<br />
                        <strong>Rating:</strong> {listing.rating !== null && listing.rating !== undefined ? listing.rating.toFixed(1) : 'No rating'}
                      </small>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapVisualization;
