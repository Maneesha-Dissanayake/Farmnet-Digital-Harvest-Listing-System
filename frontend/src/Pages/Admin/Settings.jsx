import React, { useState, useEffect } from 'react';
import Sidebar from './Components/AdminSidebar';
import { Search, Bell, KeyRound } from 'lucide-react';

const Settings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Profile States
  const [displayName, setDisplayName] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  // Get token from local storage
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  const fetchAdminSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.displayName) setDisplayName(data.displayName);
        if (data.notificationEmail) setNotificationEmail(data.notificationEmail);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ displayName, notificationEmail })
      });
      alert("Profile settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match!', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ text: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/settings/password', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPasswordMessage({ text: 'Password updated successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ text: data.message || 'Error updating password', type: 'error' });
      }
    } catch (error) {
      setPasswordMessage({ text: 'Server error. Try again later.', type: 'error' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white px-8 py-6 flex justify-between items-start border-b border-gray-100">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight">Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Admin account and platform preferences.</p>
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

        {/* Updated Container for Responsive Layout */}
        <div className="p-8 w-full max-w-7xl">
          {/* grid-cols-1 for mobile, lg:grid-cols-2 for large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Profile Settings Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-base font-bold text-gray-900">Admin profile</h3>
                <p className="text-xs text-gray-400 mt-1">These settings apply to your administrator account only.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1">Display name</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Site admin"
                    className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-lg px-3 py-2 text-sm text-gray-900 font-medium transition-all cursor-pointer focus:cursor-text outline-none placeholder:text-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1">Notification Email</label>
                  <input 
                    type="email" 
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    placeholder="admin@farmnet.lk"
                    className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-lg px-3 py-2 text-sm text-gray-900 font-medium transition-all cursor-pointer focus:cursor-text outline-none placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={isSaving} className="bg-[#22c55e] hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                    {isSaving ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Security / Change Password Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <KeyRound size={20} className="text-gray-700" />
                <div>
                  <h3 className="text-base font-bold text-gray-900">Change Password</h3>
                  <p className="text-xs text-gray-400 mt-1">Ensure your account is using a long, random password to stay secure.</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-800 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-800 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-800 transition-all"
                    required
                  />
                </div>

                {/* Error/Success Messages */}
                {passwordMessage.text && (
                  <div className={`text-sm font-medium ${passwordMessage.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {passwordMessage.text}
                  </div>
                )}

                <div className="pt-2">
                  <button type="submit" disabled={isChangingPassword} className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default Settings;