import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FiSearch, FiChevronDown, FiMapPin, FiRotateCcw } from 'react-icons/fi';
import HarvestCard from '../Components/HarvestCard';

const SRI_LANKA_DISTRICTS = [
  'Any District',
  'Anuradhapura',
  'Badulla',
  'Colombo',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kurunegala',
  'Matale',
  'Monaragala',
  'Nuwara Eliya',
  'Polonnaruwa'
];

const CATEGORIES = [
  'All Categories',
  'Vegetables',
  'Fruits',
  'Grains & Legumes',
  'Spices & Herbs'
];

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form input controls
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [district, setDistrict] = useState('Any District');
  const [maxQty, setMaxQty] = useState(5000);
  const [maxPrice, setMaxPrice] = useState(5000);

  // Active filters apply
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    category: 'All Categories',
    district: 'Any District',
    maxQty: 5000,
    maxPrice: 5000,
  });

  // Get Advertisetement from Backend
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/advertisement');
        if (response.data.success && Array.isArray(response.data.listings)) {
          setListings(response.data.listings);
        } else if (Array.isArray(response.data)) {
          setListings(response.data);
        }
      } catch (error) {
        try {
          const fallbackRes = await axios.get('http://localhost:5000/api/advertisements');
          if (fallbackRes.data.success && Array.isArray(fallbackRes.data.listings)) {
            setListings(fallbackRes.data.listings);
          }
        } catch (err) {
          console.error('Failed to load advertisements from backend:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  // Update active filters
  const handleApplyFilters = () => {
    setActiveFilters({
      search: search.trim().toLowerCase(),
      category,
      district,
      maxQty,
      maxPrice,
    });
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setSearch('');
    setCategory('All Categories');
    setDistrict('Any District');
    setMaxQty(5000);
    setMaxPrice(5000);
    setActiveFilters({
      search: '',
      category: 'All Categories',
      district: 'Any District',
      maxQty: 5000,
      maxPrice: 5000,
    });
  };

  // Filter listings based on active filter choices
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const q = activeFilters.search;
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.variety?.toLowerCase().includes(q);

      const matchesCategory =
        activeFilters.category === 'All Categories' ||
        item.category?.toLowerCase() === activeFilters.category.toLowerCase();

      const matchesDistrict =
        activeFilters.district === 'Any District' ||
        item.district?.toLowerCase() === activeFilters.district.toLowerCase();

      const itemQty = Number(item.quantity) || 0;
      const itemPrice = Number(item.pricePerUnit || item.price) || 0;
      const matchesQty = itemQty <= activeFilters.maxQty;
      const matchesPrice = itemPrice <= activeFilters.maxPrice;

      return matchesSearch && matchesCategory && matchesDistrict && matchesQty && matchesPrice;
    });
  }, [listings, activeFilters]);

  return (
    <main className="min-h-screen bg-gray-50/60 pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Search & Filter Bar */}
        <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-xs p-4 sm:p-5 mb-8 space-y-3.5">
          {/* Main Search Input */}
          <div className="relative w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              placeholder="Search vegetables, fruits, or grains..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition"
            />
          </div>

          {/* Filter Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 hover:border-gray-300 px-3.5 py-2.5 pr-8 rounded-xl text-xs font-semibold text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
            </div>

            {/* Quantity Slider */}
            <div className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 flex flex-col justify-center">
              <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                <span>Quantity</span>
                <span className="text-emerald-700 font-extrabold">Up to {maxQty} kg</span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={maxQty}
                onChange={(e) => setMaxQty(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 mt-1"
              />
            </div>

            {/* Price Slider */}
            <div className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 flex flex-col justify-center">
              <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                <span>Price Range</span>
                <span className="text-emerald-700 font-extrabold">Rs. {maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 mt-1"
              />
            </div>

            {/* District Dropdown */}
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 hover:border-gray-300 pl-8 pr-8 py-2.5 rounded-xl text-xs font-semibold text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition"
              >
                {SRI_LANKA_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                title="Reset Filters"
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs transition cursor-pointer"
              >
                <FiRotateCcw />
              </button>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Active Listings</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Showing {filteredListings.length} fresh products near you
          </p>
        </div>

        {/* Dynamic Card Grid or Empty State */}
        {loading ? (
          <div className="py-20 text-center text-gray-500 font-medium">
            Loading harvest listings from database...
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center my-8 shadow-xs">
            <p className="text-base font-semibold text-gray-800">No harvest listings match your filter criteria.</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your keyword, district, or range sliders.</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4.5">
            {filteredListings.map((item) => (
              <HarvestCard key={item._id} item={item} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
};

export default Marketplace;