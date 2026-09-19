import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  FiX,
  FiBold,
  FiItalic,
  FiList,
  FiEye,
  FiEdit3,
  FiLoader
} from 'react-icons/fi';
import Sidebar from './Components/Sidebar'; 

const EditAdvertisement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [descriptionTab, setDescriptionTab] = useState('write');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-Side Validation Schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(5, 'Title must be at least 5 characters / මාතෘකාව අකුරු 5කට වඩා දිග විය යුතුය')
      .max(100, 'Title cannot exceed 100 characters')
      .required('Crop listing title is required'),
    category: Yup.string().required('Please select a category'),
    variety: Yup.string().required('Variety is required'),
    quantity: Yup.number()
      .typeError('Quantity must be a valid number')
      .positive('Quantity must be greater than zero')
      .required('Quantity is required'),
    unit: Yup.string().required('Measurement unit is required'),
    pricePerUnit: Yup.number()
      .typeError('Price must be a valid number')
      .positive('Price must be greater than zero')
      .required('Price per unit is required'),
    harvestDate: Yup.date().required('Harvest / Availability date is required'),
    district: Yup.string().required('District / Farm location is required'),
    description: Yup.string()
      .min(20, 'Description must be at least 20 characters / විස්තරය අවම වශයෙන් අකුරු 20ක් විය යුතුය')
      .max(1500, 'Description cannot exceed 1500 characters')
      .required('Detailed description is required'),
    organicLevel: Yup.string()
      .max(300, 'Organic details cannot exceed 300 characters')
      .required('Organic level details are required'),
    packaging: Yup.string()
      .max(300, 'Packaging details cannot exceed 300 characters')
      .required('Packaging details are required'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      category: '',
      variety: '',
      quantity: '',
      unit: 'kg',
      pricePerUnit: '',
      harvestDate: '',
      district: '',
      description: '',
      organicLevel: '',
      packaging: '',
      isOrganic: false,
      acceptsBids: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (existingImages.length + newImageFiles.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Image Required / පින්තූරයක් ඇතුළත් කරන්න',
          text: 'Please retain or upload at least 1 image before saving.',
          confirmButtonColor: '#059669',
        });
        return;
      }

      Swal.fire({
        title: 'Submit Updated Listing?',
        text: 'Modifying details will re-submit this listing for Admin Review and temporarily set it to Pending.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, Update Listing',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          setIsSubmitting(true);
          Swal.fire({
            title: 'Updating Listing...',
            text: 'Synchronizing images and submitting changes to admin moderation.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });

          try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
              formData.append(key, values[key]);
            });

            existingImages.forEach((url) => {
              formData.append('existingImages', url);
            });

            newImageFiles.forEach((file) => {
              formData.append('images', file);
            });

            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/advertisements/${id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            });

            Swal.fire({
              icon: 'success',
              title: 'Submitted for Admin Approval!',
              text: 'Listing updated successfully and routed to admin for verification.',
              confirmButtonColor: '#059669',
            });

            navigate('/dashboard');
          } catch (error) {
            console.error('Update Error:', error);
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: error.response?.data?.message || 'Failed to update advertisement.',
              confirmButtonColor: '#ef4444',
            });
          } finally {
            setIsSubmitting(false);
          }
        }
      });
    },
  });

  // Fetch Existing Listing Data
  useEffect(() => {
    const fetchExistingAd = async () => {
      try {
        const token = localStorage.getItem('token');
        let res;
        try {
          res = await axios.get(`http://localhost:5000/api/advertisements/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
        } catch {
          res = await axios.get(`http://localhost:5000/api/advertisement/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
        }

        const ad = res.data.advertisement || res.data.ad || res.data.listing || res.data;
        if (ad) {
          formik.setValues({
            title: ad.title || '',
            category: ad.category || '',
            variety: ad.variety || '',
            quantity: ad.quantity || '',
            unit: ad.unit || 'kg',
            pricePerUnit: ad.pricePerUnit || ad.price || '',
            harvestDate: ad.harvestDate ? ad.harvestDate.substring(0, 10) : '',
            district: ad.district || '',
            description: ad.description || '',
            organicLevel: ad.organicLevel || '',
            packaging: ad.packaging || '',
            isOrganic: Boolean(ad.isOrganic),
            acceptsBids: Boolean(ad.acceptsBids),
          });

          if (ad.images && Array.isArray(ad.images)) {
            setExistingImages(ad.images);
          }
        }
      } catch (err) {
        console.error('Error loading listing details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchExistingAd();
  }, [id]);

  // Image Upload Handlers
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + newImageFiles.length + files.length > 5) {
      Swal.fire({
        icon: 'error',
        title: 'Limit Exceeded',
        text: 'You can upload a maximum of 5 images.',
        confirmButtonColor: '#059669',
      });
      return;
    }

    setNewImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Markdown Formatting Toolbar Actions
  const applyFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = formik.values.description || '';
    const selected = currentText.substring(start, end);
    let replacement = '';

    if (prefix === 'bullet') {
      replacement = selected
        ? selected.split('\n').map((line) => (line.trim().startsWith('• ') ? line : `• ${line}`)).join('\n')
        : '\n• ';
    } else {
      replacement = `${prefix}${selected || 'text'}${suffix}`;
    }

    const updated = currentText.substring(0, start) + replacement + currentText.substring(end);
    formik.setFieldValue('description', updated);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + replacement.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  // Preview Renderer for Description
  const renderFormattedPreview = (text) => {
    if (!text || !text.trim()) {
      return (
        <p className="text-gray-400 italic text-xs leading-relaxed">
          Nothing to preview yet / පෙරදසුනක් නොමැත...
        </p>
      );
    }

    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-sm text-gray-800 leading-relaxed font-sans">
        {lines.map((line, lineIndex) => {
          const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
          const isBullet = line.trim().startsWith('•');

          return (
            <div key={lineIndex} className={`${isBullet ? 'pl-2.5' : ''}`}>
              {parts.map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={partIndex} className="font-bold text-gray-900">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                  return (
                    <em key={partIndex} className="italic text-gray-800">
                      {part.slice(1, -1)}
                    </em>
                  );
                }
                return <span key={partIndex}>{part}</span>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500 gap-2">
        <FiLoader className="animate-spin text-emerald-600 text-2xl" />
        <span>Loading listing information...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header Banner */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Edit Harvest Advertisement
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in your harvest details below to submit a listing for direct buyers. (English / සිංහල)
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 w-fit">
                <FiAlertCircle className="mr-1.5" /> Requires Admin Approval
              </span>
            </div>
          </div>

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
                    Advertisement Title / දැන්වීමේ මාතෘකාව <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm leading-relaxed focus:outline-none focus:ring-2 transition ${
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
                    <option value="Vegetables">Vegetables / එළවළු</option>
                    <option value="Fruits">Fruits / පළතුරු</option>
                    <option value="Greenhouse Special">Greenhouse Special / හරිතාගාර නිෂ්පාදන</option>
                    <option value="Grains & Legumes">Grains & Legumes / ධාන්‍ය වර්ග</option>
                    <option value="Spices & Herbs">Spices & Herbs / කුළුබඩු වර්ග</option>
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
                      formik.touched.variety && formik.errors.variety
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
                  {formik.touched.variety && formik.errors.variety && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.variety}</p>
                  )}
                </div>

                {/* District */}
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
                    <option value="Nuwara Eliya">Nuwara Eliya (නුවරඑළිය)</option>
                    <option value="Kandy">Kandy (මහනුවර)</option>
                    <option value="Matale">Matale (මාතලේ)</option>
                    <option value="Badulla">Badulla (බදුල්ල)</option>
                    <option value="Colombo">Colombo (කොළඹ)</option>
                    <option value="Gampaha">Gampaha (ගම්පහ)</option>
                    <option value="Kalutara">Kalutara (කළුතර)</option>
                    <option value="Kurunegala">Kurunegala (කුරුණෑගල)</option>
                    <option value="Anuradhapura">Anuradhapura (අනුරාධපුර)</option>
                  </select>
                  {formik.touched.district && formik.errors.district && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.district}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Quantity */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
                <FiDollarSign className="text-emerald-600" /> Pricing & Quantity
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Available Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
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
                    <option value="kg">Kilograms (kg / කි.ග්‍රෑ.)</option>
                    <option value="g">Grams (g / ග්‍රෑම්)</option>
                    <option value="units">Units / Pieces (ඒකක)</option>
                    <option value="crates">Crates / Packs (පෙට්ටි)</option>
                  </select>
                </div>

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

              {/* Upload Box */}
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-2xl transition bg-gray-50/50">
                <div className="space-y-2 text-center">
                  <FiUploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer rounded-md font-semibold text-emerald-600 hover:text-emerald-500">
                      <span>Click to upload additional photos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB (Max 5 Total)</p>
                </div>
              </div>

              {/* Synchronized Gallery Previews */}
              {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                  {/* Saved Cloudinary Images */}
                  {existingImages.map((src, index) => (
                    <div key={`existing-${index}`} className="relative group rounded-xl overflow-hidden border border-emerald-300 aspect-square shadow-xs">
                      <img src={src} alt={`Saved crop ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        title="Remove image (Deletes from Cloudinary upon submit)"
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition"
                      >
                        <FiX className="text-xs" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-emerald-800/80 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                        Cloudinary
                      </span>
                    </div>
                  ))}

                  {/* Newly Picked Files */}
                  {newImagePreviews.map((src, index) => (
                    <div key={`new-${index}`} className="relative group rounded-xl overflow-hidden border border-blue-400 aspect-square shadow-xs">
                      <img src={src} alt={`New upload ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition"
                      >
                        <FiX className="text-xs" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-blue-700/80 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                        New
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Detailed Description */}
              <div className="pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Detailed Description / සවිස්තරාත්මක විස්තරය <span className="text-red-500">*</span>
                    </label>

                    {/* Write / Preview Tab Switcher */}
                    <div className="inline-flex p-0.5 bg-gray-100 rounded-lg border border-gray-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setDescriptionTab('write')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
                          descriptionTab === 'write' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
                        }`}
                      >
                        <FiEdit3 className="text-xs" /> Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescriptionTab('preview')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
                          descriptionTab === 'preview' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
                        }`}
                      >
                        <FiEye className="text-xs" /> Preview / පෙරදසුන
                      </button>
                    </div>
                  </div>

                  {/* Formatting Buttons */}
                  {descriptionTab === 'write' && (
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                      <button
                        type="button"
                        title="Bold (**text**)"
                        onClick={() => applyFormatting('**', '**')}
                        className="p-1.5 hover:bg-white text-gray-700 rounded transition text-xs font-bold"
                      >
                        <FiBold />
                      </button>
                      <button
                        type="button"
                        title="Italic (*text*)"
                        onClick={() => applyFormatting('*', '*')}
                        className="p-1.5 hover:bg-white text-gray-700 rounded transition text-xs italic"
                      >
                        <FiItalic />
                      </button>
                      <div className="h-4 w-px bg-gray-300 mx-0.5" />
                      <button
                        type="button"
                        title="Add Bullet Point"
                        onClick={() => applyFormatting('bullet')}
                        className="p-1.5 hover:bg-white text-gray-700 rounded transition text-xs"
                      >
                        <FiList />
                      </button>
                    </div>
                  )}
                </div>

                {/* Textarea or Preview */}
                {descriptionTab === 'write' ? (
                  <textarea
                    ref={textareaRef}
                    name="description"
                    rows="5"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 rounded-xl border text-sm leading-relaxed font-sans focus:outline-none focus:ring-2 transition ${
                      formik.touched.description && formik.errors.description
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                  ></textarea>
                ) : (
                  <div className="w-full min-h-[120px] p-4 rounded-xl border border-gray-200 bg-gray-50/50 shadow-inner">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-2">
                      Buyer View Preview / පාරිභෝගිකයාට පෙනෙන ආකාරය
                    </span>
                    {renderFormattedPreview(formik.values.description)}
                  </div>
                )}

                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.description}</p>
                )}
              </div>

              {/* Crop Specifications */}
              <div className="pt-2">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Crop Specifications / බෝග විස්තර
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Organic Level / කාබනික මට්ටම <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="organicLevel"
                      rows="3"
                      value={formik.values.organicLevel}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm leading-relaxed font-sans focus:outline-none focus:ring-2 transition ${
                        formik.touched.organicLevel && formik.errors.organicLevel
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                      }`}
                    />
                    {formik.touched.organicLevel && formik.errors.organicLevel && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.organicLevel}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Packaging / ඇසුරුම්කරණය <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="packaging"
                      rows="3"
                      value={formik.values.packaging}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm leading-relaxed font-sans focus:outline-none focus:ring-2 transition ${
                        formik.touched.packaging && formik.errors.packaging
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                      }`}
                    />
                    {formik.touched.packaging && formik.errors.packaging && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.packaging}</p>
                    )}
                  </div>
                </div>
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
                  <span className="text-sm font-medium text-gray-700">100% Organically Grown (කාබනික නිෂ්පාදනයකි)</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptsBids"
                    checked={formik.values.acceptsBids}
                    onChange={formik.handleChange}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Allow Buyer Price Offers (මිල ගණන් සාකච්ඡා කළ හැක)</span>
                </label>
              </div>
            </div>

            {/* Form Submit Button */}
            <div className="flex justify-end gap-3 pt-2 pb-12">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin text-lg" /> Submitting Changes...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="text-lg" /> Submit Updated Ad for Verification
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditAdvertisement;