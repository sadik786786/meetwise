// components/MinimalFooter.js
import Link from 'next/link';

export default function MinimalFooter() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                            <span className="text-lg font-bold">M</span>
                        </div>
                        <span className="text-xl font-bold">MeetWise</span>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
                        <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                            About
                        </Link>
                        <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                            Contact
                        </Link>
                        <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                            Terms
                        </Link>
                        <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                            Blog
                        </Link>
                    </div>

                    {/* Copyright */}
                    <div className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} MeetWise
                    </div>

                </div>
            </div>
        </footer>
    );
}