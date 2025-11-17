# 🚀 Quick Start Guide - Airbnb Dashboard

## ⚡ Installation (One-Time Setup)

### Windows (PowerShell)
```powershell
# Run the setup script
.\setup.ps1
```

OR manually:
```powershell
# Install backend
pip install -r requirements.txt

# Install frontend
npm install
```

## 🎯 Running the Dashboard

### Easy Start (Recommended)
```powershell
.\start.ps1
```

### Manual Start
**Terminal 1 - Backend:**
```powershell
python backend/app.py
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

**Open Browser:**
```
http://localhost:5173
```

## 📊 Dashboard Features at a Glance

### Charts Available
1. ✅ **KPI Cards** - Total listings, avg price, reviews, ratings
2. 📊 **Price Distribution** - Histogram of listing prices
3. 📈 **Price Trends** - Prices over construction years
4. 📊 **Room Type Comparison** - Compare different room types
5. 🗺️ **Interactive Map** - Geographic distribution of listings
6. 👥 **Top Hosts** - Hosts with most listings
7. 📍 **Neighbourhood Analysis** - Borough comparisons
8. 📋 **Cancellation Policies** - Policy distribution
9. 📅 **Availability Trends** - Availability patterns

### Filters Available
- Room Type (Entire home, Private room, Shared room)
- Borough (Manhattan, Brooklyn, Queens, etc.)
- Cancellation Policy (flexible, moderate, strict)
- Instant Bookable (Yes/No)
- Price Range (Min/Max)
- Minimum Reviews

## 🎨 Using the Dashboard

1. **Apply Filters** - Use sidebar to filter data
2. **View Charts** - All charts update automatically
3. **Hover for Details** - Hover over charts for tooltips
4. **Click Map Markers** - View listing details
5. **Reset Filters** - Click "Reset Filters" button

## 🔧 Troubleshooting

### Backend won't start
```powershell
# Check Python version (need 3.8+)
python --version

# Reinstall packages
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start
```powershell
# Check Node version (need 16+)
node --version

# Clear cache and reinstall
npm cache clean --force
npm install
```

### Can't connect to backend
- Ensure backend is running on port 5000
- Check `http://localhost:5000/api/health`
- Verify no firewall blocking

### Map not showing
- Check internet connection (needs OpenStreetMap)
- Open browser console (F12) for errors

## 📝 Port Configuration

| Service  | Port | URL |
|----------|------|-----|
| Backend  | 5000 | http://localhost:5000 |
| Frontend | 5173 | http://localhost:5173 |

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Start servers
3. ✅ Open browser
4. 📊 Explore the data!

## 📚 More Help

- Full documentation: `DOCUMENTATION.md`
- Main README: `README.md`
- Check browser console (F12) for errors
- Check terminal output for backend errors

---

**Happy Analyzing! 🎉**
