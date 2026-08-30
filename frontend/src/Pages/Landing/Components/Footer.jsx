import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FOOTER_SECTIONS = [
  {
    title: 'Marketplace',
    links: [
      { name: 'Vegetables', path: '/products' },
      { name: 'Fruits', path: '/products' },
      { name: 'Rice Varieties', path: '/products' },
      { name: 'Spices & Others', path: '/products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Mission', path: '/mission' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Support', path: '/support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Buyer Agreement', path: '/buyer-agreement' },
      { name: 'Seller Agreement', path: '/seller-agreement' },
    ],
  },
];

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // Handle newsletter subscription logic
    setEmail('');
  };

  return (
    <footer className="w-full mt-20 font-sans">
      {/* 1. Newsletter Banner Section (Edge-to-Edge Full Width) */}
      <div className="w-full bg-[#047857] text-white py-16 sm:py-20 px-4 sm:px-8 lg:px-12 2xl:px-16 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black leading-tight tracking-tight mb-3.5 text-white">
            Stay Rooted in the Marketplace
          </h3>
          
          <p className="text-emerald-100 mb-9 text-base sm:text-lg font-normal max-w-xl leading-relaxed">
            Get weekly updates on seasonal harvests, price fluctuations, and new verified farmers in your region.
          </p>
          
          {/* Email Subscription Form */}
          <form 
            onSubmit={handleSubscribe} 
            className="flex flex-col sm:flex-row w-full max-w-xl gap-3.5 items-center justify-center"
          >
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address" 
              className="w-full sm:flex-1 px-5 py-3.5 rounded-xl bg-[#065f46]/70 border border-emerald-400/40 text-white placeholder-emerald-200/80 focus:outline-none focus:border-white transition text-base shadow-inner" 
            />
            <button 
              type="submit"
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#047857] px-8 py-3.5 rounded-xl font-bold transition shadow-sm text-base whitespace-nowrap active:scale-95 cursor-pointer"
            >
              Subscribe
            </button>
          </form>

        </div>
      </div>

      {/* 2. Main Footer Links Section (Aligned with Navbar & Listing Grid) */}
      <div className="w-full bg-[#f8fafc] text-slate-700 pt-16 pb-10 border-t border-slate-200">
        <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-14 pb-14">
            
            {/* Brand Information - Only FarmNet Wordmark (No Logo / Emoji) */}
            <div className="md:col-span-2 space-y-4">
              <Link 
                to="/mainhome" 
                className="text-2xl sm:text-[26px] font-black tracking-tight text-emerald-950 hover:opacity-90 transition-opacity select-none"
              >
                Farm<span className="text-emerald-600">Net</span>
              </Link>
              <p className="text-slate-500 text-sm sm:text-[15px] leading-relaxed max-w-sm">
                Empowering the agricultural future of Sri Lanka through technology, transparency, and trust.
              </p>
            </div>

            {/* Dynamic Columns: Marketplace, Company, Legal */}
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-4">
                <h5 className="font-extrabold text-slate-900 text-sm sm:text-base uppercase tracking-wider">
                  {section.title}
                </h5>
                <ul className="space-y-3 text-sm sm:text-[15px] text-slate-600 font-medium">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="hover:text-emerald-700 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          {/* Bottom Divider & Copyright Notice */}
          <div className="w-full border-t border-slate-200 pt-8 text-center text-xs sm:text-sm text-slate-400 font-medium">
            © 2026 FarmNet Agricultural Marketplace. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;