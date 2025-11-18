# Airbnb Data Analytics Dashboard

A professional, full-stack interactive data visualization dashboard for analyzing 102,000+ Airbnb listings across NYC. Built with modern web technologies and featuring real-time filtering, interactive maps, and comprehensive analytics.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-success)
![Python](https://img.shields.io/badge/Python-3.13-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Flask](https://img.shields.io/badge/Flask-3.0-black)
![Deployed](https://img.shields.io/badge/Deployed-Vercel-black)

## 🌐 Live Demo

**🚀 [View Live Dashboard](https://airbnb-data-dashboard-frontend.vercel.app)**

> Deployed on Vercel with serverless backend architecture

## 🚀 Features

### Analytics & Visualizations
- **📊 KPI Dashboard**: Total listings, average prices, reviews, and ratings at a glance
- **📈 Price Distribution**: Histogram showing price ranges across listings
- **📉 Price Trends**: Line chart analyzing prices by construction year
- **🏠 Room Type Analysis**: Comparison of Entire home/apt, Private room, Shared room, Hotel room
- **🗺️ Interactive Map**: Geographical distribution with 2,000+ markers color-coded by price
- **👥 Top Hosts**: Analysis of hosts with most listings
- **🌆 Borough Analysis**: Statistics for Manhattan, Brooklyn, Queens, Bronx, Staten Island
- **📋 Cancellation Policies**: Pie chart of policy distribution
- **📅 Availability Trends**: Year-round availability patterns

### Interactive Features
- **🎯 7 Dynamic Filters**: Room type, borough, cancellation policy, price range (min/max), minimum reviews, instant bookable
- **🔄 Real-time Updates**: All charts and map update instantly when filters change
- **🎨 Modern UI**: Clean sidebar navigation, responsive design, professional styling
- **📱 Responsive**: Works seamlessly on desktop, tablet, and mobile devices

### Data Processing
- **✅ Data Cleaning**: Handles 102,344 listings with price validation, coordinate verification, missing value handling
- **📊 Calculated Fields**: Occupancy rate, price categories, rating categories, listing age, review frequency
- **⚡ Performance**: Optimized sampling for map visualization, efficient filtering algorithms

## 🛠️ Tech Stack

### Backend
- **Python 3.13** - Core backend language
- **Flask 3.0.0** - RESTful API framework
- **Pandas 2.3.2** - Data processing and analysis
- **NumPy 2.3.3** - Numerical computations
- **Flask-CORS 4.0.0** - Cross-origin resource sharing

### Frontend
- **React 18.2.0** - UI component library
- **Vite 5.4.21** - Build tool and dev server
- **Recharts 2.10.3** - Charting library
- **Leaflet 1.9.4** - Interactive maps
- **React-Leaflet 4.2.1** - React bindings for Leaflet
- **Lucide-React** - Modern icon library
- **Axios 1.6.2** - HTTP client

## 📋 Prerequisites

- **Python**: 3.13 or higher
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher

## 🚀 Quick Start

### Option 1: Use Live Deployment (Recommended)
Simply visit the [Live Dashboard](https://your-frontend-url.vercel.app) - no installation needed!

### Option 2: Run Locally

#### 1. Clone the Repository
```bash
git clone https://github.com/HafizMHussain/Airbnb-Data-Dashboard.git
cd Airbnb-Data-Dashboard
```

#### 2. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```
✅ Backend running on `http://localhost:5000`

#### 3. Frontend Setup
```bash
# In a new terminal, return to root directory
cd ..

# Install Node dependencies
npm install

# Start development server
npm run dev
```
✅ Frontend running on `http://localhost:5173`

#### 4. Access the Dashboard
Open your browser and navigate to `http://localhost:5173`

## ☁️ Deployment

This project is deployed on Vercel using a two-project architecture:

### Backend Deployment
- **Platform**: Vercel Serverless Functions
- **Root Directory**: `backend/`
- **Runtime**: Python 3.9
- **Environment Variables**:
  ```
  FLASK_ENV=production
  FLASK_DEBUG=False
  CORS_ORIGINS=https://your-frontend-url.vercel.app
  ```

### Frontend Deployment
- **Platform**: Vercel
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  ```
  VITE_API_URL=https://your-backend-url.vercel.app
  ```

### Deploy Your Own
1. Fork this repository
2. Import to Vercel (twice - once for backend, once for frontend)
3. Configure environment variables as shown above
4. Deploy!

## 📁 Project Structure

```
Dashboard Big Data/
├── 📂 backend/
│   ├── data/
│   │   └── Airbnb_Open_Data.csv     # Dataset (102,599 listings)
│   ├── app.py                       # Flask API server (11 endpoints)
│   ├── data_processor.py            # Data cleaning & processing engine
│   ├── requirements.txt             # Python dependencies
│   └── vercel.json                  # Vercel serverless config
│
├── 📂 data/
│   └── Airbnb_Open_Data.csv         # Original dataset
│
├── 📂 src/
│   ├── 📂 components/
│   │   ├── Sidebar.jsx              # Filter controls
│   │   ├── Dashboard.jsx            # Main dashboard layout
│   │   ├── KPICards.jsx             # Summary statistics
│   │   └── 📂 charts/
│   │       ├── MapVisualization.jsx # Interactive Leaflet map
│   │       ├── PriceDistribution.jsx
│   │       ├── PriceTrends.jsx
│   │       ├── RoomTypeComparison.jsx
│   │       ├── TopHosts.jsx
│   │       ├── NeighbourhoodAnalysis.jsx
│   │       ├── CancellationPolicies.jsx
│   │       └── AvailabilityTrends.jsx
│   ├── App.jsx                      # Root component
│   ├── App.css                      # Styling
│   └── main.jsx                     # Entry point
│
├── 📂 public/                       # Static assets
├── index.html                       # HTML template
├── package.json                     # Node dependencies
├── vite.config.js                   # Vite configuration
├── vercel.json                      # Frontend Vercel config
└── README.md                        # This file
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/summary` | GET | KPI summary statistics |
| `/api/price-distribution` | GET | Price histogram data |
| `/api/price-trends` | GET | Price by construction year |
| `/api/room-types` | GET | Room type statistics |
| `/api/map-data` | GET | Location data for map (limit=2000) |
| `/api/top-hosts` | GET | Top 10 hosts by listing count |
| `/api/neighbourhoods` | GET | Borough-level statistics |
| `/api/cancellation-policies` | GET | Policy distribution |
| `/api/availability-trends` | GET | Availability patterns |
| `/api/filter-options` | GET | Available filter values |

All endpoints support query parameters for filtering:
- `room_type`, `borough`, `cancellation_policy`
- `price_min`, `price_max`, `min_reviews`
- `instant_bookable`

## 🎨 Features in Detail

### Interactive Map
- Displays 2,000 listings on OpenStreetMap
- **Color coding by price**:
  - 🟢 Green: Under $100
  - 🟠 Orange: $100-$200
  - 🟠 Dark Orange: $200-$500
  - 🔴 Red: $500+
- Auto-zoom to fit visible markers
- Popup details on click

### Filters
1. **Room Type**: Entire home/apt, Private room, Shared room, Hotel room
2. **Borough**: Manhattan, Brooklyn, Queens, Bronx, Staten Island
3. **Cancellation Policy**: Flexible, Moderate, Strict
4. **Price Range**: Min/Max sliders
5. **Minimum Reviews**: Filter by popularity
6. **Instant Bookable**: Yes/No filter

### Data Cleaning Process
- ✅ Price validation (removes $0, negative, >$10,000)
- ✅ Coordinate validation (valid lat/long)
- ✅ Missing value handling
- ✅ Type conversions and standardization
- ✅ Calculated fields generation

## 🔧 Development

### Local Development
```bash
# Backend
cd backend
python app.py

# Frontend
npm run dev
```

### Build for Production
```bash
npm run build
```

### Environment Variables

**Backend (.env)**
```
FLASK_ENV=production
FLASK_DEBUG=False
CORS_ORIGINS=http://localhost:5173
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```

## 📊 Dataset

- **Source**: Airbnb Open Data (NYC)
- **Records**: 102,599 listings
- **Columns**: 26 fields including price, location, reviews, host info, availability
- **Coverage**: All 5 NYC boroughs (Manhattan, Brooklyn, Queens, Bronx, Staten Island)
- **Time Period**: Multi-year dataset with construction years from 2003-2022
- **File Size**: ~25 MB

## 🏗️ Architecture

### Backend
- RESTful API built with Flask
- Pandas-based data processing pipeline
- Serverless deployment on Vercel
- CSV data loaded on cold start (~2-3s)
- Efficient filtering with query parameters

### Frontend
- Single Page Application (SPA) with React
- Vite for fast builds and HMR
- Component-based architecture
- Real-time state management
- Responsive CSS Grid/Flexbox layout

### Data Flow
```
CSV File → Pandas DataFrame → Data Cleaning → Calculated Fields
    ↓
Flask API Endpoints → JSON Response
    ↓
React Frontend → Recharts/Leaflet → Interactive Dashboard
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Hafiz M Hussain**
- GitHub: [@HafizMHussain](https://github.com/HafizMHussain)
- Repository: [Airbnb-Data-Dashboard](https://github.com/HafizMHussain/Airbnb-Data-Dashboard)

## 🙏 Acknowledgments

- Airbnb for providing the open dataset
- OpenStreetMap contributors for map tiles
- The open-source community for amazing libraries

## 📸 Screenshots

### Dashboard Overview
*Full dashboard with KPI cards, charts, and interactive map*

### Interactive Map with Filters
*Leaflet map showing 2,000+ listings color-coded by price range*

### Price Analytics
*Price distribution histogram and trends over construction years*

---

## 🛣️ Roadmap

- [ ] Add date range filters
- [ ] Implement user authentication
- [ ] Add favorite listings feature
- [ ] Export data to CSV/PDF
- [ ] Add comparison mode
- [ ] Mobile app version

---

⭐ **Star this repository if you find it helpful!**

📧 **Questions?** Open an issue or reach out!

---

**Made with ❤️ by Hafiz M Hussain**
