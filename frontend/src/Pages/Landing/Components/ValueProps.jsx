import React from 'react';

function ValueProps() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
      {/* Farmers Block */}
      <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[24px] shadow-sm flex flex-col justify-between">
        <div>
          {/* Icon Box */}
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl mb-6">
            🚜
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-6">For Local Sellers & Farmers</h3>
          
          <ul className="space-y-4 text-slate-600 mb-8">
            <li className="flex items-start">
              <span className="text-emerald-600 mr-3 text-lg font-bold">✓</span>
              <div>
                <strong className="text-slate-800">Direct Market Access</strong>
                <p className="text-sm text-slate-500 mt-0.5">Skip the middlemen and sell directly to bulk buyers, retailers, and distributors.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-3 text-lg font-bold">✓</span>
              <div>
                <strong className="text-slate-800">Transparent Pricing</strong>
                <p className="text-sm text-slate-500 mt-0.5">Set your own prices based on market trends and harvest quality.</p>
              </div>
            </li>
          </ul>
        </div>

        <button className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition w-fit shadow-sm">
          Start Selling Today
        </button>
      </div>

      {/* Buyers Block */}
      <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[24px] shadow-sm flex flex-col justify-between">
        <div>
          {/* Icon Box */}
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl mb-6">
            📦
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-6">For Trusted Bulk Buyers</h3>
          
          <ul className="space-y-4 text-slate-600 mb-8">
            <li className="flex items-start">
              <span className="text-emerald-600 mr-3 text-lg font-bold">✓</span>
              <div>
                <strong className="text-slate-800">Verified Sources Only</strong>
                <p className="text-sm text-slate-500 mt-0.5">Every farm and greenhouse listing undergoes a strict quality verification process.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-3 text-lg font-bold">✓</span>
              <div>
                <strong className="text-slate-800">Bulk Ordering Tools</strong>
                <p className="text-sm text-slate-500 mt-0.5">Advanced filtering by location, quantity, and specific harvest date.</p>
              </div>
            </li>
          </ul>
        </div>

        <button className="border border-slate-300 hover:border-slate-400 text-slate-700 bg-white px-6 py-3 rounded-xl font-semibold transition w-fit">
          Register as Buyer
        </button>
      </div>
    </section>
  );
}

export default ValueProps;