import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full mt-16 font-sans">
      {/* 2. Main Footer Links Section */}
      <div className="bg-[#f8fafc] text-slate-700 pt-12 pb-8 border-t border-slate-200 font-['Inter']">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xl font-bold text-emerald-700">FarmNet</h4>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              Empowering the agricultural future of Sri Lanka through technology, transparency, and trust.
            </p>
          </div>

          {/* Column 2: Marketplace */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 text-sm">Marketplace</h5>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/products" className="hover:text-emerald-600 transition">Vegetables</Link></li>
              <li><Link to="/products" className="hover:text-emerald-600 transition">Fruits</Link></li>
              <li><Link to="/products" className="hover:text-emerald-600 transition">Rice Varieties</Link></li>
              <li><Link to="/products" className="hover:text-emerald-600 transition">Spices & Others</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 text-sm">Company</h5>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-emerald-600 transition">About Us</Link></li>
              <li><Link to="/mission" className="hover:text-emerald-600 transition">Our Mission</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-600 transition">Contact Us</Link></li>
              <li><Link to="/support" className="hover:text-emerald-600 transition">Support</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 text-sm">Legal</h5>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/privacy" className="hover:text-emerald-600 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-600 transition">Terms of Service</Link></li>
              <li><Link to="/buyer-agreement" className="hover:text-emerald-600 transition">Buyer Agreement</Link></li>
              <li><Link to="/seller-agreement" className="hover:text-emerald-600 transition">Seller Agreement</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Notice */}
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          © 2026 FarmNet Agricultural Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;