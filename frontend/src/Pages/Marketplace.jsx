import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HarvestCard from '../Components/HarvestCard';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch live advertisements directly from MongoDB backend
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/advertisement');
        if (response.data.success && Array.isArray(response.data.listings)) {
          setListings(response.data.listings);
        }
      } catch (error) {
        console.error('Failed to load advertisements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50/60 pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Active Listings</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Showing {listings.length} fresh products near you
          </p>
        </div>

        {/* Loading / Empty / Responsive Card Grid */}
        {loading ? (
          <div className="py-20 text-center text-gray-500 font-medium">
            Loading harvest listings from database...
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center my-8 shadow-xs">
            <p className="text-base font-semibold text-gray-800">No active harvest listings found.</p>
            <p className="text-xs text-gray-400 mt-1">Post a new advertisement to see it appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4.5">
            {listings.map((item) => (
              <HarvestCard key={item._id} item={item} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
};

export default Marketplace;