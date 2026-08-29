import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthBrandPanel from './AuthBrandPanel';
import bgImage from '../../Assets/Images/banner-bg.png';
 

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in:', formData);
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
              className="w-full mt-2 py-2 px-4 bg-[#006948] hover:bg-[#005238] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Log In
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