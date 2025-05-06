'use client';

import { useEffect, useState } from 'react';
import { Bookmark, CheckCircle, XCircle } from 'lucide-react';
import { generateData } from '../../components/api/graphapi';
import { bookmarkChart } from '../../components/api/bookmark';
import { unbookmarkChart } from '../../components/api/unbookmark';
import { useDatasetStore, type PromptHistoryItem } from '../datastorage/dataStore';
import { useRouter, usePathname } from 'next/navigation';

interface Prompt extends PromptHistoryItem {
  // Prompt already has all required fields from PromptHistoryItem
}

interface PromptSuggestionsProps {
  selectedPrompt: string;
  onPromptSelect: (prompt: string, query: string, chartType: string, data: any, chartId: string) => void;
  onChartDataUpdate: () => void;
}

export default function PromptSuggestions({ onPromptSelect, onChartDataUpdate }: PromptSuggestionsProps) {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [displayedPrompts, setDisplayedPrompts] = useState<Prompt[]>([]);
  
  const {
    continueApiResponse,
    projectName,
    setContinueApiResponse,
    filledBookmarks,
    setFilledBookmarks,
    setSelectedChartId,
    setChartData: setStoreChartData,
    setSelectedChart,
    setSelectedPrompt,
    savedPrompts,
    currentPrompt,
    setCurrentPrompt,
    promptsHistory,
    currentChartType,
    updatePrompt
  } = useDatasetStore();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/generate' && 
        !continueApiResponse && 
        !savedPrompts.length) {
      //console.log('No prompts available - redirecting to configure page');
      router.push('/configure');
    } else if ((!continueApiResponse || continueApiResponse.length === 0) && 
               savedPrompts.length > 0) {
      setContinueApiResponse(savedPrompts);
    }
  }, [continueApiResponse, savedPrompts, setContinueApiResponse, router]);

  useEffect(() => {
    // Correct merge order with proper priority:
    // 1. promptsHistory (lowest priority)
    // 2. continueApiResponse 
    // 3. savedPrompts (highest priority)
    const mergedPrompts = [
      ...promptsHistory,
      ...(continueApiResponse || []),
      ...savedPrompts,
    ];

    // Create a map to keep the latest version of each prompt
    const promptMap = new Map<string, Prompt>();
    mergedPrompts.forEach(prompt => {
      promptMap.set(prompt.id, prompt);
    });

    const uniquePrompts = Array.from(promptMap.values());
    setDisplayedPrompts(uniquePrompts);
  }, [continueApiResponse, promptsHistory, savedPrompts]);

  const handlePromptClick = async (llm_prompt: string, sql_query: string, chart_type: string, id: string) => {
    try {
      const data = await generateData(id);
      
      // Update store
      setSelectedChartId(id);
      setStoreChartData(data);
      setSelectedChart(chart_type);
      setSelectedPrompt(llm_prompt);
      setCurrentPrompt(llm_prompt);

      // Update the prompt in the store
      updatePrompt(id, { llm_prompt, sql_query, chart_type, data });

      //console.log('Prompt selected:', llm_prompt); // Debugging: Check selected prompt

      onPromptSelect(llm_prompt, sql_query, chart_type, data, id);
      onChartDataUpdate();
    } catch (error) {
      console.error('Error in generating data:', error);
      onPromptSelect(llm_prompt, sql_query, chart_type, null, id);
      setPopupMessage('Error generating data. Displaying SQL query instead.');
      setTimeout(() => setPopupMessage(null), 700);
    }
  };

  const handleBookmarkClick = async (id: string, prompt: Prompt) => {
    const isRemovingBookmark = filledBookmarks.has(id);
    const updatedBookmarks = new Set(filledBookmarks);

    if (isRemovingBookmark) {
      updatedBookmarks.delete(id);
      await unbookmarkChart(id);
      setPopupMessage('Bookmark Disabled for this prompt');
    } else {
      updatedBookmarks.add(id);
      await bookmarkChart(id);
      setPopupMessage('Bookmark Enabled for this prompt');
    }

    setFilledBookmarks(updatedBookmarks);
    setTimeout(() => setPopupMessage(null), 700);
  };

  return (
    <div className="space-y-4 relative">
      {popupMessage && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-white border border-gray-300 p-4 rounded shadow-lg space-x-2 z-50 max-w-md mx-auto"
          style={{ zIndex: 1050 }}
        >
          {popupMessage.includes('Enabled') ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
          <span className="text-gray-800">{popupMessage}</span>
        </div>
      )}

      {displayedPrompts.length > 0 ? (
        displayedPrompts.map(({ llm_prompt, sql_query, chart_type, id }) => (
          <button
            key={id}
            onClick={() => handlePromptClick(llm_prompt, sql_query, chart_type, id)}
            className={`w-full p-4 rounded-lg text-left border transition-all duration-200 flex items-center 
              ${currentPrompt === llm_prompt 
                ? 'bg-green-50 border-green-200 shadow' 
                : 'bg-white border-gray-200 hover:bg-blue-50'}`}
          >
            <div className="flex-shrink-0 w-8 h-8 mr-3">
              <Bookmark
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmarkClick(id, { 
                    llm_prompt, 
                    sql_query, 
                    chart_type, 
                    id, 
                    data: {
                      headers: { category: '', value: '', series: null, additional: null },
                      data: { value: [], series: [], category: [], additional: [] }
                    }
                  });
                }}
                className={`fixed-size-icon ${filledBookmarks.has(id) ? 'text-yellow-500' : 'text-gray-900'}`}
                fill={filledBookmarks.has(id) ? 'currentColor' : 'none'}
              />
            </div>
            <p className="text-sm text-gray-800">{llm_prompt}</p>
          </button>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading prompts...</p>
        </div>
      )}
    </div>
  );
}