import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import Sidebar from './Components/Sidebar';

// Demo data matching the listings table
const DEMO_LISTINGS = [
  {
    id: '1',
    title: 'Cinnamon [Grade A]',
    ref: '#CN-2042',
    quantity: '500 Kg',
    price: '3,200 - 3,500',
    status: 'Live',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '2',
    title: 'BOPF Tea Leaves',
    ref: '#TL-1988',
    quantity: '1,200 Kg',
    price: '1,800 - 2,000',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '3',
    title: 'BOPF Tea Leaves',
    ref: '#TL-1988',
    quantity: '1,200 Kg',
    price: '1,800 - 2,000',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '4',
    title: 'BOPF Tea Leaves',
    ref: '#TL-1988',
    quantity: '1,200 Kg',
    price: '1,800 - 2,000',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '5',
    title: 'BOPF Tea Leaves',
    ref: '#TL-1988',
    quantity: '1,200 Kg',
    price: '1,800 - 2,000',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '6',
    title: 'BOPF Tea Leaves',
    ref: '#TL-1988',
    quantity: '1,200 Kg',
    price: '1,800 - 2,000',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=150&q=80',
  },
];

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans w-full">
      {/* Reusable Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full overflow-hidden">
        <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
          
          {/* Header Title Only */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Seller Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your produce, chats, and marketplace performance.
            </p>
          </div>

          {/* My Listings Table Feature */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm w-full overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">My Listings</h2>
            </div>

            {/* Fully Responsive Desktop & Tablet Table Wrapper */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Crop Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (LKR)</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right pr-10">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {DEMO_LISTINGS.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Ref: {item.ref}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 font-medium">{item.quantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 font-medium whitespace-nowrap">{item.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                          item.status === 'Live' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right pr-8">
                        <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition">
                          <button 
                            type="button" 
                            aria-label="Edit Listing" 
                            className="p-2 text-gray-400 hover:text-emerald-600 transition rounded-lg hover:bg-emerald-50 cursor-pointer"
                          >
                            <FiEdit2 className="text-base" />
                          </button>
                          <button 
                            type="button" 
                            aria-label="Delete Listing" 
                            className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-red-50 cursor-pointer"
                          >
                            <FiTrash2 className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-1.5">
                <button className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition cursor-pointer">
                  Previous
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-md bg-[#6b5835] text-white text-xs font-bold shadow-sm">
                  1
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-xs font-semibold transition cursor-pointer">
                  2
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-xs font-semibold transition cursor-pointer">
                  3
                </button>
                <span className="text-gray-400 px-1">...</span>
                <button className="w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-xs font-semibold transition cursor-pointer">
                  16
                </button>
                <button className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition cursor-pointer">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                <span>Go to page:</span>
                <input 
                  type="text" 
                  defaultValue="1" 
                  className="w-10 h-7 border border-gray-200 rounded text-center focus:outline-none focus:border-emerald-600 bg-white" 
                />
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;