# Airbnb Dashboard - Complete Documentation

## 📊 Overview

This is a comprehensive, full-stack interactive dashboard for analyzing Airbnb Open Data. The dashboard features modern design with a sidebar, multiple interactive visualizations, real-time filtering, and data preparation/cleaning capabilities.

## 🌟 Features

### Data Preparation & Cleaning
- **Automatic data cleaning**: Removes invalid records, handles missing values
- **Price normalization**: Cleans currency formats, filters outliers
- **Calculated fields**: 
  - Price per night
  - Occupancy rate (based on availability)
  - Rating categories
  - Price categories
  - Listing age
  - Review frequency categories
  - Host activity levels

### Interactive Visualizations

#### 1. **KPI Summary Cards**
- Total Listings
- Average Price
- Total Reviews
- Average Rating

#### 2. **Price Distribution (Histogram)**
- Shows distribution of listing prices
- Configurable number of bins
- Interactive tooltips

#### 3. **Price Trends (Line Chart)**
- Average price by construction year
- Identifies pricing trends over time
- Shows listing count per year

#### 4. **Room Type Comparison (Bar Chart)**
- Compares listings across room types
- Shows count, avg price, and ratings
- Horizontal bar layout for easy reading

#### 5. **Geographical Map**
- Interactive Leaflet map
- Color-coded by price range:
  - Green: < $100 (Budget)
  - Orange: $100-$200 (Mid-range)
  - Dark Orange: $200-$500 (Premium)
  - Red: $500+ (Luxury)
- Clickable markers with listing details
- Auto-zooms to filtered data

#### 6. **Top Hosts (Horizontal Bar Chart)**
- Top 10 hosts by listing count
- Shows average price and total reviews
- Identifies super hosts and property managers

#### 7. **Neighbourhood Analysis (Bar Chart)**
- Compares boroughs by listing count
- Shows average prices per area
- Total reviews by neighbourhood

#### 8. **Cancellation Policy Distribution (Pie Chart)**
- Visual breakdown of cancellation policies
- Shows average price by policy type
- Color-coded segments

#### 9. **Availability Trends (Bar Chart)**
- Listings grouped by availability ranges
- Shows seasonal patterns
- Average price by availability

### Interactive Filters

Located in the sidebar:
- **Room Type**: Filter by Entire home/apt, Private room, Shared room
- **Borough**: Filter by neighbourhood group
- **Cancellation Policy**: flexible, moderate, strict
- **Instant Bookable**: Yes/No filter
- **Price Range**: Min/Max price inputs
- **Minimum Reviews**: Filter by review count
- **Reset Filters**: One-click reset button

### Cross-Chart Filtering
All visualizations update dynamically when filters are applied, providing a cohesive analytical experience.

## 🏗️ Architecture

### Backend (Python + Flask)
```
backend/
├── app.py              # Flask API server with endpoints
└── data_processor.py   # Data cleaning and processing logic
```

**Key Endpoints:**
- `GET /api/health` - Health check
- `GET /api/summary` - KPI statistics
- `GET /api/price-distribution` - Histogram data
- `GET /api/price-trends` - Time series data
- `GET /api/room-types` - Room type statistics
- `GET /api/map-data` - Geolocation data
- `GET /api/top-hosts` - Top hosts data
- `GET /api/neighbourhoods` - Neighbourhood stats
- `GET /api/cancellation-policies` - Policy distribution
- `GET /api/availability-trends` - Availability data
- `GET /api/filter-options` - Available filter values

### Frontend (React + Vite)
```
src/
├── components/
│   ├── Sidebar.jsx              # Filter sidebar
│   ├── Dashboard.jsx            # Main dashboard layout
│   ├── KPICards.jsx            # Summary cards
│   └── charts/
│       ├── PriceDistribution.jsx
│       ├── PriceTrends.jsx
│       ├── RoomTypeComparison.jsx
│       ├── MapVisualization.jsx
│       ├── TopHosts.jsx
│       ├── NeighbourhoodAnalysis.jsx
│       ├── CancellationPolicies.jsx
│       └── AvailabilityTrends.jsx
├── App.jsx              # Root component
├── App.css             # Global styles
├── main.jsx            # Entry point
└── index.css           # Base styles
```

## 🚀 Setup & Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- pip (Python package manager)
- npm (Node package manager)

### Quick Setup

**Option 1: Using Setup Script**
```powershell
.\setup.ps1
```

**Option 2: Manual Setup**

1. **Install Backend Dependencies**
```powershell
pip install -r requirements.txt
```

2. **Install Frontend Dependencies**
```powershell
npm install
```

## 🎯 Running the Application

### Option 1: Using Start Script
```powershell
.\start.ps1
```
This automatically starts both backend and frontend servers.

### Option 2: Manual Start

**Terminal 1 - Backend:**
```powershell
python backend/app.py
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```powershell
npm run dev
```
Frontend runs on `http://localhost:5173`

### Access the Dashboard
Open your browser to: **http://localhost:5173**

## 📦 Dependencies

### Backend (Python)
- `flask` - Web framework
- `flask-cors` - CORS support
- `pandas` - Data manipulation
- `numpy` - Numerical operations
- `python-dateutil` - Date parsing

### Frontend (JavaScript)
- `react` - UI framework
- `react-dom` - React DOM renderer
- `recharts` - Charting library
- `leaflet` - Map library
- `react-leaflet` - React wrapper for Leaflet
- `lucide-react` - Icon library
- `axios` - HTTP client
- `vite` - Build tool

## 🎨 Design Features

### Modern UI Elements
- Gradient sidebar with dark theme
- Card-based layout with shadows and hover effects
- Responsive grid system
- Color-coded visualizations
- Custom tooltips
- Smooth transitions and animations

### Color Palette
- Primary: `#2c3e50` (Dark blue-gray)
- Accent: `#3498db` (Blue)
- Success: `#2ecc71` (Green)
- Warning: `#f39c12` (Orange)
- Danger: `#e74c3c` (Red)
- Purple: `#9b59b6`

### Responsive Design
- Mobile-friendly layout
- Collapsible sidebar on small screens
- Flexible grid system
- Touch-friendly interactive elements

## 📊 Data Processing Details

### Data Cleaning Steps

1. **Price Cleaning**
   - Remove $ symbols and commas
   - Convert to numeric values
   - Filter out zero/negative prices
   - Remove unrealistic outliers (> $10,000)

2. **Location Data**
   - Validate latitude/longitude
   - Remove invalid coordinates
   - Handle missing values

3. **Date Processing**
   - Parse review dates
   - Convert construction years
   - Calculate listing age

4. **Categorical Data**
   - Standardize room types
   - Normalize borough names
   - Clean host verification status

5. **Numeric Fields**
   - Handle missing reviews
   - Calculate review frequency
   - Compute occupancy rates

### Calculated Fields

- **Occupancy Rate**: `((365 - availability) / 365) * 100`
- **Total Price**: `price + service_fee`
- **Listing Age**: `current_year - construction_year`
- **Price Categories**: Budget, Mid-range, Premium, Luxury
- **Rating Categories**: Excellent, Good, Fair, Poor
- **Host Activity**: Single, Small, Medium, Large

## 🔧 Performance Optimizations

1. **Backend**
   - Data cached on server startup
   - Efficient pandas operations
   - Query parameter filtering
   - Limit results for map visualization (max 5000 points)

2. **Frontend**
   - React component optimization
   - Lazy loading of chart data
   - Debounced filter updates
   - Efficient re-rendering

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError`
```powershell
pip install -r requirements.txt
```

**Problem**: Port 5000 already in use
- Change port in `backend/app.py` (line 156)
- Update proxy in `vite.config.js`

**Problem**: CSV file not found
- Ensure `data/Airbnb_Open_Data.csv` exists
- Check file path in `backend/app.py`

### Frontend Issues

**Problem**: `npm install` fails
```powershell
npm cache clean --force
npm install
```

**Problem**: Blank screen
- Check browser console for errors
- Ensure backend is running
- Verify API endpoints are accessible

**Problem**: Map not displaying
- Check internet connection (needs OpenStreetMap tiles)
- Verify leaflet CSS is loaded
- Check browser console for Leaflet errors

## 📈 Future Enhancements

Potential improvements:
- User authentication
- Data export functionality (CSV, PDF reports)
- Custom date range picker
- Advanced analytics (predictive pricing)
- Comparison mode (compare time periods)
- Saved filter presets
- Dashboard themes (light/dark mode)
- Real-time data updates
- More chart types (scatter plots, heatmaps)
- Natural language query interface

## 📝 API Documentation

### Query Parameters
All endpoints support filtering via query parameters:
- `room_type` - Filter by room type
- `borough` - Filter by neighbourhood group
- `cancellation_policy` - Filter by policy
- `price_min` - Minimum price
- `price_max` - Maximum price
- `min_reviews` - Minimum review count
- `instant_bookable` - Yes/No

### Response Format
All endpoints return JSON:
```json
{
  "data": [...],
  "error": null
}
```

### Error Handling
Errors return 500 status with:
```json
{
  "error": "Error message"
}
```

## 🤝 Contributing

To extend this dashboard:
1. Add new endpoints in `backend/app.py`
2. Create data processing methods in `data_processor.py`
3. Build React components in `src/components/charts/`
4. Update filter logic in `Sidebar.jsx`
5. Add chart to `Dashboard.jsx`

## 📄 License

This project is for educational purposes.

## 👥 Credits

Built with modern web technologies:
- Flask for Python backend
- React for frontend UI
- Recharts for data visualization
- Leaflet for mapping
- OpenStreetMap for map tiles

## 🎓 Learning Objectives

This project demonstrates:
- Full-stack application development
- RESTful API design
- Data cleaning and preparation
- Interactive data visualization
- Responsive web design
- State management in React
- Python data processing with pandas
- Modern UI/UX principles

---

**Enjoy exploring the Airbnb data! 🏠📊**
