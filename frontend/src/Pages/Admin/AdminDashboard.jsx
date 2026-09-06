import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Components/AdminSidebar';
import { Search, Bell, Filter, Ban, Trash2, Lock, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  // State for storing dashboard statistics
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: '0',
    verifiedSellers: '0',
    registeredBuyers: '0',
    activeListings: '0'
  });
  
  // State for storing recent users and pending advertisements
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingAds, setPendingAds] = useState([]);

  // Filter States for User Moderation Table
  const [filterRole, setFilterRole] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch initial data when the component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // 1. Fetch Stats from Backend
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', { headers });
      const statsData = await statsRes.json();
      
      // Console log to verify what the backend is actually sending in your browser console
      console.log("Fetched stats data:", statsData);

      // Safely map backend response keys with flexible fallbacks
      setDashboardStats({
        totalUsers: statsData.totalUsers ?? statsData.totalCount ?? '0',
        verifiedSellers: statsData.verifiedSellers ?? statsData.sellersCount ?? statsData.verifiedCount ?? '0',
        registeredBuyers: statsData.registeredBuyers ?? statsData.buyersCount ?? '0',
        activeListings: statsData.activeListings ?? statsData.listingsCount ?? '0'
      });

      // 2. Fetch Recent Users from Backend
      const usersRes = await fetch('http://localhost:5000/api/admin/users', { headers });
      const usersData = await usersRes.json();
      console.log("Fetched users data:", usersData);
      setRecentUsers(usersData.users || usersData || []);

      // 3. Fetch Pending Ads from Backend
      const adsRes = await fetch('http://localhost:5000/api/admin/ads/pending', { headers });
      const adsData = await adsRes.json();
      setPendingAds(adsData.ads || adsData || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Handler for user management actions (block, unblock, delete)
  const handleUserAction = async (userId, action) => {
    try {
      await fetch(`http://localhost:5000/api/admin/users/${userId}/${action}`, { 
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      fetchDashboardData();
    } catch (error) {
      console.error(`Error executing ${action} on user:`, error);
    }
  };

  // Handler for ad moderation actions (approve, reject)
  const handleAdAction = async (adId, action) => {
    try {
      await fetch(`http://localhost:5000/api/admin/ads/${adId}/${action}`, { 
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json' 
        }
      });
      fetchDashboardData();
    } catch (error) {
      console.error(`Error executing ${action} on ad:`, error);
    }
  };

  // Filter Logic for Users Table
  const filteredUsers = Array.isArray(recentUsers) ? recentUsers.filter((user) => {
    if (filterRole === 'All') return true;
    return user.role?.toLowerCase() === filterRole.toLowerCase();
  }) : [];

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans">
      {/* Reusable Sidebar Component */}
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Header Section */}
        <header className="bg-white px-8 py-6 flex justify-between items-start border-b border-gray-100">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight">Admin Stewardship</h1>
            <p className="text-gray-500 text-sm mt-1">Real-time marketplace oversight and control center.</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="pl-10 pr-4 py-2 w-[300px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          
          {/* Top Statistics Cards */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Users</p>
              <h2 className="text-3xl font-bold text-green-700">{dashboardStats.totalUsers}</h2>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium">
                ↗ Analytics synced
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Verified Sellers</p>
              <h2 className="text-3xl font-bold text-gray-900">{dashboardStats.verifiedSellers}</h2>
              <p className="text-xs text-orange-500 mt-2 font-medium flex items-center gap-1">
                ⏱ Active sellers
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Registered Buyers</p>
              <h2 className="text-3xl font-bold text-gray-900">{dashboardStats.registeredBuyers}</h2>
              <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                🚀 Platform reach
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Active Listings</p>
              <h2 className="text-3xl font-bold text-green-700">{dashboardStats.activeListings}</h2>
              <p className="text-xs text-gray-400 mt-2 font-medium flex items-center gap-1">
                ⏱ Live on marketplace
              </p>
            </div>
          </div>

          {/* Main Dashboard Content Layout */}
          <div className="grid grid-cols-3 gap-6">
            
            {/* User Moderation Table Section */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="p-5 flex justify-between items-center border-b border-gray-200 relative">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">User Moderation</h3>
                  <p className="text-xs text-gray-500">Monitor and manage platform participants</p>
                </div>

                {/* Working Filter Button & Dropdown Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                  >
                    <Filter size={16} /> Filter: {filterRole}
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                      <button 
                        onClick={() => { setFilterRole('All'); setIsFilterOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        All Users
                      </button>
                      <button 
                        onClick={() => { setFilterRole('Seller'); setIsFilterOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Sellers
                      </button>
                      <button 
                        onClick={() => { setFilterRole('Buyer'); setIsFilterOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Buyers
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] text-gray-500 uppercase tracking-wider bg-gray-50/50 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3 font-semibold">User</th>
                      <th className="px-5 py-3 font-semibold">Role</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-semibold text-sm">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${user.role === 'Seller' ? 'bg-[#d1fae5] text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                              user.status === 'Verified' ? 'text-green-600' : 
                              user.status === 'Blocked' ? 'text-red-600' : 'text-orange-500'
                            }`}>
                              <CheckCircle size={14} className={user.status === 'Verified' ? 'block' : 'hidden'}/>
                              {user.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>}
                              {user.status === 'Blocked' && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                              {user.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-3 text-gray-400">
                              {user.status !== 'Blocked' ? (
                                <button onClick={() => handleUserAction(user._id, 'block')} className="hover:text-orange-500 transition-colors" title="Block User">
                                  <Ban size={18}/>
                                </button>
                              ) : (
                                <button onClick={() => handleUserAction(user._id, 'unblock')} className="hover:text-green-600 transition-colors" title="Unblock User">
                                  <Lock size={18}/>
                                </button>
                              )}
                              <button onClick={() => handleUserAction(user._id, 'delete')} className="hover:text-red-600 transition-colors" title="Delete User">
                                <Trash2 size={18}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-gray-400 text-sm">
                          No users found for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {recentUsers.length > 0 && (
                <div className="p-4 border-t border-gray-200 text-center">
                  <Link to="/admin/users" className="text-sm font-semibold text-green-700 hover:text-green-800">
                    View All Users
                  </Link>
                </div>
              )}
            </div>

            {/* Ad Moderation Queue Section */}
            <div className="col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[500px]">
              <div className="p-5 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg">Moderation Queue</h3>
                <p className="text-xs text-gray-500 mt-1">{pendingAds.length} Ads awaiting review</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {Array.isArray(pendingAds) && pendingAds.map((ad) => (
                  <div key={ad._id} className="border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <div className="flex gap-3 mb-3">
                      <img src={ad.imageUrl || 'https://via.placeholder.com/60'} alt={ad.title} className="w-14 h-14 rounded-md object-cover bg-gray-100" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{ad.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">Listed by: {ad.sellerName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAdAction(ad._id, 'approve')}
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white py-1.5 rounded-md text-xs font-semibold transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleAdAction(ad._id, 'reject')}
                        className="flex-1 border border-red-500 text-red-600 hover:bg-red-50 py-1.5 rounded-md text-xs font-semibold transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {pendingAds.length > 0 && (
                <div className="p-4 border-t border-gray-200 text-center">
                  <Link to="/admin/ads" className="text-sm font-semibold text-green-700 hover:text-green-800">
                    View Queue Details
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Copyright/Footer Info */}
          <div className="pt-6 text-center text-[11px] text-gray-400 font-medium">
            © 2026 FarmNet Agricultural Marketplace. Internal Administrative Use Only. Version 4.2.0-Stewardship
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;