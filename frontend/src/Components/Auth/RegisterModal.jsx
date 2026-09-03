import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthBrandPanel from '../../Components/Auth/AuthBrandPanel';
import bgImage from '../../Assets/Images/banner-bg.png';


 

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('seller'); // 'seller' | 'buyer'
  const [profilePreview, setProfilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    // Seller fields
    fullName: '',
    email: '',
    contactNumber: '',
    nicNumber: '',
    farmAddress: '',
    sellerPassword: '',
    // Buyer fields
    username: '',
    buyerEmail: '',
    buyerContact: '',
    buyerPassword: '',
    profileImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // payload matching 
      const payload = {
        role,
        ...formData,
      };

      // Send request to backend
      const response = await axios.post('http://localhost:5000/api/auth/register', payload);

      if (response.data.success) {
        // Store authentication credentials in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Role-based navigation
        if (response.data.user.role === 'seller') {
          navigate('/dashboard'); 
        } else if (response.data.user.role === 'buyer') {
          navigate('/market'); 
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-slate-900">
      {/* Blurred Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-110 opacity-70 pointer-events-none"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-[#04190a]/50 backdrop-blur-xs pointer-events-none" />

      {/* Locked Size Card Container */}
      <div className="relative z-10 flex w-full max-w-[800px] h-[580px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-20 text-sm font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Left Side Brand Panel */}
        <AuthBrandPanel />

        {/* Right Side Form Panel */}
        <div className="flex-1 px-8 py-6 flex flex-col justify-between h-full overflow-hidden">
          
          {/* Header & Toggle Section */}
          <div>
            {/* Role Switcher */}
            <div className="flex justify-center mb-3">
              <div className="inline-flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`px-6 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                    role === 'seller'
                      ? 'bg-[#006948] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Seller
                </button>
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`px-6 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                    role === 'buyer'
                      ? 'bg-[#006948] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Buyer
                </button>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-3">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                Create {role === 'seller' ? 'Seller' : 'Buyer'} Account
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Join Sri Lanka's largest digital agri-hub.
              </p>
            </div>

            {/* Profile Picture Upload */}
            <div className="flex items-center gap-3 mb-3 px-1">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#006948] overflow-hidden bg-gray-50 shrink-0 transition-colors"
              >
                {profilePreview ? (
                  <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 leading-tight">Profile Picture</p>
                <p className="text-[10px] text-gray-400">JPG, PNG up to 5MB</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/*validation error message */}
          {errorMessage && (
            <div className="mb-2 p-2 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-md text-center">
              {errorMessage}
            </div>
          )}

          {/* Form with Scrollable Input Area */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 justify-between overflow-hidden">
            
            {/* Scrollable Viewport */}
            <div className="overflow-y-auto max-h-[250px] pr-1.5 space-y-2.5 scrollbar-thin scrollbar-thumb-gray-300">
              {role === 'seller' ? (
                <>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-0.5">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006948] focus:border-[#006948]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-0.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006948] focus:border-[#006948]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-0.5">Contact Number</label>
                      <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006948] focus:border-[#006948]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-0.5">NIC Number</label>
                      <input
                        type="text"
                        name="nicNumber"
                        value={formData.nicNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006948] focus:border-[#006948]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-0.5">Farm Address</label>
                    <input
                      type="text"
                      name="farmAddress"
                      value={formData.farmAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006948] focus:border-[#006948]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-0.5">Password</label>
                    <input
                      type="password"
                      name="sellerPassword"
                      value={formData.sellerPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006948] focus:border-[#006948]"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-0.5">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006948] focus:border-[#006948]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-0.5">Email Address</label>
                    <input
                      type="email"
                      name="buyerEmail"
                      value={formData.buyerEmail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006948] focus:border-[#006948]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-0.5">Phone Number</label>
                    <input
                      type="text"
                      name="buyerContact"
                      value={formData.buyerContact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006948] focus:border-[#006948]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-0.5">Password</label>
                    <input
                      type="password"
                      name="buyerPassword"
                      value={formData.buyerPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006948] focus:border-[#006948]"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-[#006948] hover:bg-[#005238] disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <div className="text-center pt-2">
                <p className="text-[11px] text-gray-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#006948] font-semibold hover:underline">
                    Switch to Login
                  </Link>
                </p>
              </div>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}