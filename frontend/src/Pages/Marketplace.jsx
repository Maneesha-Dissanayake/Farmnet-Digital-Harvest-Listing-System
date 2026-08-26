import React from 'react';
import HarvestCard from '../Components/HarvestCard';

const ACTIVE_LISTINGS = [
  {
    _id: '1',
    title: 'Highland Carrots',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
    tag: 'ORGANIC',
    location: 'Nuwara Eliya, CP',
    price: '450',
    unit: 'kg',
    quantity: '120 kg'
  },
  {
    _id: '2',
    title: 'Red Onions',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    tag: 'ORGANIC',
    location: 'Jaffna, NP',
    price: '380',
    unit: 'kg',
    quantity: '450 kg'
  },
  {
    _id: '3',
    title: 'Keeri Samba Rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=600&q=80',
    tag: 'PREMIUM',
    location: 'Polonnaruwa, NCP',
    price: '210',
    unit: 'kg',
    quantity: '500 kg'
  },
  {
    _id: '4',
    title: 'Fresh Red Chilli',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    tag: 'HOT DEAL',
    location: 'Dambulla, CP',
    price: '820',
    unit: 'kg',
    quantity: '45 kg'
  },
  {
    _id: '5',
    title: 'Ceylon Cinnamon',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
    tag: 'Bulk Only',
    location: 'Matara, SP',
    price: '3200',
    unit: 'kg',
    quantity: '500+ kg'
  },
  {
    _id: '6',
    title: 'Cavendish Banana',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    tag: null,
    location: 'Embilipitiya, SP',
    price: '650',
    unit: 'comb',
    quantity: '200 qty'
  },
  {
    _id: '7',
    title: 'Local Potatoes',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    tag: null,
    location: 'Badulla, UVA',
    price: '320',
    unit: 'kg',
    quantity: '300 kg'
  }
];

const Marketplace = () => {
  return (
    <main className="min-h-screen bg-gray-50/60 pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Header Title */}
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Active Listings</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Showing {ACTIVE_LISTINGS.length} fresh products near you
          </p>
        </div>

        {/* 5-Column Listing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4.5">
          {ACTIVE_LISTINGS.map((item) => (
            <HarvestCard key={item._id} item={item} />
          ))}
        </div>

      </div>
    </main>
  );
};

export default Marketplace;