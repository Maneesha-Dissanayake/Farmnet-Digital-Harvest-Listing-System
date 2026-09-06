import React, { useState, useEffect } from 'react';
import Sidebar from './Components/AdminSidebar';
import { Search, Bell, ArrowLeft, AlertTriangle, Star, MapPin, CheckCircle } from 'lucide-react';

const AdModeration = () => {
  const [pendingAds, setPendingAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAd, setSelectedAd] = useState(null); // To view detailed ad
  const [activeImage, setActiveImage] = useState(''); // For thumbnail gallery preview
  const [showConfirmModal, setShowConfirmModal] = useState(false); // For reject & delete confirmation popup
  const [adToReject, setAdToReject] = useState(null);

  useEffect(() => {
    fetchPendingAds();
  }, [searchTerm]);

  const fetchPendingAds = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/admin/ads/pending';
      
      if (searchTerm) {
        url += `?search=${searchTerm}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      // Safely set the ads state to prevent runtime crashes
      setPendingAds(data.ads || data || []);
    } catch (error) {
      console.error("Error fetching pending advertisements:", error);
      // Fallback to empty array on error
      setPendingAds([]);
    }
  };

  // Handler for approving or deleting ads
  const handleAdAction = async (adId, action) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      
      await fetch(`http://localhost:5000/api/admin/ads/${adId}/${endpoint}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });
      
      setShowConfirmModal(false);
      setSelectedAd(null);
      setAdToReject(null);
      fetchPendingAds();
    } catch (error) {
      console.error(`Error executing ${action} on ad:`, error);
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans relative">
      {/* Reusable Admin Sidebar */}
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header Section */}
        <header className="bg-white px-8 py-6 flex justify-between items-start border-b border-gray-100">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight">Ad moderation</h1>
            <p className="text-gray-500 text-sm mt-1">
              {selectedAd ? "Review & approve." : "Review listings awaiting approval."}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Global search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-[300px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Main Content Container */}
        <div className="p-8">
          
          {/* CONDITIONAL VIEW: If an ad is clicked, show detailed view; otherwise show the list */}
          {!selectedAd ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {Array.isArray(pendingAds) ? pendingAds.length : 0} ads awaiting review
                </p>
              </div>

              <div className="space-y-4">
                {/* Safely map through pending ads */}
                {Array.isArray(pendingAds) && pendingAds.length > 0 ? (
                  pendingAds.map((ad) => (
                    <div 
                      key={ad._id} 
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedAd(ad);
                        setActiveImage(ad.imageUrl || (ad.images && ad.images[0]) || 'https://via.placeholder.com/600');
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={ad.imageUrl || (ad.images && ad.images[0]) || 'https://via.placeholder.com/60'} 
                          alt={ad.title} 
                          className="w-16 h-16 rounded-lg object-cover bg-gray-100 border border-gray-100" 
                        />
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">{ad.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">Listed by: {ad.sellerName || 'Sunil Perera'}.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleAdAction(ad._id, 'approve')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => {
                            setAdToReject(ad);
                            setShowConfirmModal(true);
                          }}
                          className="border border-red-300 text-red-500 hover:bg-red-50 px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
                    No pending advertisements found.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* DETAILED AD VIEW (As shown in your second screenshot) */
            <div className="space-y-6">
              
              {/* Back Button and Quick Action Bar */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                <button 
                  onClick={() => setSelectedAd(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  <ArrowLeft size={18} /> Back to list
                </button>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleAdAction(selectedAd._id, 'approve')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => {
                      setAdToReject(selectedAd);
                      setShowConfirmModal(true);
                    }}
                    className="border border-red-300 text-red-500 hover:bg-red-50 px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Main Product Showcase Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Big Image & Thumbnails */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-[400px]">
                    <span className="absolute top-4 left-4 bg-emerald-800 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                      <CheckCircle size={12} /> Verified Harvest
                    </span>
                    <img 
                      src={activeImage} 
                      alt="Selected Ad" 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Image Gallery Thumbnails */}
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {[
                      selectedAd.imageUrl || 'https://images.unsplash.com/photo-1618512497248-acc0d6ef325e?auto=format&fit=crop&w=600&q=80',
                      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
                      'https://images.unsplash.com/photo-1508748446731-fce12e56a29f?auto=format&fit=crop&w=600&q=80',
                      'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80',
                      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
                    ].map((imgUrl, index) => (
                      <img 
                        key={index}
                        src={imgUrl}
                        alt="thumbnail"
                        onClick={() => setActiveImage(imgUrl)}
                        className={`w-20 h-20 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                          activeImage === imgUrl ? 'border-emerald-600 scale-105 shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right: Pricing, Specs & Seller Info */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Title & Location */}
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">{selectedAd.title || 'Red Onions'}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-md border border-emerald-100">
                        Local Variety: {selectedAd.variety || 'Jaffna Special'}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin size={16} className="text-gray-400" /> {selectedAd.location || 'Jaffna, Sri Lanka'}
                      </span>
                    </div>
                  </div>

                  {/* Price & Stock Card (Dark Green Box) */}
                  <div className="bg-[#0b6631] text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                    <p className="text-[11px] font-bold tracking-widest text-emerald-200 uppercase">Expected Market Price</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-black">LKR {selectedAd.price || '380'}</span>
                      <span className="text-sm font-medium text-emerald-200">/ kg</span>
                    </div>
                    
                    <div className="border-t border-emerald-700/60 mt-6 pt-4 flex justify-between items-center text-sm">
                      <div>
                        <p className="text-xs text-emerald-200">Stock Available</p>
                        <p className="font-bold text-lg mt-0.5">{selectedAd.stock || '450 kg'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-emerald-200">Harvest Date</p>
                        <p className="font-bold text-lg mt-0.5">{selectedAd.harvestDate || 'Oct 12, 2024'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Seller Profile Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" 
                      alt="Seller" 
                      className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-inner"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-gray-900 text-base">{selectedAd.sellerName || 'Sunil Perera'}</h4>
                        <CheckCircle size={16} className="text-emerald-500 fill-emerald-500 text-white" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Master Cultivator since 1998</p>
                      <div className="flex items-center gap-1 mt-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400" />
                        ))}
                        <span className="text-xs text-gray-500 font-medium ml-1.5">(124 reviews)</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>

      </main>

      {/* CONFIRMATION POPUP MODAL (For Reject & Delete) */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] text-white w-full max-w-[380px] rounded-2xl p-6 shadow-2xl border border-gray-700 text-center animate-in fade-in zoom-in duration-200">
            
            <h3 className="text-emerald-400 text-xl font-bold tracking-wide">Reject Advertiesment</h3>
            
            <div className="my-6 flex flex-col items-center justify-center">
              <div className="text-amber-200 mb-2">
                <AlertTriangle size={32} />
              </div>
              <p className="text-gray-200 font-medium text-base">Are You Sure?</p>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button 
                onClick={() => handleAdAction(adToReject._id, 'reject')}
                className="bg-[#c5221f] hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-md"
              >
                Reject & Delete
              </button>
              <button 
                onClick={() => {
                  setShowConfirmModal(false);
                  setAdToReject(null);
                }}
                className="bg-gray-700/80 hover:bg-gray-700 text-gray-200 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdModeration;