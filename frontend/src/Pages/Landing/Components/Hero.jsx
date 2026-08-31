import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="max-w-7xl mx-12 px-6 py-12 flex flex-col md:flex-row items-center justify-between font-sans">
      {/* Left Text Content */}
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
          Connecting Greenhouse & Local Farmers with <span className="text-emerald-600">Trusted Buyers</span>
        </h1>
        <p className="text-slate-600 text-lg">
          Empowering the Sri Lankan agricultural landscape with modern technology. Direct trade, transparent pricing, and quality-assured harvests at your fingertips.
        </p>
        <div className="flex space-x-4">
          <Link to="/products" className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md">
            Browse Fresh Harvests →
          </Link>
          <Link to="/contact" className="border border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded-xl font-semibold transition">
            Contact Buyers
          </Link>
        </div>
      </div>

      {/* Right Image Placeholder / Banner */}
      <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-3xl shadow-lg w-full max-w-md">
          <div className="h-64 bg-emerald-200 rounded-2xl flex items-center justify-center text-emerald-800 font-bold">
            [Figma Hero Image Banner]
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;