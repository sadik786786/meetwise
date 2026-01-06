"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiUser,
  FiCalendar,
  FiFileText,
  FiSettings,
  FiCreditCard,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
  FiInbox,
  FiShoppingBag,
  FiBell,
  FiMessageSquare
} from "react-icons/fi";

export default function BuyerSidebar({ user }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileOpen, isMobile]);

  const menu = [
    { 
      name: "Dashboard", 
      path: "/buyer/dashboard", 
      icon: <FiHome className="w-5 h-5" />,
    },
    { 
      name: "My Profile", 
      path: "/buyer/profile", 
      icon: <FiUser className="w-5 h-5" />
    },
    { 
      name: "Requirements", 
      path: "/buyer/requirements", 
      icon: <FiFileText className="w-5 h-5" />
    },
    { 
      name: "Professionals", 
      path: "/buyer/professionals", 
      icon: <FiShoppingBag className="w-5 h-5" />
    },
    { 
      name: "Proposals", 
      path: "/buyer/proposals", 
      icon: <FiInbox className="w-5 h-5" />,
    },
    { 
      name: "Subscription", 
      path: "/buyer/subscription", 
      icon: <FiCreditCard className="w-5 h-5" />,
    },
  ];

  const activeClass = "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg";
  const inactiveClass = "text-gray-600 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isMobileOpen && !event.target.closest('aside')) {
        setIsMobileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isMobileOpen]);

  return (
    <>
      {/* Floating Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Open menu"
        >
          {isMobileOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && isMobile && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:relative z-50
          h-screen bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          flex flex-col
          ${isMobile ? (isMobileOpen ? "left-0" : "-left-full") : "left-0"}
          ${isCollapsed && !isMobile ? "w-20" : "w-64"}
          shadow-xl md:shadow-lg
        `}
      >
        {/* Mobile Header */}
        {isMobile && (
          <div className="p-4 border-b border-gray-100 md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={session?.user?.image || "https://via.placeholder.com/150"}
                    className="w-10 h-10 rounded-full border-2 border-white shadow"
                    alt={session?.user?.name || "User"}
                  />
                  {session && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{session?.user?.name || "Guest"}</h4>
                  <span className="text-xs text-gray-500">Buyer</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
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
                      <span className="text-xs text-gray-500">Buyer Account</span>
                      <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full">Active</span>
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
        )}

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
                  ${isCollapsed && !isMobile ? "justify-center px-3 py-3" : "px-4 py-3.5"}
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
                
                {(!isCollapsed || isMobile) && (
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

        {/* Quick Stats - Desktop only */}
        {!isCollapsed && !isMobile && (
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Quick Stats</span>
                <div className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                  This Week
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-blue-600">3</div>
                  <div className="text-xs text-gray-500">Bookings</div>
                </div>
                <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-purple-600">5</div>
                  <div className="text-xs text-gray-500">Messages</div>
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
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FiLogOut className="w-5 h-5" />
            {(!isCollapsed || isMobile) && <span className="ml-3 font-medium">Logout</span>}
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