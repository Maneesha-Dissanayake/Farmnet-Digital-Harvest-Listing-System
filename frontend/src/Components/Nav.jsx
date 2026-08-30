import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import farmNetLogo from '../Assets/logo/favicon.png';

function Nav() {
  // Verified user profile details
  const user = {
    name: 'Kavinda Perera',
    role: 'VERIFIED BUYER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  };

  // The 6 exact navigation items
  const navLinks = [
    { name: 'Home', path: '/mainhome' },
    { name: 'Products', path: '/products' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About Us', path: '/about' },
    { name: 'Seller Profile', path: '/seller-profile' },
    { name: 'Chat', path: '/chat' },
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-xs">
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16 h-24 flex items-center justify-between">
        
        {/* 1. Left: Brand Logo Only */}
        <Link to="/mainhome" className="flex items-center shrink-0 group py-1">
          <img
            src={farmNetLogo}
            alt="FarmNet Logo"
            className="h-14 sm:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* 2. Center: Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 lg:space-x-11 h-full">
          {navLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `h-full flex items-center text-[17px] lg:text-[18px] tracking-tight transition-all duration-150 border-b-4 ${
                  isActive
                    ? 'border-emerald-600 text-emerald-800 font-extrabold'
                    : 'border-transparent text-slate-600 hover:text-emerald-700 font-semibold'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* 3. Right: Notification Bell & Verified Buyer Profile */}
        <div className="flex items-center space-x-5 sm:space-x-7">
          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60 rounded-full transition-all duration-150 cursor-pointer"
            aria-label="Notifications"
          >
            <FiBell className="text-2xl" />
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
            </span>
          </button>

          {/* User Profile Pill */}
          <Link
            to="/seller-profile"
            className="flex items-center gap-3.5 pl-2 pr-4 py-2 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200/70 transition-all duration-150 cursor-pointer group"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-600/30 group-hover:ring-emerald-600 transition-all"
            />
            <div className="flex flex-col text-left">
              <span className="text-[15px] sm:text-[16px] font-bold text-slate-800 tracking-tight leading-tight group-hover:text-emerald-800 transition-colors">
                {user.name}
              </span>
              <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider mt-0.5">
                {user.role}
              </span>
            </div>
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Nav;