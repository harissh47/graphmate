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

export const getChartOption = (chartType: ChartType) => {
    const storedData = sessionStorage.getItem('chartData');
    const chartData = storedData ? JSON.parse(storedData) : { 
        data: {
            category: [],
            value: [],
            series: [],
            additional: []
        }
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
                type: 'line'
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
    }
    else if (chartType === "Heatmap") {
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