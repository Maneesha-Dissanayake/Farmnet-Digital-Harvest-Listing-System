import React from 'react';
import { Link } from 'react-router-dom';

function ProductsPreview() {
  const products = [
    {
      title: 'Green Bell Peppers',
      price: 'LKR 420',
      unit: '/kg',
      qty: 'Qty: 500kg',
      location: 'Nuwara Eliya',
      rating: '4.9',
      tag: 'VERIFIED',
      tagBg: 'bg-emerald-700 text-white',
    },
    {
      title: 'Organic Tomatoes',
      price: 'LKR 380',
      unit: '/kg',
      qty: 'Qty: 1200kg',
      location: 'Kandy',
      rating: '4.7',
      tag: 'VERIFIED',
      tagBg: 'bg-emerald-700 text-white',
    },
    {
      title: 'Premium Keeri Samba',
      price: 'LKR 260',
      unit: '/kg',
      qty: 'Qty: 2500kg',
      location: 'Polonnaruwa',
      rating: '5.0',
      tag: 'VERIFIED',
      tagBg: 'bg-emerald-700 text-white',
    },
    {
      title: 'Cavendish Bananas',
      price: 'LKR 180',
      unit: '/kg',
      qty: 'Qty: 800kg',
      location: 'Gampaha',
      rating: '4.5',
      tag: 'PENDING VERIFY',
      tagBg: 'bg-amber-600 text-white',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Fresh Listings Preview</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time updates from farms across the island</p>
        </div>
        <Link to="/products" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition">
          View All Marketplace →
        </Link>
      </div>

      {/* Product Cards Grid matching Figma dimensions & styles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            style={{ minHeight: '370px' }}
          >
            <div>
              {/* Product Image Box with Badge */}
              <div className="relative h-40 bg-slate-100 rounded-[12px] mb-4 overflow-hidden flex items-center justify-center text-slate-400 font-medium">
                [Product Image]
                <span className={`absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider ${item.tagBg}`}>
                  ✓ {item.tag}
                </span>
              </div>

              {/* Title & Rating */}
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-800 text-base leading-snug">{item.title}</h3>
                <span className="text-xs font-semibold text-amber-500 flex items-center bg-amber-50 px-1.5 py-0.5 rounded">
                  ★ {item.rating}
                </span>
              </div>

              {/* Location */}
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                📍 {item.location}
              </p>
            </div>

            {/* Price and Quantity Details */}
            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
              <div>
                <span className="text-emerald-700 font-bold text-lg">{item.price}</span>
                <span className="text-xs text-slate-500 font-medium"> {item.unit}</span>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium border border-slate-200">
                {item.qty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductsPreview;