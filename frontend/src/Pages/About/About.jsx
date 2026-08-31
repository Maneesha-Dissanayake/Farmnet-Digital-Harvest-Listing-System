import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../../Components/Nav';
import Footer from '../Landing/Components/Footer';

function About() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation Bar */}
      <Nav />

      {/* Main Container matching Figma max width and clean padding */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        
        {/* Section 1: About FarmNet */}
        <section className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center text-slate-900">
            About FarmNet
          </h1>
          <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
            <p>
              FarmNet is a web-based Digital Harvest Listing System developed to support greenhouse farmers in advertising their harvest products online. The platform allows farmers to create detailed harvest listings by providing information such as:
            </p>
            
            {/* Left-aligned list without bullets matching the design image */}
            <div className="space-y-1 font-medium text-slate-800 text-left">
              <p>Vegetable name and variety</p>
              <p>Available quantity</p>
              <p>Price per kilogram</p>
              <p>Expected harvest date</p>
              <p>Farm location</p>
              <p>Product images</p>
            </div>

            <p>
              Through this system, farmers can promote their products in advance and reach potential buyers more efficiently.
            </p>
          </div>
        </section>

        {/* Section 2: Two Columns (For Sellers / Farmers & For Buyers) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 relative pt-4">
          
          {/* Vertical divider line for desktop layout */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[1px] bg-slate-300 -translate-x-1/2"></div>

          {/* For Sellers / Farmers Column */}
          <div className="space-y-6 pr-0 md:pr-6">
            <h2 className="text-2xl font-bold text-center text-slate-900">For Sellers / Farmers</h2>
            <div className="space-y-4 text-slate-700 text-sm md:text-base leading-relaxed">
              <p className="font-semibold text-center text-slate-800">FarmNet enables farmers to:</p>
              <ul className="space-y-2 text-center md:text-left">
                <li>Publish harvest advertisements easily</li>
                <li>Increase product visibility in the market</li>
                <li>Set their own prices transparently</li>
                <li>Connect directly with interested buyers</li>
                <li>Negotiate details without relying on intermediaries</li>
              </ul>
              <p className="font-medium text-slate-900 pt-2 text-center md:text-left">
                This improves market access and helps farmers secure better profits.
              </p>
            </div>
          </div>

          {/* For Buyers Column */}
          <div className="space-y-6 pl-0 md:pl-6">
            <h2 className="text-2xl font-bold text-center text-slate-900">For Buyers</h2>
            <div className="space-y-4 text-slate-700 text-sm md:text-base leading-relaxed">
              <p className="font-semibold text-center text-slate-800">Buyers such as supermarkets, retailers, and wholesalers can:</p>
              <ul className="space-y-2 text-center md:text-left">
                <li>Browse available harvest listings</li>
                <li>Search products based on their requirements</li>
                <li>Compare prices and quantities</li>
                <li>Directly contact sellers through the platform</li>
                <li>Discuss and negotiate purchase details</li>
              </ul>
              <p className="font-medium text-slate-900 pt-2 text-center md:text-left">
                This ensures easy access to fresh agricultural products in a simple and organized way.
              </p>
            </div>
          </div>

        </section>

        {/* Section 3: Integrated Solution & Purpose */}
        <section className="space-y-4 pt-6">
          <h2 className="text-2xl font-bold text-slate-900">Integrated Solution & Purpose</h2>
          <p className="text-slate-700 text-base md:text-lg leading-relaxed">
            FarmNet is designed to modernize agricultural trading by directly connecting greenhouse farmers with buyers through a transparent digital platform. By eliminating unnecessary intermediaries, the system increases farmers' profitability while providing buyers with reliable access to fresh harvest products. FarmNet enhances market visibility, improves access to opportunities, and creates an organized, efficient, and technology-driven environment for agricultural trade.
          </p>
        </section>

        {/* Section 4: Contact us */}
        <section className="space-y-8 pt-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Contact us</h2>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-32 max-w-3xl mx-auto pt-2">
            {/* Call us Block */}
            <div className="flex flex-col items-center space-y-3 p-6 transition">
              <div className="text-5xl mb-1">📞</div>
              <h3 className="text-xl font-bold text-slate-800">Call us</h3>
            </div>

            {/* Email us Block */}
            <div className="flex flex-col items-center space-y-3 p-6 transition">
              <div className="text-5xl mb-1">✉️</div>
              <h3 className="text-xl font-bold text-slate-800">Email us</h3>
            </div>
          </div>
        </section>

      </main>

      {/* Standard Footer */}
      <Footer />
    </div>
  );
}

export default About;