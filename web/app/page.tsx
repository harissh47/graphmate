'use client';

import React from 'react';
import Header from './Header';
import Hero from './home/Hero';
import Features from './home/Features';
import Stats from './home/Stats';
import Footer from './Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      {/* <Stats /> */}
      <Footer />
    </div>
  );
}

export default App;