'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import BuyerSidebar from "@/app/components/BuyerSidebar";
import {
  FiSave,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiFileText,
  FiMail,
  FiUser,
  FiCheck,
  FiEdit2,
  FiGlobe,
  FiCalendar,
  FiShield,
  FiX,
  FiEdit,
  FiMenu,
  FiArrowLeft
} from "react-icons/fi";

export default function BuyerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    requirements: "",
    phone: "",
    location: "",
  });

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/buyer/profile", { method: 'GET' });
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.message || "Failed to load profile");
          return;
        }

        setProfile(data.profile);
        setFormData({
          company_name: data.profile.company_name ?? "",
          requirements: data.profile.requirements ?? "",
          phone: data.profile.phone ?? "",
          location: data.profile.location ?? "",
        });
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/buyer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Update failed. Please check your information.");
      } else {
        setSuccess("Profile updated successfully!");
        setProfile({ ...profile, ...formData });
        setIsEditing(false); // Exit edit mode after successful save
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setSaving(false);
    }
  };

  // Start editing
  const handleEditClick = () => {
    setIsEditing(true);
    // Reset form to current profile data when starting edit
    setFormData({
      company_name: profile?.company_name ?? "",
      requirements: profile?.requirements ?? "",
      phone: profile?.phone ?? "",
      location: profile?.location ?? "",
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  // LoadingSpinner component
  const LoadingSpinner = ({ 
    message = "Loading your profile...", 
    subMessage = "This will just take a moment",
    showProgress = true,
    size = "lg" 
  }) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-12 w-12", 
      lg: "h-16 w-16"
    };

    return (
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div 
            className={`inline-block animate-spin rounded-full border-4 border-purple-100 border-t-purple-600 ${sizeClasses[size]}`}
            role="status"
            aria-label="Loading"
          >
            <span className="sr-only">{message}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {message}
            </h3>
            {subMessage && (
              <p className="text-gray-500 text-sm">{subMessage}</p>
            )}
          </div>
          
          {showProgress && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden max-w-xs mx-auto">
              <div className="animate-pulse-shimmer bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 h-full w-1/2"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Mobile Edit Overlay
  const MobileEditOverlay = () => (
    <div className="lg:hidden fixed inset-0 z-50 bg-white">
      {/* Mobile Edit Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleCancelEdit}
            className="flex items-center gap-2 text-gray-600"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Profile
          </h2>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="text-blue-600 font-medium"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Mobile Edit Form Content */}
      <div className="h-[calc(100vh-56px)] overflow-y-auto pb-4">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                placeholder="Enter your company name"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                placeholder="Enter your city and country"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base resize-none"
                placeholder="Describe the services you're looking for..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Be specific to get better matches with professionals
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <BuyerSidebar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
          <LoadingSpinner 
            message="Loading your profile..."
            subMessage="Fetching your details and preferences"
            showProgress={true}
            size="lg"
          />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen">
        <BuyerSidebar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't load your profile information.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
    

      {/* Sidebar for Desktop */}
      <div className="">
        <BuyerSidebar />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 w-full">
        <div className="max-w-6xl mx-auto">
          
          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  {profile.active_role || "Buyer"}
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
                  >
                    <FiEdit className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Success & Error Messages - Mobile */}
            {success && (
              <div className="mb-4 animate-fadeIn">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <FiCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-green-700 text-sm">{success}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 animate-fadeIn">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium flex items-center gap-2">
                  <FiShield className="w-4 h-4" />
                  <span className="capitalize">{profile.active_role || "Buyer"}</span>
                </div>
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Active</span>
                </div>
                
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    <FiEdit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* Success & Error Messages - Desktop */}
            {success && (
              <div className="mb-6 animate-fadeIn">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <FiCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-700 font-medium">{success}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 animate-fadeIn">
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Edit Overlay */}
          {isEditing && isMobile && <MobileEditOverlay />}

          {/* Profile Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4 sm:mb-6">
                    <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mx-auto overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src={profile.profile_image || "/avatar.png"}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base flex items-center justify-center gap-1 sm:gap-2">
                    <FiMail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </p>
                  
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-600 rounded-full mb-4 sm:mb-6 text-sm">
                    <FiUser className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium capitalize">{profile.active_role || "Buyer"}</span>
                  </div>
                  
                  {/* Stats - Mobile Horizontal, Desktop Grid */}
                  <div className="flex sm:grid grid-cols-3 gap-2 sm:gap-3 mt-6 sm:mt-8">
                    <div className="flex-1 sm:flex-none text-center p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl">
                      <div className="text-lg sm:text-2xl font-bold text-blue-600">12</div>
                      <div className="text-xs text-gray-600">Bookings</div>
                    </div>
                    <div className="flex-1 sm:flex-none text-center p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl">
                      <div className="text-lg sm:text-2xl font-bold text-purple-600">8</div>
                      <div className="text-xs text-gray-600">Messages</div>
                    </div>
                    <div className="flex-1 sm:flex-none text-center p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl">
                      <div className="text-lg sm:text-2xl font-bold text-green-600">4</div>
                      <div className="text-xs text-gray-600">Projects</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mt-4 sm:mt-6 shadow-sm">
                <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  Account Summary
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Member Since</span>
                    <span className="font-medium text-sm sm:text-base">
                      {new Date(profile.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700">
                  <div className="text-xs sm:text-sm text-gray-400">Need help?</div>
                  <div className="text-blue-300 font-medium hover:text-blue-200 cursor-pointer mt-1 text-sm">
                    Contact Support
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - View or Edit Mode */}
            <div className="lg:col-span-2">
              {isEditing && !isMobile ? (
                /* EDIT MODE - Desktop Only */
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                      <p className="text-gray-600 mt-1">Update your personal and professional information</p>
                    </div>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Cancel editing"
                    >
                      <FiX className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Company Name */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <FiBriefcase className="w-4 h-4 text-blue-500" />
                          Company Name
                          <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50"
                            placeholder="Enter your company name"
                          />
                          <FiBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <FiPhone className="w-4 h-4 text-blue-500" />
                          Phone Number
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50"
                            placeholder="+1 (555) 123-4567"
                          />
                          <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <FiMapPin className="w-4 h-4 text-blue-500" />
                          Location
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50"
                            placeholder="Enter your city and country"
                          />
                          <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <FiFileText className="w-4 h-4 text-blue-500" />
                          Service Requirements
                          <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            rows={5}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 resize-none"
                            placeholder="Describe the services you're looking for, your budget range, timeline, and any specific requirements..."
                          />
                          <FiFileText className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mt-2 ml-12">
                          Be specific to get better matches with professionals
                        </p>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-gray-100">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span>Saving Changes...</span>
                          </>
                        ) : (
                          <>
                            <FiSave className="w-5 h-5" />
                            <span>Save Profile Changes</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* VIEW MODE - Profile Details Card */
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Profile Details</h2>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">Your personal and professional information</p>
                    </div>
                    {!isEditing && !isMobile && (
                      <button
                        onClick={handleEditClick}
                        className="hidden sm:flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                      >
                        <FiEdit2 className="w-5 h-5" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>

                  {/* Profile Details Display */}
                  <div className="space-y-6 sm:space-y-8">
                    {/* Company Information */}
                    <div className="border-b border-gray-100 pb-4 sm:pb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        Company Information
                      </h3>
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Company Name</label>
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg sm:rounded-xl">
                            <FiBriefcase className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-gray-900 font-medium text-sm sm:text-base">
                              {profile.company_name || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-b border-gray-100 pb-4 sm:pb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <FiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg sm:rounded-xl">
                            <FiPhone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-gray-900 font-medium text-sm sm:text-base">
                              {profile.phone || "Not specified"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg sm:rounded-xl">
                            <FiMapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-gray-900 font-medium text-sm sm:text-base">
                              {profile.location || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Requirements */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <FiFileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        Service Requirements
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Your Requirements</label>
                        <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
                          <FiFileText className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-gray-900 text-sm sm:text-base whitespace-pre-wrap">
                              {profile.requirements || "No specific requirements added yet. Add your requirements to get better matches with professionals."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edit Button at Bottom - Mobile Only */}
                  {!isEditing && isMobile && (
                    <div className="flex justify-center pt-6 mt-6 border-t border-gray-100">
                      <button
                        onClick={handleEditClick}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
                      >
                        <FiEdit2 className="w-5 h-5" />
                        <span>Edit Profile</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}