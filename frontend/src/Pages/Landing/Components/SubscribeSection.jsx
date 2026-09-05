import React from 'react';

function SubscribeSection() {
  return (
    <div className="bg-[#047857] text-white py-20 px-6 text-center font-sans">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        
        {/* Section Heading */}
        <h3 className="text-[30px] font-black leading-[38px] tracking-[-0.3px] mb-3 text-white">
          Stay Rooted in the Marketplace
        </h3>
        
        {/* Subtitle description */}
        <p className="text-emerald-100 mb-10 text-sm md:text-base max-w-lg font-normal">
          Get weekly updates on seasonal harvests, price fluctuations, and new verified farmers in your region.
        </p>
        
        {/* Email Form with Separate Subscribe Button */}
        <div className="flex flex-col sm:flex-row w-full max-w-xl gap-4 items-center justify-center">
          
          {/* Email Input Field */}
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="w-full sm:w-[360px] px-5 py-4 rounded-2xl bg-[#065f46]/60 border border-emerald-500/40 text-white placeholder-emerald-200/70 focus:outline-none focus:border-white transition text-sm shadow-inner" 
          />
          
          {/* Subscribe Button */}
          <button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#047857] px-8 py-4 rounded-2xl font-bold transition shadow-md text-sm whitespace-nowrap">
            Subscribe
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default SubscribeSection;