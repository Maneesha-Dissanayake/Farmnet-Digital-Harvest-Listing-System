import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiHeart } from 'react-icons/fi';

const HarvestCard = ({ item }) => {
  const navigate = useNavigate();

  // Redirect visitors to /login, logged-in users to product details
  const handleCardClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate(`/listings/${item._id}`);
    }
  };

  const hasImage = Array.isArray(item.images) && item.images.length > 0;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Product Image (First Cloudinary Image) */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {hasImage && (
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* Organic Tag */}
        {item.isOrganic && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md tracking-wider text-white bg-emerald-600 shadow-xs">
              ORGANIC
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-xs transition"
        >
          <FiHeart className="text-sm" />
        </button>
      </div>

      {/* Produce Details */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
          {item.title}
        </h3>

        <div className="flex items-center text-xs text-gray-500 mb-4 space-x-1">
          <FiMapPin className="shrink-0 text-emerald-600" />
          <span className="truncate">{item.district || 'Location N/A'}</span>
        </div>

        {/* Pricing & Quantity Row */}
        <div className="mt-auto flex items-end justify-between mb-4 pt-2 border-t border-gray-50">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 block uppercase tracking-wide">
              Price / {item.unit || 'kg'}
            </span>
            <span className="text-lg font-black text-emerald-700 leading-none">
              Rs. {item.pricePerUnit}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-semibold text-gray-400 block uppercase tracking-wide">
              Available
            </span>
            <span className="text-xs font-bold text-gray-800">
              {item.quantity} {item.unit || 'kg'}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.98]"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default HarvestCard;