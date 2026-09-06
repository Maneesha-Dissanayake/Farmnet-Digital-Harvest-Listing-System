import React, { useState, useEffect } from 'react';
import Sidebar from './Components/AdminSidebar';
import { Search, Bell, Plus, Edit2, Trash2, Layers, X, AlertTriangle } from 'lucide-react';

const CategorySetup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  
  // States for Add Category Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for Edit Category Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // States for Custom Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/admin/categories';
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
      setCategories(data.categories || data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  // Handler for adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/admin/categories', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ name: newCategoryName })
      });
      
      setNewCategoryName('');
      setIsAddModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for opening edit modal
  const openEditModal = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setIsEditModalOpen(true);
  };

  // Handler for updating category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategoryName.trim() || !editingCategory) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/admin/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ name: editCategoryName })
      });
      
      setIsEditModalOpen(false);
      setEditingCategory(null);
      setEditCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for opening custom delete confirmation modal
  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // Handler for executing deletion
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/admin/categories/${categoryToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories(); 
    } catch (error) {
      console.error("Error deleting category:", error);
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
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus size={18} />
              Add category
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
            <div className="flex flex-col">
              {Array.isArray(categories) && categories.length > 0 ? (
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
                        onClick={() => openEditModal(category)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 border border-gray-200 rounded-lg transition-all"
                        title="Edit Category"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => confirmDelete(category)}
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
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Category</h3>
              <button onClick={() => { setIsAddModalOpen(false); setNewCategoryName(''); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Organic Vegetables" 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  autoFocus
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setNewCategoryName(''); }} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={isSubmitting || !newCategoryName.trim()} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold">
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Category</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                <input 
                  type="text" 
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  autoFocus
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={isSubmitting || !editCategoryName.trim()} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold">
                  {isSubmitting ? 'Updating...' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL (Matching your design screenshot) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] text-white w-full max-w-[380px] rounded-2xl p-6 shadow-2xl border border-gray-700 text-center animate-in fade-in zoom-in duration-200">
            
            <h3 className="text-emerald-400 text-xl font-bold tracking-wide">Delete Category</h3>
            
            <div className="my-6 flex flex-col items-center justify-center">
              <div className="text-amber-200 mb-2">
                <AlertTriangle size={32} />
              </div>
              <p className="text-gray-200 font-medium text-base">Are You Sure?</p>
              <p className="text-xs text-gray-400 mt-1">
                Do you want to delete <span className="font-semibold text-white">"{categoryToDelete?.name}"</span>?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button 
                onClick={handleDeleteCategory}
                className="bg-[#c5221f] hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-md flex-1"
              >
                Delete
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-700/80 hover:bg-gray-700 text-gray-200 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors flex-1"
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

export default CategorySetup;