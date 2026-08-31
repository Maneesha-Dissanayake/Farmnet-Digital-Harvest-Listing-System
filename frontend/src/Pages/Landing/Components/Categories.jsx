import React from 'react';

function Categories() {
  const categories = [
    { name: 'Vegetables', icon: '🥦' },
    { name: 'Fruits', icon: '🍎' },
    { name: 'Harvested Rice', icon: '🌾' },
    { name: 'Mixed Items', icon: '🛒' },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Heading matching Figma typography and #191C1E color */}
        <h2 className="text-[20px] font-semibold text-[#191C1E] tracking-normal mb-10 font-sans">
          Browse Harvest Collections
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center cursor-pointer group font-sans"
            >
              {/* Circular Icon Container */}
              <div className="w-28 h-28 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-sm group-hover:scale-105 transition-transform duration-200 border border-slate-200/60">
                {cat.icon}
              </div>
              
              {/* Category Title matching Figma's exact color #191C1E */}
              <h3 className="font-semibold text-[#191C1E] text-base group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;