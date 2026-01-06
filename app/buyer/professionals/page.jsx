'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import BuyerSidebar from "@/app/components/BuyerSidebar";

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/buyer/professionals")
      .then(res => res.json())
      .then(data => {
        setProfessionals(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <BuyerSidebar />
      
      <main className="flex-1 lg:mr-20 lg:ml-20">
        {/* Header */}
        <div className="border-b border-gray-100 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Professionals</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Discover and connect with verified experts
            </p>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : professionals.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No professionals yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Check back later or explore other categories
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing <span className="font-medium text-blue-600">{professionals.length}</span> professionals
                  </p>
                </div>

                {/* Professionals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {professionals.map(p => {
                    const skills = p.skills ? p.skills.split(',').map(s => s.trim()).slice(0, 2) : [];
                    
                    return (
                      <div 
                        key={p.seller_id} 
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200 group"
                      >
                        {/* Professional Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl">💼</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                              {p.title || "Professional"}
                            </h3>
                            {p.experience_years && (
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="mr-2">📅</span>
                                <span>{p.experience_years} years experience</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Skills */}
                        {skills.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill, index) => (
                                <span 
                                  key={index} 
                                  className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Location */}
                        {p.country && (
                          <div className="flex items-center text-sm text-gray-600 mb-5">
                            <span className="mr-2">📍</span>
                            <span>{p.country}</span>
                          </div>
                        )}

                        {/* View Profile Link */}
                        <Link
                          href={`/buyer/professionals/${p.seller_id}`}
                          className="block w-full text-center py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity group-hover:shadow"
                        >
                          View Profile
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      `}</style>
    </div>
  );
}