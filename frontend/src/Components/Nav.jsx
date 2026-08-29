import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-100 px-6 py-4 shadow-sm w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand / Logo */}
        <Link to="/mainhome" className="text-xl font-extrabold tracking-tight text-emerald-800 flex items-center gap-2">
          🌾 FarmNet
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-8 font-medium text-slate-600">
          <Link to="/mainhome" className="hover:text-emerald-600 transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-emerald-600 transition">
            Products
          </Link>
          <Link to="/dashboard" className="hover:text-emerald-600 transition">
            Dashboard
          </Link>
          <Link to="/about" className="hover:text-emerald-600 transition">
            About Us
          </Link>
          <Link to="/seller-profile" className="hover:text-indigo-400 transition">
            Seller Profile
          </Link>
           <Link to="/chat" className="hover:text-indigo-400 transition">
            Chat
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link to="/login" className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-semibold transition shadow-sm">
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Nav;