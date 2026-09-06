import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../../Components/Nav';
import Footer from '../Landing/Components/Footer';
import pubsellerimage from '../../Assets/pubsellerimage.png';

function PublicProfile() {
  // Extracts seller ID from URL parameters
  const { id } = useParams();

  // Demo data for seller profile; will be replaced by backend data fetch
  const [seller, setSeller] = useState({
    name: "Arjuna Perera",
    badge: "PREMIUM ORGANIC SELLER",
    rating: 4.9,
    reviewCount: 128,
    joinedDate: "March 2021",
    location: "Kandy, Sri Lanka",
    isVerified: true,
    certified: true,
    about: "With over 20 years of experience in the highlands of Kandy, I specialize in heirloom vegetables and organic spices. My farm uses traditional Sri Lankan stewardship methods augmented by modern soil-health monitoring technology. Every product listed on FarmNet is harvested within 24 hours of dispatch, ensuring peak freshness and maximum nutritional value for your family.",
    reviews: [
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
    ]
  });

  const [loading, setLoading] = useState(false);

  // Rating Modal States
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetches seller details from backend API on mount
  useEffect(() => {
    const fetchSellerProfile = async () => {
      if (!id) return;

      try {
        const endpoint = `http://localhost:5000/api/sellers/${id}`;
        const response = await fetch(endpoint);
        
        if (response.ok) {
          const data = await response.json();
          setSeller(data);
        }
      } catch (err) {
        console.warn('Backend sync skipped, sticking to current profile data:', err.message);
      }
    };

    fetchSellerProfile();
  }, [id]);

  // Handle submitting the rating to the backend
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please log in to submit a review.');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sellerId: id,
          rating: Number(newRating),
          comment: newComment
        })
      });

      if (response.ok) {
        // Convert numeric rating to stars representation matching UI format
        const starString = '★'.repeat(Number(newRating)) + '☆'.repeat(5 - Number(newRating));
        
        const formattedReview = {
          name: 'You',
          badge: 'Verified Purchase',
          time: 'Just now',
          rating: starString,
          comment: newComment
        };

        // Instantly update UI by placing the new review at the top of the list
        setSeller(prev => ({
          ...prev,
          reviews: [formattedReview, ...prev.reviews]
        }));

        // Close modal and reset input values
        setIsRatingModalOpen(false);
        setNewComment('');
        setNewRating(5);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Network error while submitting review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    // Public profile page container
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      {/* Navigation Bar */}
      <Nav />

      {/* Scenic Banner Image */}
      <div className="w-full h-64 md:h-80 overflow-hidden relative shadow-inner bg-slate-200">
        <img 
          src={pubsellerimage} 
          alt="Scenic Farm Banner" 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Main Profile Layout */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Seller Info Card */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[24px] p-6 shadow-md space-y-6 h-fit mt-4 lg:mt-16">
            
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-200 mb-4 border-4 border-white shadow-md">
                <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 font-semibold text-xs">
                  [Seller Photo]
                </div>
              </div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                {seller?.name} {seller?.isVerified && <span className="text-emerald-600 text-sm" title="Verified Seller">✔</span>}
              </h1>
              <p className="text-xs tracking-wider font-semibold text-slate-500 uppercase mt-1">
                {seller?.badge || 'PREMIUM ORGANIC SELLER'}
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* Seller profile metadata details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">RATING</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="text-amber-500">★</span> {seller?.rating} <span className="text-slate-400 font-normal text-xs">({seller?.reviewCount || seller?.reviews?.length || 0} Reviews)</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">JOINED</span>
                <span className="font-semibold text-slate-800">{seller?.joinedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">LOCATION</span>
                <span className="font-semibold text-slate-800">{seller?.location}</span>
              </div>
            </div>

            {/* Certification badge info box */}
            {seller?.certified !== false && (
              <div className="bg-emerald-800 text-white p-4 rounded-2xl flex items-center space-x-3 shadow-sm">
                <div className="text-2xl">🌱</div>
                <div>
                  <h4 className="font-bold text-sm">SL-GAP Certified</h4>
                  <p className="text-[11px] text-emerald-100 opacity-90">Validated Agricultural Standards 2024</p>
                </div>
              </div>
            )}

            {/* Report profile button */}
            <button className="w-full border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-xs font-semibold transition">
              ⚠ Report Profile
            </button>
          </div>

          {/* Right column: About and reviews section */}
          <div className="lg:col-span-8 space-y-6 pt-4 lg:pt-16">
            
            {/* About seller bio card */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-3">About {seller?.name ? `${seller.name}'s Harvest` : "Seller"}</h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                {seller?.about}
              </p>
            </div>

            {/* Buyer reviews list card */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-6">
              
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Buyer Reviews</h2>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">
                  Most Recent
                </span>
              </div>

              {/* Mapped list of review items */}
              <div className="space-y-6 divide-y divide-slate-100">
                {seller?.reviews && seller.reviews.map((rev, index) => (
                  <div key={index} className="pt-6 first:pt-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-200">
                          {rev.name ? rev.name.charAt(0) : 'U'}
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

              {/* Trigger button for rating submission modal */}
              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setIsRatingModalOpen(true)}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition text-sm shadow-sm flex items-center gap-2"
                >
                  Give Seller Rating →
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Rating Popup Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-xl border border-slate-100 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Rate {seller?.name}</h3>
              <button 
                onClick={() => setIsRatingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {/* Review submission form */}
            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  Star Rating (1 to 5)
                </label>
                <select 
                  value={newRating} 
                  onChange={(e) => setNewRating(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-emerald-600 bg-slate-50 font-medium"
                >
                  <option value="5">★★★★★ (5 Stars - Excellent)</option>
                  <option value="4">★★★★☆ (4 Stars - Good)</option>
                  <option value="3">★★★☆☆ (3 Stars - Average)</option>
                  <option value="2">★★☆☆☆ (2 Stars - Poor)</option>
                  <option value="1">★☆☆☆☆ (1 Star - Terrible)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  Your Review / Message
                </label>
                <textarea 
                  rows="4"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share details of your experience with this seller's harvest..."
                  required
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-emerald-600 bg-slate-50 resize-none"
                ></textarea>
              </div>

              {/* Modal form action buttons */}
              <div className="flex space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsRatingModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold transition shadow-sm disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PublicProfile;