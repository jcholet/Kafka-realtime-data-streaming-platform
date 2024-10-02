import React, {useState} from 'react';
import {Line} from 'react-chartjs-2';
import {Chart, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend} from 'chart.js';
import 'chartjs-plugin-datalabels';
import './weatherGraph.css';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const WeatherGraph = () => {
    const [currentDayIndex, setCurrentDayIndex] = useState(0);

    const daysData = [
        {
            day: 'Upcoming hours',
            precipitation: [23, 29, 58, 75, 33, 20, 73, 49],
            temperatures: [27, 28, 28, 29, 30, 29, 29, 28],
            weatherIcons: ['☀️', '☀️', '🌥️', '🌥️', '☀️', '🌥️', '🌥️', '☀️'],
            times: ['Now', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
        },
        {
            day: 'Thursday 18',
            precipitation: [15, 40, 60, 80, 50, 30, 20, 55, 70, 85, 65, 45, 50],
            temperatures: [25, 26, 27, 28, 29, 28, 28, 27, 26, 25, 24, 23, 20],
            weatherIcons: ['☀️', '☀️', '☀️', '☁️', '☁️', '☀️', '☀️', '☁️', '🌧️', '🌧️', '☁️', '🌙', "🌙"],
            times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00']
        },
        {
            day: 'Wednesday 19',
            precipitation: [10, 20, 30, 50, 40, 70, 60, 90, 80, 60, 40, 20, 10],
            temperatures: [22, 24, 25, 26, 28, 27, 26, 25, 24, 23, 22, 21, 20],
            weatherIcons: ['🌧️', '🌧️', '🌥️', '☀️', '☀️', '☀️', '☀️', '🌥️', '🌧️', '🌧️', '🌥️', '🌧️', '🌙'],
            times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00']
        },
    ];


    const data = {
        labels: daysData[currentDayIndex].precipitation.map(value => `${value}%`),
        datasets: [
            {
                label: 'Precipitation Probability',
                data: daysData[currentDayIndex].precipitation,
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


    const handleNextDaysClick = () => {
        setCurrentDayIndex((prevIndex) => prevIndex + 1);
    };

    const handlePreviousDaysClick = () => {
        setCurrentDayIndex((prevIndex) => prevIndex - 1);
    };

    return (
        <div className="weather-graph-card">
            <div className="weather-title-container">
                <div className="weather-title">{daysData[currentDayIndex].day}</div>
                <div>
                    {currentDayIndex > 0 && <button className="weather-button prev" onClick={handlePreviousDaysClick}>
                        &lt; Previous days
                    </button>}
                    {daysData.length > currentDayIndex + 1 &&
                        <button className="weather-button" onClick={handleNextDaysClick}>
                            Next days &gt;
                        </button>}
                </div>
            </div>
            <div className="weather-graph">
                <div className="weather-temperatures">
                    {daysData[currentDayIndex].temperatures.map((temp, index) => (
                        <div key={index} className="weather-item">
                            <div className="time">{daysData[currentDayIndex].times[index]}</div>
                            <div className="weather-icon">{daysData[currentDayIndex].weatherIcons[index]}</div>
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
