import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FiMapPin, 
  FiMessageSquare, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiChevronRight, 
  FiBox, 
  FiAward, 
  FiStar, 
  FiArrowLeft,
  FiPhone
} from 'react-icons/fi';
import Nav from '../Components/Nav';
import Sidebar from './Seller/Components/Sidebar';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  // Read referring category if passed from marketplace
  const cameFromCategory = location.state?.category;

  // Extract user identity and role from token, redirect unauthorized users
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { 
        state: { from: `/listings/${id}` }, 
        replace: true 
      });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.id || payload._id);
      setCurrentUserRole(payload.role);

      // Only allow buyers or sellers
      if (payload.role !== 'buyer' && payload.role !== 'seller') {
        navigate('/login', { 
          state: { from: `/listings/${id}` }, 
          replace: true 
        });
      }
    } catch (err) {
      console.error('Failed to parse auth token:', err);
      navigate('/login', { replace: true });
    }
  }, [id, navigate]);

  // Fetch advertisement details from Express backend
  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        setLoading(true);
        let res;
        try {
          res = await axios.get(`http://localhost:5000/api/advertisement/${id}`);
        } catch (err) {
          res = await axios.get(`http://localhost:5000/api/advertisements/${id}`);
        }

        if (res.data?.success && res.data?.advertisement) {
          const ad = res.data.advertisement;
          setProduct(ad);
          if (Array.isArray(ad.images) && ad.images.length > 0) {
            setSelectedImage(ad.images[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load harvest details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdvertisement();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col w-full font-sans">
        <header className="w-full">
          <Nav />
        </header>
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-gray-600">Loading harvest details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col w-full font-sans">
        <header className="w-full">
          <Nav />
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">This harvest item is no longer active or available.</p>
          <button 
            onClick={() => navigate('/products')} 
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Strictly seller owner view check
  const sellerId = product.seller_id?._id || product.seller_id;
  const isOwner = Boolean(
    currentUserId && 
    sellerId && 
    currentUserId === sellerId && 
    currentUserRole === 'seller'
  );

  // Process images and metadata
  const displayImages = (product.images || []).slice(0, 5);
  const activeMainImage = selectedImage || displayImages[0] || 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80';
  
  const formattedDate = product.harvestDate 
    ? new Date(product.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Available Now';

  const sellerName = product.seller_id?.fullName || 'Verified Cultivator';
  const sellerLocation = product.seller_id?.farmAddress || product.district || 'Sri Lanka';
  const sellerPhone = product.seller_id?.contactNumber;
  const sellerAvatar = product.seller_id?.profileImage;

  return (
    <div className={`min-h-screen flex ${isOwner ? 'flex-row bg-gray-50' : 'flex-col bg-white'} w-full overflow-x-hidden font-sans`}>
      {/* Seller sees Sidebar; Buyer sees public Nav header */}
      {isOwner ? (
        <Sidebar />
      ) : (
        <header className="w-full">
          <Nav />
        </header>
      )}

      {/* Main Container */}
      <main className={`flex-1 w-full ${isOwner ? 'p-6 sm:p-8 lg:p-10' : 'px-4 sm:px-8 lg:px-12 2xl:px-16 py-6 sm:py-8'}`}>
        
        {/* Dynamic Breadcrumb */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-gray-500">
            {isOwner ? (
              <Link to="/dashboard" className="hover:text-emerald-700 transition flex items-center gap-1 font-semibold">
                <FiArrowLeft className="text-sm" /> Dashboard
              </Link>
            ) : (
              <Link to="/products" className="hover:text-emerald-700 transition font-semibold">
                Products
              </Link>
            )}

            <FiChevronRight className="text-gray-400 text-xs shrink-0" />

            {(cameFromCategory || product.category) && (
              <>
                <Link 
                  to={`/products?category=${encodeURIComponent(cameFromCategory || product.category)}`}
                  className="hover:text-emerald-700 transition"
                >
                  {cameFromCategory || product.category}
                </Link>
                <FiChevronRight className="text-gray-400 text-xs shrink-0" />
              </>
            )}

            <span className="text-gray-900 font-semibold truncate max-w-xs sm:max-w-md">
              {product.title}
            </span>
          </nav>

          {isOwner && (
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
              Seller Dashboard View
            </span>
          )}
        </div>

        {/* Product Showcase: 7:5 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start mb-14 sm:mb-18">
          
          {/* Left Column: Proportional, Uncropped Image Frame */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden bg-slate-900/[0.03] border border-gray-200/90 shadow-xs flex items-center justify-center p-3">
              {/* Ambient blurred backdrop fill */}
              <img 
                src={activeMainImage} 
                alt="" 
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-20 scale-110 pointer-events-none" 
              />
              
              {/* Uncropped main photo */}
              <img 
                src={activeMainImage} 
                alt={product.title} 
                className="relative z-10 max-h-full max-w-full object-contain rounded-xl drop-shadow-sm transition-all duration-300"
              />

              {product.isOrganic && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-md tracking-wider text-white bg-emerald-600 shadow-md">
                    ORGANIC
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {displayImages.length > 1 && (
              <div className="w-full grid grid-cols-5 gap-3">
                {displayImages.map((img, idx) => {
                  const isActive = activeMainImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer p-0.5 bg-gray-50 ${
                        isActive 
                          ? 'border-emerald-600 scale-[1.03] shadow-xs' 
                          : 'border-gray-200 hover:border-emerald-300 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Title, Pricing, Seller Card, Animated Chat */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {product.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 mt-3">
                <span className="bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg">
                  Variety: {product.variety || 'Standard'}
                </span>
                <span className="inline-flex items-center text-xs sm:text-sm text-gray-500 font-medium">
                  <FiMapPin className="text-emerald-600 mr-1 shrink-0" />
                  {product.district || 'Sri Lanka'}
                </span>
              </div>
            </div>

            {/* Expected Market Price Card */}
            <div className="bg-[#0b533f] text-white rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
              <div>
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest block mb-1">
                  Expected Market Price
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight">
                    Rs. {product.pricePerUnit || product.price || 0}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-emerald-200">
                    /{product.unit || 'kg'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-700/60">
                <div>
                  <span className="text-xs text-emerald-300 block mb-0.5">Stock Available</span>
                  <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                    {product.quantity} {product.unit || 'kg'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-300 block mb-0.5">Harvest Date</span>
                  <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Cultivator Card */}
            <div 
              onClick={() => {
                if (product.seller_id?._id) {
                  navigate(`/seller-profile/${product.seller_id._id}`);
                } else {
                  navigate('/seller-profile');
                }
              }}
              className="bg-white hover:bg-emerald-50/30 border-2 border-gray-200 hover:border-emerald-600/70 rounded-2xl min-h-[160px] px-6 sm:px-8 py-6 flex items-center justify-between gap-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl ring-2 ring-emerald-600/30 group-hover:ring-emerald-600 group-hover:scale-105 transition-all duration-300 shrink-0 overflow-hidden shadow-xs">
                  {sellerAvatar ? (
                    <img src={sellerAvatar} alt={sellerName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{sellerName.charAt(0) || 'V'}</span>
                  )}
                </div>
                
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-emerald-800 transition truncate">
                      {sellerName}
                    </h3>
                    <FiCheckCircle className="text-emerald-600 text-base shrink-0 group-hover:scale-110 transition-transform" />
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
                    Farm: {sellerLocation}
                  </p>

                  {sellerPhone && (
                    <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <FiPhone className="text-xs" /> {sellerPhone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-100/80 group-hover:bg-emerald-700 group-hover:text-white px-3.5 py-2 rounded-xl transition duration-300 shrink-0 shadow-2xs">
                <span>{product.status || 'Active'}</span>
              </div>
            </div>

            {/* Conditional Action: Seller Dashboard Return vs. Buyer Animated Chat */}
            {isOwner ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-base font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <FiArrowLeft /> Back to Seller Dashboard
              </button>
            ) : (
              <>
                <div className="relative w-full">
                  <span className="absolute -inset-1 bg-emerald-500 rounded-2xl blur-md opacity-60 animate-pulse pointer-events-none"></span>

                  <button
                    type="button"
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      if (!token) {
                        navigate('/login', { state: { from: `/listings/${product._id}` } });
                      } else {
                        navigate(`/chat?recipient=${sellerId || ''}&product=${product._id}`);
                      }
                    }}
                    className="relative w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-base font-bold shadow-xl shadow-emerald-900/30 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] overflow-hidden group"
                  >
                    <span className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-25deg] pointer-events-none animate-[shimmer_2.5s_infinite]"></span>
                    <FiMessageSquare className="text-xl animate-bounce group-hover:scale-110 transition-transform shrink-0" />
                    <span className="tracking-wide">Chat with Seller</span>
                  </button>
                </div>

                <div className="text-center pt-1">
                  <button 
                    type="button" 
                    onClick={() => alert('Listing reported for moderation review.')}
                    className="inline-flex items-center text-xs font-medium text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    <FiAlertCircle className="mr-1.5 text-sm" />
                    Report this listing
                  </button>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Description Section */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Description
            </h2>
          </div>

          <div className="bg-gradient-to-br from-white via-emerald-50/15 to-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
            <p className="text-base sm:text-[17px] text-gray-700 leading-relaxed font-normal whitespace-pre-line">
              {product.description || 'No detailed description provided by the cultivator.'}
            </p>
          </div>
        </section>

        {/* Specifications Section */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Crop Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <FiAward className="text-xl" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                Organic Level
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {product.organicLevel || (product.isOrganic ? '100% Organically grown crop with natural fertilizers.' : 'Standard conventional crop production.')}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <FiBox className="text-xl" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                Packaging
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {product.packaging || 'Standard wholesale agricultural packaging.'}
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Looping Light Sweep Keyframes */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-150%) skewX(-25deg);
          }
          100% {
            transform: translateX(450%) skewX(-25deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;