'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import SellerSidebar from "@/app/components/SellerSidebar";
import { 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  MessageCircle, 
  ArrowLeft,
  User,
  Briefcase,
  Star,
  FileText,
  Download,
  Shield,
  Loader2,
  ChevronRight,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Globe,
  Award,
  Bell,
  Users,
  Target,
  Sparkle
} from "lucide-react";

export default function ClientProfilePage() {
  const { data: session } = useSession();
  const { buyerId } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch(`/api/seller/clients/${buyerId}`);
        const data = await res.json();
        setProfile(data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [buyerId, router]);
  const startChat = async () => {
    const seller_data = await fetch(`/api/seller/profile`).then(r => r.json());
    const seller_id = seller_data.data.id;
};

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <SellerSidebar />
        <div className="flex-1 flex items-center justify-center ml-0 md:ml-20">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading client profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <SellerSidebar />
        <div className="flex-1 flex items-center justify-center ml-0 md:ml-20">
          <div className="text-center max-w-md mx-4">
            <User className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Client Not Found</h3>
            <p className="text-gray-600 mb-6">The client profile you're looking for doesn't exist.</p>
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
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
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 bg-white/90 backdrop-blur-sm border-b border-green-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Active</span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <div className="hidden md:block">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Client Profile
                </h1>
                <p className="text-gray-600 mt-2">Detailed information about your client</p>
              </div>
            </div>

            {/* Main Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 mb-6">
              {/* Profile Header with Gradient */}
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-6 md:p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white/40 shadow-xl overflow-hidden bg-white">
                      <Image 
                        src={profile.profile_image || '/default-avatar.png'} 
                        alt={profile.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center md:text-left text-white">
                    <h2 className="text-xl md:text-2xl font-bold mb-2">{profile.name}</h2>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      <Building className="w-4 h-4 md:w-5 md:h-5" />
                      <p className="text-sm md:text-base">{profile.company_name || "Independent Client"}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span className="text-xs md:text-sm font-medium">Verified Client</span>
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
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      Contact Details
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Mail className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="text-gray-800 font-medium truncate">{profile.email}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                      </div>

                      <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="text-gray-800 font-medium">{profile.phone}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      Additional Information
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Building className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Company</p>
                          <p className="text-gray-800 font-medium">{profile.company_name || "Not specified"}</p>
                        </div>
                      </div>

                      <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <MapPin className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="text-gray-800 font-medium">{profile.location || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-4">
                  {(activeTab === 'overview' || activeTab === 'contact') && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <Mail className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium truncate">{profile.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-medium">{profile.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                        <Building className="w-5 h-5 text-emerald-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Company</p>
                          <p className="text-sm font-medium">{profile.company_name || "Not specified"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium">{profile.location || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}