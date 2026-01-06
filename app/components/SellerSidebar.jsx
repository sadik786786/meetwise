"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiUser,
  FiFileText,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
  FiMessageSquare,
  FiCreditCard,
  FiDollarSign,
  FiUsers,
  FiInbox
} from "react-icons/fi";

export default function SellerSidebar({ user }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menu = [
    { 
      name: "Dashboard", 
      path: "/seller/dashboard", 
      icon: <FiHome className="w-5 h-5" />,
    },
    { 
      name: "My Profile", 
      path: "/seller/profile", 
      icon: <FiUser className="w-5 h-5" />
    },
    { 
      name: "Browse Requirements", 
      path: "/seller/browse-requirements", 
      icon: <FiFileText className="w-5 h-5" />
    },
    { 
      name: "My Requests", 
      path: "/seller/requests", 
      icon: <FiInbox className="w-5 h-5" />
    },
    { 
      name: "Your Clients", 
      path: "/seller/clients", 
      icon: <FiUsers className="w-5 h-5" />
    },
    { 
      name: "Subscription", 
      path: "/seller/subscription", 
      icon: <FiCreditCard className="w-5 h-5" />,
    },
  ];

  const activeClass = "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg";
  const inactiveClass = "text-gray-600 hover:bg-gray-50 hover:text-green-600 hover:shadow-sm";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 p-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
      >
        {isMobileOpen ? (
          <FiX className="w-6 h-6 text-white" />
        ) : (
          <FiMenu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && isMobile && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:relative z-40
          h-screen bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          flex flex-col
          ${isMobile ? (isMobileOpen ? "left-0" : "-left-64") : "left-0"}
          ${isCollapsed && !isMobile ? "w-20" : "w-64"}
          shadow-xl md:shadow-lg
        `}
      >
        {/* Header with User Info */}
        <div className="p-6 border-b border-gray-100">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
            <div className={`flex items-center ${isCollapsed ? "justify-center w-full" : "space-x-3"}`}>
              <div className="relative">
                <img
                  src={session?.user?.image || "https://via.placeholder.com/150"}
                  className={`rounded-full border-2 border-white shadow-md ${
                    isCollapsed ? "w-10 h-10" : "w-12 h-12"
                  }`}
                  alt={session?.user?.name || "User"}
                />
                {session && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{session?.user?.name || "Guest User"}</h4>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Seller Account</span>
                    <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-600 rounded-full">Active</span>
                  </div>
                </div>
              )}
            </div>
            
            {!isCollapsed && !isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Collapse sidebar"
              >
                <FiChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
          
          {isCollapsed && !isMobile && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Expand sidebar"
              >
                <FiChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => isMobile && setIsMobileOpen(false)}
                className={`
                  flex items-center rounded-xl transition-all duration-200
                  ${isCollapsed ? "justify-center px-3 py-3" : "px-4 py-3.5"}
                  ${isActive ? activeClass : inactiveClass}
                  hover:scale-[1.02] active:scale-[0.98]
                `}
              >
                <div className="relative">
                  {item.icon}
                  {item.notification && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.notification}
                    </span>
                  )}
                </div>
                
                {!isCollapsed && (
                  <>
                    <span className="ml-3 font-medium">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Seller Stats */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Quick Stats</span>
                <div className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                  This Week
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-green-600">12</div>
                  <div className="text-xs text-gray-500">Requests</div>
                </div>
                <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-teal-600">₹8,450</div>
                  <div className="text-xs text-gray-500">Earnings</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className={`
              flex items-center w-full rounded-xl px-4 py-3.5
              text-red-600 hover:bg-red-50 hover:text-red-700
              transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <FiLogOut className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>

        {/* Collapse Button for Desktop */}
        {!isMobile && (
          <div className="absolute -right-3 top-20 hidden md:block">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <FiChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <FiChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        )}
      </aside>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        aside nav::-webkit-scrollbar {
          width: 4px;
        }
        aside nav::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        aside nav::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        aside nav::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  );
}