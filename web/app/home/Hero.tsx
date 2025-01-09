'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #bfdbfe, #ffffff, #fef9c3)',
        fontFamily: 'Poppins'
      }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiNmMGYwZjAiLz48L2c+PC9zdmc+')] opacity-5" />
      <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-40 pb-16 sm:pb-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-16">
          <div className="md:w-1/2 space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Upload.<br />
              Analyze With AI.<br />
              Visualize it.
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Unlock stunning visual insights in minutes with AI. Let auto-generated SQL queries do the work while you make smarter, data-driven decisions with ease and precision!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/upload" className="group px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:translate-x-1">
                <span className="flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <a href="/" className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-900 text-gray-900 rounded-full hover:bg-gray-50 transition-colors">
                Watch Demo
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-3xl transform rotate-3" />
              <img 
                src="/photo.png"
                alt="Modern workspace"
                className="rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}