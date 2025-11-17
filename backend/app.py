"""
Flask Backend API for Airbnb Dashboard
Provides REST endpoints for dashboard data
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

from data_processor import AirbnbDataProcessor

app = Flask(__name__)

# Configure CORS - allow requests from frontend
cors_origins = os.getenv('CORS_ORIGINS', '*')
if cors_origins and cors_origins != '*':
    cors_origins = [origin.strip() for origin in cors_origins.split(',')]
else:
    cors_origins = '*'
CORS(app, origins=cors_origins, supports_credentials=True)

# Initialize data processor
DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'Airbnb_Open_Data.csv')
processor = AirbnbDataProcessor(DATA_PATH)

# Load and process data on startup
print("Loading data...")
processor.load_data()
print("Cleaning data...")
processor.clean_data()
print("Creating calculated fields...")
processor.create_calculated_fields()
if processor.df_clean is not None:
    print(f"Data loaded: {len(processor.df_clean)} listings")
else:
    print("Error: Data loading failed")


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    record_count = len(processor.df_clean) if processor.df_clean is not None else 0
    return jsonify({
        'status': 'ok',
        'message': 'Airbnb Dashboard API is running',
        'records': record_count
    })


@app.route('/api/summary', methods=['GET'])
def get_summary():
    """Get summary statistics / KPIs"""
    try:
        # Apply filters if provided
        filters = request.args.to_dict()
        if filters:
            filtered_processor = processor.apply_filters(filters)
            summary = filtered_processor.get_summary_stats()
        else:
            summary = processor.get_summary_stats()
        
        return jsonify(summary)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/price-distribution', methods=['GET'])
def get_price_distribution():
    """Get price distribution data for histogram"""
    try:
        bins = int(request.args.get('bins', 30))
        filters = request.args.to_dict()
        filters.pop('bins', None)
        
        if filters:
            filtered_processor = processor.apply_filters(filters)
            data = filtered_processor.get_price_distribution(bins)
        else:
            data = processor.get_price_distribution(bins)
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/price-trends', methods=['GET'])
def get_price_trends():
    """Get price trends over time (by construction year)"""
    try:
        filters = request.args.to_dict()
        
        if filters:
            filtered_processor = processor.apply_filters(filters)
            data = filtered_processor.get_price_trends_by_construction_year()
        else:
            data = processor.get_price_trends_by_construction_year()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/room-types', methods=['GET'])
def get_room_types():
    """Get room type comparison data"""
    try:
        filters = request.args.to_dict()
        
        if filters:
            filtered_processor = processor.apply_filters(filters)
            data = filtered_processor.get_room_type_comparison()
        else:
            data = processor.get_room_type_comparison()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/map-data', methods=['GET'])
def get_map_data():
    """Get location data for map visualization"""
    try:
        limit = int(request.args.get('limit', 5000))
        filters = request.args.to_dict()
        filters.pop('limit', None)
        
        if filters:
            filtered_processor = processor.apply_filters(filters)
            data = filtered_processor.get_map_data(limit)
        else:
            data = processor.get_map_data(limit)
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/top-hosts', methods=['GET'])
def get_top_hosts():
    """Get top hosts by listing count"""
    try:
        limit = int(request.args.get('limit', 10))
        filters = request.args.to_dict()
        filters.pop('limit', None)
        
        if filters:
            filtered_processor = processor.apply_filters(filters)
            data = filtered_processor.get_top_hosts(limit)
        else:
            data = processor.get_top_hosts(limit)
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/neighbourhoods', methods=['GET'])
def get_neighbourhoods():
    """Get neighbourhood analysis"""
    try:
        limit = int(request.args.get('limit', 15))
        filters = request.args.to_dict()
        filters.pop('limit', None)
        
        if filters:
            filtered_processor = processor.apply_filters(filters)
            data = filtered_processor.get_neighbourhood_analysis(limit)
        else:
            data = processor.get_neighbourhood_analysis(limit)
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/cancellation-policies', methods=['GET'])
def get_cancellation_policies():
    """Get cancellation policy distribution"""
    try:
        filters = request.args.to_dict()
        
        if filters:
            filtered_processor = processor.apply_filters(filters)
            data = filtered_processor.get_cancellation_policy_distribution()
        else:
            data = processor.get_cancellation_policy_distribution()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/price-categories', methods=['GET'])
def get_price_categories():
    """Get price distribution by category"""
    try:
        filters = request.args.to_dict()
        
        if filters:
            filtered_processor = processor.apply_filters(filters)
            data = filtered_processor.get_price_by_category()
        else:
            data = processor.get_price_by_category()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/availability-trends', methods=['GET'])
def get_availability_trends():
    """Get availability trends"""
    try:
        filters = request.args.to_dict()
        
        if filters:
            filtered_processor = processor.apply_filters(filters)
            data = filtered_processor.get_availability_trends()
        else:
            data = processor.get_availability_trends()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/filter-options', methods=['GET'])
def get_filter_options():
    """Get available filter options"""
    try:
        options = processor.get_filter_options()
        return jsonify(options)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Airbnb Dashboard API Server")
    print("="*50)
    record_count = len(processor.df_clean) if processor.df_clean is not None else 0
    print(f"📊 Loaded {record_count} listings")
    print("🌐 Server running on http://localhost:5000")
    print("="*50 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
