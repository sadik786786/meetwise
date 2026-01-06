"use client";
import BuyerSidebar from "@/app/components/BuyerSidebar";
import { useState, useEffect } from "react";

export default function BuyerSubscription() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on medium+ screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      

      <BuyerSidebar />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0 lg:pl-72 w-full">
        <div className="min-h-screen lg:min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="w-full max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
                <div className="relative">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full animate-ping absolute -top-1 -right-1"></div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm sm:text-lg">⚡</span>
                  </div>
                </div>
                <span className="ml-2 sm:ml-3 text-blue-600 font-semibold text-sm sm:text-base tracking-wide">
                  COMING SOON
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Subscription Plans
              </h1>
              
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed px-2">
                Premium buyer subscriptions are launching soon to enhance your experience.
              </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-lg sm:shadow-xl lg:shadow-2xl shadow-blue-100/50 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500">
              {/* Coming Features Section */}
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-blue-200 rounded-full -translate-y-8 sm:-translate-y-12 lg:-translate-y-16 translate-x-8 sm:translate-x-12 lg:translate-x-16 opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-indigo-200 rounded-full translate-y-8 sm:translate-y-12 lg:translate-y-12 -translate-x-8 sm:-translate-x-12 lg:-translate-x-12 opacity-20"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-lg sm:text-xl lg:text-2xl">🚀</span>
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      What's Coming
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-white/80 rounded-lg sm:rounded-xl backdrop-blur-sm hover:bg-white transition-colors">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-sm sm:text-base">👤</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">More Seller Profiles</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Unlimited access to verified sellers</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-white/80 rounded-lg sm:rounded-xl backdrop-blur-sm hover:bg-white transition-colors">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-sm sm:text-base">💬</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Direct Chat Access</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Instant communication with sellers</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-white/80 rounded-lg sm:rounded-xl backdrop-blur-sm hover:bg-white transition-colors">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 text-sm sm:text-base">⭐</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Priority Support</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Dedicated buyer assistance</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-white/80 rounded-lg sm:rounded-xl backdrop-blur-sm hover:bg-white transition-colors">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 text-sm sm:text-base">🔄</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Flexible Plans</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Lifetime & monthly options</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coming Soon Badge */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg w-full max-w-md mx-auto">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-base sm:text-xl">⏳</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full border-2 border-yellow-50"></div>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-yellow-900 text-sm sm:text-lg">Subscriptions Coming Soon</h3>
                    <p className="text-xs sm:text-sm text-yellow-700">We're preparing something special for you</p>
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="mt-6 sm:mt-8">
                  <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden max-w-md mx-auto">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">Launching in progress...</p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center mt-6 sm:mt-8 px-2">
              <p className="text-gray-500 text-xs sm:text-sm">
                Stay tuned for updates. We'll notify you when subscriptions are available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}