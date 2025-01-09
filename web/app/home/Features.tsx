'use client';

import React from 'react';
import { Zap, Shield, BarChart3, Cpu, Cloud, Lock, Upload, Settings, Edit, Bookmark, LogOut } from 'lucide-react';

const features = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: 'File Upload',
    description: 'You can upload Excel (XLSX) or CSV files. These files will be used to process and manage your data.'
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: 'Configure Data',
    description: 'Edit and organize your data easily with AI-driven suggestions for better accuracy.'
  },
  {
    icon: <Edit className="w-6 h-6" />,
    title: 'Update or Delete Data',
    description: 'You can make changes to the data anytime. If something is no longer needed, you can delete it as well.'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Generate AI Prompts',
    description: 'The system will create prompts for AI models to help you get better insights or automate tasks based on your data.'
  },
  {
    icon: <Bookmark className="w-6 h-6" />,
    title: 'Bookmark Data',
    description: 'Save important data by bookmarking it. This makes it easier to find and use later.'
  },
  {
    icon: <LogOut className="w-6 h-6" />,
    title: 'Session Logs with Apache Superset',
    description: 'Apache Superset saves your sessions, tracks activity, and ensures a secure logout when done.'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-12 sm:py-24" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Work Flow-Steps to Visualize
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
          Streamlined process to transform data into clear insights.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br border border-gray-200 hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}