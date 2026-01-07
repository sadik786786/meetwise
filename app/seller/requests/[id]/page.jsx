'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SellerSidebar from "@/app/components/SellerSidebar";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit2,
  IndianRupee,
  Loader2,
  MessageSquare,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock4,
  User,
  Eye,
  BarChart3,
  DollarSign,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  Info
} from "lucide-react";
import Link from "next/link";

export default function SellerRequestDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/seller/requests/${id}`);
      
      if (!res.ok) throw new Error('Failed to fetch request details');
      
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setMessage(result.data.request.message || "");
        setBudget(result.data.request.proposed_budget || "");
      } else {
        setError(result.message || "Failed to load request details");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!data?.request?.id) {
      setError("Request ID not found");
      return;
    }

    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    if (!budget || isNaN(budget) || Number(budget) <= 0) {
      setError("Please enter a valid budget amount");
      return;
    }

    try {
      setUpdating(true);
      setError("");
      
      const res = await fetch(`/api/seller/requests/${data.request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: message.trim(), 
          proposed_budget: Number(budget) 
        })
      });

      const result = await res.json();
      
      if (result.success) {
        setIsEditing(false);
        await fetchData();
      } else {
        setError(result.message || "Failed to update request");
      }
    } catch (err) {
      setError("An error occurred while updating");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!data?.request?.id) return;
    
    if (!window.confirm("Are you sure you want to delete this request? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      
      const res = await fetch(`/api/seller/requests/${data.request.id}`, { 
        method: "DELETE" 
      });

      const result = await res.json();
      
      if (result.success) {
        router.push("/seller/requests");
      } else {
        setError(result.message || "Failed to delete request");
      }
    } catch (err) {
      setError("An error occurred while deleting");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: "bg-amber-100 text-amber-800", icon: Clock4, label: "Pending" },
      accepted: { color: "bg-emerald-100 text-emerald-800", icon: CheckCircle, label: "Accepted" },
      rejected: { color: "bg-rose-100 text-rose-800", icon: XCircle, label: "Rejected" },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Completed" },
      cancelled: { color: "bg-gray-100 text-gray-800", icon: XCircle, label: "Cancelled" }
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SellerSidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-20">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-lg p-6 shadow h-64"></div>
                  <div className="bg-white rounded-lg p-6 shadow h-64"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-6 shadow h-48"></div>
                  <div className="bg-white rounded-lg p-6 shadow h-48"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SellerSidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {error || "Request not found"}
              </h3>
              <p className="text-gray-600 mb-6">
                The request you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link
                href="/seller/requests"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back to Requests
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { request, requirement } = data;
  const statusConfig = getStatusConfig(request.status);
  const isEditable = request.status === "pending";
  const budgetDifference = budget && requirement.budget ? budget - requirement.budget : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />
      
      <main className="flex-1 p-4 md:p-6 lg:ml-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/seller/requests"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Requests</span>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color} inline-flex items-center gap-1.5`}>
                  <statusConfig.icon className="w-3.5 h-3.5" />
                  {statusConfig.label}
                </span>
                {isEditable && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last updated: {formatDate(request.updated_at || request.created_at)}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Requirement Card */}
              <div className="bg-white rounded-xl shadow border border-gray-200">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h2 className="text-xl font-bold text-gray-900">{requirement.title}</h2>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {requirement.category || "General"}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">Posted by client</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {requirement.description || "No description provided"}
                  </p>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Budget</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(requirement.budget)}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Deadline</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {formatDate(requirement.deadline)}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Urgency</span>
                      </div>
                      <p className={`font-medium ${
                        requirement.urgency === "high" ? "text-rose-600" :
                        requirement.urgency === "medium" ? "text-amber-600" :
                        "text-emerald-600"
                      }`}>
                        {requirement.urgency?.charAt(0).toUpperCase() + requirement.urgency?.slice(1) || "Normal"}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Posted</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {formatDate(requirement.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proposal Card */}
              <div className="bg-white rounded-xl shadow border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <h2 className="text-xl font-bold text-gray-900">Your Proposal</h2>
                    </div>
                    <span className="text-sm text-gray-500">
                      Sent {formatDate(request.created_at)}
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message to Buyer
                      </label>
                      {isEditing ? (
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Explain your approach and why you're the best fit..."
                          className="w-full h-32 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                          disabled={updating}
                        />
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {message || "No message provided"}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proposed Budget
                      </label>
                      {isEditing ? (
                        <div className="relative max-w-xs">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IndianRupee className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="Enter your proposed amount"
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            disabled={updating}
                            min="0"
                            step="100"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-5 h-5 text-gray-600" />
                          <span className="text-xl font-bold text-gray-900">
                            {budget ? formatCurrency(budget) : "Flexible"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Edit Actions */}
                  {isEditing && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex flex-wrap gap-3 justify-end">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setMessage(request.message || "");
                            setBudget(request.proposed_budget || "");
                          }}
                          className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                          disabled={updating}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdate}
                          disabled={updating}
                          className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                        >
                          {updating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Action Card */}
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  {request.status === "accepted" && (
                    <button
                      onClick={async () => {
                        router.push(`/seller/buyer/${requirement.id}`);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Buyer Details
                    </button>
                  )}
                  
                  {isEditable && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Proposal
                    </button>
                  )}
                  
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 font-medium rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete Request
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Budget Comparison */}
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Budget Comparison
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Buyer's Budget</span>
                      <span className="font-medium text-gray-900">{formatCurrency(requirement.budget)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Your Proposal</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(budget)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ 
                          width: budget && requirement.budget 
                            ? `${Math.min(100, (budget / requirement.budget) * 100)}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {budget && requirement.budget && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Difference</span>
                        <div className="flex items-center gap-1">
                          {budgetDifference > 0 ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-rose-600" />
                              <span className="font-bold text-rose-600">
                                +{formatCurrency(Math.abs(budgetDifference))}
                              </span>
                            </>
                          ) : budgetDifference < 0 ? (
                            <>
                              <TrendingDown className="w-4 h-4 text-emerald-600" />
                              <span className="font-bold text-emerald-600">
                                -{formatCurrency(Math.abs(budgetDifference))}
                              </span>
                            </>
                          ) : (
                            <>
                              <Minus className="w-4 h-4 text-gray-600" />
                              <span className="font-bold text-gray-600">Same</span>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {budgetDifference > 0 
                          ? `Your proposal is ${((budgetDifference / requirement.budget) * 100).toFixed(1)}% higher`
                          : budgetDifference < 0
                          ? `Your proposal is ${((Math.abs(budgetDifference) / requirement.budget) * 100).toFixed(1)}% lower`
                          : "Your proposal matches the budget"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timeline
                </h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Proposal Sent</p>
                      <p className="text-sm text-gray-500">{formatDate(request.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      request.status !== 'pending' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        request.status !== 'pending' ? 'bg-green-600' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Buyer's Review</p>
                      <p className="text-sm text-gray-500">
                        {request.status === 'pending' 
                          ? 'Awaiting response' 
                          : `Responded ${formatDate(request.updated_at)}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      request.status === 'accepted' || request.status === 'completed' 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        request.status === 'accepted' || request.status === 'completed' 
                          ? 'bg-green-600' 
                          : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Project Start</p>
                      <p className="text-sm text-gray-500">
                        {request.status === 'accepted' || request.status === 'completed'
                          ? 'Ready to begin' 
                          : 'Pending acceptance'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="fixed bottom-4 right-4 max-w-sm z-50 animate-slide-in">
            <div className="bg-rose-50 border border-rose-200 rounded-lg shadow-lg p-4 flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-rose-900">Error</p>
                <p className="text-sm text-rose-700 mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="text-rose-400 hover:text-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}