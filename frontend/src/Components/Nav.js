import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow-md w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link to="/mainhome" className="text-xl font-bold tracking-wide hover:text-indigo-400 transition">
          MyBrand
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-8 font-medium">
          <Link to="/mainhome" className="hover:text-indigo-400 transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-indigo-400 transition">
            Products
          </Link>
          <Link to="/about" className="hover:text-indigo-400 transition">
            About Us
          </Link>
          <Link to ="/contact" className="hover:text-indigo-400 transition">
            Contact
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block space-x-4">
          <Link to="/login" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-semibold transition">
            Get Started
          </Link>
          <Link to="/regi" className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold transition">
            Register
          </Link>
          <button onClick={logout} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg font-semibold transition">
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Nav;
