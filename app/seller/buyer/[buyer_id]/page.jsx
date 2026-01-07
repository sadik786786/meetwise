'use client';
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SellerSidebar from "@/app/components/SellerSidebar";
import { 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  MessageCircle, 
  User,
  Loader2,
  Calendar,
  DollarSign,
  Package,
  Star,
  ChevronRight,
  Shield,
  BadgeCheck
} from "lucide-react";

export default function BuyerProfile() {
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { buyer_id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    fetch(`/api/seller/view-buyer/${buyer_id}`)
      .then(res => res.json())
      .then(data => {
        setBuyer(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [buyer_id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <SellerSidebar />
        <div className="flex-1 flex items-center justify-center ml-0 md:ml-20">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
              <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-20"></div>
            </div>
            <p className="mt-4 text-gray-700 font-medium">Loading buyer profile...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching the latest details</p>
          </div>
        </div>
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <SellerSidebar />
        <div className="flex-1 flex items-center justify-center ml-0 md:ml-20">
          <div className="text-center max-w-md mx-4">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10"></div>
              <User className="w-full h-full text-green-400 p-4" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Buyer Not Found</h3>
            <p className="text-gray-600 mb-6">The buyer profile you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <SellerSidebar />
      
      <div className="flex-1 ml-0 md:ml-20">
        {/* Floating Header for Mobile */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-green-100 md:hidden">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-gray-800">Buyer Profile</h1>
                <p className="text-xs text-gray-600 truncate max-w-[200px]">{buyer.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-green-500" />
                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 md:p-6 lg:p-8">
          {/* Header with Gradient */}
          <div className="mb-6 md:mb-8">
            <div className="hidden md:block">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Buyer Profile
              </h1>
              <p className="text-gray-600 mt-2">View and manage buyer information</p>
            </div>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
            {/* Enhanced Gradient Header */}
            <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-4 md:p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 bg-white/5 rounded-full -translate-x-12 translate-y-12"></div>
              
              <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-6">
                {/* Profile Image Container */}
                <div className="relative">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/40 shadow-2xl overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500">
                    <Image 
                      src={buyer.profile_image || '/default-profile.png'} 
                      alt="Buyer Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 md:w-8 md:h-8 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left text-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 drop-shadow-sm">{buyer.name}</h2>
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                        <Building className="w-4 h-4 md:w-5 md:h-5" />
                        <p className="text-sm md:text-base font-medium opacity-90">{buyer.company_name}</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold">Verified Buyer</span>
                    </div>
                  </div>
                  
                  {/* Quick Contact Mobile */}
                  <div className="md:hidden flex items-center justify-center gap-4 mt-4">
                    <a href={`mailto:${buyer.email}`} className="p-2 bg-white/20 rounded-full">
                      <Mail className="w-4 h-4" />
                    </a>
                    <a href={`tel:${buyer.phone}`} className="p-2 bg-white/20 rounded-full">
                      <Phone className="w-4 h-4" />
                    </a>
                    <button className="p-2 bg-white text-green-600 rounded-full">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-4 md:p-6 lg:p-8">
              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    Contact Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-gray-800 font-medium truncate">{buyer.email}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                    </div>

                    <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <p className="text-gray-800 font-medium">{buyer.phone}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Building className="w-4 h-4 text-white" />
                    </div>
                    Company Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Building className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Company Name</p>
                        <p className="text-gray-800 font-medium">{buyer.company_name}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                    </div>

                    <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-gray-800 font-medium">{buyer.location}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden space-y-4">
                {(activeTab === 'overview' || activeTab === 'contact') && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <Mail className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium truncate">{buyer.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-medium">{buyer.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                        <Building className="w-5 h-5 text-emerald-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Company</p>
                          <p className="text-sm font-medium">{buyer.company_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium">{buyer.location}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}