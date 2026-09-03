import React from 'react';
import catVegetable from '../../../Assets/Images/cat-vegetable.png';
import catFruits from '../../../Assets/Images/cat-fruits.png';
import catHarvestedRice from '../../../Assets/Images/cat-harvested-rice.png';
import catMixedItems from '../../../Assets/Images/cat-mixed-items.png';

function Categories() {
  const categories = [
    { name: 'Vegetables', image: catVegetable },
    { name: 'Fruits', image: catFruits },
    { name: 'Harvested Rice', image: catHarvestedRice },
    { name: 'Mixed Items', image: catMixedItems },
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
              <div className="w-28 h-28 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden mb-4 shadow-sm group-hover:scale-105 transition-transform duration-200 border border-slate-200/60">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
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