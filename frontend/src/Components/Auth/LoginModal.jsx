import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthBrandPanel from './AuthBrandPanel';
import bgImage from '../../Assets/Images/banner-bg.png';
 

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Persist token for Bearer-based APIs and user info for client UI
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Role-based routing aligned with App.jsx
        if (response.data.user.role === 'seller') {
          navigate('/dashboard');
        } else if (response.data.user.role === 'buyer') {
          navigate('/market');
        } else if (response.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(
        error.response?.data?.message || 'Invalid credentials. Please try again.'
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

      {/* Container Card */}
      <div className="relative z-10 flex w-full max-w-[800px] bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[480px]">
        {/* Close / Return Home Button */}
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
        <div className="flex-1 px-8 py-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Log in to your FarmNet account
            </p>
          </div>
          
          {errorMessage && (
            <div className="mb-4 p-2 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-md text-center">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">
                Email or Username
              </label>
              <input
                type="text"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006948] focus:border-[#006948]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006948] focus:border-[#006948]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2 px-4 bg-[#006948] hover:bg-[#005238] disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >             
                {loading ? 'Logging In...' : 'Log In'}
            </button>

            {/* Link to Register Page */}
            <div className="text-center pt-2">
              <p className="text-[11px] text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#006948] font-semibold hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}