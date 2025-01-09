'use client';

import { useEffect, useState } from 'react';
import { Bookmark, CheckCircle, XCircle } from 'lucide-react';
import { generateData } from '../../components/api/graphapi';
import { bookmarkChart } from '../../components/api/bookmark';
import { unbookmarkChart } from '../../components/api/unbookmark';

interface Prompt {
  llm_prompt: string;
  sql_query: string;
  chart_type: string;
  id: string;
}

interface PromptSuggestionsProps {
  selectedPrompt: string;
  onPromptSelect: (prompt: string, query: string, chartType: string, data: any) => void;
  onChartDataUpdate: () => void;
}

export default function PromptSuggestions({ selectedPrompt, onPromptSelect, onChartDataUpdate }: PromptSuggestionsProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filledBookmarks, setFilledBookmarks] = useState<Set<string>>(() => {
    const storedBookmarks = sessionStorage.getItem('filledBookmarks');
    return storedBookmarks ? new Set(JSON.parse(storedBookmarks)) : new Set();
  });
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedResponse = sessionStorage.getItem('continueApiResponse');
    if (storedResponse) {
      try {
        const parsedResponse = JSON.parse(storedResponse);
        setPrompts(parsedResponse);
      } catch (error) {
        console.error('Failed to parse stored API response:', error);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('filledBookmarks', JSON.stringify(Array.from(filledBookmarks)));
  }, [filledBookmarks]);

  const handlePromptClick = async (llm_prompt: string, sql_query: string, chart_type: string, id: string) => {
    try {
      const data = await generateData(id);
      sessionStorage.setItem('chartData', JSON.stringify(data));
      sessionStorage.setItem('selectedChart', chart_type);
      sessionStorage.setItem('selectedPrompt', llm_prompt);

      onPromptSelect(llm_prompt, sql_query, chart_type, data);
      onChartDataUpdate();
    } catch (error) {
      console.error('Error in generating data:', error);
      onPromptSelect(llm_prompt, sql_query, chart_type, null);
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
      {prompts.map(({ llm_prompt, sql_query, chart_type, id }) => (
        <button
          key={llm_prompt}
          onClick={() => handlePromptClick(llm_prompt, sql_query, chart_type, id)}
          className={`w-full p-4 rounded-lg text-left border transition-all duration-200 flex items-center 
            ${selectedPrompt === llm_prompt 
              ? 'bg-green-50 border-green-200 shadow' 
              : 'bg-white border-gray-200 hover:bg-blue-50'}`}
        >
          <div className="flex-shrink-0 w-8 h-8 mr-3">
            <Bookmark
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkClick(id, { llm_prompt, sql_query, chart_type, id });
              }}
              className={`fixed-size-icon ${filledBookmarks.has(id) ? 'text-yellow-500' : 'text-gray-900'}`}
              fill={filledBookmarks.has(id) ? 'currentColor' : 'none'}
            />
          </div>
          <p className="text-sm text-gray-800">{llm_prompt}</p>
        </button>
      ))}
    </div>
  );
}
