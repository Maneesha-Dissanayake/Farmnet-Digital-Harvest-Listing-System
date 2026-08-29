import React from 'react';
import Nav from '../../Components/Nav';
import Footer from '../Landing/Components/Footer';
import pubsellerimage from '../../Assets/pubsellerimage.png';

function PublicProfile() {
  // Sample data matching your Figma design for Arjuna's Harvest
  const reviews = [
    {
      name: 'Sithum M.',
      badge: 'Verified Purchase',
      time: '2 days ago',
      rating: '★★★★★',
      comment: 'The organic carrots were exceptionally sweet and crunchy. Arjuna’s packaging was very professional—no bruising at all during delivery to Colombo.'
    },
    {
      name: 'Raveen K.',
      badge: 'Verified Purchase',
      time: '1 week ago',
      rating: '★★★★★',
      comment: 'Great quality cinnamon quills. A bit pricey but worth it for the aroma and authenticity. Will buy again for my restaurant.'
    },
    {
      name: 'Anjali N.',
      badge: 'Verified Purchase',
      time: '2 weeks ago',
      rating: '★★★★★',
      comment: 'Excellent communication from the seller. He even included a small bunch of fresh curry leaves as a gift. Highly recommend this store!'
    },
    {
      name: 'Chamari P.',
      badge: 'Verified Purchase',
      time: '1 month ago',
      rating: '★★★★☆',
      comment: 'Consistent quality over multiple orders. The passion fruit is always perfectly ripe. This is what true organic farming looks like.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] text-slate-900">
      {/* Navigation Bar */}
      <Nav />

      {/* Scenic Banner Image Right Below the Navigation Bar */}
      <div className="w-full h-64 md:h-80 overflow-hidden relative shadow-inner bg-slate-200">
        <img 
          src={pubsellerimage} 
          alt="Scenic Farm Banner" 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Main Profile Layout with negative top margin so the profile card overlaps the banner */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Seller Info Card (4 Columns wide) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[24px] p-6 shadow-md space-y-6 h-fit">
            
            {/* Seller Avatar & Header */}
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-200 mb-4 border-4 border-white shadow-md">
                {/* Profile Image Placeholder */}
                <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 font-semibold text-xs">
                  [Seller Photo]
                </div>
              </div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                Arjuna Perera <span className="text-emerald-600 text-sm" title="Verified Seller">✔</span>
              </h1>
              <p className="text-xs tracking-wider font-semibold text-slate-500 uppercase mt-1">
                PREMIUM ORGANIC SELLER
              </p>

              {/* Social Links Icons */}
              <div className="flex space-x-3 mt-4">
                <a href="#facebook" className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm shadow hover:opacity-90 transition">f</a>
                <a href="#linkedin" className="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center text-sm shadow hover:opacity-90 transition">in</a>
                <a href="#messenger" className="w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center text-sm shadow hover:opacity-90 transition">M</a>
                <a href="#globe" className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm shadow hover:opacity-90 transition">🌐</a>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Quick Metadata */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">RATING</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="text-amber-500">★</span> 4.9 <span className="text-slate-400 font-normal text-xs">(128 Reviews)</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">JOINED</span>
                <span className="font-semibold text-slate-800">March 2021</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">LOCATION</span>
                <span className="font-semibold text-slate-800">Kandy, Sri Lanka</span>
              </div>
            </div>

            {/* SL-GAP Certified Badge */}
            <div className="bg-emerald-800 text-white p-4 rounded-2xl flex items-center space-x-3 shadow-sm">
              <div className="text-2xl">🌱</div>
              <div>
                <h4 className="font-bold text-sm">SL-GAP Certified</h4>
                <p className="text-[11px] text-emerald-100 opacity-90">Validated Agricultural Standards 2024</p>
              </div>
            </div>

            {/* Report Button */}
            <button className="w-full border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-xs font-semibold transition">
              ⚠ Report Profile
            </button>

          </div>

          {/* Right Column: About Seller & Reviews Section (8 Columns wide) */}
          <div className="lg:col-span-8 space-y-6 pt-4 lg:pt-16">
            
            {/* About Card */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-3">About Arjuna's Harvest</h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                With over 20 years of experience in the highlands of Kandy, I specialize in heirloom vegetables and organic spices. My farm uses traditional Sri Lankan stewardship methods augmented by modern soil-health monitoring technology. Every product listed on FarmNet is harvested within 24 hours of dispatch, ensuring peak freshness and maximum nutritional value for your family.
              </p>
            </div>

            {/* Reviews Section Card */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-6">
              
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Buyer Reviews</h2>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">
                  Most Recent
                </span>
              </div>

              {/* Reviews List */}
              <div className="space-y-6 divide-y divide-slate-100">
                {reviews.map((rev, index) => (
                  <div key={index} className="pt-6 first:pt-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-200">
                          {rev.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{rev.name}</h4>
                          <span className="text-[11px] text-emerald-600 font-medium">✔ {rev.badge} • {rev.time}</span>
                        </div>
                      </div>
                      <div className="text-amber-500 text-sm tracking-tighter">
                        {rev.rating}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm pl-13 mt-2 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>

              {/* Give Seller Rating Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <button className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition text-sm shadow-sm flex items-center gap-2">
                  Give Seller Rating →
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PublicProfile;