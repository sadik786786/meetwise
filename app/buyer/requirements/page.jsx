'use client';

import { useEffect, useState } from "react";
import BuyerSidebar from "@/app/components/BuyerSidebar";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiTag,
  FiCheckCircle,
  FiSearch,
  FiArrowLeft,
  FiMenu,
  FiX
} from "react-icons/fi";

export default function BuyerRequirementsPage() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: "",
    urgency: "medium"
  });

  useEffect(() => {
    const fetchRequirements = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/requirements");
        if (!res.ok) throw new Error("Failed to fetch requirements");
        const data = await res.json();
        setRequirements(data.requirements || []);
      } catch (error) {
        console.error("Error fetching requirements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequirements();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError("Title and description are required");
      setIsSubmitting(false);
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? `/api/requirements/${editingId}` : "/api/requirements";
    
    const payload = {
      ...formData,
      budget: formData.budget ? parseInt(formData.budget) : null,
      deadline: formData.deadline || null
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save requirement");
      }

      resetForm();
      const refreshRes = await fetch("/api/requirements");
      const refreshData = await refreshRes.json();
      setRequirements(refreshData.requirements || []);
    } catch (error) {
      console.error("Error saving requirement:", error);
      setFormError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (req) => {
    setEditingId(req.id);
    setFormData({
      title: req.title || "",
      description: req.description || "",
      budget: req.budget ? req.budget.toString() : "",
      deadline: req.deadline ? req.deadline.split("T")[0] : "",
      category: req.category || "",
      urgency: req.urgency || "medium",
    });
    setShowForm(true);
    setFormError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this requirement?")) return;

    try {
      const res = await fetch(`/api/requirements/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete requirement");
      }

      // Update local state without refetching
      setRequirements(prev => prev.filter(req => req.id !== id));
    } catch (error) {
      console.error("Error deleting requirement:", error);
      alert("Failed to delete requirement. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      budget: "",
      deadline: "",
      category: "",
      urgency: "medium"
    });
    setEditingId(null);
    setShowForm(false);
    setFormError("");
    setIsSubmitting(false);
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      active: { color: "bg-blue-50 text-blue-700", label: "Active" },
      in_progress: { color: "bg-purple-50 text-purple-700", label: "In Progress" },
      completed: { color: "bg-green-50 text-green-700", label: "Completed" },
      cancelled: { color: "bg-red-50 text-red-700", label: "Cancelled" }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredRequirements = requirements
    .filter(req => {
      const matchesSearch = 
        req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Mobile Form Component
  const MobileForm = () => (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={resetForm}
          disabled={isSubmitting}
          className="flex items-center gap-2 text-gray-600 p-2 disabled:opacity-50"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="font-medium text-sm">Back</span>
        </button>
        <h2 className="text-base font-semibold text-gray-900">
          {editingId ? "Edit Requirement" : "New Requirement"}
        </h2>
        <div className="w-12"></div>
      </div>

      {/* Error Message */}
      {formError && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{formError}</p>
        </div>
      )}

      {/* Form */}
      <form 
        onSubmit={handleSubmit} 
        className="h-[calc(100vh-56px)] flex flex-col"
      >
        <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="What do you need?"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Describe your project..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Budget & Deadline */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Budget
                </label>
                <input
                  type="number"
                  name="budget"
                  placeholder="₹50000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData.budget}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData.deadline}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Category
              </label>
              <select
                name="category"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                <option value="web">Web Development</option>
                <option value="mobile">Mobile App</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="writing">Writing</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Urgency Level
              </label>
              <select
                name="urgency"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                value={formData.urgency}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="flex-1 px-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-3 rounded-lg hover:bg-blue-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  {editingId ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <BuyerSidebar />
        <div className="flex-1 flex items-center justify-center p-4 ml-0 md:ml-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading requirements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/50" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute left-0 top-0 h-full w-3/4 bg-white" 
            onClick={e => e.stopPropagation()}
          >
            <BuyerSidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <BuyerSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-20">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-600"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">Requirements</h1>
              <p className="text-xs text-gray-500">{requirements.length} items</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium text-sm"
            >
              <FiPlus className="w-4 h-4" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 py-3 border-b border-gray-200 bg-white">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search requirements..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block px-6 py-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Requirements</h1>
              <p className="text-gray-600 mt-1">Manage your project requirements</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              New Requirement
            </button>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block px-6 py-4 bg-white border-b border-gray-200">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requirements..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Form Overlay */}
        {showForm && <MobileForm />}

        {/* Main Content */}
        <div className="p-4 md:p-6">
          {filteredRequirements.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "No matching requirements" : "No requirements yet"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                {searchTerm 
                  ? "Try a different search term" 
                  : "Create your first requirement to get started"}
              </p>
              {!searchTerm && !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Requirement
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Requirements Grid - Mobile */}
              <div className="md:hidden space-y-3">
                {filteredRequirements.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-3">
                        <h3 className="font-semibold text-gray-900 text-sm mb-2">
                          {req.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <StatusBadge status={req.status} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(req)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          aria-label={`Edit ${req.title}`}
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label={`Delete ${req.title}`}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-xs line-clamp-2 mb-4">
                      {req.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {req.budget && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                            <FiDollarSign className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Budget</p>
                            <p className="font-medium text-green-700 text-sm">
                              ₹{req.budget.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {req.deadline && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                            <FiCalendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Deadline</p>
                            <p className="font-medium text-blue-700 text-sm">
                              {new Date(req.deadline).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      {req.category && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          <FiTag className="w-3 h-3" />
                          {req.category}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Requirements Grid - Desktop */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequirements.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0 pr-3">
                          <h3 className="font-semibold text-gray-900 text-lg mb-2 truncate">
                            {req.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-4">
                            <StatusBadge status={req.status} />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(req)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label={`Edit ${req.title}`}
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(req.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label={`Delete ${req.title}`}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3 min-h-[60px]">
                        {req.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {req.budget && (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FiDollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-gray-500 truncate">Budget</p>
                              <p className="font-semibold text-green-700 truncate">
                                ₹{req.budget.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                        {req.deadline && (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FiCalendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-gray-500 truncate">Deadline</p>
                              <p className="font-semibold text-blue-700 truncate">
                                {new Date(req.deadline).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          {req.category && (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm truncate max-w-[200px]">
                              <FiTag className="w-4 h-4 flex-shrink-0" />
                              <span className="capitalize truncate">
                                {req.category.replace('-', ' ')}
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex-shrink-0">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Desktop Stats */}
        <div className="hidden md:block px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-3xl font-bold text-gray-900">{requirements.length}</div>
              <div className="text-gray-600">Total Requirements</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-3xl font-bold text-green-700">
                {requirements.filter(r => r.status === 'active').length}
              </div>
              <div className="text-gray-600">Active</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-3xl font-bold text-blue-700">
                ₹{requirements.reduce((sum, req) => sum + (req.budget || 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Budget</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}