import React, { useState, useEffect } from 'react';
import banner1 from '../../Assets/Images/farmnet-banner.jpeg';
import banner2 from '../../Assets/Images/farmnet-banner2.jpg';

import banner3 from '../../Assets/Images/farmnet-banner3.jpg';

export default function AuthBrandPanel() {
  // Array of slides with images and corresponding taglines
  const slides = [
    {
      image: banner1,
      tagline: 'Bridging tradition with technology for a sustainable agricultural future.',
    },
    {
      image: banner2,
      tagline: 'Empowering local farmers with transparent, real-time market pricing.',
    },
    {
      image: banner3,
      tagline: 'Direct seller buyer communication trough real-time chat and notifications.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-switch images 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2500);

    return () => clearInterval(interval); // Clean up on unmount
  }, [slides.length]);

  return (
    <div className="hidden md:flex flex-col justify-between w-[280px] relative p-6 text-white shrink-0 overflow-hidden bg-[#0a3812]">
      {/* Carousel Background Images with Cross-Fade */}
      {slides.map((slide, index) => (
        <img
          key={index}
          src={slide.image}
          alt={`Slide ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 scale-105 transition-transform duration-[2500ms]' : 'opacity-0 scale-100'
          }`}
        />
      ))}

      {/* Dark Green Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06260e]/50 to-[#031c0a]/95 z-10" />

      {/* Top Spacer */}
      <div className="relative z-20" />

      {/* Bottom Brand Details & Dynamic Content */}
      <div className="relative z-20 space-y-2.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
          FarmNet
        </h1>
        
        {/* Animated Tagline */}
        <p className="text-xs font-normal text-emerald-100/90 leading-relaxed min-h-[36px] transition-all duration-500">
          {slides[currentIndex].tagline}
        </p>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center gap-1.5 pt-1">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                index === currentIndex
                  ? 'w-4 bg-emerald-400'
                  : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}