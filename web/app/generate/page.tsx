'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '../Header';
import prompticon from './assets/prompticon.png';
import Footer from '../Footer';
import { generateData } from '../../components/api/graphapi';
import { updatePromptAPI } from '../../components/api/updateprompt';
import { useDatasetStore, type PromptHistoryItem } from '../datastorage/dataStore';
import { useRouter } from 'next/navigation';

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
  const [isPromptEdited, setIsPromptEdited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentChartId, setCurrentChartId] = useState<string | null>(null);
  const [updatedPrompt, setUpdatedPrompt] = useState<string>("");

  const {
    setSelectedChartId,
    setChartData: setStoreChartData,
    setSelectedChart: setStoreSelectedChart,
    setSelectedPrompt: setStoreSelectedPrompt,
    projectName,
    setProjectName,
    continueApiResponse,
    setContinueApiResponse,
    setCurrentChartData,
    setCurrentPrompt,
    setCurrentChartType,
    promptsHistory,
    setPromptsHistory,
    savedPrompts,
    setSavedPrompts,
    currentPrompt,
    currentChartType,
    currentChartData,
    currentQuery,
    setCurrentQuery,
  } = useDatasetStore();

  const router = useRouter();

  const [savedPromptsList, setSavedPromptsList] = useState<PromptHistoryItem[]>(savedPrompts);

  useEffect(() => {
    if (!continueApiResponse || continueApiResponse.length === 0) {
      setContinueApiResponse(savedPrompts);
    }
  }, [continueApiResponse, savedPrompts, setContinueApiResponse]);

  useEffect(() => {
    // Only initialize if we don't have an active input prompt
    if (currentPrompt && !inputPrompt) {
      setSelectedPrompt(currentPrompt);
      setInputPrompt(currentPrompt);
      setSelectedChart(currentChartType);
      setChartData(currentChartData);
      setIsPromptSelected(true);
      setSelectedQuery(currentQuery);
    }
  }, [currentPrompt, currentChartType, currentChartData, currentQuery, inputPrompt]);

  useEffect(() => {
    setSavedPromptsList(savedPrompts);
  }, [savedPrompts]);

  const handlePromptSelect = (prompt: string, query: string, chartType: string, data: ChartData, id: string) => {
    setSelectedPrompt(prompt);
    setInputPrompt(prompt);
    setSelectedQuery(query);
    setSelectedChart(chartType);
    setIsPromptSelected(true);
    setCurrentChartId(id);
    setCurrentChartData(data);
    setCurrentPrompt(prompt);
    setCurrentChartType(chartType);
    setChartData(data);
    setSavedPrompts((prev) => {
      if (!prev.some((p) => p.id === id)) {
        return [...prev, { llm_prompt: prompt, sql_query: query, chart_type: chartType, id, data }];
      }
      return prev;
    });
    setCurrentQuery(query);
  };

  const handleChartSelect = (chartType: string) => {
    setSelectedChart(chartType);
  };

  const handleChartDataUpdate = () => {
    setChartDataVersion((prev) => prev + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrompt = e.target.value;
    setInputPrompt(newPrompt);
    setIsPromptEdited(newPrompt !== selectedPrompt);
    setCurrentPrompt(newPrompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isPromptEdited) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!currentChartId || !isPromptEdited) {
      //console.log('Submit button clicked but conditions not met:', { currentChartId, isPromptEdited });
      return;
    }
    setLoading(true);
    try {
      //console.log('Submitting prompt:', inputPrompt);
      const updateData = await updatePromptAPI(currentChartId, inputPrompt);
      //console.log('Update data received:', updateData);
      
      // Update saved prompts with new prompt but keep existing data
      setSavedPrompts((prev) => prev.map((p) => 
        p.id === currentChartId ? { 
          ...p, 
          llm_prompt: inputPrompt,
          sql_query: updateData.sql_query,
          chart_type: updateData.chart_type
        } : p
      ));

      setSelectedQuery(updateData.sql_query);
      setSelectedChart(updateData.chart_type);
      setIsPromptEdited(false);
      setCurrentPrompt(inputPrompt);
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToMoreCharts = () => {
    // Ensure the current state is set before navigating
    setCurrentPrompt(selectedPrompt);
    setCurrentChartType(selectedChart);
    setCurrentChartData(chartData);
    router.push('/moreCharts');
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #bfdbfe, #ffffff, #dbeafe)" }}>
      <Header />
      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-white bg-opacity-90 shadow-lg p-4 mt-16 lg:sticky top-16 h-64 lg:h-[calc(100vh-4rem)] overflow-y-auto">
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
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Select a prompt"
                  className="w-full pl-3 pr-4 py-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isPromptEdited}
                  className={`ml-4 px-4 py-2 text-white rounded-xl ${isPromptEdited ? 'bg-blue-500' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  Submit
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col space-y-6">
              <ChartDisplay
                selectedChart={selectedChart}
                chartDataVersion={chartDataVersion}
                isPromptSelected={isPromptSelected}
                selectedPrompt={selectedPrompt}
                chartData={chartData}
                navigateToMoreCharts={navigateToMoreCharts}
              />
              <DataTable 
                chartData={chartData} 
                selectedChart={selectedChart}
                chartId={currentChartId || undefined}
              />
            </div>

            {/* Query Section */}
            <QueryDisplay query={selectedQuery} isPromptSelected={isPromptSelected} />
          </div>
        </section>
      </main>
      <Footer />

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}