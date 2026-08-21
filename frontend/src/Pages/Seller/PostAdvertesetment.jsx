import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import axios from 'axios';
import { 
  FiUploadCloud, 
  FiDollarSign, 
  FiLayers, 
  FiMapPin, 
  FiCalendar, 
  FiTag, 
  FiCheckCircle, 
  FiAlertCircle,
  FiX
} from 'react-icons/fi';
import Sidebar from './Components/Sidebar'; 

const PostAdvertisement = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Client-Side Validation Schema

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title cannot exceed 100 characters')
      .required('Crop listing title is required'),
    category: Yup.string()
      .required('Please select a category'),
    quantity: Yup.number()
      .typeError('Quantity must be a valid number')
      .positive('Quantity must be greater than zero')
      .required('Quantity is required'),
    unit: Yup.string()
      .required('Measurement unit is required'),
    pricePerUnit: Yup.number()
      .typeError('Price must be a valid number')
      .positive('Price must be greater than zero')
      .required('Price per unit is required'),
    harvestDate: Yup.date()
      .required('Harvest / Availability date is required'),
    district: Yup.string()
      .required('District / Farm location is required'),
    description: Yup.string()
      .min(20, 'Description must be at least 20 characters')
      .max(1000, 'Description cannot exceed 1000 characters')
      .required('Detailed description is required'),
  });

  // Formik Hook 
  const formik = useFormik({
    initialValues: {
      title: '',
      category: '',
      variety:'',
      quantity: '',
      unit: 'kg',
      pricePerUnit: '',
      harvestDate: '',
      district: '',
      description: '',
      isOrganic: false,
      acceptsBids: false
    },

    validationSchema,
    onSubmit: async (values, { resetForm }) => {

      if (selectedImages.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Image Required',
          text: 'Please upload at least 1 image of your harvest before submitting.',
          confirmButtonColor: '#059669'
        });
        return;
      }

      // Confirmation Alert

      Swal.fire({
        title: 'Submit Advertisement?',
        text: 'Your advertisement will be submitted for Admin Review and will go live upon approval.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, Submit',
        cancelButtonText: 'Cancel'
      }).then(async (result) => {
        if (result.isConfirmed) {

          Swal.fire({
            title: 'Uploading..........',
            text:"Please wait until proess your images and submit the listing",
            allowOutsideClick:false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          try {
            // Prepare FormData
            const formData = new FormData();
            
            // Append all text fields
            Object.keys(values).forEach(key => {
              formData.append(key, values[key]);
            });

            // Append all image files
            selectedImages.forEach((image) => {
              formData.append('images', image);
            });

            // Send to Backend via Axios
            const token = localStorage.getItem('token'); 
            
            await axios.post('http://localhost:5000/api/advertisement', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` 
              }
            });

            // 3. Success Feedback
            Swal.fire({
              icon: 'success',
              title: 'Submitted for Verification!',
              text: 'Your harvest listing has been submitted for admin approval.',
              confirmButtonColor: '#059669'
            });

          // Reset UI
          resetForm();
          setSelectedImages([]);
          setImagePreviews([]);
        }catch (error) {
            console.error('Upload Error:', error);
            Swal.fire({
              icon: 'error',
              title: 'Submission Failed',
              text: error.response?.data?.message || 'Something went wrong while uploading. Please try again.',
              confirmButtonColor: '#ef4444'
            });
          }
        }
      });
    }
  });

  // Handle Multi-Image Selection 

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      Swal.fire({
        icon: 'error',
        title: 'Limit Exceeded',
        text: 'You can upload a maximum of 5 images.',
        confirmButtonColor: '#059669'
      });
      return;
    }

    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove preview image

  const removeImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
       {/* Sidebar adding */}
      <Sidebar />

      {/* 2. Main Visible Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Banner */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Post New Harvest Advertisement
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in your harvest details below to submit a listing for direct buyers.
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 w-fit">
                <FiAlertCircle className="mr-1.5" /> Requires Admin Approval
              </span>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            
            {/* Section 1: Basic Information */}

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
                <FiTag className="text-emerald-600" /> Basic Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Advertisement Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Fresh Greenhouse Bell Peppers (Grade A)"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                      formik.touched.title && formik.errors.title
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.title}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 transition ${
                      formik.touched.category && formik.errors.category
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                  >
                    <option value="">Select Category</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Greenhouse Special">Greenhouse Special</option>
                    <option value="Grains & Legumes">Grains & Legumes</option>
                    <option value="Spices & Herbs">Spices & Herbs</option>
                  </select>
                  {formik.touched.category && formik.errors.category && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.category}</p>
                  )}
                </div>

                {/* Variety */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Variety <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="variety"
                    value={formik.values.variety}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 transition ${
                      formik.touched.category && formik.errors.category
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                  >
                    <option value="">Select Variety</option>
                    <option value="Bell Pepper - Green">Bell Pepper - Green</option>
                    <option value="Bell Pepper - Red/Yellow">Bell Pepper - Red/Yellow</option>
                    <option value="Salad Cucumber">Salad Cucumber</option>
                    <option value="Cherry Tomatoes">Cherry Tomatoes</option>
                    <option value="Beefsteak Tomatoes">Beefsteak Tomatoes</option>
                    <option value="Hydroponic Lettuce">Hydroponic Lettuce</option>
                    <option value="Other">Other Variety</option>
                  </select>
                  {formik.touched.category && formik.errors.category && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.variety}</p>
                  )}
                </div>

                {/* District Location */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    <FiMapPin className="text-gray-400" /> District / Farm Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formik.values.district}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 transition ${
                      formik.touched.district && formik.errors.district
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                  >
                    <option value="">Select District</option>
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Matale">Matale</option>
                    <option value="Badulla">Badulla</option>
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Anuradhapura">Anuradhapura</option>
                  </select>
                  {formik.touched.district && formik.errors.district && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.district}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Quantity & Pricing */}

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
                <FiDollarSign className="text-emerald-600" /> Pricing & Quantity
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Available Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="e.g., 500"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                      formik.touched.quantity && formik.errors.quantity
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                  />
                  {formik.touched.quantity && formik.errors.quantity && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.quantity}</p>
                  )}
                </div>

                {/* Unit */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="unit"
                    value={formik.values.unit}
                    onChange={formik.handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100 transition"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="units">Units / Pieces</option>
                    <option value="crates">Crates / Packs</option>
                  </select>
                </div>

                {/* Price */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Price per Unit (LKR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 text-xs font-bold">
                      Rs.
                    </span>
                    <input
                      type="number"
                      name="pricePerUnit"
                      placeholder="e.g., 380"
                      value={formik.values.pricePerUnit}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                        formik.touched.pricePerUnit && formik.errors.pricePerUnit
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                      }`}
                    />
                  </div>
                  {formik.touched.pricePerUnit && formik.errors.pricePerUnit && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.pricePerUnit}</p>
                  )}
                </div>
              </div>

              {/* Harvest Date */}

              <div className="sm:w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                  <FiCalendar className="text-gray-400" /> Harvest / Available Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="harvestDate"
                  value={formik.values.harvestDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                    formik.touched.harvestDate && formik.errors.harvestDate
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                  }`}
                />
                {formik.touched.harvestDate && formik.errors.harvestDate && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.harvestDate}</p>
                )}
              </div>
            </div>

            {/* Section 3: Media Upload & Description */}

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
                <FiLayers className="text-emerald-600" /> Photos & Description
              </h2>

              {/* Multi-Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Harvest Photos (Max 5 Images) <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-2xl transition bg-gray-50/50">
                  <div className="space-y-2 text-center">
                    <FiUploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer rounded-md font-semibold text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                        <span>Click to choose images</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB each</p>
                  </div>
                </div>

                {/* Local Previews */}

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square shadow-xs">
                        <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition"
                        >
                          <FiX className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe produce quality, cultivation details, packaging, delivery or pickup instructions..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                    formik.touched.description && formik.errors.description
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                  }`}
                ></textarea>
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.description}</p>
                )}
              </div>

              {/* Extra Checkboxes */}

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isOrganic"
                    checked={formik.values.isOrganic}
                    onChange={formik.handleChange}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">100% Organically Grown</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptsBids"
                    checked={formik.values.acceptsBids}
                    onChange={formik.handleChange}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Allow Buyer Price Offers (Negotiation)</span>
                </label>
              </div>
            </div>

            {/* Form Submit Button */}

            <div className="flex justify-end gap-3 pt-2 pb-12">
              <button
                type="submit"
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <FiCheckCircle className="text-lg" /> Submit for Verification
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default PostAdvertisement;