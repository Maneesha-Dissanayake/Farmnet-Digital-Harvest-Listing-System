import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-6 py-4 shadow-sm w-full sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand / Logo */}
        <Link to="/mainhome" className="text-xl font-extrabold tracking-tight text-emerald-800 flex items-center gap-2">
          🌾 FarmNet
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 font-medium text-slate-600">
          <Link to="/mainhome" className="hover:text-emerald-600 transition">Home</Link>
          <Link to="/products" className="hover:text-emerald-600 transition">Products</Link>
          <Link to="/dashboard" className="hover:text-emerald-600 transition">Dashboard</Link>
          <Link to="/about" className="hover:text-emerald-600 transition">About Us</Link>
          <Link to="/seller-profile" className="hover:text-indigo-400 transition">Seller Profile</Link>
          <Link to="/chat" className="hover:text-indigo-400 transition">Chat</Link>
        </div>

        {/* Desktop Right Section: Profile Icon & CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            to="/seller-profile" 
            className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition shadow-sm"
            title="User Profile"
          >
            👤
          </Link>
          <Link 
            to="/login" 
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-semibold transition shadow-sm flex items-center justify-center"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Right Section: Profile Icon & Hamburger Button */}
        <div className="flex items-center md:hidden space-x-3">
          <Link 
            to="/seller-profile" 
            className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-50 transition shadow-sm"
            title="User Profile"
          >
            👤
          </Link>

          <button 
            onClick={toggleMenu}
            className="text-slate-700 focus:outline-none p-2 rounded-lg hover:bg-slate-100 transition"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Drawer Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-slate-100 pt-4 flex flex-col space-y-3 font-medium text-slate-600 animate-fadeIn">
          <Link to="/mainhome" onClick={() => setIsOpen(false)} className="hover:text-emerald-600 transition px-2 py-1">Home</Link>
          <Link to="/products" onClick={() => setIsOpen(false)} className="hover:text-emerald-600 transition px-2 py-1">Products</Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-emerald-600 transition px-2 py-1">Dashboard</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-emerald-600 transition px-2 py-1">About Us</Link>
          <Link to="/seller-profile" onClick={() => setIsOpen(false)} className="hover:text-indigo-400 transition px-2 py-1">Seller Profile</Link>
          <Link to="/chat" onClick={() => setIsOpen(false)} className="hover:text-indigo-400 transition px-2 py-1">Chat</Link>
          
          <div className="pt-2">
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)} 
              className="block text-center bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-sm w-full"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;