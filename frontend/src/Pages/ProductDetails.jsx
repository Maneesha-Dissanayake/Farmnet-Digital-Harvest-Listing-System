import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiMapPin, 
  FiMessageSquare, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiChevronRight, 
  FiBox, 
  FiAward, 
  FiStar 
} from 'react-icons/fi';
import Nav from '../Components/Nav';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');

  // Fetch live advertisement details from backend by ID
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

  /*
  // SELLER PROFILE NAVIGATION (COMMENTED OUT UNTIL SELLER PROFILE IS COMPLETE)
  // const handleSellerClick = () => {
  //   if (product?.seller_id?._id) {
  //     navigate(`/seller-profile/${product.seller_id._id}`);
  //   } else {
  //     navigate('/seller-profile');
  //   }
  // };
  */

  /*
  // CHAT INITIATION (COMMENTED OUT UNTIL USER MESSAGING BACKEND IS COMPLETE)
  // const handleChatClick = () => {
  //   navigate(`/chat?recipient=${product?.seller_id?._id || ''}&product=${product?._id}`);
  // };
  */

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
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-xs transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const displayImages = (product.images || []).slice(0, 5);
  const formattedDate = product.harvestDate 
    ? new Date(product.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Available Now';

  const cultivatorLocation = product.district || 'Sri Lanka';

  return (
    <div className="min-h-screen flex flex-col bg-white w-full overflow-x-hidden font-sans">
      {/* 1. Full-Width Nav Header */}
      <header className="w-full">
        <Nav />
      </header>

      {/* 2. Main Full-Width Content Container */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 2xl:px-16 py-6 sm:py-8">

        {/* Dynamic User Navigation Breadcrumb Trail */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-gray-500 mb-6 sm:mb-8">
          {/* Main Products Page Link matching your Nav path */}
          <Link 
            to="/products" 
            className="hover:text-emerald-700 transition"
          >
            Products
          </Link>

          <FiChevronRight className="text-gray-400 text-xs shrink-0" />

          {/* Actual Category Link with Query Parameter filter */}
          {product.category && (
            <>
              <Link 
                to={`/products?category=${encodeURIComponent(product.category)}`} 
                className="hover:text-emerald-700 transition"
              >
                {product.category}
              </Link>
              <FiChevronRight className="text-gray-400 text-xs shrink-0" />
            </>
          )}

          {/* Current Active Product Title */}
          <span className="text-gray-900 font-semibold truncate max-w-xs sm:max-w-md">
            {product.title}
          </span>
        </nav>

        {/* Top Product Showcase: 7:5 Ratio Matching Reference Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start mb-14 sm:mb-18">
          
          {/* Left Column: Full-Span Landscape Image Showcase */}
          <div className="lg:col-span-7 space-y-4">
            <div className="w-full aspect-[16/10] max-h-[520px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/90 shadow-xs">
              <img 
                src={selectedImage || displayImages[0]} 
                alt={product.title} 
                className="w-full h-full object-cover transition duration-300"
              />
            </div>

            {/* Thumbnails Row (Max 5 items) */}
            {displayImages.length > 1 && (
              <div className="w-full grid grid-cols-5 gap-3">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      (selectedImage || displayImages[0]) === img 
                        ? 'border-emerald-600 scale-[1.03] shadow-xs' 
                        : 'border-gray-200 hover:border-emerald-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Price Card, Taller Seller Card & Chat CTA */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {product.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 mt-3">
                <span className="bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg">
                  Local Variety: {product.variety || 'Standard'}
                </span>
                <span className="inline-flex items-center text-xs sm:text-sm text-gray-500 font-medium">
                  <FiMapPin className="text-emerald-600 mr-1 shrink-0" />
                  {cultivatorLocation}
                </span>
              </div>
            </div>

            {/* Dark Green Expected Market Price Card */}
            <div className="bg-[#0b533f] text-white rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
              <div>
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest block mb-1">
                  Expected Market Price
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight">
                    LKR {product.pricePerUnit}
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

            {/* Cultivator Details Card (No Auth Required) */}
            <div 
              className="bg-white border-2 border-gray-200 rounded-2xl min-h-[165px] px-6 sm:px-8 py-8 flex items-center justify-between gap-6 shadow-sm group"
            >
              <div className="flex items-center gap-5 sm:gap-6 min-w-0">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl ring-2 ring-emerald-600/30 shrink-0">
                  {product.title?.charAt(0) || 'F'}
                </div>
                
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 truncate">
                      Verified Cultivator
                    </h3>
                    <FiCheckCircle className="text-emerald-600 text-lg shrink-0" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium truncate">
                    Farm in {cultivatorLocation}
                  </p>
                  
                  <div className="flex items-center gap-1.5 pt-0.5 text-amber-500 text-sm">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="fill-current text-sm" />
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs font-bold ml-1">
                      (FarmNet Verified)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-100/80 px-4 py-3 rounded-xl transition shrink-0 shadow-2xs">
                <span>Active</span>
              </div>
            </div>

            {/* High-Attention Animated Chat Button */}
            <div className="relative w-full">
              <span className="absolute -inset-1 bg-emerald-500 rounded-2xl blur-sm opacity-60 animate-pulse pointer-events-none"></span>

              <button
                type="button"
                onClick={() => {
                  /*
                  // TODO: Connect to handleChatClick() when chat backend is ready
                  */
                  alert('Chat system will be connected once user messaging backend is active.');
                }}
                className="relative w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-base font-bold shadow-xl shadow-emerald-900/30 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] overflow-hidden group"
              >
                <span className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] pointer-events-none animate-[shimmer_2.5s_infinite]"></span>
                <FiMessageSquare className="text-xl animate-bounce group-hover:scale-110 transition-transform shrink-0" />
                <span className="tracking-wide">Chat with Seller</span>
              </button>
            </div>

            {/* Report Listing */}
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
          </div>
        </div>

        {/* 3. Description Section */}
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

        {/* 4. Crop Specifications Section */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Crop Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Organic Standard Card */}
            <div className="bg-white border border-gray-200 hover:border-emerald-300 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200">
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

            {/* Packaging Card */}
            <div className="bg-white border border-gray-200 hover:border-emerald-300 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200">
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