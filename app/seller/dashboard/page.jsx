'use client';
import { useEffect, useState } from "react";
import SellerSidebar from "@/app/components/SellerSidebar";
import {
  FiUsers,
  FiCheckCircle,
  FiMessageSquare,
  FiStar,
  FiUser,
  FiMail,
  FiCalendar,
  FiBriefcase,
  FiTrendingUp,
  FiArrowUp,
  FiFileText
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

export default function SellerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/seller/dashboard", { method: 'GET' });
        const json = await res.json();
        console.log(json.data)
        if (!res.ok) throw new Error(json.message || "Failed");

        setData(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <SellerSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-56">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SellerSidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-5 md:mr-20 md:ml-20">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500">
                Member since {new Date(data.userdata.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold">
                {data.userdata.profile_image ? (
                  <img 
                    src={data.userdata.profile_image} 
                    alt={data.userdata.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  data.userdata.name?.charAt(0) || <FiUser />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <HiOutlineSparkles className="text-white text-xs" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{data.userdata.name}</h2>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMail className="text-green-500" />
                      <span className="text-sm">{data.userdata.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiBriefcase className="text-green-500" />
                      <span className="text-sm">{data.profile?.title || "No title set"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="text-green-500" />
                      <span className="text-sm">
                        Joined {new Date(data.userdata.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 min-w-[200px]">
                  <div className="text-sm text-green-800 font-medium mb-1">Skills & Expertise</div>
                  <div className="flex flex-wrap gap-2">
                    {data.profile?.skills ? (
                      data.profile.skills.split(',').map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-white text-green-700 rounded-full text-xs font-medium border border-green-200">
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Add your skills in profile settings</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard 
            title="Total Requests" 
            value={data.totalRequests} 
            icon={<FiUsers />}
            trend="+12%"
            description="From last month"
          />
          <StatCard 
            title="Accepted" 
            value={data.acceptedRequests} 
            icon={<FiCheckCircle />}
            percentage={data.totalRequests > 0 ? Math.round((data.acceptedRequests / data.totalRequests) * 100) : 0}
            description="Acceptance rate"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Requests Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FiFileText className="text-green-500" />
                    Recent Requests
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Latest opportunities from buyers</p>
                </div>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                  View all
                  <FiArrowUp className="transform rotate-90" />
                </button>
              </div>

              {data.recentRequests.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFileText className="text-green-400 text-2xl" />
                  </div>
                  <h3 className="text-gray-700 font-medium mb-2">No requests yet</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    When buyers show interest in your services, their requests will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.recentRequests.map((req, i) => (
                    <RequestItem
                      key={i}
                      buyer={req.buyer_name}
                      title={req.title}
                      budget={`₹${req.budget}`}
                      status={req.status}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, trend, percentage, description, isPlan = false }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-green-50 rounded-xl text-green-600">
          <div className="text-xl">{icon}</div>
        </div>
        {trend && (
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className={`text-2xl md:text-3xl font-bold ${isPlan ? 'text-green-600' : 'text-gray-800'}`}>
          {value}
          {percentage !== undefined && (
            <span className="text-green-600 text-lg ml-2">({percentage}%)</span>
          )}
        </h3>
        
        {description && (
          <p className="text-gray-500 text-xs mt-2">{description}</p>
        )}
      </div>
    </div>
  );
}

function RequestItem({ buyer, title, budget, status }) {
  const statusColors = {
    accepted: "bg-green-100 text-green-700 border border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    rejected: "bg-red-100 text-red-700 border border-red-200",
    review: "bg-blue-100 text-blue-700 border border-blue-200"
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 hover:bg-green-50 rounded-xl transition-colors duration-200 group">
      <div className="mb-3 sm:mb-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center text-white font-bold">
            {buyer?.charAt(0) || "B"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-200">{title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <FiUser className="text-xs" />
                {buyer}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="font-medium text-green-600">{budget}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || "bg-gray-100 text-gray-700"}`}>
          {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </span>
        <button className="text-green-600 hover:text-green-700 text-sm font-medium hidden sm:block">
          View Details
        </button>
      </div>
    </div>
  );
}