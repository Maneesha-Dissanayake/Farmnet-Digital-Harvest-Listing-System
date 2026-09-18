import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import BuyerProfile from '../Pages/BuyerProfile';

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  // State management for mobile menu open/close toggle
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
 
  // authenticated user state 
  const [user, setUser] = useState(null);

  // Sync user state from localStorage when route changes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowProfile(false);
    navigate('/login');
  };

  // Style active desktop link
  const getNavLinkClass = ({ isActive }) => {
    return isActive 
      ? "text-emerald-600 font-bold underline underline-offset-8 decoration-2 transition" 
      : "text-slate-600 hover:text-emerald-600 transition";
  };

  // Helper function for mobile links
  const getMobileLinkClass = ({ isActive }) => {
    return isActive 
      ? "text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded-xl transition" 
      : "text-slate-600 hover:text-emerald-600 transition px-2 py-1";
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-6 py-4 shadow-sm w-full sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand / Logo Image Only */}
        <NavLink to="/mainhome" className="flex items-center">
          <img src="/favicon.png" alt="FarmNet Logo" className="h-16 w-auto object-contain" />
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 font-medium">
          <NavLink to="/mainhome" className={getNavLinkClass}>Home</NavLink>
          <NavLink to="/products" className={getNavLinkClass}>Products</NavLink>
          <NavLink to="/about" className={getNavLinkClass}>About Us</NavLink>

          {/* Seller Exclusive */}
          {user?.role === 'seller' && (
            <>
              <NavLink to="/dashboard" className={getNavLinkClass}>Dashboard</NavLink>
              <NavLink to="/seller-profile" className={getNavLinkClass}>Seller Profile</NavLink>
            </>
          )}

          {/* Admin Exclusive */}
          {user?.role === 'admin' && (
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => 
                isActive 
                  ? "text-amber-600 font-bold underline underline-offset-8 decoration-2 transition" 
                  : "text-amber-600 hover:text-amber-700 transition"
              }
            >
              Admin Panel
            </NavLink>
          )}

          {/* Authenticated Members Only */}
          {user && (
            <NavLink to="/chat" className={getNavLinkClass}>Chat</NavLink>
          )}
        </div>

        {/* Desktop Right Section: Profile Icon replaces Get Started when logged in */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <NavLink 
              to="/login" 
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-semibold transition shadow-sm flex items-center justify-center"
            >
              Get Started
            </NavLink>
          ) : (
           <button 
              type="button"
              onClick={() => setShowProfile((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:ring-2 hover:ring-emerald-500/50 transition shadow-sm overflow-hidden cursor-pointer"
              title={user.fullName || user.username}
            >
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-xs text-emerald-700">
                  {(user.fullName || user.username || 'U')[0].toUpperCase()}
                </span>
              )}
            </button>
          )}

          {/* Floating Profile Modal */}
          {showProfile && user && (
            <BuyerProfile
              user={user}
              setUser={setUser}
              onClose={() => setShowProfile(false)}
              onLogout={handleLogout}
            />
          )}
        </div>

       {/* Mobile Right Section: Profile Icon replaces Get Started when logged in */}
        <div className="flex items-center md:hidden space-x-3">
          {user && (
            <button 
              type="button"
              onClick={() => setShowProfile((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-50 transition shadow-sm overflow-hidden cursor-pointer"
            >
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-xs text-emerald-700">
                  {(user.fullName || user.username || 'U')[0].toUpperCase()}
                </span>
              )}
            </button>
          )}

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

          {/* Mobile Floating Drawer */}
          {showProfile && user && (
            <BuyerProfile
              user={user}
              setUser={setUser}
              onClose={() => setShowProfile(false)}
              onLogout={handleLogout}
            />
          )}

        </div>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-slate-100 pt-4 flex flex-col space-y-3 font-medium animate-fadeIn">
          <NavLink to="/mainhome" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>Home</NavLink>
          <NavLink to="/products" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>Products</NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>About Us</NavLink>

          {user?.role === 'seller' && (
            <>
              <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>Dashboard</NavLink>
              <NavLink to="/seller-profile" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>Seller Profile</NavLink>
            </>
          )}

          {user?.role === 'admin' && (
            <NavLink to="/admin/dashboard" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>Admin Panel</NavLink>
          )}

          {user && (
            <NavLink to="/chat" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>Chat</NavLink>
          )}
          
          {/* Mobile CTA: Only visible when NOT logged in */}
          {!user && (
            <div className="pt-2">
              <NavLink 
                to="/login" 
                onClick={() => setIsOpen(false)} 
                className="block text-center bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-sm w-full"
              >
                Get Started
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Nav;