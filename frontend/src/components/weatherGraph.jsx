import React from 'react';
import {Line} from 'react-chartjs-2';
import {Chart, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend} from 'chart.js';
import 'chartjs-plugin-datalabels';
import './weatherGraph.css';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const WeatherGraph = () => {
    const data = {
        labels: ['23%', '29%', '58%', '75%', '33%', '20%', '73%', '49%'],
        datasets: [
            {
                label: 'Precipitation Probability',
                data: [23, 29, 58, 75, 33, 20, 73, 49],
                fill: true,
                backgroundColor: '#5C9BE5',
                borderColor: '#5C9BE5',
                borderWidth: 2,
                tension: 0, // Smooth the curve
                pointRadius: 0, // Hide points
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: true,
                grid: {
                    display: true, // Hide vertical grid lines
                    color: '#5b5b5b',
                    z: 1,
                },
            },
            y: {
                display: false, // Hide y-axis
                beginAtZero: true,
                max: 100, // Precipitation in percentage
            },
        },
        plugins: {
            legend: {
                display: false, // Hide the legend
            },
            datalabels: {
                display: false, // Hide data labels on the graph
            },
        },
    };

    const times = ['Now', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const temperatures = [27, 28, 28, 29, 30, 29, 29, 28];
    const weatherIcons = [
        '☀️', '☀️', '🌥️', '🌥️', '☀️', '🌥️', '🌥️', '☀️'
    ];

    return (
        <div className="weather-graph-card">
            <div className="weather-graph">
                <div className="weather-temperatures">
                    {temperatures.map((temp, index) => (
                        <div key={index} className="weather-item">
                            <div className="time">{times[index]}</div>
                            <div className="weather-icon">{weatherIcons[index]}</div>
                            <div className="temperature-label">{temp}°</div>
                        </div>
                    ))}
                </div>
                <div className="weather-graph-container">
                    <Line data={data} options={options}/>
                </div>
            </div>
        </div>
    );
};

export default WeatherGraph;
