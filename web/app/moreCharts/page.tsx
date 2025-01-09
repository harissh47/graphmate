'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '../Header';
import Footer from '../Footer';

// Dynamically import components with SSR disabled
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const MoreChart = dynamic(() => import('./moreChart'), { ssr: false });

import { ChartType } from './morevisual';

export default function ChatPage() {
  const [selectedChart, setSelectedChart] = useState<ChartType>("Basic Line Chart");
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");

  useEffect(() => {
    const storedPrompt = sessionStorage.getItem('selectedPrompt');
    if (storedPrompt) {
      setSelectedPrompt(storedPrompt);
    }
  }, []);

  const handleChartSelect = (chart: ChartType) => {
    setSelectedChart(chart);
  };

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg, #c4daff, #c4daff, #fef9c3, #fef9c3)' }}
    >
      <Header />
      <div className="flex flex-grow">
        <Sidebar onChartSelect={handleChartSelect} />
        <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
          {/* <h1 className="text-3xl font-bold text-center">
            {selectedPrompt || "More Charts📊"}
          </h1> */}
          <MoreChart 
            selectedChart={selectedChart}
            onChartSelect={handleChartSelect}
            selectedPrompt={selectedPrompt}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
}