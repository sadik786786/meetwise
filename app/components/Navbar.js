'use client';
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { FiMenu, FiX, FiLogOut, FiLogIn, FiUser, FiChevronDown, FiShoppingBag, FiBriefcase } from "react-icons/fi"
import { RiDashboardLine } from "react-icons/ri"
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const menuRef = useRef(null)
  const profileRef = useRef(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Get user display name
  const getUserName = () => {
    if (session?.user?.name) return session.user.name
    if (session?.user?.email) return session.user.email.split('@')[0]
    return "User"
  }

  // Truncate long text
  const truncateText = (text, maxLength = 20) => {
    if (!text) return ""
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...'
    }
    return text
  }

  // Handle role selection
  const handleRoleSelection = async (role) => {
    localStorage.setItem('userRole', role);
    
    if (session) {
      router.push(role === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard');
    } else {
      await signIn('google', { 
        callbackUrl: role === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard' 
      });
    }
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }

  // Handle sign out
  const handleSignOut = async () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    await signOut({ callbackUrl: '/' });
  }

  // Navigate to dashboard
  const goToDashboard = () => {
    const role = localStorage.getItem('userRole') || 'buyer';
    router.push(role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
    setIsProfileOpen(false);
  }

  return (
    <>
      {/* Navigation Bar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/98 backdrop-blur-xl shadow-2xl py-2' 
            : 'bg-white/95 backdrop-blur-lg shadow-lg py-3'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Section */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center space-x-3 group"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsProfileOpen(false)
                }}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 rounded-xl flex items-center justify-center transform group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-purple-200">
                    <span className="text-white font-bold text-lg">MW</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                    MeetWise
                  </span>
                  <span className="text-[10px] text-gray-500 -mt-1">Smart Connections</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Right Section */}
            <div className="hidden lg:flex items-center space-x-3">
              
              {/* Role Selection Buttons */}
              <div className="flex items-center space-x-2 border-r border-gray-200 pr-3">
                <button
                  onClick={() => handleRoleSelection('buyer')}
                  className="group relative px-4 py-2.5 text-sm font-medium text-purple-700 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200 flex items-center space-x-2"
                >
                  <FiShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Start as Buyer</span>
                </button>
                
                <button
                  onClick={() => handleRoleSelection('seller')}
                  className="group relative px-4 py-2.5 text-sm font-medium text-teal-700 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-lg hover:border-teal-300 hover:shadow-md transition-all duration-200 flex items-center space-x-2"
                >
                  <FiBriefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Start as Seller</span>
                </button>
              </div>
              
              {/* User Profile/Auth */}
              {session ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-2.5 py-2 transition-all duration-200 shadow-sm hover:shadow-md group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {session.user?.image ? (
                          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white ring-offset-2 ring-offset-blue-50">
                            <Image
                              src={session.user.image}
                              alt="Profile"
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {truncateText(getUserName())}
                        </span>
                        <span className="text-xs text-gray-500">
                          {session.user?.email ? truncateText(session.user.email, 18) : "User"}
                        </span>
                      </div>
                    </div>
                    <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{session.user?.email}</p>
                      </div>

                      {/* Dashboard Button */}
                      <div className="px-2 pt-2">
                        <button
                          onClick={goToDashboard}
                          className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                        >
                          <RiDashboardLine className="w-4 h-4 mr-3" />
                          Go to Dashboard
                        </button>
                      </div>

                      {/* Role Switch Section */}
                      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Switch Role</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRoleSelection('buyer')}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors font-medium"
                          >
                            <FiShoppingBag className="w-3.5 h-3.5 mr-2" />
                            Buyer
                          </button>
                          <button
                            onClick={() => handleRoleSelection('seller')}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors font-medium"
                          >
                            <FiBriefcase className="w-3.5 h-3.5 mr-2" />
                            Seller
                          </button>
                        </div>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-2"
                        >
                          <FiLogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => signIn('google')}
                  className="group relative px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-teal-500 rounded-lg hover:from-purple-700 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2.5"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6 text-gray-700" />
                ) : (
                  <FiMenu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isMenuOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-30' : 'opacity-0'
          }`}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">MW</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">MeetWise</span>
                  <p className="text-xs text-gray-600">Smart Connections</p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* User Info (if logged in) */}
            {session && (
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-white shadow"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <FiUser className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {getUserName()}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items - Simplified */}
            <div className="flex-1 overflow-y-auto py-6">
              {/* Role Selection - Mobile */}
              <div className="px-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-3 px-2">Start as:</p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleRoleSelection('buyer')}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-4 text-base font-medium text-purple-700 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition-all duration-200"
                  >
                    <FiShoppingBag className="w-5 h-5" />
                    <span>Start as Buyer</span>
                  </button>
                  
                  <button
                    onClick={() => handleRoleSelection('seller')}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-4 text-base font-medium text-teal-700 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-xl hover:bg-teal-100 hover:border-teal-300 transition-all duration-200"
                  >
                    <FiBriefcase className="w-5 h-5" />
                    <span>Start as Seller</span>
                  </button>
                </div>
              </div>

              {/* Dashboard Button for logged in users */}
              {session && (
                <div className="px-4 mt-6">
                  <button
                    onClick={goToDashboard}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 rounded-xl transition-all duration-200"
                  >
                    <RiDashboardLine className="w-4.5 h-4.5" />
                    <span>Go to Dashboard</span>
                  </button>
                </div>
              )}
            </div>

            {/* Auth Section - Mobile */}
            <div className="border-t border-gray-100 p-6">
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200"
                >
                  <FiLogOut className="w-4.5 h-4.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    signIn('google')
                  }}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 rounded-xl transition-all duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add padding to prevent content from being hidden behind navbar */}
      <div className="h-16"></div>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  )
}