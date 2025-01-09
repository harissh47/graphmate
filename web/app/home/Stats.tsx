'use client';

import React from 'react';

const stats = [
  { number: '100%', label: 'Uptime', suffix: '' },
  { number: '2.5', label: 'Million Users', suffix: 'M+' },
  { number: '500', label: 'Enterprise Clients', suffix: '+' },
  { number: '24/7', label: 'Expert Support', suffix: '' }
];

export default function Stats() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gray-900" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                <div className="relative">
                  <div className="text-5xl font-bold text-white mb-2 tracking-tight">
                    {stat.number}{stat.suffix}
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}