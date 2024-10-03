import './leftPart.css';
import {TiLocationArrowOutline} from "react-icons/ti";
import React, {useEffect, useState} from "react";
import {LuSunrise} from "react-icons/lu";
import {LuSunset} from "react-icons/lu";
import {GoSun} from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import BuildingNight from '../assets/building_night.png';
import BuildingSun from '../assets/building_sun.png';

function LeftPart({socket}) {
    const navigate = useNavigate();
    const [weatherData, setWeatherData] = useState({
        location: 'Laval',
        sunrise: '06:00 AM',
        sunset: '08:00 PM',
        temperature: 0,
        condition: 'null'
    });
    const [isDay, setIsDay] = useState(true);

    const convertTo24Hour = (time) => {
      const [hourMin, period] = time.split(' ');
      let [hours, minutes] = hourMin.split(':').map(Number);
    
      if (period === 'PM' && hours !== 12) {
        hours += 12; // Convert PM to 24-hour format
      }
      if (period === 'AM' && hours === 12) {
        hours = 0; // Handle midnight
      }
    
      return { hours, minutes };
    }
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    }); 

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

    useEffect(() => {
        if (!socket) return;

        // Écoute de l'événement `weather-update` pour recevoir les données du serveur
        socket.on('weather-update', (data) => {
            console.log('Received weather data:', data);
            // Met à jour l'état avec les données reçues
            setWeatherData((prevData) => ({
                location: data.weather.location || prevData.location,
                sunrise: data.weather.sunrise || prevData.sunrise,
                sunset: data.weather.sunset || prevData.sunset,
                temperature: data.weather.temperature || prevData.temperature,
                condition: data.weather.condition || prevData.condition
            }));
        });

        // Nettoyage à la déconnexion
        return () => {
            socket.off('weather-update');
        };
    }, [socket]);

    useEffect(() => {
      const checkDayNight = () => {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
    
        const { hours: sunriseHour, minutes: sunriseMinutes } = convertTo24Hour(weatherData.sunrise);
        const { hours: sunsetHour, minutes: sunsetMinutes } = convertTo24Hour(weatherData.sunset);
    
        // Compare current time with sunrise and sunset
        const isAfterSunrise = currentHours > sunriseHour || (currentHours === sunriseHour && currentMinutes >= sunriseMinutes);
        const isBeforeSunset = currentHours < sunsetHour || (currentHours === sunsetHour && currentMinutes < sunsetMinutes);
    
        setIsDay(isAfterSunrise && isBeforeSunset);
      };
    
      checkDayNight();
    
      // Check every minute to update day/night status
      const interval = setInterval(checkDayNight, 60000);
    
      return () => clearInterval(interval);
    }, [weatherData.sunrise, weatherData.sunset]);

    useEffect(() => {
      document.body.className = isDay ? 'day-mode' : 'night-mode';
    }, [isDay]);

    return (
        <div className={`left-part ${isDay ? 'day-mode' : 'night-mode'}`}>
            <div className="sun-grid">
                {/* First row */}
                <div className="location">
                    <TiLocationArrowOutline color="white"/>
                    <div>{weatherData.location}</div>
                </div>
                <div className="sunrise">
                    <LuSunrise color="white"/>
                    <div>{weatherData.sunrise}</div>
                </div>

                {/* Second row */}
                <div className="date">
                    <div>{formattedDate}</div>
                </div>
                <div className="sunset">
                    <LuSunset color="white"/>
                    <div>{weatherData.sunset}</div>
                </div>
            </div>
            <div className="temperature">
                <div>{weatherData.temperature}°</div>
            </div>
            <div className="weather">
                <div className="weather-blur"></div>
                {/* Nouvelle div pour le flou */}
                <div>{getWeatherIcon(weatherData.condition)}</div>
                <div>{weatherData.condition}</div>
            </div>
            {
              isDay ?
                <img src={BuildingSun} alt="Building and sun" className="background-image"/>
                :
                <img src={BuildingNight} alt="Building and sun" className="background-image"/>  
            }
            <button className="ip-dashboard-button" onClick={() => navigate('/ip-dashboard')}>
                Show IP Dashboard
            </button>
        </div>
    );
}

export default LeftPart;
