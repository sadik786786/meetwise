'use client';

import { useEffect, useState } from "react";
import RequirementCard from "@/app/components/RequirementCard";
import SellerSidebar from "@/app/components/SellerSidebar";
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiTrendingUp,
  FiCalendar,
  FiDollarSign,
  FiRefreshCw,
  FiAlertCircle,
  FiChevronDown,
  FiCheck,
  FiX,
  FiStar,
  FiClock,
  FiMapPin,
  FiTarget,
  FiBriefcase,
  FiAward,
  FiTrendingDown
} from "react-icons/fi";
import { 
  Sparkles, 
  Target, 
  Briefcase,
  BarChart3, 
  DollarSign as DollarSignLucide,
  Zap,
  Users,
  Globe
} from "lucide-react";

export default function BrowseRequirementsPage() {
  const [requirements, setRequirements] = useState([]);
  const [filteredRequirements, setFilteredRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    budget: null,
    urgency: null,
    location: null
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["Web Development", "Mobile App", "UI/UX Design", "Digital Marketing", "Content Writing", "SEO", "Graphic Design", "Other"];
  const budgetRanges = [
    { label: "Under ₹10k", value: "0-10000" },
    { label: "₹10k - ₹50k", value: "10000-50000" },
    { label: "₹50k - ₹1L", value: "50000-100000" },
    { label: "₹1L+", value: "100000+" }
  ];
  const urgencyLevels = ["Urgent", "High", "Medium", "Low"];
  const locations = ["Remote", "India", "USA", "UK", "Europe", "Other"];

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const res = await fetch("/api/seller/requirements");
        const data = await res.json();
        if (data.success) {
          setRequirements(data.data);
          setFilteredRequirements(data.data);
        }
      } catch (error) {
        console.error("Error fetching requirements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequirements();
  }, []);

  useEffect(() => {
    let filtered = requirements;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(req => 
        req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (activeFilters.category) {
      filtered = filtered.filter(req => req.category === activeFilters.category);
    }

    // Budget filter
    if (activeFilters.budget) {
      const [min, max] = activeFilters.budget.split('-').map(Number);
      filtered = filtered.filter(req => {
        if (!req.budget) return false;
        if (max) return req.budget >= min && req.budget <= max;
        return req.budget >= min;
      });
    }

    // Urgency filter
    if (activeFilters.urgency) {
      filtered = filtered.filter(req => req.urgency === activeFilters.urgency);
    }

    // Location filter
    if (activeFilters.location) {
      filtered = filtered.filter(req => req.location === activeFilters.location);
    }

    setFilteredRequirements(filtered);
  }, [searchQuery, activeFilters, requirements]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      category: null,
      budget: null,
      urgency: null,
      location: null
    });
    setSearchQuery("");
  };

  const hasActiveFilters = Object.values(activeFilters).some(filter => filter !== null) || searchQuery;

  const refreshRequirements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seller/requirements");
      const data = await res.json();
      if (data.success) {
        setRequirements(data.data);
      }
    } catch (error) {
      console.error("Error refreshing requirements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <SellerSidebar />
        <div className="flex-1 md:ml-16 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center h-[70vh]">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <p className="mt-6 text-green-600 font-medium">Discovering opportunities...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <SellerSidebar />
      
      <main className="flex-1 md:ml-16 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section - Colorful */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-green-900">
                    Browse Opportunities
                  </h1>
                </div>
                <p className="text-green-700 mt-2 pl-12">
                  Discover projects that match your skills and expertise
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={refreshRequirements}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-600 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 shadow-sm hover:shadow"
                  title="Refresh"
                >
                  <FiRefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-600 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 shadow-sm hover:shadow"
                >
                  {viewMode === "grid" ? <FiList className="w-5 h-5" /> : <FiGrid className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <FiFilter className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Search Bar - Green themed */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="w-5 h-5 text-green-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, skills, or category..."
                className="w-full pl-10 pr-4 py-3.5 bg-white border-2 border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder-green-400"
              />
            </div>

            {/* Active Filters - Green theme */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm">
                <div className="flex items-center gap-2 text-green-700">
                  <FiFilter className="w-4 h-4" />
                  <span className="text-sm font-medium">Active filters:</span>
                </div>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                    <FiSearch className="w-3 h-3" />
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-green-900">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {Object.entries(activeFilters).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <span key={key} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                      {key === 'category' && <Briefcase className="w-3 h-3" />}
                      {key === 'budget' && <DollarSignLucide className="w-3 h-3" />}
                      {key === 'urgency' && <Zap className="w-3 h-3" />}
                      {key === 'location' && <Globe className="w-3 h-3" />}
                      {value}
                      <button onClick={() => handleFilterChange(key, null)} className="ml-1 hover:text-green-900">
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                <button
                  onClick={clearFilters}
                  className="ml-auto text-sm text-green-600 hover:text-green-900 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Filters Panel - Green theme */}
            {showFilters && (
              <div className="bg-gradient-to-b from-green-50 to-white rounded-2xl border border-green-200 p-6 mb-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FiFilter className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-900">Filter Opportunities</h3>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FiX className="w-5 h-5 text-green-600" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Category
                    </label>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => handleFilterChange("category", category)}
                          className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                            activeFilters.category === category
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 shadow-sm"
                              : "hover:bg-green-50 text-green-700 border border-green-100"
                          }`}
                        >
                          {activeFilters.category === category && (
                            <FiCheck className="w-4 h-4 text-green-600" />
                          )}
                          <div className={`w-2 h-2 rounded-full ${activeFilters.category === category ? 'bg-green-500' : 'bg-green-300'}`}></div>
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Filter */}
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-3 flex items-center gap-2">
                      <DollarSignLucide className="w-4 h-4" />
                      Budget Range
                    </label>
                    <div className="space-y-2">
                      {budgetRanges.map(range => (
                        <button
                          key={range.value}
                          onClick={() => handleFilterChange("budget", range.value)}
                          className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                            activeFilters.budget === range.value
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 shadow-sm"
                              : "hover:bg-green-50 text-green-700 border border-green-100"
                          }`}
                        >
                          {activeFilters.budget === range.value && (
                            <FiCheck className="w-4 h-4 text-green-600" />
                          )}
                          <DollarSignLucide className="w-3.5 h-3.5" />
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Urgency Filter */}
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Urgency Level
                    </label>
                    <div className="space-y-2">
                      {urgencyLevels.map(urgency => (
                        <button
                          key={urgency}
                          onClick={() => handleFilterChange("urgency", urgency)}
                          className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                            activeFilters.urgency === urgency
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 shadow-sm"
                              : "hover:bg-green-50 text-green-700 border border-green-100"
                          }`}
                        >
                          {activeFilters.urgency === urgency && (
                            <FiCheck className="w-4 h-4 text-green-600" />
                          )}
                          <FiClock className="w-3.5 h-3.5" />
                          {urgency}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Location
                    </label>
                    <div className="space-y-2">
                      {locations.map(location => (
                        <button
                          key={location}
                          onClick={() => handleFilterChange("location", location)}
                          className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                            activeFilters.location === location
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 shadow-sm"
                              : "hover:bg-green-50 text-green-700 border border-green-100"
                          }`}
                        >
                          {activeFilters.location === location && (
                            <FiCheck className="w-4 h-4 text-green-600" />
                          )}
                          <FiMapPin className="w-3.5 h-3.5" />
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Bar - Colorful green theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-4 border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Total Opportunities</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">{requirements.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-4 border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-50 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Active Today</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {requirements.filter(req => 
                      new Date(req.created_at).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-4 border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl flex items-center justify-center">
                  <FiStar className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Urgent Projects</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {requirements.filter(req => req.urgency === "Urgent").length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-4 border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center">
                  <DollarSignLucide className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Avg. Budget</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    ₹{Math.round(requirements.reduce((sum, req) => sum + (req.budget || 0), 0) / requirements.length) || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements Grid/List */}
          {filteredRequirements.length === 0 ? (
            <div className="bg-gradient-to-b from-green-50 to-white rounded-2xl border-2 border-dashed border-green-200 p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">
                {hasActiveFilters ? "No matching opportunities found" : "No opportunities available"}
              </h3>
              <p className="text-green-600 mb-6 max-w-md mx-auto">
                {hasActiveFilters 
                  ? "Try adjusting your filters or search terms to find more opportunities."
                  : "Check back later for new project opportunities that match your skills."
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <Sparkles className="w-4 h-4" />
                  <p className="text-green-900 font-medium">
                    Showing <span className="font-bold text-green-950">{filteredRequirements.length}</span> of{" "}
                    <span className="font-bold text-green-950">{requirements.length}</span> opportunities
                  </p>
                </div>
                <div className="flex items-center gap-2 text-green-600 mt-2 sm:mt-0">
                  <FiTrendingDown className="w-4 h-4" />
                  <span className="text-sm">Sorted by:</span>
                  <select className="bg-transparent border-none focus:ring-0 text-green-900 font-medium">
                    <option className="text-green-900">Newest First</option>
                    <option className="text-green-900">Budget (High to Low)</option>
                    <option className="text-green-900">Urgency</option>
                  </select>
                </div>
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRequirements.map(req => (
                    <RequirementCard key={req.id} requirement={req} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequirements.map(req => (
                    <div key={req.id} className="bg-gradient-to-r from-white to-green-50 rounded-2xl border border-green-200 p-6 hover:border-green-300 transition-all duration-300 hover:shadow-md">
                      {/* List view layout - customize as needed */}
                      <RequirementCard requirement={req} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}