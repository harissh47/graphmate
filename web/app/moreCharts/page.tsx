'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '../Header';
import Footer from '../Footer';
import { useDatasetStore } from '../datastorage/dataStore';
import { useRouter } from 'next/navigation';

// Dynamically import components with SSR disabled
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const MoreChart = dynamic(() => import('./moreChart'), { ssr: false });

import { ChartType } from './morevisual';

export default function ChatPage() {
  const router = useRouter();
  const [selectedChart, setSelectedChart] = useState<ChartType>("Basic Line Chart");
  
  const { 
    currentPrompt, 
    currentChartType, 
    currentChartData,
    promptsHistory,
    savedPrompts
  } = useDatasetStore();

  const [selectedPrompt, setSelectedPrompt] = useState<string>(currentPrompt);

  useEffect(() => {
    // Redirect only if there's no data available
    if (!currentChartData && 
        promptsHistory.length === 0 && 
        savedPrompts.length === 0) {
      router.push('/generate');
    }
  }, [currentChartData, promptsHistory, savedPrompts, router]);

  // Add back button handler
  const handleBack = () => {
    router.push('/generate');
  };

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
        {/* Add back button */}
        {/* <button
          onClick={handleBack}
          className="absolute top-24 left-4 px-4 py-2 text-white rounded-xl bg-blue-500 hover:bg-blue-600"
        >
          Back to Generate
        </button> */}

        <Sidebar 
          onChartSelect={handleChartSelect} 
          currentChartType={currentChartType}
        />
        <main className="flex-grow container mx-auto px-4 pt-24 pb-12">

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