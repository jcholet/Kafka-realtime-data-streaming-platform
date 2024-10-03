import {TiLocationArrowOutline} from "react-icons/ti";
import React, {useEffect, useState} from "react";
import {LuSunrise} from "react-icons/lu";
import {LuSunset} from "react-icons/lu";
import {GoSun} from "react-icons/go";
import BuildingSun from '../assets/building_sun.png';
import './leftPart.css';
import BuildingNight from '../assets/building_night.png';
import { useNavigate } from 'react-router-dom';


function LeftPart({socket}) {
    const navigate = useNavigate();
    const [weatherData, setWeatherData] = useState({
        location: 'Laval',
        sunrise: '00:00',
        sunset: '00:00',
        temperature: 0,
        condition: 'null'
    });

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

    return (
        <div className="left-part">
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
                    <div>Today, Sept. 30</div>
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
                <GoSun color="white"/>
                <div>{weatherData.condition}</div>
            </div>
            <img src={BuildingNight} alt="Building and sun" className="background-image"/>
            <button className="ip-dashboard-button" onClick={() => navigate('/ip-dashboard')}>
                Show IP Dashboard
            </button>
        </div>
    )
        ;
}

export default LeftPart;
