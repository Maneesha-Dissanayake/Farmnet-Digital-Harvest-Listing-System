import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImage1 from '../../../Assets/Images/hero-image1.jpg';
import heroImage2 from '../../../Assets/Images/hero-image2.jpg';
import heroImage3 from '../../../Assets/Images/hero-image3.jpg';

function Hero() {
  const images = [heroImage1, heroImage2, heroImage3];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="w-full bg-white"> 
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between font-sans"> 
         
        {/* Left Text Content */} 
        <div className="md:w-1/2 space-y-6 pr-0 md:pr-8"> 
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight"> 
            Connecting Greenhouse & Local Farmers with <span className="text-emerald-600">Trusted Buyers</span> 
          </h1> 
          <p className="text-slate-600 text-lg leading-relaxed"> 
            Empowering the Sri Lankan agricultural landscape with modern technology. Direct trade, transparent pricing, and quality-assured harvests at your fingertips. 
          </p> 
          <div className="flex flex-wrap gap-4 pt-2"> 
            <Link to="/products" className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md"> 
              Browse Fresh Harvests → 
            </Link> 
            <Link to="/contact" className="border border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded-xl font-semibold transition"> 
              Contact Buyers 
            </Link> 
          </div> 
        </div> 
 
        {/* Right Image Slideshow Banner */} 
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-end"> 
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-3xl shadow-lg w-full max-w-md"> 
            <div className="h-64 rounded-2xl overflow-hidden relative flex items-center justify-center"> 
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Hero Banner ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-[3000ms] ease-in-out transform ${
                    index === currentIndex 
                      ? 'opacity-100 scale-100 z-10' 
                      : 'opacity-0 scale-95 z-0'
                  }`}
                />
              ))}
            </div> 
          </div> 
        </div> 
 
      </div> 
    </section> 
  ); 
} 

export default Hero;