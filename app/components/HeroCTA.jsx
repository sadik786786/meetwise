'use client';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function HeroCTA() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
        src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Professional business meeting"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Where Clients Meet
          <span className="block mt-2">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Trusted Professionals
            </span>
          </span>
        </h1>
        
        {/* Description */}
        <p className="text-lg sm:text-xl text-slate-200 mb-10 max-w-2xl mx-auto px-4">
          Connect with verified experts, share your project needs, and schedule 
          consultations seamlessly—all in one platform.
        </p>
        
        {/* Features - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
          {[
            { icon: '✓', title: 'Verified Experts', desc: 'Background-checked professionals' },
            { icon: '⚡', title: 'Quick Matching', desc: 'Find the right fit in minutes' },
            { icon: '🔒', title: 'Secure Platform', desc: 'Safe and confidential consultations' }
          ].map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg 
                       border border-white/20 hover:bg-white/15 transition-all duration-200"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
              <p className="text-slate-300 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Single Client CTA Button */}
        <div className="mb-12">
          <button
            onClick={() => signIn('google')}
            className="group inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-4 
                     bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold 
                     rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 
                     transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto text-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Find Your Professional
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl 
                      animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl 
                      animate-pulse delay-1000"></div>
    </section>
  );
}