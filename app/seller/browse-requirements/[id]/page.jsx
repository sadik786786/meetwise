'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SellerSidebar from "@/app/components/SellerSidebar";
import {
  FiCalendar,
  FiDollarSign,
  FiFolder,
  FiClock,
  FiUser,
  FiMapPin,
  FiMessageSquare,
  FiSend,
  FiChevronLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiFileText,
  FiTag,
  FiGlobe,
  FiX,
  FiEdit2,
  FiInfo,
  FiEye,
  FiUsers,
  FiThumbsUp,
  FiStar
} from "react-icons/fi";
import { 
  Sparkles, 
  Target, 
  BarChart3, 
  DollarSign as DollarSignLucide,
  Zap,
  Users,
  Globe,
  Award,
  TrendingUp as TrendingUpLucide,
  Shield,
  Rocket,
  Lightbulb,
  Calendar,
  Clock,
  MapPin,
  Briefcase
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function RequirementDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [requirement, setRequirement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    proposed_budget: ""
  });

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        const res = await fetch(`/api/seller/requirements/${id}`);
        const data = await res.json();
        if (data.success) {
          setRequirement(data.data);
        }
      } catch (error) {
        console.error("Error fetching requirement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequirement();
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendRequest = async () => {
    if (!requirement) return;
    setShowRequestForm(true);
  };

  const handleSubmitRequest = async () => {
    if (!formData.message.trim() || !formData.proposed_budget.trim()) {
      alert("Please fill in the message and budget fields");
      return;
    }

    setSendingRequest(true);

    try {
      const res = await fetch("/api/seller/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requirement_id: requirement.id,
          message: formData.message,
          proposed_budget: parseFloat(formData.proposed_budget)
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send request");
        return;
      }

      alert("Service request sent successfully!");
      setShowRequestForm(false);
      setFormData({
        message: "",
        proposed_budget: "",
        estimated_days: ""
      });
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Something went wrong");
    } finally {
      setSendingRequest(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent': return 'bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 border border-rose-200';
      case 'high': return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200';
      case 'medium': return 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-gradient-to-r from-green-100 to-emerald-50 text-green-800 border border-green-200';
      default: return 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200';
    }
  };

  const calculateServiceBudget = () => {
    if (!formData.proposed_budget || !requirement?.budget) return null;
    const budget = parseFloat(formData.proposed_budget);
    const requirementBudget = requirement.budget;
    const percentage = (budget / requirementBudget) * 100;
    return percentage.toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <SellerSidebar />
        <div className="flex-1 md:ml-16 p-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center justify-center h-[70vh]">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <p className="mt-4 text-green-600 font-medium">Loading opportunity details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <SellerSidebar />
        <div className="flex-1 md:ml-16 p-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-b from-green-50 to-white rounded-2xl shadow-sm border border-green-200 p-6 text-center">
              <FiAlertCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-green-900 mb-2">Opportunity Not Found</h2>
              <p className="text-green-600 mb-4">The opportunity you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
              >
                <FiChevronLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Request Form Modal - Green Themed */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-green-50 to-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-green-200 shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <FiSend className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-green-900">Send Service Request</h2>
                    <p className="text-sm text-green-600">Submit your proposal to the client</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="p-2 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FiX className="w-5 h-5 text-green-600" />
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-green-800 font-medium mb-1">Proposal Tips</p>
                    <p className="text-xs text-green-700">
                      Customize your message to show how you can help. Include your estimated budget and timeline.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Project Budget Info */}
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-600 font-medium">Client's Budget</span>
                  <span className="font-bold text-green-900">
                    ₹{requirement.budget ? requirement.budget.toLocaleString() : "Flexible"}
                  </span>
                </div>
                {formData.proposed_budget && requirement.budget && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-green-600">Your Quote</span>
                      <span className={`font-bold ${
                        parseFloat(formData.proposed_budget) > requirement.budget 
                          ? 'text-rose-600' 
                          : 'text-green-600'
                      }`}>
                        {calculateServiceBudget()}% of client budget
                      </span>
                    </div>
                    <div className="w-full bg-green-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          parseFloat(formData.proposed_budget) > requirement.budget 
                            ? 'bg-gradient-to-r from-rose-500 to-rose-600' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-600'
                        }`}
                        style={{ 
                          width: `${Math.min(calculateServiceBudget(), 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-green-900 mb-2">
                  <div className="flex items-center gap-2">
                    <FiMessageSquare className="w-4 h-4 text-green-600" />
                    Your Message *
                  </div>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                  placeholder="Introduce yourself and explain how you can help with this project..."
                  required
                />
                <p className="text-xs text-green-500 mt-1">Minimum 50 characters recommended</p>
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSignLucide className="w-4 h-4 text-green-600" />
                      Your Service Budget (₹) *
                    </div>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500">₹</span>
                    <input
                      type="number"
                      name="proposed_budget"
                      value={formData.proposed_budget}
                      onChange={handleFormChange}
                      className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                      placeholder="5000"
                      min="1"
                      required
                    />
                  </div>
                  {formData.proposed_budget && requirement.budget && (
                    <p className={`text-xs mt-1 font-medium ${
                      parseFloat(formData.proposed_budget) > requirement.budget 
                        ? 'text-rose-600' 
                        : 'text-green-600'
                    }`}>
                      {parseFloat(formData.proposed_budget) > requirement.budget 
                        ? 'Above client budget'
                        : 'Within client budget'
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* Requirements Check */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200">
                <h4 className="text-sm font-medium text-green-900 mb-3">Make sure you can:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-green-700">
                    <FiCheckCircle className="w-4 h-4 text-green-500" />
                    Meet the project requirements
                  </li>
                  <li className="flex items-center gap-2 text-sm text-green-700">
                    <FiCheckCircle className="w-4 h-4 text-green-500" />
                    Deliver within estimated timeline
                  </li>
                  <li className="flex items-center gap-2 text-sm text-green-700">
                    <FiCheckCircle className="w-4 h-4 text-green-500" />
                    Provide regular updates to client
                  </li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-green-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="px-4 py-3 border border-green-300 rounded-xl text-green-700 hover:bg-green-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={sendingRequest}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  {sendingRequest ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <SellerSidebar />
        
        <main className="flex-1 md:ml-16 p-4">
          <div className="max-w-6xl mx-auto">
            {/* Header with Back Button */}
            <div className="mb-4">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-900 mb-3 text-sm"
              >
                <FiChevronLeft className="w-3.5 h-3.5" />
                Back to Opportunities
              </button>
              
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="p-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-green-900">
                      {requirement.title}
                    </h1>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getUrgencyColor(requirement.urgency)}`}>
                      {requirement.urgency || 'Standard'}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 pl-12">
                    Posted on {new Date(requirement.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={handleSendRequest}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                  >
                    <FiSend className="w-3.5 h-3.5" />
                    Send Request
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column - Details */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-b from-white to-green-50 rounded-2xl shadow-sm border border-green-200 overflow-hidden">
                  {/* Description Section */}
                  <div className="p-4 border-b border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <FiFileText className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-green-900">Project Description</h2>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-green-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {requirement.description}
                      </p>
                    </div>
                  </div>

                  {/* Requirements Grid */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <FiCheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-green-900">Project Details</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Budget Card */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <DollarSignLucide className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-green-600">Budget</p>
                            <p className="text-lg font-bold text-green-900">
                              ₹{requirement.budget ? requirement.budget.toLocaleString() : "Flexible"}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-green-500">Project budget range</p>
                      </div>

                      {/* Deadline Card */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl p-3 border border-blue-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-blue-600">Deadline</p>
                            <p className="text-lg font-bold text-blue-900">
                              {requirement.deadline ? new Date(requirement.deadline).toLocaleDateString() : "Flexible"}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-blue-500">Expected completion date</p>
                      </div>

                      {/* Category Card */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-50 rounded-xl p-3 border border-purple-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-purple-600">Category</p>
                            <p className="text-lg font-bold text-purple-900">
                              {requirement.category || "General"}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-purple-500">Project category</p>
                      </div>

                      {/* Timeline Card */}
                      <div className="bg-gradient-to-br from-amber-50 to-amber-50 rounded-xl p-3 border border-amber-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-amber-600">Duration</p>
                            <p className="text-lg font-bold text-amber-900">
                              {requirement.duration || "Not specified"}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-amber-500">Expected project timeline</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="bg-gradient-to-b from-white to-green-50 rounded-2xl shadow-sm border border-green-200 mt-4 p-4">
                  <h2 className="text-lg font-bold text-green-900 mb-3">Additional Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-green-600">Client Type</p>
                          <p className="text-sm font-medium text-green-900">Individual / Business</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <Globe className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-green-600">Location</p>
                          <p className="text-sm font-medium text-green-900">{requirement.location || "Remote"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <TrendingUpLucide className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-green-600">Experience Level</p>
                          <p className="text-sm font-medium text-green-900">{requirement.experience_level || "Any"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <FiTag className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-green-600">Tags</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(requirement.tags || []).map((tag, index) => (
                              <span key={index} className="px-2 py-0.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-lg text-xs border border-green-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Actions */}
              <div className="space-y-3">
                {/* Stats Card */}
                <div className="bg-gradient-to-b from-white to-green-50 rounded-2xl shadow-sm border border-green-200 p-4">
                  <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                    Project Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-green-100">
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <FiEye className="w-3.5 h-3.5" />
                        Views
                      </span>
                      <span className="font-bold text-green-900">1,247</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-green-100">
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <FiUsers className="w-3.5 h-3.5" />
                        Proposals
                      </span>
                      <span className="font-bold text-green-900">48</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-green-100">
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Avg. Response
                      </span>
                      <span className="font-bold text-green-600">24 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <FiThumbsUp className="w-3.5 h-3.5" />
                        Hiring Rate
                      </span>
                      <span className="font-bold text-blue-600">68%</span>
                    </div>
                  </div>
                </div>

                {/* Action Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-4">
                  <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 bg-white rounded-xl border border-green-200 hover:border-green-400 hover:shadow-sm transition-all duration-300 text-sm">
                      <span className="font-medium text-green-900 flex items-center gap-2">
                        <FiStar className="w-4 h-4 text-amber-500" />
                        Save Opportunity
                      </span>
                      <p className="text-xs text-green-600 mt-0.5">Save for later review</p>
                    </button>
                    <button className="w-full text-left p-3 bg-white rounded-xl border border-green-200 hover:border-green-400 hover:shadow-sm transition-all duration-300 text-sm">
                      <span className="font-medium text-green-900 flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-blue-500" />
                        Share with Team
                      </span>
                      <p className="text-xs text-green-600 mt-0.5">Collaborate with colleagues</p>
                    </button>
                    <button 
                      onClick={handleSendRequest}
                      className="w-full text-left p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-400 hover:shadow-sm transition-all duration-300 text-sm"
                    >
                      <span className="font-medium text-green-900 flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-green-600" />
                        Send Custom Proposal
                      </span>
                      <p className="text-xs text-green-600 mt-0.5">Send your service request</p>
                    </button>
                  </div>
                </div>

                {/* Tips Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-2xl border border-blue-200 p-4">
                  <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    Proposal Tips
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-1.5">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      <span className="text-xs text-green-700">Be specific about how you'll help</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">2</span>
                      </div>
                      <span className="text-xs text-green-700">Include relevant portfolio links</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">3</span>
                      </div>
                      <span className="text-xs text-green-700">Set clear timeline expectations</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">4</span>
                      </div>
                      <span className="text-xs text-green-700">Be transparent about budget</span>
                    </li>
                  </ul>
                </div>

                {/* CTA Card */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-1">Ready to Apply?</h3>
                  <p className="text-xs mb-3 opacity-90">
                    Send a tailored proposal to stand out from other sellers.
                  </p>
                  <button
                    onClick={handleSendRequest}
                    className="w-full py-2.5 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Send Service Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Add missing icon imports
import { FileText, Share2 } from "lucide-react";