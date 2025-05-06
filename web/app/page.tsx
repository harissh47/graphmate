'use client';

import React, { useEffect } from 'react';
import Header from './Header';
import Hero from './home/Hero';
import Features from './home/Features';
import Stats from './home/Stats';
import Footer from './Footer';

function App() {
  useEffect(() => {
    // Extract session from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionCookie = urlParams.get('session');
    
    // Set cookie only if session parameter exists in URL
    if (sessionCookie) {
      // Set cookie with secure attributes
      document.cookie = `session=${sessionCookie}; path=/; SameSite=Strict; Secure`;
      
      // Remove the session parameter from URL after setting cookie
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []); // Empty dependency array means this runs once when component mounts

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