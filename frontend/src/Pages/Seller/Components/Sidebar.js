import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FiLayout, 
  FiMessageSquare, 
  FiPlusSquare, 
  FiGlobe, 
  FiInfo, 
  FiUser, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

// 1. Import your transparent FarmNet Logo image
import farmNetLogo from '../../../Assets/logo/favicon.png';

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Auto-close sidebar on link click if screen is mobile/tablet (< 768px)
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  // Top Main Navigation Links
  const navItems = [
    { 
      name: 'My Dashboard', 
      path: '/dashboard', 
      icon: <FiLayout className="text-lg" /> 
    },
    { 
      name: 'Chat', 
      path: '/chat', 
      icon: <FiMessageSquare className="text-lg" />, 
      badge: 4 // Unread chat counter
    },
    { 
      name: 'Post New Advertisement', 
      path: '/post-advertisement', 
      icon: <FiPlusSquare className="text-lg" /> 
    },
    { 
      name: 'View My Public Profile', 
      path: '/public-profile', 
      icon: <FiGlobe className="text-lg" /> 
    },
    { 
      name: 'About Us', 
      path: '/about', 
      icon: <FiInfo className="text-lg" /> 
    },
  ];

  // SweetAlert2 Log Out handler
  const handleLogout = () => {
    Swal.fire({
      title: 'Log Out',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669', // Emerald 600
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Log Out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

  return (
    <>
      {/* 1. Mobile Hamburger / Close Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar Menu"
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-[#2D3133] text-[#E0E3E5] border border-white/10 shadow-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
      >
        {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
      </button>

      {/* 2. Dimmed Background Backdrop Overlay (Mobile only) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* 3. Main Responsive Sidebar Drawer */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 min-h-screen bg-[#2D3133] border-r border-white/10 flex flex-col justify-between p-5 select-none shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header & Main Navigation */}
        <div>
          {/* Logo & Technological Stewardship Header */}
          <div className="flex flex-col items-start px-2 pb-6 mb-6 border-b border-white/10">
            <NavLink to="/" onClick={handleNavClick} className="inline-block">
              <img 
                src={farmNetLogo} 
                alt="FarmNet Logo" 
                className="h-16 md:h-18 w-auto object-contain transition-transform hover:scale-105 [filter:drop-shadow(0_1px_2px_rgba(255,255,255,0.4))]"
              />
            </NavLink>
            <span className="text-[9.5px] font-extrabold tracking-widest text-[#E0E3E5] uppercase mt-2.5 text-left opacity-90">
              TECHNOLOGICAL STEWARDSHIP
            </span>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                      : 'text-[#E0E3E5] hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <span className={isActive ? 'text-white' : 'text-[#E0E3E5]'}>
                        {item.icon}
                      </span>
                      <span className="text-[13.5px]">{item.name}</span>
                    </div>

                    {/* Badge for Chat */}
                    {item.badge && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-800 text-white'
                            : 'bg-emerald-500/20 text-[#E0E3E5] border border-emerald-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Profile & Logout Section */}
        <div className="pt-4 border-t border-white/10 space-y-1.5">
          {/* My Profile */}
          <NavLink
            to="/profile"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-[#E0E3E5] hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-white' : 'text-[#E0E3E5]'}>
                  <FiUser className="text-lg" />
                </span>
                <span className="text-[13.5px]">My Profile</span>
              </>
            )}
          </NavLink>

          {/* Log Out */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150 text-left"
          >
            <FiLogOut className="text-lg text-red-400" />
            <span className="text-[13.5px]">Log Out</span>
          </button>
        </div>

      </aside>
    </>
  );
}

export default Sidebar;