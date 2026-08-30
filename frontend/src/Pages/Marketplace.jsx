import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FiSearch, FiChevronDown, FiMapPin, FiRotateCcw } from 'react-icons/fi';
import HarvestCard from '../Components/HarvestCard';
import Nav from "../Components/Nav";
import Footer from "../Pages/Landing/Components/Footer";

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

  // Get Advertisement from Backend
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
    <div className="min-h-screen flex flex-col bg-gray-50/60 w-full overflow-x-hidden">
      {/* Full-width Nav Header */}
      <header className="w-full">
        <Nav />
      </header>

      {/* Main Full-Width Content Container */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 2xl:px-16 py-8 sm:py-10">
        
        {/* Top Search & Filter Bar */}
        <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6 mb-10 space-y-4">
          
          {/* Main Search Input */}
          <div className="relative w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              placeholder="Search vegetables, fruits, or grains..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm sm:text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition"
            />
          </div>

          {/* Filter Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-center">
            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 hover:border-gray-300 px-4 py-3 pr-9 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
            </div>

            {/* Quantity Slider */}
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex flex-col justify-center">
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tight">
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
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 mt-1.5"
              />
            </div>

            {/* Price Slider */}
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex flex-col justify-center">
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tight">
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
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 mt-1.5"
              />
            </div>

            {/* District Dropdown */}
            <div className="relative">
              <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 hover:border-gray-300 pl-9 pr-9 py-3 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition"
              >
                {SRI_LANKA_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold tracking-wide transition shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                title="Reset Filters"
                className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm transition cursor-pointer"
              >
                <FiRotateCcw className="text-base" />
              </button>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Active Listings
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
            Showing {filteredListings.length} fresh products near you
          </p>
        </div>

        {/* Dynamic Card Grid or Empty State */}
        {loading ? (
          <div className="py-24 text-center text-gray-500 text-base sm:text-lg font-medium">
            Loading harvest listings from database...
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 sm:p-16 text-center my-8 shadow-sm max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl font-bold text-gray-800">
              No harvest listings match your filter criteria.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your keyword, district, or range sliders.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-7">
            {filteredListings.map((item) => (
              <HarvestCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </main>

      {/* Full-width Footer */}
      <footer className="w-full mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Marketplace;