import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

// Demo Data matching your reference specification (Max 5 images)[cite: 12]
const DEMO_PRODUCT = {
  _id: '2',
  title: 'Red Onions',
  category: 'Vegetables',
  variety: 'Jaffna Special',
  location: 'Jaffna, Sri Lanka',
  pricePerUnit: 380,
  unit: 'kg',
  stockAvailable: '450 kg',
  harvestDate: 'Oct 12, 2024',
  images: [
    'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'
  ],
  seller: {
    _id: 'seller_101',
    name: 'Sunil Perera',
    title: 'Master Cultivator since 1998',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    reviewsCount: 124,
    verified: true
  },
  description: 
    'Fresh, high-quality onions harvested directly from the farm are available for sale. This listing includes the onion variety, available quantity, price per kilogram, expected harvest or availability date, farm location, and product images. Buyers can contact the seller through the FarmNet platform to negotiate prices, discuss bulk orders, and arrange delivery or collection. All onions are carefully grown to ensure freshness, quality, and reliable supply.',
  specifications: {
    organicLevel: 'Grown using 100% natural fertilizers and minimal pest-control chemicals. Certified Grade A.',
    packaging: 'Standard 25kg mesh bags. Custom bulk packaging available upon request for larger orders.'
  }
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = DEMO_PRODUCT;
  const displayImages = (product.images || []).slice(0, 5); // Enforces max 5 images[cite: 12]
  const [selectedImage, setSelectedImage] = useState(displayImages[0]);

  const handleSellerClick = () => {
    navigate(`/seller-profile`);
  };

  const handleChatClick = () => {
    navigate(`/chat?recipient=${product.seller._id}&product=${product._id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white w-full overflow-x-hidden font-sans">
      {/* Full-Width Nav Header[cite: 11] */}
      <header className="w-full">
        <Nav />
      </header>

      {/* Main Full-Width Content Container */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 2xl:px-16 py-6 sm:py-8">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-gray-500 mb-6 sm:mb-8">
          <Link to="/" className="hover:text-emerald-700 transition">Marketplace</Link>
          <FiChevronRight className="text-gray-400 text-xs shrink-0" />
          <Link to="/products" className="hover:text-emerald-700 transition">{product.category}</Link>
          <FiChevronRight className="text-gray-400 text-xs shrink-0" />
          <span className="text-gray-900 font-semibold truncate">{product.title}</span>
        </nav>

        {/* Top Product Showcase: 7:5 Ratio Matching Reference Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start mb-14 sm:mb-18">
          
          {/* Left Column: Full-Span Landscape Image Showcase */}
          <div className="lg:col-span-7 space-y-4">
            <div className="w-full aspect-[16/10] max-h-[520px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/90 shadow-xs">
              <img 
                src={selectedImage} 
                alt={product.title} 
                className="w-full h-full object-cover transition duration-300"
              />
            </div>

            {/* Thumbnails Row (Max 5 items)[cite: 12] */}
            <div className="w-full grid grid-cols-5 gap-3">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === img 
                      ? 'border-emerald-600 scale-[1.03] shadow-xs' 
                      : 'border-gray-200 hover:border-emerald-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Title, Expected Market Price, Seller & Chat */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {product.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 mt-3">
                <span className="bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg">
                  Local Variety: {product.variety}
                </span>
                <span className="inline-flex items-center text-xs sm:text-sm text-gray-500 font-medium">
                  <FiMapPin className="text-emerald-600 mr-1 shrink-0" />
                  {product.location}
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
                    /{product.unit}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-700/60">
                <div>
                  <span className="text-xs text-emerald-300 block mb-0.5">Stock Available</span>
                  <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                    {product.stockAvailable}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-300 block mb-0.5">Harvest Date</span>
                  <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                    {product.harvestDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Clickable Seller Card */}
            <div 
              onClick={handleSellerClick}
              className="bg-white hover:bg-emerald-50/40 border-2 border-gray-200 hover:border-emerald-600/70 rounded-2xl min-h-[165px] px-6 sm:px-8 py-8 flex items-center justify-between gap-6 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg group"
            >
              <div className="flex items-center gap-5 sm:gap-6 min-w-0">
                <img 
                  src={product.seller.avatar} 
                  alt={product.seller.name} 
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-emerald-600/30 group-hover:ring-emerald-600 transition-all shrink-0"
                />
                
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 group-hover:text-emerald-800 transition truncate">
                      {product.seller.name}
                    </h3>
                    {product.seller.verified && (
                      <FiCheckCircle className="text-emerald-600 text-lg shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-medium truncate">
                    {product.seller.title}
                  </p>
                  
                  <div className="flex items-center gap-1.5 pt-0.5 text-amber-500 text-sm">
                    <div className="flex">
                      {[...Array(product.seller.rating)].map((_, i) => (
                        <FiStar key={i} className="fill-current text-sm" />
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs font-bold ml-1">
                      ({product.seller.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-100/80 group-hover:bg-emerald-700 group-hover:text-white px-4 py-3 rounded-xl transition shrink-0 shadow-2xs">
                <span>View</span>
                <FiChevronRight className="text-base group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* High-Attention Animated Chat Button */}
            <div className="relative w-full">
              <span className="absolute -inset-1 bg-emerald-500 rounded-2xl blur-sm opacity-60 animate-pulse pointer-events-none"></span>

              <button
                type="button"
                onClick={handleChatClick}
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
                onClick={() => alert('Report flow initialized')}
                className="inline-flex items-center text-xs font-medium text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <FiAlertCircle className="mr-1.5 text-sm" />
                Report this listing
              </button>
            </div>
          </div>
        </div>

        {/* 3. Description Section (Without Unverified Badges) */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Description
            </h2>
          </div>

          <div className="bg-gradient-to-br from-white via-emerald-50/15 to-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
            <p className="text-base sm:text-[17px] text-gray-700 leading-relaxed font-normal">
              {product.description}
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
                {product.specifications.organicLevel}
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
                {product.specifications.packaging}
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