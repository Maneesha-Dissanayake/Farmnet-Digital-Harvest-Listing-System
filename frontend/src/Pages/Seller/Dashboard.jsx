import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import Sidebar from './Components/Sidebar';

function Dashboard() {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only this seller's advertisements from the backend
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/advertisement/my-ads', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && Array.isArray(response.data.myListings)) {
          setMyListings(response.data.myListings);
        }
      } catch (error) {
        // Fallback for plural route setup
        try {
          const token = localStorage.getItem('token');
          const fallbackRes = await axios.get('http://localhost:5000/api/advertisements/my-ads', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (fallbackRes.data.success && Array.isArray(fallbackRes.data.myListings)) {
            setMyListings(fallbackRes.data.myListings);
          }
        } catch (err) {
          console.error('Failed to load seller listings:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  // Delete an advertisement with SweetAlert2 confirmation
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
        const res = await axios.delete(`http://localhost:5000/api/advertisement/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200 || res.data.success) {
          setMyListings((prev) => prev.filter((ad) => ad._id !== id));
          Swal.fire({
            title: 'Deleted!',
            text: 'Your advertisement has been deleted.',
            icon: 'success',
            confirmButtonColor: '#059669',
          });
        }
      } catch (error) {
        // Plural fallback check
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/api/advertisements/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMyListings((prev) => prev.filter((ad) => ad._id !== id));
          Swal.fire({
            title: 'Deleted!',
            text: 'Your advertisement has been deleted.',
            icon: 'success',
            confirmButtonColor: '#059669',
          });
        } catch (err) {
          console.error('Failed to delete ad:', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete advertisement.',
            icon: 'error',
            confirmButtonColor: '#059669',
          });
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans w-full">
      {/* Reusable Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full overflow-hidden">
        <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
          
          {/* Header Title Only */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Seller Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your produce, chats, and marketplace performance.
            </p>
          </div>

          {/* My Listings Table Feature */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm w-full overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">My Listings</h2>
            </div>

            {/* Fully Responsive Desktop & Tablet Table Wrapper */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Crop Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (LKR)</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right pr-10">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-sm text-gray-500">
                        Loading your listings from database...
                      </td>
                    </tr>
                  ) : myListings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-sm text-gray-500">
                        You have not posted any harvest listings yet.
                      </td>
                    </tr>
                  ) : (
                    myListings.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/60 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                              <img 
                                src={item.images?.[0] || 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=150&q=80'} 
                                alt={item.title} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{item.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Ref: #{item._id.slice(-6).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 font-medium">
                            {item.quantity} {item.unit || 'Kg'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                            Rs. {item.pricePerUnit || item.price}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                            item.status === 'Live' || item.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {item.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right pr-8">
                          <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition">
                            <button 
                              type="button" 
                              aria-label="Edit Listing" 
                              className="p-2 text-gray-400 hover:text-emerald-600 transition rounded-lg hover:bg-emerald-50 cursor-pointer"
                            >
                              <FiEdit2 className="text-base" />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleDelete(item._id)}
                              aria-label="Delete Listing" 
                              className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-red-50 cursor-pointer"
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

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-1.5">
                <button className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition cursor-pointer">
                  Previous
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-md bg-[#6b5835] text-white text-xs font-bold shadow-sm">
                  1
                </button>
                <button className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition cursor-pointer">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                <span>Total Items: {myListings.length}</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;