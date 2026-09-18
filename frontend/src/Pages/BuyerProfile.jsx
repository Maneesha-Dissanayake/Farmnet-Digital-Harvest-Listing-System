import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfileDrawer({ user, setUser, onClose, onLogout }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    contactNumber: user?.contactNumber || '',
    profileImage: user?.profileImage || '',
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Fetch live user details directly from database via /api/auth/me
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.user) {
          const u = res.data.user;
          setFormData({
            username: u.username || '',
            email: u.email || '',
            contactNumber: u.contactNumber || '',
            profileImage: u.profileImage || '',
          });
          setUser(u);
          localStorage.setItem('user', JSON.stringify(u));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Direct upload to Cloudinary
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="absolute right-6 top-20 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-6 flex flex-col font-sans animate-fadeIn">
      {/* Top Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-800">My Profile</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
        >
          ✕
        </button>
      </div>

      {message.text && (
        <div
          className={`mt-3 p-2 text-xs rounded-lg text-center ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading details...</div>
      ) : (
      /* Form Area */
      <form onSubmit={handleSave} className="space-y-4 mt-4">
        {/* Avatar with Click-to-Edit Overlay */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-slate-100">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                (formData.fullName || formData.username || 'U')[0].toUpperCase()
              )}
            </div>

            <label
              htmlFor="avatar-input"
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {uploading ? '...' : 'Edit'}
            </label>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1 capitalize font-medium">
            {user?.role} Account
          </p>
        </div>

        {/* Input Fields */}

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="+94 7X XXX XXXX"
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {/* Log Out Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </form>
      )}
    </div>
  );
}