import { chartTooltip } from './utils'
var message2 = 'I am default';
export default message2;
export const lineChartOptions = {
    legend: {
        display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: chartTooltip,
    plugins: {
        datalabels: {
            display: true
        },
    },
    scales: {
        yAxes: [{
            gridLines: {
                display: true,
                lineWidth: 1,
                color: 'rgba(0,0,0,0.1)',
                drawBorder: false,
            },
            ticks: {
                beginAtZero: true,
                stepSize: 1000,
                // min: 1,
                // max: 35,
                padding: 10
            }
        }],
        xAxes: [{
            gridLines: {
                display: false
            }
        }]
    },
}

export const polarAreaChartOptions = {
    legend: {
        position: 'bottom',
        labels: {
            padding: 30,
            usePointStyle: true,
            fontSize: 12
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    scale: {
        ticks: {
            display: false
        }
    },
    plugins: {
        datalabels: {
            display: false
        }
    },
    tooltips: chartTooltip
}

export const areaChartOptions = {
    legend: {
        display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: chartTooltip,
    scales: {
        yAxes: [{
            gridLines: {
                display: true,
                lineWidth: 1,
                color: 'rgba(0,0,0,0.1)',
                drawBorder: false
            },
            ticks: {
                beginAtZero: true,
                stepSize: 5,
                min: 50,
                max: 70,
                padding: 20
            }
        }],
        xAxes: [{
            gridLines: {
                display: false
            }
        }]
    }
}

export const scatterChartOptions = {
    legend: {
        position: 'bottom',
        labels: {
            padding: 30,
            usePointStyle: true,
            fontSize: 12
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            gridLines: {
                display: true,
                lineWidth: 1,
                color: 'rgba(0,0,0,0.1)',
                drawBorder: false
            },
            ticks: {
                beginAtZero: true,
                stepSize: 20,
                min: -80,
                max: 80,
                padding: 20
            }
        }],
        xAxes: [{
            gridLines: {
                display: true,
                lineWidth: 1,
                color: 'rgba(0,0,0,0.1)'
            }
        }]
    },
    tooltips: chartTooltip
}

export const barChartOptions = {
    legend: {
        position: 'bottom',
        labels: {
            padding: 30,
            usePointStyle: true,
            fontSize: 12
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            gridLines: {
                display: true,
                lineWidth: 1,
                color: 'rgba(0,0,0,0.1)',
                drawBorder: false
            },
            ticks: {
                beginAtZero: true,
                stepSize: 100,
                min: 300,
                max: 800,
                padding: 20
            }
        }],
        xAxes: [{
            gridLines: {
                display: false
            }
        }]
    },
    tooltips: chartTooltip
}

export const radarChartOptions = {
    legend: {
        position: 'bottom',
        labels: {
            padding: 30,
            usePointStyle: true,
            fontSize: 12
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    scale: {
        ticks: {
            display: false
        }
    },
    tooltips: chartTooltip
}

export const pieChartOptions = {
    legend: {
        position: 'top',
        labels: {
            padding: 10,
            usePointStyle: true,
            fontSize: 12,
        },
        display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    title: {
        display: false
    },
    layout: {
        padding: {
            bottom: 0
        }
    },
    tooltips: chartTooltip,
    plugins: {
        labels: {
            // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
            render: function (args) {
                return  args.label + `(${args.value})`;
            },
            // position to draw label, available value is 'default', 'border' and 'outside'
            // bar chart ignores this
            // default is 'default'
            position: 'outside',

            // precision for percentage, default is 0
            precision: 0,

            // identifies whether or not labels of value 0 are displayed, default is false
            showZero: true,

            // font size, default is defaultFontSize
            fontSize: 14,

            // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
            fontColor: '#ccccc',

            // font style, default is defaultFontStyle
            fontStyle: 'normal',

            // font family, default is defaultFontFamily
            fontFamily: "'Kantumruy'",

            // draw text shadows under labels, default is false
            textShadow: true,

            // text shadow intensity, default is 6
            shadowBlur: 5,

            // text shadow X offset, default is 3
            shadowOffsetX: -5,

            // text shadow Y offset, default is 3
            shadowOffsetY: 5,

            // text shadow color, default is 'rgba(0,0,0,0.3)'
            shadowColor: 'rgba(0,0,0,0.1)',

            // draw label in arc, default is false
            // bar chart ignores this
            arc: false,

            // draw label even it's overlap, default is true
            // bar chart ignores this
            overlap: true,

            // show the real calculated percentages from the values and don't apply the additional logic to fit the percentages to 100 in total, default is false
            showActualPercentages: true,

            // set images when `render` is 'image'
            images: [
                {
                    src: 'image.png',
                    width: 16,
                    height: 16
                }
            ],

            // add padding when position is `outside`
            // default is 2
            outsidePadding: 2,

            // add margin of text when position is `outside` or `border`
            // default is 2
            textMargin: 4
        }
    }
}

export const doughnutChartOptions = {
    legend: {
        position: 'bottom',
        labels: {
            padding: 30,
            usePointStyle: true,
            fontSize: 12
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    title: {
        display: false
    },
    cutoutPercentage: 80,
    layout: {
        padding: {
            bottom: 20
        }
    },
    tooltips: chartTooltip
}

export const smallLineChartOptions = {
    layout: {
        padding: {
            left: 5,
            right: 5,
            top: 10,
            bottom: 10
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        display: false
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            },
            display: false
        }],
        xAxes: [{
            display: false
        }]
    }
    // tooltips: {
    //   intersect: false,
    //   enabled: false,
    //   custom: function(tooltipModel) {
    //     if (tooltipModel && tooltipModel.dataPoints) {
    //       var yLabel = tooltipModel.dataPoints[0].yLabel;
    //       var xLabel = tooltipModel.dataPoints[0].xLabel;
    //       var label = tooltipModel.body[0].lines[0].split(":")[0];
    //     //  changeState("$" + addCommas(yLabel), label + "-" + xLabel);
    //     }
    //   }
    // },
    // plugins:{[
    //   {
    //     afterInit: function(chart, options) {
    //       var yLabel = chart.data.datasets[0].data[0];
    //       var xLabel = chart.data.labels[0];
    //       var label = chart.data.datasets[0].label;
    //       changeState("$" + addCommas(yLabel), label + "-" + xLabel);
    //     }
    //   }
    // ]}
}
