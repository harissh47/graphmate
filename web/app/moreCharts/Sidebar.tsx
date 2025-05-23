'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faChartPie, 
  faChartBar, 
  faChartArea, 
  faArrowLeft 
} from '@fortawesome/free-solid-svg-icons';
import { ChartType } from './morevisual';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  onChartSelect: (chartType: ChartType) => void;
  currentChartType: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onChartSelect, currentChartType }) => {
  const router = useRouter();

  const chartTypesToShow = () => {
    switch (currentChartType) {
      case 'Line Chart':
      case 'Bar Chart':
      case 'Pie Chart':
        return ['Line Chart', 'Bar Chart', 'Pie Chart'];
      case 'Scatter Plot':
        return ['Scatter Plot'];
      case 'Heatmap':
        return ['Heatmap'];
      default:
        return [];
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full sm:w-60 bg-white/40 text-black h-screen p-7">
      {/* Header Section */}
      <div className="relative flex items-center mb-20 sm:mb-10 mt-5 sm:mt-10">
        <button
          onClick={() => router.back()}
          className="absolute left-0 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
          title="Go back"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </button>
        <h2 className="mx-auto text-lg sm:text-xl font-bold">Chart Types</h2>
      </div>

      {/* Chart Types List */}
      <ul className="flex flex-col space-y-3 sm:space-y-5">
        {chartTypesToShow().includes('Line Chart') && (
          <li>
            <a
              href="#"
              onClick={() => onChartSelect('Line Chart' as ChartType)}
              className="flex items-center block px-3 py-1 rounded-md transition-colors hover:bg-black/10"
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-2" /> Line Chart
            </a>
          </li>
        )}
        {chartTypesToShow().includes('Bar Chart') && (
          <li>
            <a
              href="#"
              onClick={() => onChartSelect('Bar Chart' as ChartType)}
              className="flex items-center block px-3 py-1 rounded-md transition-colors hover:bg-black/10"
            >
              <FontAwesomeIcon icon={faChartBar} className="mr-2" /> Bar Chart
            </a>
          </li>
        )}
        {chartTypesToShow().includes('Pie Chart') && (
          <li>
            <a
              href="#"
              onClick={() => onChartSelect('Pie Chart' as ChartType)}
              className="flex items-center block px-3 py-1 rounded-md transition-colors hover:bg-black/10"
            >
              <FontAwesomeIcon icon={faChartPie} className="mr-2" /> Pie Chart
            </a>
          </li>
        )}
        {chartTypesToShow().includes('Scatter Plot') && (
          <li>
            <a
              href="#"
              onClick={() => onChartSelect('Scatter Plot' as ChartType)}
              className="flex items-center block px-3 py-1 rounded-md transition-colors hover:bg-black/10"
            >
              <FontAwesomeIcon icon={faChartArea} className="mr-2" /> Scatter Plot
            </a>
          </li>
        )}
        {chartTypesToShow().includes('Heatmap') && (
          <li>
            <a
              href="#"
              onClick={() => onChartSelect('Heatmap' as ChartType)}
              className="flex items-center block px-3 py-1 rounded-md transition-colors hover:bg-black/10"
            >
              <FontAwesomeIcon icon={faChartArea} className="mr-2" /> Heatmap
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
