'use client';

import { useEffect, useState } from "react";
import BuyerSidebar from "@/app/components/BuyerSidebar";
import {
  FiUser,
  FiMessageSquare,
  FiDollarSign,
  FiCheck,
  FiX,
  FiClock,
  FiBriefcase,
  FiStar,
  FiFilter,
  FiSearch,
  FiMenu,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiTag,
  FiMapPin,
  FiMail,
  FiPhone
} from "react-icons/fi";

export default function BuyerProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedProposal, setExpandedProposal] = useState(null);

  useEffect(() => {
    fetch("/api/buyer/proposals")
      .then(res => res.json())
      .then(data => {
        if (data.success) setProposals(data.data);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/buyer/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setProposals(prev =>
        prev.map(p =>
          p.request_id === id ? { ...p, status } : p
        )
      );
    }
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <FiClock className="w-4 h-4" />,
        label: "Pending"
      },
      accepted: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: <FiCheckCircle className="w-4 h-4" />,
        label: "Accepted"
      },
      rejected: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: <FiXCircle className="w-4 h-4" />,
        label: "Rejected"
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color}`}>
        {config.icon}
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = 
      proposal.requirement_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.seller_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.skills?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <BuyerSidebar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-white">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500 mb-4"></div>
            <p className="text-purple-700 font-medium">Loading proposals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white">
      {/* Mobile Sidebar Overlay */}
      <BuyerSidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 w-full">
        <div className="max-w-6xl mx-auto">
          
          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Proposals</h1>
              </div>
              <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-medium text-sm">
                {proposals.length}
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Seller Proposals</h1>
                <p className="text-gray-600 mt-2">Review and manage proposals from sellers</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-xl font-medium">
                  {proposals.length} {proposals.length === 1 ? 'Proposal' : 'Proposals'}
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl font-medium">
                  {proposals.filter(p => p.status === 'accepted').length} Accepted
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search proposals by title, seller name, or skills..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Proposals List */}
          {filteredProposals.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-50 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiMessageSquare className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No matching proposals" : "No proposals yet"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Proposals from sellers will appear here once they respond to your requirements"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProposals.map((proposal) => (
                <div
                  key={proposal.request_id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* Proposal Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FiUser className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {proposal.requirement_title}
                              </h3>
                              <StatusBadge status={proposal.status} />
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-gray-700 font-medium">
                                {proposal.seller_name}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">
                                {proposal.seller_title || "Freelancer"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Proposal Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column - Seller Info */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Seller Information</h4>
                          <div className="space-y-3">
                            {proposal.seller_email && (
                              <div className="flex items-center gap-3">
                                <FiMail className="w-4 h-4 text-purple-500" />
                                <span className="text-gray-700">{proposal.seller_email}</span>
                              </div>
                            )}
                            {proposal.skills && (
                              <div className="flex items-center gap-3">
                                <FiTag className="w-4 h-4 text-blue-500" />
                                <span className="text-gray-700">{proposal.skills}</span>
                              </div>
                            )}
                            {proposal.seller_location && (
                              <div className="flex items-center gap-3">
                                <FiMapPin className="w-4 h-4 text-blue-500" />
                                <span className="text-gray-700">{proposal.seller_location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Budget Info */}
                        {proposal.proposed_budget && (
                          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                              <FiDollarSign className="w-5 h-5 text-purple-600" />
                              <span className="font-medium text-gray-700">Proposed Budget</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-700">
                              ₹{proposal.proposed_budget.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Message */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FiMessageSquare className="w-5 h-5 text-purple-500" />
                          <h4 className="text-sm font-medium text-gray-500">Seller's Message</h4>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {proposal.message || "No message provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {proposal.status === "pending" && (
                      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-100">
                        <button
                          onClick={() => updateStatus(proposal.request_id, "accepted")}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-semibold"
                        >
                          <FiCheck className="w-5 h-5" />
                          Accept Proposal
                        </button>
                        <button
                          onClick={() => updateStatus(proposal.request_id, "rejected")}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold"
                        >
                          <FiX className="w-5 h-5" />
                          Reject Proposal
                        </button>
                      </div>
                    )}

                    {/* Proposal Date */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500">
                        <FiClock className="w-4 h-4" />
                        <span className="text-sm">
                          Received on {new Date(proposal.created_at || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      {proposal.status !== "pending" && (
                        <div className="text-sm text-gray-500">
                          {proposal.status === "accepted" 
                            ? "You accepted this proposal" 
                            : "You rejected this proposal"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          {proposals.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-100">
                <div className="text-xl sm:text-2xl font-bold text-purple-700">{proposals.length}</div>
                <div className="text-xs sm:text-sm text-purple-600">Total</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-100">
                <div className="text-xl sm:text-2xl font-bold text-yellow-700">
                  {proposals.filter(p => p.status === 'pending').length}
                </div>
                <div className="text-xs sm:text-sm text-yellow-600">Pending</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-100">
                <div className="text-xl sm:text-2xl font-bold text-green-700">
                  {proposals.filter(p => p.status === 'accepted').length}
                </div>
                <div className="text-xs sm:text-sm text-green-600">Accepted</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100">
                <div className="text-xl sm:text-2xl font-bold text-blue-700">
                  {proposals.filter(p => p.status === 'rejected').length}
                </div>
                <div className="text-xs sm:text-sm text-blue-600">Rejected</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}