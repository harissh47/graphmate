'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import zoomin from './assets/zoomin.png';
import * as echarts from 'echarts';
import { getChartOption } from './chartOptions';

interface ChartDisplayProps {
    selectedChart: string;
    chartDataVersion: number;
    isPromptSelected: boolean;
}

export default function ChartDisplay({ selectedChart, chartDataVersion, isPromptSelected }: ChartDisplayProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [loading, setLoading] = useState(false);
    const chartRef = useRef<HTMLDivElement | null>(null);
    const zoomedChartRef = useRef<HTMLDivElement | null>(null);
    const chartInstanceRef = useRef<echarts.ECharts | null>(null);

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    const handleMoreVisualizationsClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            window.location.href = '/moreCharts';
        }, 1000);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isZoomed) {
                setIsZoomed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isZoomed]);

    useEffect(() => {
        const ref = isZoomed ? zoomedChartRef.current : chartRef.current;
        if (ref) {
            if (!chartInstanceRef.current) {
                chartInstanceRef.current = echarts.init(ref);
            }
            const chartInstance = chartInstanceRef.current;
            const option = getChartOption(selectedChart);

            console.log('Chart option:', option);

            if (option) {
                chartInstance.setOption(option, true);
            }

            chartInstance.resize();
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.dispose();
                chartInstanceRef.current = null;
            }
        };
    }, [selectedChart, isZoomed, chartDataVersion]);

    useEffect(() => {
        if (chartInstanceRef.current) {
            const option = getChartOption(selectedChart);
            if (option) {
                chartInstanceRef.current.setOption(option);
            }
        }
    }, [selectedChart]);

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.resize();
        }
    }, [isZoomed]);

    return (
        <div className="w-full space-y-4 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                    Visualization - {selectedChart}
                </h3>
                <div className="flex items-center space-x-2">
                    <button onClick={handleMoreVisualizationsClick} className="px-3 py-2 bg-blue-500 text-white rounded-xl shadow-sm hover:bg-blue-600">
                        More Visualizations
                    </button>
                    <button onClick={toggleZoom} className="text-gray-500 hover:text-gray-700">
                        <img src={zoomin.src} className="h-5 w-5" alt="Zoom Icon" />
                    </button>
                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
                </div>
            )}

            {isPromptSelected ? (
                <div 
                    ref={chartRef} 
                    className={`aspect-video w-full bg-gray-50 rounded-lg overflow-hidden border ${isZoomed ? 'hidden' : ''}`}
                ></div>
            ) : (
                <div className="text-center text-gray-500">
                    Select a prompt to view chart
                </div>
            )}

            {isZoomed && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg relative w-full max-w-5xl h-full max-h-5xl sm:w-4/5 sm:h-4/5">
                        <button onClick={() => { toggleZoom(); }} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div ref={zoomedChartRef} className="w-full h-full bg-white"></div>
                    </div>
                </div>
            )}
        </div>
    );
}