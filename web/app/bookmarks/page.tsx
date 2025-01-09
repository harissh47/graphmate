'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ChartDisplay from '../generate/ChartDisplay';
import DataTable from '../generate/DataTable';
import Header from '../Header';
import Footer from '../Footer';
import { unbookmarkChart } from '../../components/api/unbookmark';
import { fetchBookmarks } from '../../components/api/bookmarkdetails';
import { generateData } from '../../components/api/graphapi';
import { TrashIcon, ChevronUpIcon, ChevronDownIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import QueryDisplay from '../generate/QueryDisplay';

interface Chart {
  id: string;
  chart_type: string;
  sql_query: string;
  llm_prompt: string;
  parameters: {
    category: string;
    value: string;
    series: string | null;
    additional: string | null;
  };
}

interface BookmarkDetails {
  name: string;
  charts: Chart[];
}

// Updated LoadingSpinner component
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="fixed top-18 left-140 right-140 bg-red-50 border-l-4 border-red-500 p-4 z-50 rounded-md">
    <p className="text-red-700 text-center">{message}</p>
  </div>
);

const BookmarkCard = ({ bookmark, onPromptClick, onDelete, onDeleteAll }: {
  bookmark: BookmarkDetails;
  onPromptClick: (chart: Chart) => void;
  onDelete: (chartId: string, e: React.MouseEvent) => void;
  onDeleteAll: (bookmarkName: string, e: React.MouseEvent) => void;
}) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
        <h3 className="text-xl font-semibold text-gray-800">
          {bookmark.name}
        </h3>
        <button
          onClick={(e) => onDeleteAll(bookmark.name, e)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
          title="Delete all bookmarks"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-3">
        {bookmark.charts.map((chart) => (
          <div key={chart.id} className="flex items-center gap-2 group">
            <button
              onClick={() => onPromptClick(chart)}
              className="flex-1 text-left p-3 rounded-lg bg-gray-50 hover:bg-blue-50 
                transition-all duration-200 text-sm text-gray-700 border border-gray-100
                hover:border-blue-200 group-hover:shadow-sm"
            >
              {chart.llm_prompt || 'No Prompt Available'}
            </button>
            <button
              onClick={(e) => onDelete(chart.id, e)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200
                opacity-0 group-hover:opacity-100"
              title="Delete bookmark"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function BookmarkDetails() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkDetails[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [selectedChart, setSelectedChart] = useState<Chart | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [chartDataVersion, setChartDataVersion] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(true);

  const detailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedChart && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChart]);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setLoading(true);
        const data = await fetchBookmarks('123');
        setBookmarks(data);
      } catch (error) {
        setError('Failed to fetch bookmarks');
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  const handlePromptClick = async (chart: Chart) => {
    try {
      setLoading(true);
      setError(null); // Clear any existing error
      const data = await generateData(chart.id);
      setSelectedChart(chart); // Store the entire chart object
      setChartData(data); // Ensure chartData is set correctly
      setChartDataVersion((prev) => prev + 1);
      console.log('Chart data:', data); // Debugging: Log chart data
    } catch (error) {
      setError('Failed to fetch chart data');
      console.error('Error fetching chart data:', error);
      // Automatically clear error after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chartId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await unbookmarkChart(chartId);
      setBookmarks(bookmarks.map(bookmark => ({
        ...bookmark,
        charts: bookmark.charts.filter(chart => chart.id !== chartId)
      })).filter(bookmark => bookmark.charts.length > 0));
    } catch (error) {
      setError('Failed to delete bookmark');
      console.error('Error deleting bookmark:', error);
      // Automatically clear error after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleDeleteAll = async (bookmarkName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const bookmarkToDelete = bookmarks.find(bookmark => bookmark.name === bookmarkName);
      if (bookmarkToDelete) {
        for (const chart of bookmarkToDelete.charts) {
          await unbookmarkChart(chart.id);
        }
        setBookmarks(bookmarks.filter(bookmark => bookmark.name !== bookmarkName));
      }
    } catch (error) {
      setError('Failed to delete all bookmarks');
      console.error('Error deleting all bookmarks:', error);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const toggleDetailsVisibility = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-white to-blue-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-20 pb-12 max-w-7xl">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
            title="Go back"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-4xl font-bold text-center flex-grow">
            Bookmarks🔖
          </h1>
        </div>
        
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && bookmarks.length > 0 ? (
            bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.name}
                bookmark={bookmark}
                onPromptClick={handlePromptClick}
                onDelete={handleDelete}
                onDeleteAll={handleDeleteAll}
              />
            ))
          ) : (
            !loading && (
              <div className="col-span-full flex items-center justify-center p-12 text-gray-500">
                <p className="text-lg">No bookmarks available</p>
              </div>
            )
          )}
        </div>

        {selectedChart && (
          <div
            ref={detailsRef}
            className="mt-8 bg-white rounded-xl shadow-sm p-6 transition-all duration-300 ease-in-out"
          >
            <button
              onClick={toggleDetailsVisibility}
              className="mb-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
            >
              {isDetailsVisible ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <>
                  <ChevronDownIcon className="h-5 w-5" />
                  <span className="ml-2">Click to see the expanded view</span>
                </>
              )}
            </button>
            {isDetailsVisible && (
              <>
                <div className="llm-prompt-container mb-4">
                  <h4 className="text-lg font-semibold mb-2">LLM Prompt</h4>
                  <p className="text-gray-700">{selectedChart.llm_prompt || 'No Prompt Available'}</p>
                </div>
                <div className="chart-display-container mb-4">
                  <ChartDisplay
                    selectedChart={selectedChart.chart_type}
                    chartDataVersion={chartDataVersion}
                    isPromptSelected={!!selectedChart}
                  />
                </div>
                <div className="data-table-container mb-4">
                  <DataTable chartData={chartData} />
                </div>
                <div className="query-display-container">
                  <QueryDisplay 
                    query={selectedChart.sql_query} 
                    isPromptSelected={!!selectedChart} 
                  />
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
