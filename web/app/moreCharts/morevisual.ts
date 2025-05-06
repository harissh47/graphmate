import { useDatasetStore } from '../datastorage/dataStore'; // Ensure this import is present

// Define chart type as a union type
export type ChartType = 
    | "Basic Line Chart"
    | "Smoothed Line Chart"
    | "Basic Area Chart"
    | "Stacked Line Chart"
    | "Basic Bar Chart"
    | "Axis Align with Tick"
    | "Bar with Background"
    | "Simple Pie"
    | "Doughnut Pie Chart"
    | "Customized Pie"
    | "Basic Scatter Chart"
    | "Heatmap";

// Define and export the array of chart typesa
export const CHART_TYPES: ChartType[] = [
    "Basic Line Chart",
    "Smoothed Line Chart",
    "Basic Area Chart",
    "Stacked Line Chart",
    "Basic Bar Chart",
    "Axis Align with Tick",
    "Bar with Background",
    "Simple Pie",
    "Doughnut Pie Chart",
    "Customized Pie",
    "Basic Scatter Chart",
    "Heatmap"
];

export const getChartOption = (chartType: ChartType, chartData: any) => {
    // Remove sessionStorage usage
    if (!chartData) {
        chartData = { 
            data: {
                category: [],
                value: [],
                series: [],
                additional: []
            }
        };
    }

    // Helper function to validate color
    const validateColor = (color: string | undefined): string => {
        // Default to a safe color if undefined or invalid
        return color && /^#([0-9A-F]{3}){1,2}$/i.test(color) ? color : '#000000';
    };

    if (chartType === "Basic Line Chart") {
        return {
            xAxis: {
                type: 'category',
                data: chartData.data.category
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: chartData.data.value,
                type: 'line',
                itemStyle: {
                    color: validateColor(chartData.data.color) // Example of color validation
                }
            }]
        };
    } 
    else if (chartType === "Smoothed Line Chart") {
        return {
            xAxis: {
                type: 'category',
                data: chartData.data.category
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: chartData.data.value,
                type: 'line',
                smooth: true
            }]
        };
    }
    else if (chartType === "Basic Area Chart") {
        return {
            xAxis: {
                type: 'category',
                data: chartData.data.category
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: chartData.data.value,
                type: 'line',
                areaStyle: {}
            }]
        };
    }
    else if (chartType === "Stacked Line Chart") {
        return {
            xAxis: {
                type: 'category',
                data: chartData.data.category
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    type: 'line',
                    stack: 'Total',
                    data: chartData.data.series
                },
                {
                    type: 'line',
                    stack: 'Total',
                    data: chartData.data.additional
                },
                {
                    type: 'line',
                    stack: 'Total',
                    data: chartData.data.value
                }
            ]
        };
    }
    else if (chartType === "Basic Bar Chart") {
        return {
            xAxis: {
                type: 'category',
                data: chartData.data.category
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: chartData.data.value,
                    type: 'bar'
                }
            ]
        };
    }
    else if (chartType === "Axis Align with Tick") {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: chartData.data.category,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Direct',
                    data: chartData.data.value,
                    type: 'bar',
                    barWidth: '60%',
                }
            ]
        };
    }
    else if (chartType === "Bar with Background") {
        return {
            xAxis: {
                type: 'category',
                data: chartData.data.category
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: chartData.data.value,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }
            ]
        };
    }
    else if (chartType === "Simple Pie") {
        const pieData = chartData.data.value.map((val: number, index: number) => ({
            value: val,
            name: chartData.data.category[index] || `Category ${index + 1}`
        }));

        return {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: pieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }
    else if (chartType === "Doughnut Pie Chart") {
        const pieData = chartData.data.value.map((val: number, index: number) => ({
            value: val,
            name: chartData.data.category[index] || `Category ${index + 1}`
        }));

        return {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 40,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: pieData
                }
            ]
        };
    }
    else if (chartType === "Customized Pie") {
        const pieData = chartData.data.value.map((val: number, index: number) => ({
            value: val,
            name: chartData.data.category[index] || `Category ${index + 1}`
        }));

        return {
            backgroundColor: '#2c343c',
            title: {
                text: 'Customized Pie',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#ccc'
                }
            },
            tooltip: {
                trigger: 'item'
            },
            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: pieData.sort(function (a: { value: number }, b: { value: number }) {
                        return a.value - b.value;
                    }),
                    roseType: 'radius',
                    label: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    labelLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    },
                    itemStyle: {
                        color: '#fff66d',
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx: number) {
                        return Math.random() * 200;
                    }
                }
            ]
        };
    }
    else if (chartType === "Basic Scatter Chart") {
        const hasCategory = chartData.data.category.length > 0;
        const scatterData = (hasCategory ? chartData.data.category : chartData.data.series).map((category: string, index: number) => {
            const x = chartData.data.series[index] || category || `Series ${index + 1}`;
            const y = chartData.data.value[index] ?? 0; // Use nullish coalescing for default value
            return [x, y];
        });

        return {
            xAxis: {
                type: 'category', // Consider using 'category' if x is categorical
                data: hasCategory ? chartData.data.category : chartData.data.series // Use series if available
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    symbolSize: 5,
                    data: scatterData,
                    type: 'scatter'
                }
            ]
        };
    }
    else if (chartType === "Heatmap") {
        const { category, value, additional } = chartData.data;

        // Use value as yAxis labels (e.g., countries)
        const yAxisLabels = [...new Set(value)]; // Remove duplicates

        // Generate heatmap data in the format [xIndex, yIndex, value]
        const heatmapData = additional.map((val: number, index: number) => {
            const xLabel = category[index]; // x-axis label (region)
            const yLabel = value[index]; // y-axis label (country)
            const xIndex = [...new Set(category)].indexOf(xLabel); // x-axis index (unique regions)
            const yIndex = yAxisLabels.indexOf(yLabel); // y-axis index (unique countries)
            return [xIndex, yIndex, val || 0]; // [x, y, value]
        });

        // Filter out null/undefined values before calculating min/max
        const validNumbers = additional.filter((val: any) => 
            typeof val === 'number' && !isNaN(val) && val !== null
        );
        
        // Set default min/max if no valid numbers exist
        const minValue = validNumbers.length > 0 ? Math.min(...validNumbers) : 0;
        const maxValue = validNumbers.length > 0 ? Math.max(...validNumbers) : 100;

        return {
            tooltip: {
                position: 'top',
                formatter: (params: any) => {
                    const xLabel = [...new Set(category)][params.data[0]] || `Category ${params.data[0] + 1}`;
                    const yLabel = yAxisLabels[params.data[1]] || `Series ${params.data[1] + 1}`;
                    return `${xLabel}<br>${yLabel}<br>Value: ${params.data[2]}`;
                }
            },
            grid: {
                height: '50%',
                top: '10%'
            },
            xAxis: {
                type: 'category',
                data: [...new Set(category)], // Unique regions for x-axis
                splitArea: { show: true }
            },
            yAxis: {
                type: 'category',
                data: yAxisLabels, // Unique countries for y-axis
                splitArea: { show: true }
            },
            visualMap: {
                min: minValue,
                max: maxValue,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%',
                inRange: {
                    color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                }
            },
            series: [{
                name: 'Heatmap',
                type: 'heatmap',
                data: heatmapData,
                label: {
                    show: true,
                    formatter: (params: any) => params.data[2]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
    }
    return null;
};