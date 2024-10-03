import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import 'chartjs-plugin-datalabels';
import './weatherGraph.css';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const WeatherGraph = ({ hourlyData }) => {
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const [daysData, setDaysData] = useState([]);

    // Transform hourlyData into daysData when it changes
    useEffect(() => {
        if (!hourlyData || !hourlyData.length) return;
    
        // Group data by day
        const groupedData = hourlyData.reduce((acc, hour, index) => {
            // Skip every other hour to only get data at 2-hour intervals
            if (index % 2 !== 0) return acc;
    
            const date = hour.time.split(' ')[0]; // Get the date part (e.g., "2024-10-03")
            if (!acc[date]) {
                acc[date] = {
                    day: new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
                    precipitation: [],
                    temperatures: [],
                    weatherIcons: [],
                    times: [],
                };
            }
    
            acc[date].precipitation.push(hour.rain); // Add precipitation data
            acc[date].temperatures.push(hour.temperature); // Add temperature data
            acc[date].weatherIcons.push(getWeatherIcon(hour.condition)); // Get icon from condition
            acc[date].times.push(hour.time.split(' ')[1].slice(0, 5)); // Get time part (e.g., "00:00")
    
            return acc;
        }, {});
    
        // Convert grouped data to an array
        const formattedData = Object.values(groupedData);
        setDaysData(formattedData);
    }, [hourlyData]);

    // Function to get weather icons from condition
    const getWeatherIcon = (condition) => {
        const conditionLower = condition.toLowerCase();
        if (conditionLower.includes('sunny')) return '☀️';
        if(conditionLower.includes('clear')) return '🌙';
        if (conditionLower.includes('partly cloudy')) return '🌥️'; // Partly cloudy
        if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) return '☁️'; // Cloudy or overcast
        if (conditionLower.includes('mist')) return '🌫️'; // Mist
        if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('Showers')) return '🌧️'; // Rain, drizzle, showers
        if (conditionLower.includes('snow') || conditionLower.includes('sleet')) return '❄️'; // Snow or sleet
        if (conditionLower.includes('thunder')) return '⛈️'; // Thunderstorms
        return condition;
    };

    const data = {
        labels: daysData[currentDayIndex]?.precipitation.map(value => `${value}%`),
        datasets: [
            {
                label: 'Precipitation Probability',
                data: daysData[currentDayIndex]?.precipitation,
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
        setCurrentDayIndex((prevIndex) => Math.min(prevIndex + 1, daysData.length - 1));
    };

    const handlePreviousDaysClick = () => {
        setCurrentDayIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    return (
        <div className="weather-graph-card">
            <div className="weather-title-container">
                <div className="weather-title">{daysData[currentDayIndex]?.day}</div>
                <div>
                    {currentDayIndex > 0 && (
                        <button className="weather-button prev" onClick={handlePreviousDaysClick}>
                            &lt; Previous days
                        </button>
                    )}
                    {daysData.length > currentDayIndex + 1 && (
                        <button className="weather-button" onClick={handleNextDaysClick}>
                            Next days &gt;
                        </button>
                    )}
                </div>
            </div>
            <div className="weather-graph">
                <div className="weather-temperatures">
                    {daysData[currentDayIndex]?.temperatures.map((temp, index) => (
                        <div key={index} className="weather-item">
                            <div className="time">{daysData[currentDayIndex].times[index]}</div>
                            <div className="weather-icon">{daysData[currentDayIndex].weatherIcons[index]}</div>
                            <div className="temperature-label">{temp}°</div>
                        </div>
                    ))}
                </div>
                <div className="weather-graph-container">
                    <Line data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default WeatherGraph;