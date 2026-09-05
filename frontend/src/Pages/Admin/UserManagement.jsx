import React, { useState, useEffect } from 'react';
import Sidebar from './Components/AdminSidebar';
import { Search, Bell, Filter, Ban, Trash2, Lock, CheckCircle, ChevronDown } from 'lucide-react';

const UserManagement = () => {
  // State for managing user data, search input, and role filter
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Fetch initial data when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the backend with authorization headers
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      // Safely set the users state to prevent crashes
      setUsers(data.users || data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback to empty array on error
      setUsers([]); 
    }
  };

  // Handle administrative actions on users (block, unblock, delete)
  const handleUserAction = async (userId, action) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/admin/users/${userId}/${action}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });
      // Refresh user list dynamically after execution
      fetchUsers();
    } catch (error) {
      console.error(`Failed to execute ${action} on user:`, error);
    }
  };

  // Safely filter users based on role and search term
  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  }) : [];

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans">
      {/* Reusable Admin Sidebar */}
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header Section */}
        <header className="bg-white px-8 py-6 flex justify-between items-start border-b border-gray-100">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight">User management</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor and manage platform participants.</p>
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

        {/* Main Content Card Container */}
        <div className="p-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            
            {/* Filter and Count Bar */}
            <div className="p-5 flex justify-between items-center border-b border-gray-200 bg-white">
              <div className="relative">
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 px-4 py-2 pr-10 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                >
                  <option value="All">All roles</option>
                  <option value="Seller">Seller</option>
                  <option value="Buyer">Buyer</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {filteredUsers.length} users
              </span>
            </div>

            {/* Users Data Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">User</th>
                    <th className="px-6 py-3.5 font-semibold">Role</th>
                    <th className="px-6 py-3.5 font-semibold">Status</th>
                    <th className="px-6 py-3.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Safely map through filtered users */}
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50/80 transition-colors">
                        {/* User Info & Avatar */}
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-xs">
                            {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">{user.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                            user.role === 'Seller' ? 'bg-[#d1fae5] text-green-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>

                        {/* Status Indicator */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.status === 'Verified' ? 'bg-green-50 text-green-700' :
                            user.status === 'Blocked' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'Verified' ? 'bg-green-500' :
                              user.status === 'Blocked' ? 'bg-red-500' : 'bg-orange-500'
                            }`}></span>
                            {user.status}
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3 text-gray-400">
                            {user.status !== 'Blocked' ? (
                              <button 
                                onClick={() => handleUserAction(user._id, 'block')} 
                                className="hover:text-orange-500 transition-colors p-1"
                                title="Block User"
                              >
                                <Ban size={18} />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUserAction(user._id, 'unblock')} 
                                className="hover:text-green-600 transition-colors p-1"
                                title="Unblock User"
                              >
                                <Lock size={18} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleUserAction(user._id, 'delete')} 
                              className="hover:text-red-600 transition-colors p-1"
                              title="Delete User"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-gray-400 text-sm">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default UserManagement;