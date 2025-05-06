'use client';

import { utils, writeFile } from 'xlsx';
import download from './assets/download.png';
import { useState, useEffect } from 'react';
import { generateData } from '../../components/api/graphapi';
import { useDatasetStore } from '../datastorage/dataStore';

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

interface DataTableProps {
  chartData: ChartData | null;
  selectedChart?: string;
  chartId?: string;
}

export default function DataTable({ chartData, selectedChart, chartId }: DataTableProps) {
  const [tableData, setTableData] = useState<ChartData | null>(chartData);
  const [loading, setLoading] = useState(false);
  const selectedChartId = useDatasetStore(state => state.selectedChartId);

  useEffect(() => {
    // Update tableData whenever chartData prop changes
    setTableData(chartData);
  }, [chartData]);

  useEffect(() => {
    const fetchTableData = async () => {
      // Get chartId from props or store
      const effectiveChartId = chartId || selectedChartId;
      
      if (!effectiveChartId) {
        //console.log('No chartId available');
        return;
      }
      
      setLoading(true);
      try {
        //console.log('Fetching data for chartId:', effectiveChartId);
        const data = await generateData(effectiveChartId);
        //console.log('Received data:', data);
        setTableData(data);
      } catch (error) {
        console.error('Error fetching table data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a chartId
    if (chartId || selectedChartId) {
      fetchTableData();
    }
  }, [chartId, selectedChartId]);

  const downloadData = () => {
    if (!tableData) return;

    const data = tableData.data.value.map((val: number, index: number) => ({
      [tableData.headers.category || tableData.headers.series || 'X']: 
        (tableData.data.category[index] || tableData.data.series[index] || `Item ${index + 1}`),
      [tableData.headers.value || 'Value']: val,
    }));

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data");
    writeFile(workbook, "data.xlsx");
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
        </div>
        <div className="p-6 text-center text-gray-500">
          Loading data...
        </div>
      </div>
    );
  }

  if (!tableData) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
        </div>
        <div className="p-6 text-center text-gray-500">
          Select a prompt to view data
        </div>
      </div>
    );
  }

  const renderTableHeaders = () => {
    const xHeader = tableData.headers.category || tableData.headers.series || 'X';
    const yHeader = tableData.headers.value || 'Value';

    return (
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
          {xHeader}
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
          {yHeader}
        </th>
      </tr>
    );
  };

  const renderTableRow = (val: number, index: number) => {
    const xValue = tableData.data.category[index] || 
                  tableData.data.series[index] || 
                  `Item ${index + 1}`;

    return (
      <tr key={index} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {xValue}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {val ?? 0}
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden h-[400px] flex flex-col">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
        <button onClick={downloadData} className="text-gray-500 hover:text-gray-700">
          <img src={download.src} alt="Download" className="h-5 w-5" />
        </button>
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            {renderTableHeaders()}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tableData.data.value.map((val: number, index: number) => 
              renderTableRow(val, index)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}