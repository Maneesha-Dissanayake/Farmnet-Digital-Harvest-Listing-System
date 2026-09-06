import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiEdit2, FiTrash2, FiSearch, FiList, FiMessageSquare, FiStar } from 'react-icons/fi';
import Sidebar from './Components/Sidebar';

function Dashboard() {
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch only this seller's advertisements
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const token = localStorage.getItem('token');
        let response;
        try {
          response = await axios.get('http://localhost:5000/api/advertisements/my-ads', {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          response = await axios.get('http://localhost:5000/api/advertisement/my-ads', {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        if (response.data?.success && Array.isArray(response.data.myListings)) {
          setMyListings(response.data.myListings);
        }
      } catch (error) {
        console.error('Failed to load seller listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  // Delete advertisement
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this advertisement!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        let res;
        try {
          res = await axios.delete(`http://localhost:5000/api/advertisements/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          res = await axios.delete(`http://localhost:5000/api/advertisement/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        if (res.status === 200 || res.data?.success) {
          setMyListings((prev) => prev.filter((ad) => ad._id !== id));
          Swal.fire({
            title: 'Deleted!',
            text: 'Your advertisement has been deleted.',
            icon: 'success',
            confirmButtonColor: '#059669',
          });
        }
      } catch (error) {
        console.error('Failed to delete ad:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete advertisement.',
          icon: 'error',
          confirmButtonColor: '#059669',
        });
      }
    }
  };

  const filteredListings = myListings.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans w-full">
      <Sidebar />

      <main className="flex-1 flex flex-col w-full overflow-hidden">
        <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Seller Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your produce, chats, and marketplace performance.
              </p>
            </div>

            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listing..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
              />
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <FiList className="text-emerald-600 text-xl" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Total Listings</p>
                <h2 className="text-2xl font-black text-gray-900">{myListings.length}</h2>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <FiMessageSquare className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Chats</p>
                <h2 className="text-2xl font-black text-gray-900">Active</h2>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <FiStar className="text-emerald-600 text-xl" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Rating</p>
                <h2 className="text-2xl font-black text-gray-900">4.9 / 5.0</h2>
              </div>
            </div>
          </div>

          {/* Listings Table */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm w-full overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">My Listings</h2>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Crop Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right pr-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                        Loading your listings...
                      </td>
                    </tr>
                  ) : filteredListings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                        No advertisements found.
                      </td>
                    </tr>
                  ) : (
                    filteredListings.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                        <td
                          className="px-6 py-4 cursor-pointer"
                          onClick={() => navigate(`/listings/${item._id}`)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                              <img
                                src={item.images?.[0] || 'https://via.placeholder.com/150'}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{item.title}</p>
                              <p className="text-xs text-gray-400">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                          {item.quantity} {item.unit || 'kg'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                          Rs. {item.pricePerUnit || item.price}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              item.status === 'active' || item.status === 'Live'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right pr-8">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => navigate(`/post-advertisement?edit=${item._id}`)}
                              className="p-2 text-gray-400 hover:text-emerald-600 transition rounded-lg hover:bg-emerald-50"
                            >
                              <FiEdit2 className="text-base" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                            >
                              <FiTrash2 className="text-base" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;