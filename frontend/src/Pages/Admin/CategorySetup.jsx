import React, { useState, useEffect } from 'react';
import Sidebar from './Components/AdminSidebar';
import { Search, Bell, Plus, Edit2, Trash2, Layers, X } from 'lucide-react';

const CategorySetup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  
  // States for the Add Category Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      let url = 'http://localhost:5000/api/admin/categories';
      if (searchTerm) {
        url += `?search=${searchTerm}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handler for saving a new category to the database
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('http://localhost:5000/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName })
      });
      
      // Clear input, close modal, and refresh list
      setNewCategoryName('');
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await fetch(`http://localhost:5000/api/admin/categories/${id}`, {
          method: 'DELETE'
        });
        fetchCategories(); 
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans relative">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white px-8 py-6 flex justify-between items-start border-b border-gray-100">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight">Category setup</h1>
            <p className="text-gray-500 text-sm mt-1">Manage vegetable and produce categories.</p>
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

        <div className="p-8">
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus size={18} />
              Add category
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
            <div className="flex flex-col">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <div 
                    key={category._id || index} 
                    className={`flex items-center justify-between p-5 ${
                      index !== categories.length - 1 ? 'border-b border-gray-100' : ''
                    } hover:bg-gray-50/50 transition-colors`}
                  >
                    <div className="w-1/3">
                      <span className="text-sm font-bold text-gray-800">
                        {category.name || 'Category Name'}
                      </span>
                    </div>

                    <div className="flex-1">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100 shadow-sm">
                        <Layers size={14} className="text-emerald-500" />
                        {category.count || 0} listings
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 border border-gray-200 rounded-lg transition-all"
                        title="Edit Category"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-lg transition-all"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No categories found. Click "Add category" to create one.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ADD CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Category</h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setNewCategoryName('');
                }} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCategory}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name
                </label>
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Organic Vegetables" 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewCategoryName('');
                  }}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !newCategoryName.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default CategorySetup;