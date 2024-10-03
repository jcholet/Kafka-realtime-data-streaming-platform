const { Kafka } = require('kafkajs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const caPath = path.join(__dirname, '../../kafka_ssl_certs/ca-cert');
const keyPath = path.join(__dirname, '../../kafka_ssl_certs/client.key');
const certPath = path.join(__dirname, '../../kafka_ssl_certs/client.crt');

const ssl = {
  rejectUnauthorized: false,
  ca: [fs.readFileSync(caPath, 'utf-8')],
  key: fs.readFileSync(keyPath, 'utf-8'),
  cert: fs.readFileSync(certPath, 'utf-8'),
};

const kafka = new Kafka({
  clientId: 'my-weather-producer',
  brokers: ['kafka1:9092', 'kafka2:9093', 'kafka3:9094'],
  ssl,
  retry: {
    initialRetryTime: 1500,
    retries: 10,
  }
});

const producer = kafka.producer();

// Fonction pour récupérer les données météo
const fetchWeatherData = async () => {
  // Connexion du producer
  await producer.connect();
  console.log('Producer connected');
  try {
    // Appel de l'API pour obtenir la prévision météo pour Laval
    const response = await axios.get('https://api.weatherapi.com/v1/forecast.json?key=27f33547d58d4d68995124844243009&q=laval,france&days=3&aqi=no&alerts=no');
    const data = response.data;

    const allHourlyData = [];

    const weather = {
      location: data.location.name, // Nom de la ville
      date: data.forecast.forecastday.date, // Date du jour
      humidity: data.current.humidity, // Humidité actuelle
      precipitation: data.current.precip_mm, // Précipitation actuelle en mm
      wind_speed: data.current.wind_kph, // Vitesse du vent actuelle en km/h
      uv: data.current.uv, // Indice UV actuel
      rain: data.forecast.forecastday[0].day.daily_chance_of_rain, // Probabilité de pluie
      temperature: data.current.temp_c, // Température actuelle en degrés Celsius
      condition: data.current.condition.text, // Condition météorologique actuelle (ex : "Ensoleillé")
      feels_like: data.current.feelslike_c, // Température ressentie en degrés Celsius
      sunrise: data.forecast.forecastday[0].astro.sunrise, // Heure du lever du soleil
      sunset: data.forecast.forecastday[0].astro.sunset, // Heure du coucher du soleil
    };
    // Extraction des informations spécifiques pour chaque heure de chaque jour
    const weatherInfo = {
      forecast: data.forecast.forecastday.map((day) => ({
        hours: day.hour.map((hourData) => ({
          time: hourData.time, // Heure spécifique
          temperature: hourData.temp_c, // Température à cette heure en degrés Celsius
          condition: hourData.condition.text, // Condition météorologique (ex : "Ensoleillé")
          rain: hourData.chance_of_rain, // Probabilité de pluie
        })),
      })),
    };

    console.log('weatherInfo: ', weather);
    // Envoi des données récupérées pour chaque heure à Kafka
    for (const day of weatherInfo.forecast) {
      for (const hour of day.hours) {
        const hourlyData = {
          time: hour.time, // Heure spécifique
          temperature: hour.temperature, // Température à cette heure en degrés Celsius
          condition: hour.condition, // Condition météorologique (ex : "Ensoleillé")
          rain: hour.rain, // Probabilité de pluie
        };
        allHourlyData.push(hourlyData);
      }
    }
    // Préparer un objet global qui inclut toutes les données météo
    const weatherDataToSend = {
      weather: weather, // Inclure les données météo générales
      hours: allHourlyData, // Inclure toutes les données horaires regroupées
    };

    await producer.send({
      topic: 'weather',
      messages: [
        {
          value: JSON.stringify(weatherDataToSend), // Convertir les données en chaîne JSON
        },
      ],
    });

    console.log('Hourly data sent to Kafka:', weatherDataToSend);
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error; // Propager l'erreur pour l'utiliser plus tard
  }

  // Déconnexion du producteur
  await producer.disconnect();
  console.log('Producer disconnected');
};

// Démarrer le producer
const runWeatherProducer = async () => {
  // Récupération initiale des données
  await fetchWeatherData();
  // Récupérer les données toutes les minutes
  setInterval(fetchWeatherData, 10000);
};
module.exports = { runWeatherProducer };
