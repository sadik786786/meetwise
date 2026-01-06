'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import SellerSidebar from "@/app/components/SellerSidebar";
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Star, 
  Clock, 
  CheckCircle, 
  Eye,
  Building,
  Loader2,
  Menu,
  X
} from "lucide-react";

export default function SellerClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/seller/clients")
      .then(res => res.json())
      .then(data => {
        setClients(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.requirement_title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "recent") {
      return matchesSearch && client.status === "active";
    } else if (filter === "high-budget") {
      return matchesSearch && (parseInt(client.proposed_budget) > 5000);
    }
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SellerSidebar />
        <div className="flex-1 flex items-center justify-center ml-0 md:ml-20">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading clients...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar with mobile support */}
      <div className={` lg:block fixed lg:static z-40`}>
        <SellerSidebar/>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 w-full px-4 sm:px-6 py-4">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Clients</h1>
              <p className="text-gray-600 text-sm">{clients.length} clients</p>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Clients</h1>
            <p className="text-gray-600 mt-1">Manage your client relationships</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search clients by name or project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    filter === "all" 
                      ? "bg-green-600 text-white" 
                      : "text-gray-600 hover:text-gray-900"
                  } rounded-l-lg`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("recent")}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    filter === "recent" 
                      ? "bg-green-600 text-white" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setFilter("high-budget")}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    filter === "high-budget" 
                      ? "bg-green-600 text-white" 
                      : "text-gray-600 hover:text-gray-900"
                  } rounded-r-lg`}
                >
                  High Budget
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredClients.length} {filteredClients.length === 1 ? 'Client' : 'Clients'}
          </h2>
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-600 text-sm mb-4">
                {searchTerm 
                  ? "No clients match your search."
                  : "You haven't accepted any clients yet."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Clients Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map(client => (
                <div 
                  key={client.request_id} 
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  {/* Client Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-700 font-bold">
                              {client.buyer_name?.charAt(0) || "C"}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 truncate">
                            {client.buyer_name || "Client"}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 truncate">
                            <Building className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">
                              {client.company_name || "Individual"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-amber-600">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-bold">4.8</span>
                        </div>
                      </div>
                    </div>

                    {/* Project Title */}
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                        {client.requirement_title || "Project Requirement"}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>Started 2 weeks ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Client Details */}
                  <div className="p-4">
                    {/* Budget & Timeline */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-green-700 mb-1">
                          <DollarSign className="w-3 h-3" />
                          <span className="font-bold">₹{client.proposed_budget || "0"}</span>
                        </div>
                        <p className="text-xs text-gray-600">Budget</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-blue-700 mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="font-bold">30</span>
                        </div>
                        <p className="text-xs text-gray-600">Days</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/seller/clients/${client.buyer_id}`}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Profile</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}