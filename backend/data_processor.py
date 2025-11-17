"""
Data Processor for Airbnb Dataset
Handles data cleaning, preparation, and calculated fields
"""

import pandas as pd
import numpy as np
from datetime import datetime
import re


class AirbnbDataProcessor:
    def __init__(self, csv_path):
        """Initialize with CSV file path"""
        self.csv_path = csv_path
        self.df: pd.DataFrame | None = None
        self.df_clean: pd.DataFrame | None = None
        
    def load_data(self):
        """Load CSV data"""
        self.df = pd.read_csv(self.csv_path)
        return self.df
    
    def clean_price(self, price_str):
        """Clean price string to float"""
        if pd.isna(price_str):
            return np.nan
        if isinstance(price_str, (int, float)):
            return float(price_str)
        # Remove $ and commas, strip whitespace
        cleaned = str(price_str).replace('$', '').replace(',', '').strip()
        try:
            return float(cleaned)
        except:
            return np.nan
    
    def clean_data(self):
        """Clean and prepare the dataset"""
        if self.df is None:
            raise ValueError("Data not loaded. Call load_data() first.")
        df = self.df.copy()
        
        # 1. Clean price and service fee columns
        df['price_clean'] = df['price'].apply(self.clean_price)
        df['service_fee_clean'] = df['service fee'].apply(self.clean_price)
        
        # 2. Filter out invalid records
        df = df[df['price_clean'].notna()]  # Remove listings without price
        df = df[df['price_clean'] > 0]  # Remove zero/negative prices
        df = df[df['price_clean'] < 10000]  # Remove unrealistic prices
        
        # 3. Clean host verification
        df['host_verified'] = df['host_identity_verified'].fillna('unconfirmed')
        
        # 4. Clean room type
        df['room_type_clean'] = df['room type'].fillna('Unknown')
        
        # 5. Clean neighborhood data
        df['neighbourhood_group_clean'] = df['neighbourhood group'].fillna('Unknown')
        df['neighbourhood_clean'] = df['neighbourhood'].fillna('Unknown')
        
        # 6. Convert dates
        df['last_review_date'] = pd.to_datetime(df['last review'], errors='coerce')
        df['construction_year_clean'] = pd.to_numeric(df['Construction year'], errors='coerce')
        
        # 7. Clean numeric fields
        df['minimum_nights_clean'] = pd.to_numeric(df['minimum nights'], errors='coerce').fillna(1)
        df['number_of_reviews_clean'] = pd.to_numeric(df['number of reviews'], errors='coerce').fillna(0)
        df['reviews_per_month_clean'] = pd.to_numeric(df['reviews per month'], errors='coerce').fillna(0)
        df['review_rate_clean'] = pd.to_numeric(df['review rate number'], errors='coerce')
        df['availability_365_clean'] = pd.to_numeric(df['availability 365'], errors='coerce').fillna(0)
        df['calculated_host_listings_clean'] = pd.to_numeric(df['calculated host listings count'], errors='coerce').fillna(1)
        
        # 8. Clean location data
        df['lat_clean'] = pd.to_numeric(df['lat'], errors='coerce')
        df['long_clean'] = pd.to_numeric(df['long'], errors='coerce')
        df = df[df['lat_clean'].notna() & df['long_clean'].notna()]
        
        # 9. Clean cancellation policy
        df['cancellation_policy_clean'] = df['cancellation_policy'].fillna('unknown')
        
        # 10. Clean instant bookable
        df['instant_bookable_clean'] = df['instant_bookable'].map({True: 'Yes', False: 'No', 'TRUE': 'Yes', 'FALSE': 'No'}).fillna('No')
        
        self.df_clean = df
        return df
    
    def create_calculated_fields(self):
        """Create calculated fields for analysis"""
        if self.df_clean is None:
            raise ValueError("Data not cleaned. Call clean_data() first.")
        df = self.df_clean.copy()
        
        # 1. Price per night (already cleaned)
        df['price_per_night'] = df['price_clean']
        
        # 2. Total price (price + service fee)
        df['total_price'] = df['price_clean'] + df['service_fee_clean'].fillna(0)
        
        # 3. Occupancy rate (based on availability)
        df['occupancy_rate'] = ((365 - df['availability_365_clean']) / 365 * 100).round(2)
        
        # 4. Review rate category
        def categorize_rating(rating):
            if pd.isna(rating):
                return 'No Rating'
            elif rating >= 4.5:
                return 'Excellent (4.5+)'
            elif rating >= 4.0:
                return 'Good (4.0-4.5)'
            elif rating >= 3.0:
                return 'Fair (3.0-4.0)'
            else:
                return 'Poor (<3.0)'
        
        df['rating_category'] = df['review_rate_clean'].apply(categorize_rating)
        
        # 5. Price category
        def categorize_price(price):
            if price < 100:
                return 'Budget (<$100)'
            elif price < 200:
                return 'Mid-range ($100-$200)'
            elif price < 500:
                return 'Premium ($200-$500)'
            else:
                return 'Luxury ($500+)'
        
        df['price_category'] = df['price_clean'].apply(categorize_price)
        
        # 6. Listing age (years since construction)
        current_year = datetime.now().year
        df['listing_age'] = current_year - df['construction_year_clean']
        df['listing_age'] = df['listing_age'].apply(lambda x: x if 0 <= x <= 100 else np.nan)
        
        # 7. Review frequency category
        def categorize_review_freq(freq):
            if pd.isna(freq) or freq == 0:
                return 'No Reviews'
            elif freq < 0.5:
                return 'Low (<0.5/month)'
            elif freq < 1.5:
                return 'Medium (0.5-1.5/month)'
            else:
                return 'High (>1.5/month)'
        
        df['review_frequency_category'] = df['reviews_per_month_clean'].apply(categorize_review_freq)
        
        # 8. Host activity level
        def categorize_host_activity(listings_count):
            if listings_count == 1:
                return 'Single Listing'
            elif listings_count <= 3:
                return 'Small Host (2-3)'
            elif listings_count <= 10:
                return 'Medium Host (4-10)'
            else:
                return 'Large Host (10+)'
        
        df['host_activity_level'] = df['calculated_host_listings_clean'].apply(categorize_host_activity)
        
        # 9. Has reviews flag
        df['has_reviews'] = df['number_of_reviews_clean'] > 0
        
        # 10. Recent activity (reviewed in last year)
        current_date = pd.Timestamp.now()
        df['days_since_review'] = (df['last_review_date'].apply(lambda x: (current_date - x).days if pd.notna(x) else None))
        df['recently_active'] = df['days_since_review'] < 365
        
        self.df_clean = df
        return df
    
    def get_summary_stats(self):
        """Get summary statistics for KPIs"""
        if self.df_clean is None:
            raise ValueError("Data not available. Process data first.")
        df = self.df_clean
        
        return {
            'total_listings': int(len(df)),
            'average_price': float(round(df['price_clean'].mean(), 2)),
            'median_price': float(df['price_clean'].median()),
            'total_reviews': int(df['number_of_reviews_clean'].sum()),
            'average_rating': float(round(df['review_rate_clean'].mean(), 2)),
            'average_availability': float(round(df['availability_365_clean'].mean(), 2)),
            'average_occupancy_rate': float(round(df['occupancy_rate'].mean(), 2)),
            'total_hosts': int(df['host id'].nunique()),
            'verified_hosts': int(df[df['host_verified'] == 'verified']['host id'].nunique()),
        }
    
    def get_price_distribution(self, bins=30):
        """Get price distribution for histogram"""
        if self.df_clean is None:
            raise ValueError("Data not available. Process data first.")
        df = self.df_clean
        hist, edges = np.histogram(df['price_clean'].dropna(), bins=bins)
        
        return {
            'bins': [f"${int(edges[i])}-${int(edges[i+1])}" for i in range(len(edges)-1)],
            'counts': hist.tolist(),
            'bin_edges': edges.tolist()
        }
    
    def get_price_trends_by_construction_year(self):
        """Get average price by construction year"""
        if self.df_clean is None:
            raise ValueError("Data not available. Process data first.")
        df = self.df_clean
        trends = df.groupby('construction_year_clean')['price_clean'].agg(['mean', 'count']).reset_index()
        trends = trends[trends['count'] >= 3]  # Only years with 3+ listings
        trends = trends.sort_values('construction_year_clean')
        
        return {
            'years': trends['construction_year_clean'].astype(int).tolist(),
            'avg_prices': trends['mean'].round(2).tolist(),
            'counts': trends['count'].tolist()
        }
    
    def get_room_type_comparison(self):
        """Get room type statistics"""
        if self.df_clean is None:
            raise ValueError("Data not available. Process data first.")
        df = self.df_clean
        room_stats = df.groupby('room_type_clean').agg({
            'id': 'count',
            'price_clean': 'mean',
            'number_of_reviews_clean': 'sum',
            'review_rate_clean': 'mean',
            'availability_365_clean': 'mean'
        }).reset_index()
        
        room_stats.columns = ['room_type', 'count', 'avg_price', 'total_reviews', 'avg_rating', 'avg_availability']
        room_stats = room_stats.sort_values('count', ascending=False)
        
        return room_stats.to_dict('records')
    
    def get_map_data(self, limit=5000):
        """Get location data for map (limited for performance)"""
        if self.df_clean is None:
            raise ValueError("Data not available. Process data first.")
        df = self.df_clean
        
        # Don't sample if already filtered to reasonable size
        if len(df) > limit:
            df_sample = df.sample(n=min(limit, len(df)), random_state=42)
        else:
            df_sample = df
        
        # Ensure we have valid data
        if len(df_sample) == 0:
            return []
        
        map_data = df_sample[['id', 'NAME', 'lat_clean', 'long_clean', 'price_clean', 
                                'room_type_clean', 'neighbourhood_group_clean', 
                                'neighbourhood_clean', 'review_rate_clean']].copy()
        map_data.columns = ['id', 'name', 'lat', 'lng', 'price', 'room_type', 
                           'borough', 'neighbourhood', 'rating']
        
        # Convert to records and clean NaN values
        records = []
        for _, row in map_data.iterrows():
            record = {
                'id': int(row['id']),
                'name': str(row['name']) if pd.notna(row['name']) else 'Unknown',
                'lat': float(row['lat']),
                'lng': float(row['lng']),
                'price': float(row['price']),
                'room_type': str(row['room_type']) if pd.notna(row['room_type']) else 'Unknown',
                'borough': str(row['borough']) if pd.notna(row['borough']) else 'Unknown',
                'neighbourhood': str(row['neighbourhood']) if pd.notna(row['neighbourhood']) else 'Unknown',
                'rating': float(row['rating']) if pd.notna(row['rating']) else None
            }
            records.append(record)
        
        return records
    
    def get_top_hosts(self, limit=10):
        """Get top hosts by listing count and average rating"""
        if self.df_clean is None:
            raise ValueError("Data not available. Process data first.")
        df = self.df_clean
        
        host_stats = df.groupby(['host id', 'host name']).agg({
            'id': 'count',
            'review_rate_clean': 'mean',
            'price_clean': 'mean',
            'number_of_reviews_clean': 'sum'
        }).reset_index()
        
        host_stats.columns = ['host_id', 'host_name', 'listing_count', 'avg_rating', 'avg_price', 'total_reviews']
        host_stats = host_stats.sort_values('listing_count', ascending=False).head(limit)
        
        return host_stats.to_dict('records')
    
    def get_neighbourhood_analysis(self, limit=15):
        """Get neighbourhood statistics"""
        if self.df_clean is None:
            raise ValueError("Data not available. Process data first.")
        df = self.df_clean
        
        neighbourhood_stats = df.groupby('neighbourhood_group_clean').agg({
            'id': 'count',
            'price_clean': 'mean',
            'number_of_reviews_clean': 'sum',
            'availability_365_clean': 'mean'
        }).reset_index()
        
        neighbourhood_stats.columns = ['borough', 'listing_count', 'avg_price', 'total_reviews', 'avg_availability']
        neighbourhood_stats = neighbourhood_stats.sort_values('listing_count', ascending=False).head(limit)
        
        return neighbourhood_stats.to_dict('records')
    
    def get_cancellation_policy_distribution(self):
        """Get cancellation policy distribution"""
        if self.df_clean is None:
            raise ValueError("Data not available. Process data first.")
        df = self.df_clean
        
        policy_dist = df.groupby('cancellation_policy_clean').agg({
            'id': 'count',
            'price_clean': 'mean'
        }).reset_index()
        
        policy_dist.columns = ['policy', 'count', 'avg_price']
        policy_dist = policy_dist.sort_values('count', ascending=False)
        
        return policy_dist.to_dict('records')
    
    def get_price_by_category(self):
        """Get price distribution by category"""
        if self.df_clean is None:
            raise ValueError("Data not available. Process data first.")
        df = self.df_clean
        
        price_cat = df['price_category'].value_counts().reset_index()
        price_cat.columns = ['category', 'count']
        
        # Order categories logically
        category_order = ['Budget (<$100)', 'Mid-range ($100-$200)', 'Premium ($200-$500)', 'Luxury ($500+)']
        price_cat['category'] = pd.Categorical(price_cat['category'], categories=category_order, ordered=True)
        price_cat = price_cat.sort_values('category')
        
        return price_cat.to_dict('records')
    
    def get_availability_trends(self):
        """Get availability statistics"""
        if self.df_clean is None:
            raise ValueError("Data not available. Process data first.")
        df = self.df_clean
        
        # Create availability bins
        bins = [0, 30, 90, 180, 270, 365]
        labels = ['0-30 days', '31-90 days', '91-180 days', '181-270 days', '271-365 days']
        
        df['availability_bin'] = pd.cut(df['availability_365_clean'], bins=bins, labels=labels, include_lowest=True)
        
        availability_dist = df.groupby('availability_bin', observed=True).agg({
            'id': 'count',
            'price_clean': 'mean'
        }).reset_index()
        
        availability_dist.columns = ['availability_range', 'count', 'avg_price']
        
        return availability_dist.to_dict('records')
    
    def apply_filters(self, filters):
        """Apply filters to dataset"""
        if self.df_clean is None:
            raise ValueError("Data not available. Process data first.")
        df = self.df_clean.copy()
        
        if filters.get('room_type') and filters['room_type'] not in ['all', '', None]:
            df = df[df['room_type_clean'] == filters['room_type']]
        
        if filters.get('borough') and filters['borough'] not in ['all', '', None]:
            df = df[df['neighbourhood_group_clean'] == filters['borough']]
        
        if filters.get('cancellation_policy') and filters['cancellation_policy'] not in ['all', '', None]:
            df = df[df['cancellation_policy_clean'] == filters['cancellation_policy']]
        
        if filters.get('price_min') and filters['price_min'] not in ['', None]:
            try:
                df = df[df['price_clean'] >= float(filters['price_min'])]
            except (ValueError, TypeError):
                pass
        
        if filters.get('price_max') and filters['price_max'] not in ['', None]:
            try:
                df = df[df['price_clean'] <= float(filters['price_max'])]
            except (ValueError, TypeError):
                pass
        
        if filters.get('min_reviews') and filters['min_reviews'] not in ['', None]:
            try:
                df = df[df['number_of_reviews_clean'] >= int(filters['min_reviews'])]
            except (ValueError, TypeError):
                pass
        
        if filters.get('instant_bookable') and filters['instant_bookable'] not in ['all', '', None]:
            df = df[df['instant_bookable_clean'] == filters['instant_bookable']]
        
        # Create temporary processor with filtered data
        temp_processor = AirbnbDataProcessor(self.csv_path)
        temp_processor.df_clean = df
        temp_processor.df = self.df  # Keep original data reference
        
        return temp_processor
    
    def get_filter_options(self):
        """Get available filter options"""
        if self.df_clean is None:
            raise ValueError("Data not available. Process data first.")
        df = self.df_clean
        
        return {
            'room_types': sorted(df['room_type_clean'].unique().tolist()),
            'boroughs': sorted(df['neighbourhood_group_clean'].unique().tolist()),
            'cancellation_policies': sorted(df['cancellation_policy_clean'].unique().tolist()),
            'price_range': {
                'min': float(df['price_clean'].min()),
                'max': float(df['price_clean'].max())
            }
        }
