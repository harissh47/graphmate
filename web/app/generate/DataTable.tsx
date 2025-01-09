'use client';

import { utils, writeFile } from 'xlsx';
import download from './assets/download.png';

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
}

export default function DataTable({ chartData }: DataTableProps) {
  const downloadData = () => {
    if (!chartData) return;

    const data = chartData.data.category.map((cat, index) => ({
      [chartData.headers.category]: cat,
      [chartData.headers.value]: chartData.data.value[index],
    }));

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data");
    writeFile(workbook, "data.xlsx");
  };

  if (!chartData) {
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
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                {chartData?.headers.category}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                {chartData?.headers.value}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {chartData?.data.category.map((cat, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{chartData.data.value[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}