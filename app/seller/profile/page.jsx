'use client';
import SellerSidebar from "@/app/components/SellerSidebar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiGlobe,
  FiStar,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiCalendar,
  FiCode,
  FiAward,
  FiMail,
  FiCheckCircle,
  FiX,
  FiAlertCircle,
  FiExternalLink,
  FiEye,
  FiTrendingUp,
  FiMessageSquare,
  FiHeart
} from "react-icons/fi";

export default function SellerProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [form, setForm] = useState({
    title: "",
    skills: "",
    experience_years: "",
    bio: "",
    country: "",
  });

  const fetchProfile = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/seller/profile', { 
        method: 'GET',
        cache: 'no-store'
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.data) {
          setProfile(data.data);
          setForm({
            title: data.data.title || "",
            skills: data.data.skills || "",
            experience_years: data.data.experience_years || "",
            bio: data.data.bio || "",
            country: data.data.country || "",
          });
        } else {
          setProfile(null);
          setForm({
            title: "",
            skills: "",
            experience_years: "",
            bio: "",
            country: "",
          });
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to fetch profile' });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    const method = profile ? "PUT" : "POST";
    
    try {
      const res = await fetch("/api/seller/profile", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          experience_years: form.experience_years ? Number(form.experience_years) : null,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        await fetchProfile();
        setIsEditing(false);
        setMessage({ 
          type: 'success', 
          text: profile ? 'Profile updated successfully!' : 'Profile created successfully!' 
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Error saving profile' });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your profile? This action cannot be undone.")) return;

    try {
      const res = await fetch('/api/seller/profile', {
        method: "DELETE",
      });

      const data = await res.json();
      
      if (data.success) {
        setProfile(null);
        setIsEditing(false);
        setForm({
          title: "",
          skills: "",
          experience_years: "",
          bio: "",
          country: "",
        });
        setMessage({ type: 'success', text: data.message || 'Profile deleted successfully' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Error deleting profile' });
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const skillsArray = form.skills.split(',').map(skill => skill.trim()).filter(skill => skill);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SellerSidebar />
        <div className="flex-1 md:ml-20 p-4 md:p-6">
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FiUser className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />
      
      {/* Main Content */}
      <main className="flex-1 md:ml-20 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Seller Profile
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                  {profile 
                    ? "Manage and showcase your professional profile" 
                    : "Create your professional profile to start receiving project requests"
                  }
                </p>
              </div>
              
              {profile && !isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Message Alert */}
            {message.text && (
              <div className={`mb-4 p-3 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  {message.type === 'success' ? (
                    <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="text-sm">{message.text}</span>
                  <button 
                    onClick={() => setMessage({ type: '', text: '' })}
                    className="ml-auto"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Left Column - Form / Preview */}
            <div className="lg:col-span-2">
              {isEditing || !profile ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {profile ? "Edit Profile" : "Create Your Profile"}
                      </h2>
                      <p className="text-gray-600 mt-1 text-sm">
                        {profile ? "Update your professional information" : "Fill in your details to get started"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {profile && (
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setForm({
                              title: profile.title || "",
                              skills: profile.skills || "",
                              experience_years: profile.experience_years || "",
                              bio: profile.bio || "",
                              country: profile.country || "",
                            });
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave className="w-4 h-4" />
                            {profile ? "Save Changes" : "Create Profile"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <form className="space-y-6">
                    {/* User Info Preview */}
                    {session?.user && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                            {session.user.image ? (
                              <img 
                                src={session.user.image} 
                                alt={session.user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              session.user.name?.charAt(0) || 'U'
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{session.user.name}</h3>
                            <p className="text-sm text-gray-600">{session.user.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Professional Title & Experience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          <FiBriefcase className="inline-block w-4 h-4 mr-2 text-green-600" />
                          Professional Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="e.g., Senior Web Developer"
                          required
                        />
                        <p className="text-xs text-gray-500">Your main professional role</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          <FiCalendar className="inline-block w-4 h-4 mr-2 text-green-600" />
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          name="experience_years"
                          value={form.experience_years}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="5"
                          min="0"
                        />
                        <p className="text-xs text-gray-500">Years of professional experience</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        <FiCode className="inline-block w-4 h-4 mr-2 text-green-600" />
                        Skills & Expertise *
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={form.skills}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="React, Node.js, MongoDB, TypeScript"
                        required
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skillsArray.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-sm font-medium border border-green-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">Separate skills with commas</p>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        <FiUser className="inline-block w-4 h-4 mr-2 text-green-600" />
                        Professional Bio
                      </label>
                      <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                        placeholder="Tell buyers about your expertise, experience, and what makes you unique..."
                      />
                      <p className="text-xs text-gray-500">Minimum 50 characters recommended</p>
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        <FiGlobe className="inline-block w-4 h-4 mr-2 text-green-600" />
                        Location
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="United States"
                      />
                      <p className="text-xs text-gray-500">Your primary work location</p>
                    </div>

                    {/* Delete Profile Section */}
                    {profile && (
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Danger Zone</h3>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h4 className="font-medium text-red-800">Delete Profile</h4>
                              <p className="text-sm text-red-600 mt-1">
                                This will permanently remove your seller profile and all associated data.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleDelete}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
                            >
                              <FiTrash2 className="w-4 h-4" />
                              Delete Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              ) : (
                /* Profile Preview */
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                            {session?.user?.image ? (
                              <img 
                                src={session.user.image} 
                                alt={session.user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                                {session?.user?.name?.charAt(0) || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <FiCheckCircle className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-white">{session?.user?.name || "User"}</h2>
                          <p className="text-white/90 text-sm md:text-base mt-1">{profile.title || "Professional Title"}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {profile.country && (
                              <>
                                <FiMapPin className="w-4 h-4 text-white/80" />
                                <span className="text-white/90 text-sm">{profile.country}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                        <FiStar className="w-3 h-3 mr-1.5" />
                        Available for Work
                      </span>
                    </div>
                  </div>

                  {/* Profile Body */}
                  <div className="p-4 md:p-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <FiCalendar className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Experience</p>
                            <p className="text-lg font-bold text-gray-900">{profile.experience_years || 0} yrs</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <FiCode className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Skills</p>
                            <p className="text-lg font-bold text-gray-900">{skillsArray.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio Section */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">About Me</h3>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {profile.bio || "No bio provided yet. Add a bio to tell clients about your experience and expertise."}
                        </p>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FiCode className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Skills & Expertise</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skillsArray.length > 0 ? (
                          skillsArray.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <div className="text-center w-full py-4 text-gray-500">
                            <FiCode className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No skills added yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                            <FiCalendar className="w-4 h-4 text-green-600" />
                            Profile Activity
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">Member Since</span>
                              <span className="font-medium text-sm">
                                {profile.created_at 
                                  ? new Date(profile.created_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short'
                                    })
                                  : 'N/A'
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">Last Updated</span>
                              <span className="font-medium text-sm">
                                {profile.updated_at 
                                  ? new Date(profile.updated_at).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                  : 'Never'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Stats & Tips */}
            <div className="space-y-4">
              {/* Profile Status Card */}
              {profile && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    Profile Status
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 text-sm font-medium">Completeness</span>
                        <span className="font-bold text-green-600">
                          {[
                            profile.title ? 25 : 0,
                            skillsArray.length > 0 ? 25 : 0,
                            profile.bio ? 25 : 0,
                            profile.country ? 25 : 0
                          ].reduce((a, b) => a + b, 0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${[
                              profile.title ? 25 : 0,
                              skillsArray.length > 0 ? 25 : 0,
                              profile.bio ? 25 : 0,
                              profile.country ? 25 : 0
                            ].reduce((a, b) => a + b, 0)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'Professional Title', value: profile.title, weight: 25 },
                        { label: 'Skills Added', value: skillsArray.length > 0, weight: 25 },
                        { label: 'Bio Written', value: profile.bio, weight: 25 },
                        { label: 'Location Set', value: profile.country, weight: 25 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                              item.value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {item.value ? '✓' : '!'}
                            </div>
                            <span className="text-sm text-gray-700">{item.label}</span>
                          </div>
                          <span className={`text-sm font-medium ${item.value ? 'text-green-600' : 'text-gray-500'}`}>
                            {item.weight}%
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        Complete profiles receive 3x more project inquiries
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 border border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiStar className="w-4 h-4 text-green-600" />
                  </div>
                  Pro Tips
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">1</span>
                    </div>
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">Be specific</span> with skills for better matching
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">2</span>
                    </div>
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">Update regularly</span> for more visibility
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">3</span>
                    </div>
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">Add portfolio</span> to showcase your work
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">4</span>
                    </div>
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">Complete profile</span> for 3x more leads
                    </span>
                  </li>
                </ul>
              </div>

              {/* Call to Action Card */}
              {!profile && (
                <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-4 text-white">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                    <FiCheckCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Ready to Start?</h3>
                  <p className="text-sm mb-4 opacity-90">
                    Create your seller profile to start receiving project requests.
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2.5 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Create Profile Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}