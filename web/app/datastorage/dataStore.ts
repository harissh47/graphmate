import { create } from 'zustand';

// Define column interface
interface Column {
  columnName: string;
  columnDescription: string;
  columnDataDescription: string;
  columnDataType: string;
  column_name?: string;
  column_description?: string;
  column_data_description?: string;
  column_data_type?: string;
}

// Define response interface
interface DatasetResponse {
  datasetDescription?: string;
  datasetName?: string;
  datasetId?: string;
  dataset_relation_id?: string;
  table_name?: string;
  db_type?: string;
  columns: Column[];
  [key: string]: any; // For any additional properties
}

// Define dataset interface
interface Dataset {
  fileName: string;
  response: DatasetResponse;
  color: string;
}

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
    color?: string;
  };
}

// Add type definition for the API response
interface PromptResponse {
  llm_prompt: string;
  sql_query: string;
  chart_type: string;
  id: string;
}

// Add to your interfaces
export interface PromptHistoryItem extends PromptResponse {
  data: ChartData;
}

interface DatasetState {
  // Dataset related state
  datasets: Dataset[];
  currentDatasetId: string | null;
  
  // Chart related state
  selectedChartId: string | null;
  selectedChart: string;
  chartData: ChartData | null;
  projectName: string;
  continueApiResponse: any;
  filledBookmarks: Set<string>;
  selectedPrompt: string;
  scatterPlotDataSource: string;
  
  // New state properties
  currentChartData: any | null;
  currentPrompt: string;
  currentChartType: string;
  
  // Prompts history
  promptsHistory: PromptHistoryItem[];
  
  // Add new state property for saved prompts
  savedPrompts: PromptHistoryItem[];
  
  // Add new state property for current query
  currentQuery: string;
  
  // Actions
  setDatasets: (datasets: Dataset[]) => void;
  addDataset: (dataset: Dataset) => void;
  clearDatasets: () => void;
  setCurrentDatasetId: (id: string | null) => void;
  setSelectedChartId: (id: string | null) => void;
  setSelectedChart: (chartType: string) => void;
  setChartData: (data: ChartData | null) => void;
  setProjectName: (name: string) => void;
  setContinueApiResponse: (response: any) => void;
  setFilledBookmarks: (bookmarks: Set<string>) => void;
  setSelectedPrompt: (prompt: string) => void;
  setScatterPlotDataSource: (source: string) => void;
  setCurrentChartData: (data: any) => void;
  setCurrentPrompt: (prompt: string) => void;
  setCurrentChartType: (type: string) => void;
  setPromptsHistory: (prompts: PromptHistoryItem[] | ((prev: PromptHistoryItem[]) => PromptHistoryItem[])) => void;
  setSavedPrompts: (prompts: PromptHistoryItem[] | ((prev: PromptHistoryItem[]) => PromptHistoryItem[])) => void;
  setCurrentQuery: (query: string) => void;
  updatePrompt: (id: string, updatedPrompt: Partial<PromptHistoryItem>) => void;
}

export const useDatasetStore = create<DatasetState>((set) => ({
  // Initial state
  datasets: [],
  currentDatasetId: null,
  selectedChartId: null,
  selectedChart: '',
  chartData: null,
  projectName: '',
  continueApiResponse: null,
  filledBookmarks: new Set(),
  selectedPrompt: '',
  scatterPlotDataSource: '',
  
  // New state properties
  currentChartData: null,
  currentPrompt: '',
  currentChartType: '',
  
  // Prompts history
  promptsHistory: [],
  
  // Add new state property for saved prompts
  savedPrompts: [],
  
  // Add new state property for current query
  currentQuery: '',
  
  // Actions
  setDatasets: (datasets) => set({ datasets }),
  addDataset: (dataset) => set((state) => ({ 
    datasets: [...state.datasets, dataset] 
  })),
  clearDatasets: () => set((state) => ({ 
    datasets: [], 
    currentDatasetId: null,
    selectedChartId: null,
    selectedChart: '',
    chartData: null,
    projectName: '',
    continueApiResponse: null,
    filledBookmarks: new Set(),
    selectedPrompt: '',
    scatterPlotDataSource: '',
    currentChartData: null,
    currentPrompt: '',
    currentChartType: '',
    promptsHistory: [],
    // Don't clear savedPrompts
    savedPrompts: state.savedPrompts
  })),
  setCurrentDatasetId: (id) => set({ currentDatasetId: id }),
  setSelectedChartId: (id) => set({ selectedChartId: id }),
  setSelectedChart: (chartType) => set({ selectedChart: chartType }),
  setChartData: (data) => set({ chartData: data }),
  setProjectName: (name) => set({ projectName: name }),
  setContinueApiResponse: (response) => {
    //console.log('Setting continue API response:', response);
    set({ continueApiResponse: response });
  },
  setFilledBookmarks: (bookmarks) => set({ filledBookmarks: bookmarks }),
  setSelectedPrompt: (prompt) => set({ selectedPrompt: prompt }),
  setScatterPlotDataSource: (source) => set({ scatterPlotDataSource: source }),
  setCurrentChartData: (data: any) => set({ currentChartData: data }),
  setCurrentPrompt: (prompt: string) => set({ currentPrompt: prompt }),
  setCurrentChartType: (type: string) => set({ currentChartType: type }),
  setPromptsHistory: (prompts) => set((state) => ({
    promptsHistory: typeof prompts === 'function' ? prompts(state.promptsHistory) : prompts
  })),
  setSavedPrompts: (prompts) => set((state) => ({
    savedPrompts: typeof prompts === 'function' ? prompts(state.savedPrompts) : prompts
  })),
  setCurrentQuery: (query) => set({ currentQuery: query }),
  updatePrompt: (id: string, updatedPrompt: Partial<PromptHistoryItem>) => set((state) => ({
    savedPrompts: state.savedPrompts.map(prompt =>
      prompt.id === id ? { ...prompt, ...updatedPrompt } : prompt
    ),
    promptsHistory: state.promptsHistory.map(prompt =>
      prompt.id === id ? { ...prompt, ...updatedPrompt } : prompt
    )
  })),
}));

// Export types for use in other files
export type { Dataset, DatasetResponse, Column, ChartData, PromptResponse };