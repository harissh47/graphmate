'use client';

import React, { useState, useEffect, useRef } from 'react';
import zoomin from './assets/zoomin.png';
import * as echarts from 'echarts';
import 'echarts-stat';
import { getChartOption, CHART_TYPES, ChartType } from './morevisual';
import Sidebar from './Sidebar';

interface MoreChartProps {
    selectedChart: ChartType;
    onChartSelect: (chart: ChartType) => void;
    selectedPrompt: string;
}

const CHARTS_BY_TYPE: Record<string, string[]> = {
    'Line Chart': ['Basic Line Chart', 'Smoothed Line Chart', 'Basic Area Chart', 'Stacked Line Chart'],
    'Bar Graph': ['Basic Bar Chart', 'Axis Align with Tick', 'Bar with Background'],
    'Pie Chart': ['Simple Pie', 'Doughnut Pie Chart', 'Customized Pie'],
    'Scatter Plot': ['Basic Scatter Chart'],
    'Heatmap': ['Heatmap'],
};

export default function ChartDisplay({ selectedChart, onChartSelect, selectedPrompt }: MoreChartProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomedChartIndex, setZoomedChartIndex] = useState<number>(0);
    const [activeChartType, setActiveChartType] = useState<string>('Line Chart');

    const chartRefs = useRef<(HTMLDivElement | null)[]>([]);
    const chartInstanceRefs = useRef<(echarts.ECharts | null)[]>([]);
    const zoomedChartRef = useRef<HTMLDivElement | null>(null);
    const zoomedChartInstance = useRef<echarts.ECharts | null>(null);

    // Initialize all charts on activeChartType change
    useEffect(() => {
        chartRefs.current.forEach((ref, index) => {
            if (ref) {
                chartInstanceRefs.current[index]?.dispose();
                const chartInstance = echarts.init(ref);
                chartInstanceRefs.current[index] = chartInstance;

                const chartType = CHARTS_BY_TYPE[activeChartType][index];
                const option = getChartOption(chartType as ChartType);
                if (option) {
                    chartInstance.setOption(option);
                } else {
                    ref.style.opacity = '0.5';
                }
            }
        });

        return () => {
            chartInstanceRefs.current.forEach((instance) => instance?.dispose());
        };
    }, [activeChartType]);

    // Handle zoom behavior
    useEffect(() => {
        if (isZoomed && zoomedChartRef.current) {
            zoomedChartInstance.current?.dispose();
            const chartInstance = echarts.init(zoomedChartRef.current);
            zoomedChartInstance.current = chartInstance;

            const chartType = CHARTS_BY_TYPE[activeChartType][zoomedChartIndex];
            const option = getChartOption(chartType as ChartType);
            if (option) {
                chartInstance.setOption(option);
            }
        }

        return () => {
            zoomedChartInstance.current?.dispose();
        };
    }, [isZoomed, zoomedChartIndex, activeChartType]);

    const toggleZoom = (index: number): void => {
        setZoomedChartIndex(index);
        setIsZoomed(!isZoomed);
    };

    return (
        <div className="ml-0 sm:ml-60 pt-6 min-h-screen">
            <Sidebar onChartSelect={setActiveChartType} />
            <div className="flex justify-center items-center mb-4 bg-white/50 rounded-lg p-4 shadow-sm">
                <h2 className="text-2xl"> <strong>Prompt:</strong> {selectedPrompt || "More Charts📊"}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                {CHARTS_BY_TYPE[activeChartType].map((chartType, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm h-[500px]">
                        <div className="relative h-[90%]">
                            <div
                                ref={(el) => {
                                    chartRefs.current[index] = el;
                                }}
                                className={`w-full h-full bg-gray-50 rounded-lg overflow-hidden border ${
                                    !getChartOption(chartType as ChartType) ? 'opacity-50' : ''
                                }`}
                            ></div>
                            <button
                                onClick={() => toggleZoom(index)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1"
                            >
                                <img src={zoomin.src} className="h-4 w-4" alt="Zoom Icon" />
                            </button>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-900">{chartType}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {isZoomed && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg relative w-[90%] h-[90%] p-6">
                        <button onClick={() => toggleZoom(zoomedChartIndex)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <div ref={zoomedChartRef} className="w-full h-full"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
