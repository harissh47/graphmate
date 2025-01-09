export const getChartOption = (selectedChart: string) => {
    const storedData = sessionStorage.getItem('chartData');
    const chartData = storedData ? JSON.parse(storedData) : {
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
            additional: []
        }
    };
 
    // Define default colors
    const defaultColor = '#5470C6';
    const defaultShadowColor = 'rgba(0, 0, 0, 0.5)';
 
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
                        color: defaultColor
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
                        color: defaultColor
                    }
                }
            ]
        };
    } else if (selectedChart === "Pie Chart") {
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
                            shadowColor: defaultShadowColor
                        }
                    }
                }
            ]
        };
    } else if (selectedChart === "Scatter Plot") {
        // Handle dynamic combinations of value, category, and series
        const scatterData = chartData.data.value.map((val: number, index: number) => {
            const x = val;
            const y = chartData.data.category[index] || 0;
            const z = chartData.data.series[index] || 0;
            return [x, y, z];
        });
 
        return {
            xAxis: {
                type: 'value'
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
    } else if (selectedChart === "Heatmap") {
        const { category, value, additional } = chartData.data;
    
        // Generate heatmap data
        const heatmapData = additional.map((val: number, index: number) => {
            const x = index % category.length;
            const y = Math.floor(index / category.length);
            return [x, y, val];
        });
    
        return {
            tooltip: {
                position: 'top',
                formatter: (params: any) => {
                    return `Category: ${category[params.data[0]]}<br>Value: ${value[params.data[1]]}<br>Count: ${params.data[2]}`;
                }
            },
            grid: {
                height: '50%',
                top: '10%'
            },
            xAxis: {
                type: 'category',
                data: category,
                splitArea: { show: true }
            },
            yAxis: {
                type: 'category',
                data: value,
                splitArea: { show: true }
            },
            visualMap: {
                min: Math.min(...additional),
                max: Math.max(...additional),
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%'
            },
            series: [
                {
                    name: 'Punch Card',
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
                }
            ]
        };
    }    
    return null;
};