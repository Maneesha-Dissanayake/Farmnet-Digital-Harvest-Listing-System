import React, { useState, useEffect } from 'react';
import Sidebar from './Components/AdminSidebar';
import { Search, Bell } from 'lucide-react';

const Analytics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // State to hold dynamically fetched analytics data
  const [stats, setStats] = useState({
    users: { sellers: 0, buyers: 0 },
    categories: [] // This will dynamically hold all categories from the database
  });

  // Fetch analytics data on component mount
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Adjust this URL to match your backend analytics endpoint
      const response = await fetch('http://localhost:5000/api/admin/analytics');
      const data = await response.json();
      
      // Expected backend response structure:
      // {
      //   users: { sellers: 3, buyers: 2 },
      //   categories: [ { name: 'Vegetables', count: 128 }, { name: 'Fruits', count: 64 }, ... ]
      // }
      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  // Calculations for dynamic progress bars
  const totalUsers = stats.users.sellers + stats.users.buyers || 1; // Fallback to 1 to prevent division by zero
  
  // Find the maximum category count to scale the category progress bars correctly
  const maxCategoryCount = stats.categories.length > 0 
    ? Math.max(...stats.categories.map(cat => cat.count)) 
    : 1;

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans">
      {/* Reusable Admin Sidebar */}
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header Section */}
        <header className="bg-white px-8 py-6 flex justify-between items-start border-b border-gray-100">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight">Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">Platform activity at a glance.</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Global search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-[300px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Main Content Container - Grid Layout */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card 1: Users by role */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
              <h3 className="text-sm font-bold text-gray-900 mb-6">Users by role</h3>
              
              <div className="space-y-4">
                {/* Sellers Row */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500 w-16">Sellers</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(stats.users.sellers / totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-6 text-right">
                    {stats.users.sellers}
                  </span>
                </div>

                {/* Buyers Row */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500 w-16">Buyers</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(stats.users.buyers / totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-6 text-right">
                    {stats.users.buyers}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Listings by category (Fully Dynamic) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
              <h3 className="text-sm font-bold text-gray-900 mb-6">Listings by category</h3>
              
              <div className="space-y-4">
                {stats.categories.length > 0 ? (
                  stats.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                      {/* Dynamic Category Name */}
                      <span className="text-sm text-gray-500 w-28 truncate" title={category.name}>
                        {category.name}
                      </span>
                      
                      {/* Dynamic Progress Bar */}
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(category.count / maxCategoryCount) * 100}%` }}
                        ></div>
                      </div>
                      
                      {/* Dynamic Count */}
                      <span className="text-sm font-medium text-gray-700 w-8 text-right">
                        {category.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No categories data available.</p>
                )}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default Analytics;