'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/chartx.png" className="h-6 w-6 text-blue-600 cursor-pointer" alt="GraphMate Logo" onClick={() => window.location.href = '/'} />
          <span className="font-semibold text-xl cursor-pointer" onClick={() => window.location.href = '/'}>GraphMate</span>
          {(pathname === '/generate' || pathname === '/configure') && (
            <span className="font-semibold text-xl">
              {pathname === '/generate' ? ' - Data Visualization' : ' - Dataset Configuration'}
            </span>
          )}
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors border border-gray-300 hover:border-blue-600 rounded-full px-3 py-1">Home</a>
          <a href="/upload" className="text-gray-600 hover:text-blue-600 transition-colors border border-gray-300 hover:border-blue-600 rounded-full px-3 py-1" onClick={() => {
            sessionStorage.clear();
          }}>Upload</a>
          <a href="/bookmarks" className="text-gray-600 hover:text-blue-600 transition-colors border border-gray-300 hover:border-blue-600 rounded-full px-3 py-1">Bookmarks</a>
        </nav>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col items-start space-y-2 p-4">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Home</a>
            <a href="/upload" className="text-gray-600 hover:text-blue-600 transition-colors duration-200" onClick={() => {
              sessionStorage.clear();
            }}>Upload</a>
            <a href="/bookmarks" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Bookmarks</a>
          </nav>
        </div>
      )}
    </header>
  );
}