'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import BuyerSidebar from "@/app/components/BuyerSidebar";
import {
  FiFileText,
  FiCheckCircle,
  FiUser,
  FiMail,
  FiBriefcase,
  FiMapPin,
  FiShoppingBag,
  FiCalendar,
  FiDollarSign,
  FiTag,
  FiClock
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

export default function BuyerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/buyer/dashboard");
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to fetch");
        setData(json.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
        <BuyerSidebar />
        <main className="flex-1 p-4 ml-0 md:mr-20 md:ml-20">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const daysUntilDeadline = (deadline) => {
    if (!deadline) return 0;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getRequirementStatus = (deadline) => {
    const daysLeft = daysUntilDeadline(deadline);
    if (daysLeft < 0) return { text: 'Expired', color: 'bg-red-100 text-red-700' };
    if (daysLeft <= 3) return { text: 'Urgent', color: 'bg-orange-100 text-orange-700' };
    return { text: 'Active', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <BuyerSidebar />

      <main className="flex-1 p-4 ml-0 md:mr-20 md:ml-20">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Manage requirements & connect with sellers</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {data?.plan || 'Free'} Plan
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid - Single row on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Requirements</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {data?.totalRequirements || 0}
                </h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <FiFileText className="text-purple-600 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <h3 className="text-lg font-bold text-purple-600 mt-1 flex items-center gap-2">
                  <FiCheckCircle />
                  Verified
                </h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FiUser className="text-green-600 text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card - Stacked on mobile */}
        <div className="bg-white rounded-xl shadow mb-6 p-4">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                  {data?.userdata?.profile_image ? (
                    <img 
                      src={data.userdata.profile_image} 
                      alt={data.userdata.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    data?.userdata?.name?.charAt(0) || <FiUser />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border-2 border-white">
                  <HiOutlineSparkles className="text-white text-xs w-full h-full p-1" />
                </div>
              </div>
              
              <div className="sm:hidden">
                <h2 className="font-bold text-gray-800">{data?.userdata?.name || 'User'}</h2>
                <p className="text-sm text-gray-600 mt-1">{data?.userdata?.email || ''}</p>
              </div>
            </div>

            <div className="flex-1">
              <div className="hidden sm:block">
                <h2 className="font-bold text-gray-800">{data?.userdata?.name || 'User'}</h2>
                <p className="text-sm text-gray-600 mt-1">{data?.userdata?.email || ''}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {data?.profile?.company_name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiBriefcase className="text-purple-500" />
                    <span>{data.profile.company_name}</span>
                  </div>
                )}
                {data?.profile?.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMapPin className="text-purple-500" />
                    <span>{data.profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMail className="text-purple-500" />
                  <span className="truncate">{data?.userdata?.email || ''}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Member since {formatDate(data?.userdata?.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Requirements */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <FiShoppingBag className="text-purple-500" />
                Recent Requirements
              </h2>
              <p className="text-sm text-gray-600 mt-1">Your latest projects</p>
            </div>
            {data?.recentRequirements?.length > 0 && (
              <Link href="/buyer/requirements" className="text-sm text-purple-600 font-medium hidden sm:block">
                View all →
              </Link>
            )}
          </div>

          {!data?.recentRequirements?.length ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiFileText className="text-purple-400 text-xl" />
              </div>
              <h3 className="text-gray-700 font-medium mb-2">No requirements yet</h3>
              <p className="text-gray-500 text-sm mb-4">
                Post your first requirement to connect with sellers
              </p>
              <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg text-sm">
                Post New Requirement
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentRequirements.slice(0, 3).map((req, i) => {
                const status = getRequirementStatus(req.deadline);
                const daysLeft = daysUntilDeadline(req.deadline);
                
                return (
                  <div key={i} className="border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{req.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiDollarSign className="text-green-500" />
                        <span className="font-medium">₹{req.budget || '0'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="text-purple-500" />
                        {formatDate(req.deadline)}
                      </span>
                      {req.category && (
                        <span className="flex items-center gap-1">
                          <FiTag className="text-blue-500" />
                          {req.category}
                        </span>
                      )}
                    </div>
                    
                    {daysLeft <= 3 && daysLeft >= 0 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                        <FiClock />
                        <span>{daysLeft} days left</span>
                      </div>
                    )}
                    
                    <button className="w-full mt-3 text-center text-purple-600 text-sm font-medium py-2 border border-purple-200 rounded-lg hover:bg-purple-50">
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}