'use client';
import BuyerSidebar from "@/app/components/BuyerSidebar";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Globe,
  Phone,
  CheckCircle,
  Loader2,
  ArrowLeft
} from "lucide-react";

export default function SellerProfile() {
  const router = useRouter();
  const { seller_id } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/buyer/professionals/${seller_id}`);
        
        if (res.status === 403) {
          router.push("/buyer/subscription");
          return;
        }
        
        const data = await res.json();
        setProfile(data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [seller_id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <BuyerSidebar />
        <div className="flex-1 flex items-center justify-center ml-0 md:ml-20">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <BuyerSidebar />
        <div className="flex-1 flex items-center justify-center ml-0 md:ml-20">
          <div className="text-center max-w-md mx-4">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Profile Not Found</h3>
            <p className="text-gray-600 mb-6">The seller profile you're looking for doesn't exist.</p>
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const skills = profile.skills ? profile.skills.split(',').map(skill => skill.trim()) : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BuyerSidebar />
      
      <main className="flex-1 ml-0 md:ml-20">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Seller Profile</h1>
                <p className="text-xs text-gray-500">{profile.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Desktop Header */}
            <div className="hidden md:block mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Seller Profile</h1>
                  <p className="text-gray-600 text-sm mt-1">Professional details</p>
                </div>
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            </div>

            {/* Main Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Profile Header */}
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gray-100 overflow-hidden bg-white">
                      <Image 
                        src={profile.profile_image || '/default-avatar.png'} 
                        alt={profile.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                      <p className="text-gray-600 mb-3">{profile.title}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Verified Professional
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.country || "Not specified"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-4 md:p-6">
                {/* Two Column Layout for Desktop */}
                <div className="hidden md:grid md:grid-cols-2 gap-6">
                  {/* Left Column - Bio & Skills */}
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Professional Bio</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 text-base">
                          {profile.bio || "No bio provided"}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.length > 0 ? skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm"
                          >
                            {skill}
                          </span>
                        )) : (
                          <p className="text-gray-500 text-sm">No skills listed</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Contact */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="text-gray-800 font-medium truncate">{profile.email}</p>
                        </div>
                      </div>

                      {profile.phone && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="text-gray-800 font-medium">{profile.phone}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="text-gray-800 font-medium">{profile.country || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single Column Layout for Mobile */}
                <div className="md:hidden space-y-6">
                  {/* Bio */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Professional Bio</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 text-sm">
                        {profile.bio || "No bio provided"}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.length > 0 ? skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm"
                        >
                          {skill}
                        </span>
                      )) : (
                        <p className="text-gray-500 text-sm">No skills listed</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium truncate">{profile.email}</p>
                        </div>
                      </div>

                      {profile.phone && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Phone className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium">{profile.phone}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium">{profile.country || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}