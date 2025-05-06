import { useDatasetStore } from '../datastorage/dataStore';

export const getChartOption = (selectedChart: string) => {
    const chartData = useDatasetStore.getState().chartData || {
        headers: {
            category: null,
            value: null,
            series: null,
            additional: null
        },
        data: {
            category: [],
            value: [],
            series: [],
            additional: [],
            color: undefined  // Add default color property
        }
    };

    // Ensure chartData is correctly structured
    //console.log('Chart Data:', chartData);

    // Define default colors
    const defaultColor = '#5470C6';
    const defaultShadowColor = 'rgba(0, 0, 0, 0.5)';

    // Validate color
    let validatedColor = chartData.data?.color || defaultColor;
    if (!/^#[0-9A-F]{6}$/i.test(validatedColor)) {
        console.warn(`Invalid color value: ${validatedColor}. Using default color: ${defaultColor}`);
        validatedColor = defaultColor;
    }

    if (selectedChart === "Line Chart") {
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
                    type: 'line',
                    itemStyle: {
                        color: validatedColor || defaultColor
                    }
                }
            ]
        };
    } else if (selectedChart === "Bar Chart") {
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
                    itemStyle: {
                        color: validatedColor || defaultColor
                    }
                }
            ]
        };
    } else if (selectedChart === "Pie Chart") {
        const pieData = chartData.data.value.map((val: number, index: number) => ({
            value: val,
            name: chartData.data.category[index] || `Category ${index + 1}`,
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
                            shadowColor: defaultShadowColor || 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    } else if (selectedChart === "Scatter Plot") {
        const hasCategory = chartData.data.category.length > 0;
        // Create scatter data points using category (or series if category is null) as X values and value as Y values
        const scatterData = chartData.data.value.map((yValue: number, index: number) => {
            const xLabel = hasCategory 
                ? chartData.data.category[index] 
                : chartData.data.series[index] || `Item ${index + 1}`;
            return [xLabel, yValue];
        });

        // Store the data source information in store instead
        useDatasetStore.setState({ scatterPlotDataSource: hasCategory ? 'category' : 'series' });

        return {
            xAxis: {
                type: 'category',
                data: hasCategory ? chartData.data.category : chartData.data.series,
                name: hasCategory 
                    ? (chartData.headers.category || 'Category')
                    : (chartData.headers.series || 'Series'),
                nameLocation: 'middle',
                nameGap: 30,
            },
            yAxis: {
                type: 'value',
                name: chartData.headers.value || 'Y Value',
                nameLocation: 'middle',
                nameGap: 30,
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params: any) {
                    const xHeader = chartData.headers.category || chartData.headers.series || 'X';
                    const valueHeader = chartData.headers.value || 'Y';
                    return `${xHeader}: ${params.data[0]}<br/>${valueHeader}: ${params.data[1]}`;
                }
            },
            series: [
                {
                    symbolSize: 10,
                    data: scatterData,
                    type: 'scatter',
                    itemStyle: {
                        color: validatedColor || defaultColor
                    }
                }
            ]
        };
    } else if (selectedChart === "Heatmap") {
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