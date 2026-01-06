'use client';

import { useEffect, useState } from "react";
import SellerSidebar from "@/app/components/SellerSidebar";
import Link from "next/link";
import { 
  CalendarDays, 
  Clock, 
  Filter, 
  Search, 
  AlertCircle,
  ArrowUpDown,
  Tag,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock4,
  Sparkles,
  Target,
  BarChart3,
  DollarSign,
  Menu,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function SellerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/seller/requests");
        const data = await res.json();
        if (data.success) {
          setRequests(data.data);
        }
      } catch (error) {
        console.error("Error loading requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const statusColor = (status) => {
    const colors = {
      accepted: "text-emerald-700 bg-emerald-50 border-emerald-200",
      rejected: "text-rose-700 bg-rose-50 border-rose-200",
      pending: "text-amber-700 bg-amber-50 border-amber-200",
      completed: "text-green-700 bg-green-50 border-green-200",
      cancelled: "text-gray-700 bg-gray-50 border-gray-200"
    };
    return colors[status] || colors.pending;
  };

  const statusIcon = (status) => {
    const icons = {
      accepted: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
      rejected: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
      pending: <Clock4 className="w-3.5 h-3.5 text-amber-600" />,
      completed: <CheckCircle className="w-3.5 h-3.5 text-green-600" />,
      cancelled: <XCircle className="w-3.5 h-3.5 text-gray-600" />
    };
    return icons[status] || icons.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Flexible";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredRequests = requests
    .filter(request => {
      const matchesSearch = request.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "budget_high") return (b.budget || 0) - (a.budget || 0);
      if (sortBy === "budget_low") return (a.budget || 0) - (b.budget || 0);
      return 0;
    });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    accepted: requests.filter(r => r.status === "accepted").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    completed: requests.filter(r => r.status === "completed").length,
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <SellerSidebar />
      <main className="flex-1 w-full px-3 sm:px-4 md:px-5 lg:px-6 py-4 md:py-5 lg:py-6 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Service Requests</h1>
              <p className="text-xs text-gray-600">Manage your service requests</p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-5">
            <div className="hidden lg:block">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Service Requests</h1>
              </div>
              <p className="text-gray-600 text-sm mt-1 pl-2">Manage and track your service requests</p>
            </div>
            
            <div className="flex items-center justify-between w-full lg:w-auto gap-2">
              <Link
                href="/seller/browse-requirements"
                className="inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg flex-1 sm:flex-none text-center"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Browse Requirements</span>
                <span className="sm:hidden">Browse</span>
              </Link>
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden p-2.5 bg-white border border-green-200 rounded-lg text-green-600"
              >
                {showMobileFilters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <Filter className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Stats Cards - Responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 md:mb-6">
            {/* Total */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-3 sm:p-4 shadow-sm border border-green-100">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <div className="p-1 sm:p-1.5 bg-green-100 rounded-lg">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <p className="text-xs text-green-700 uppercase tracking-wider font-semibold">Total</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-green-800 mt-1">{stats.total}</p>
            </div>
            
            {/* Pending */}
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg p-3 sm:p-4 shadow-sm border border-amber-100">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <div className="p-1 sm:p-1.5 bg-amber-100 rounded-lg">
                  <Clock4 className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                </div>
                <p className="text-xs text-amber-700 uppercase tracking-wider font-semibold">Pending</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-amber-800 mt-1">{stats.pending}</p>
            </div>
            
            {/* Accepted */}
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-lg p-3 sm:p-4 shadow-sm border border-emerald-100">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <div className="p-1 sm:p-1.5 bg-emerald-100 rounded-lg">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-emerald-700 uppercase tracking-wider font-semibold">Accepted</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-800 mt-1">{stats.accepted}</p>
            </div>
            
            {/* Rejected */}
            <div className="bg-gradient-to-br from-rose-50 to-white rounded-lg p-3 sm:p-4 shadow-sm border border-rose-100 hidden sm:block">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <div className="p-1 sm:p-1.5 bg-rose-100 rounded-lg">
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600" />
                </div>
                <p className="text-xs text-rose-700 uppercase tracking-wider font-semibold">Rejected</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-rose-800 mt-1">{stats.rejected}</p>
            </div>
            
            {/* Completed */}
            <div className="bg-gradient-to-br from-green-100 to-white rounded-lg p-3 sm:p-4 shadow-sm border border-green-200 hidden lg:block">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <div className="p-1 sm:p-1.5 bg-green-200 rounded-lg">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-700" />
                </div>
                <p className="text-xs text-green-800 uppercase tracking-wider font-semibold">Completed</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
            </div>

            {/* Mobile Rejected & Completed Combined */}
            <div className="bg-gradient-to-br from-rose-50 to-white rounded-lg p-3 sm:p-4 shadow-sm border border-rose-100 sm:hidden">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="p-1 bg-rose-100 rounded-lg">
                  <XCircle className="w-3 h-3 text-rose-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-rose-700 uppercase tracking-wider font-semibold">Completed</p>
                  <p className="text-xl font-bold text-rose-800">{stats.completed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 sm:p-4 shadow-sm border border-green-100 mb-4 sm:mb-5`}>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                  />
                </div>
              </div>
              
              <div className="flex flex-col xs:flex-row gap-2">
                <div className="relative w-full xs:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2 text-sm border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white w-full cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-3.5 h-3.5" />
                </div>

                <div className="relative w-full xs:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2 text-sm border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white w-full cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="budget_high">Budget: High to Low</option>
                    <option value="budget_low">Budget: Low to High</option>
                  </select>
                  <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 sm:p-5 shadow-sm border animate-pulse border-green-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-green-100 rounded w-3/4"></div>
                    <div className="h-3 bg-green-100 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-green-100 rounded w-20"></div>
                      <div className="h-6 bg-green-100 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-7 bg-green-100 rounded w-16"></div>
                    <div className="h-9 bg-green-100 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-8 sm:py-10 bg-gradient-to-b from-green-50 to-white rounded-xl border-2 border-dashed border-green-200 px-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-green-900 mb-2">
              {searchQuery || statusFilter !== "all" ? "No matching requests found" : "No requests yet"}
            </h3>
            <p className="text-green-700 text-xs sm:text-sm max-w-md mx-auto mb-4">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your search or filter to find what you're looking for."
                : "You haven't sent any service requests yet. Start by browsing available requirements."}
            </p>
            <Link
              href="/seller/browse-requirements"
              className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors shadow-md hover:shadow-lg"
            >
              Browse Requirements
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((req) => (
              <div
                key={req.request_id}
                className="group bg-gradient-to-r from-white to-green-50/50 rounded-lg p-4 sm:p-5 shadow-sm border border-green-100 hover:shadow-lg transition-all duration-300 hover:border-green-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-5">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className="flex-1 pr-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <h2 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1">
                            {req.title}
                          </h2>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium self-start sm:self-center">
                            {req.category || "General"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <Clock className="w-3 h-3" />
                            {formatDate(req.created_at)}
                          </span>
                          {req.deadline && (
                            <>
                              <span className="text-xs text-green-400 hidden sm:inline">•</span>
                              <span className="flex items-center gap-1 text-xs text-green-600">
                                <CalendarDays className="w-3 h-3" />
                                Due: {formatDate(req.deadline)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end sm:hidden">
                        <div className="flex items-center gap-2 mb-2">
                          {statusIcon(req.status)}
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColor(req.status)}`}
                          >
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                      {req.description || "No description provided"}
                    </p>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <div className="flex items-center gap-1.5 text-green-800 bg-green-100 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md text-xs font-medium border border-green-200">
                        <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="font-bold">{formatCurrency(req.budget)}</span>
                      </div>
                      
                      {req.urgency && (
                        <div className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md text-xs font-medium border ${
                          req.urgency === "high" ? "bg-gradient-to-r from-rose-50 to-rose-100 text-rose-800 border-rose-200" :
                          req.urgency === "medium" ? "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200" :
                          "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200"
                        }`}>
                          {req.urgency === "high" ? "🔥 High" : req.urgency === "medium" ? "⚡ Medium" : "✨ Low"}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md text-xs border border-green-100">
                        <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{req.category || "General"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 sm:gap-3 mt-2 sm:mt-0">
                    <div className="hidden sm:flex items-center gap-2">
                      {statusIcon(req.status)}
                      <span
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-medium border ${statusColor(req.status)}`}
                      >
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/seller/requests/${req.requirement_id}`}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg group/link flex-1 sm:flex-none text-center"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                        <svg className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        {!loading && filteredRequests.length > 0 && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-green-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <div className="text-xs sm:text-sm text-green-700">
                  Showing <span className="font-bold text-green-900">{filteredRequests.length}</span> of{" "}
                  <span className="font-bold text-green-900">{requests.length}</span> requests
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-4 mt-2 sm:mt-0">
                <div className="flex items-center gap-1.5 text-xs px-2 py-1.5 bg-green-50 rounded-full border border-green-100">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500"></div>
                  <span className="font-medium text-amber-700">Pending: {stats.pending}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs px-2 py-1.5 bg-green-50 rounded-full border border-green-100">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500"></div>
                  <span className="font-medium text-emerald-700">Accepted: {stats.accepted}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs px-2 py-1.5 bg-green-50 rounded-full border border-green-100">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500"></div>
                  <span className="font-medium text-rose-700">Rejected: {stats.rejected}</span>
                </div>
                <div className="hidden lg:flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-green-50 rounded-full border border-green-100">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  <span className="font-medium text-green-800">Completed: {stats.completed}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}