import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldAlert, MessageSquare, LineChart, Settings2, Settings, LogOut, Plus } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  // Helper function to check active routes
  const isActive = (path) => {
    if (path === '/admin/dashboard' && location.pathname === '/') return true;
    return location.pathname.includes(path);
  };

  return (
    <aside className="w-[260px] bg-[#2A2D34] text-gray-300 h-screen flex flex-col justify-between shrink-0 font-sans">
      <div>
        {/* Branding Area */}
        <div className="p-6 flex flex-col items-center border-b border-gray-700">
          <img 
            src="/favicon.png" 
            alt="FarmNet" 
            className="w-24 h-24 object-contain mb-1" 
          />
          <h2 className="text-[#86EFAC] text-xl font-bold tracking-wide">Admin Panel</h2>
          <p className="text-[10px] text-gray-400 tracking-widest text-center mt-1">TECHNOLOGICAL<br/>STEWARDSHIP</p>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-4 space-y-1">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'text-white bg-gray-700/50' : 'hover:text-white hover:bg-gray-700/30'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium text-sm">Overview</span>
          </Link>

          <Link 
            to="/admin/users" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users') ? 'text-white bg-gray-700/50' : 'hover:text-white hover:bg-gray-700/30'}`}
          >
            <Users size={20} />
            <span className="font-medium text-sm">User Management</span>
          </Link>

          <Link 
            to="/admin/ads" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/ads') ? 'text-white bg-gray-700/50' : 'hover:text-white hover:bg-gray-700/30'}`}
          >
            <ShieldAlert size={20} />
            <span className="font-medium text-sm">Ad Moderation</span>
          </Link>

          <Link 
            to="/admin/chat-audits" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/chat-audits') ? 'text-white bg-gray-700/50' : 'hover:text-white hover:bg-gray-700/30'}`}
          >
            <MessageSquare size={20} />
            <span className="font-medium text-sm">Chat Audits</span>
          </Link>

          <Link 
            to="/admin/analytics" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/analytics') ? 'text-white bg-gray-700/50' : 'hover:text-white hover:bg-gray-700/30'}`}
          >
            <LineChart size={20} />
            <span className="font-medium text-sm">Analytics</span>
          </Link>

          <Link 
            to="/admin/category-setup" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/category-setup') ? 'text-white bg-gray-700/50' : 'hover:text-white hover:bg-gray-700/30'}`}
          >
            <Settings2 size={20} />
            <span className="font-medium text-sm">Category Setup</span>
          </Link>

          <Link 
            to="/admin/settings" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/settings') ? 'text-white bg-gray-700/50' : 'hover:text-white hover:bg-gray-700/30'}`}
          >
            <Settings size={20} />
            <span className="font-medium text-sm">Settings</span>
          </Link>
        </nav>
      </div>

      {/* Action Buttons at Bottom */}
      <div className="p-4">
        <Link 
          to="/admin/reports" 
          className="w-full flex items-center justify-center gap-2 bg-[#86EFAC] text-green-950 px-4 py-3 rounded-lg font-semibold text-sm hover:bg-green-400 transition-colors mb-3">
          <Plus size={18} /> New Report
        </Link>

        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all duration-200 group">
          <LogOut size={18} className="text-red-400 group-hover:scale-110 transition-transform" /> 
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;