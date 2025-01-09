'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '../Header';
import prompticon from './assets/prompticon.png';
import Footer from '../Footer';

// Dynamically import components with SSR disabled
const PromptSuggestions = dynamic(() => import('./PromptSuggestions'), { ssr: false });
const ChartDisplay = dynamic(() => import('./ChartDisplay'), { ssr: false });
const DataTable = dynamic(() => import('./DataTable'), { ssr: false });
const QueryDisplay = dynamic(() => import('./QueryDisplay'), { ssr: false });

interface ChartData {
  headers: {
    category: string;
    value: string;
    series: string | null;
    additional: string | null;
  };
  data: {
    value: number[];
    series: any[];
    category: string[];
    additional: any[];
  };
}

export default function ChatPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [selectedChart, setSelectedChart] = useState<string>("");
  const [isPromptSelected, setIsPromptSelected] = useState<boolean>(false);
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [chartDataVersion, setChartDataVersion] = useState(0);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [projectName, setProjectName] = useState<string>('');

  useEffect(() => {
    const storedProjectName = sessionStorage.getItem('projectName');
    if (storedProjectName) {
      setProjectName(storedProjectName);
    }
  }, []);

  const handlePromptSelect = (prompt: string, query: string, chartType: string, data: ChartData) => {
    setSelectedPrompt(prompt);
    setInputPrompt(prompt);
    setSelectedQuery(query);
    setSelectedChart(chartType);
    setIsPromptSelected(true);
    setChartData(data);
  };

  const handleChartSelect = (chartType: string) => {
    setSelectedChart(chartType);
  };

  const handleChartDataUpdate = () => {
    setChartDataVersion((prev) => prev + 1);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #bfdbfe, #ffffff, #dbeafe)" }}>
      <Header />
      <main className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-white bg-opacity-90 shadow-lg p-4 mt-16 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="max-h-full overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Prompts</h2>
            <PromptSuggestions
              selectedPrompt={selectedPrompt}
              onPromptSelect={handlePromptSelect}
              onChartDataUpdate={handleChartDataUpdate}
            />
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-6 flex flex-col items-center justify-center mt-16">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
            {projectName ? `Project: ${projectName}` : 'Data Visualization'}
          </h1>

          <div className="w-full max-w-4xl space-y-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div
                className="relative flex items-center bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-4 shadow-lg"
              >
                <img src={prompticon.src} className="h-12 w-12 text-gray-400 mr-3" alt="Prompt Icon" />
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Select a prompt"
                  className="w-full pl-3 pr-4 py-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col space-y-6">
              <ChartDisplay
                selectedChart={selectedChart}
                chartDataVersion={chartDataVersion}
                isPromptSelected={isPromptSelected}
              />
              <DataTable chartData={chartData} />
            </div>

            {/* Query Section */}
            <QueryDisplay query={selectedQuery} isPromptSelected={isPromptSelected} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
