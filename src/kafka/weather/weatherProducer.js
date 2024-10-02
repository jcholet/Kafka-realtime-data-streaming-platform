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

// Fonction pour récupérer les données de trafic
const fetchWeatherData = async () => {
  // Connexion du producer
  await producer.connect();
  console.log('Producer connected');
  try {
    // Appel de l'API pour obtenir la prévision météo pour Laval
    const response = await axios.get('https://api.weatherapi.com/v1/forecast.json?key=27f33547d58d4d68995124844243009&q=laval,france&days=1&aqi=no&alerts=no');
    const data = response.data;

    const weather = {
      location: data.location.name, // Nom de la ville
      date: data.forecast.forecastday.date, // Date du jour
    };
    // Extraction des informations spécifiques pour chaque heure de chaque jour
    const weatherInfo = {
      forecast: data.forecast.forecastday.map((day) => ({
        date: day.date, // Date du jour
        hours: day.hour.map((hourData) => ({
          time: hourData.time, // Heure spécifique
          temperature: hourData.temp_c, // Température à cette heure en degrés Celsius
          condition: hourData.condition.text, // Condition météorologique (ex : "Ensoleillé")
          wind_speed: hourData.wind_kph, // Vitesse du vent en km/h
          humidity: hourData.humidity, // Humidité
        })),
        sunrise: day.astro.sunrise, // Heure du lever du soleil
        sunset: day.astro.sunset, // Heure du coucher du soleil
      })),
    };

    await producer.send({
      topic: 'traffic-meteo',
      messages: [
        {
          value: JSON.stringify(weather), // Convertir les données en chaîne JSON
        },
      ],
    });
    console.log('weatherInfo: ', weather);
    // Envoi des données récupérées pour chaque heure à Kafka
    for (const day of weatherInfo.forecast) {
      for (const hour of day.hours) {
        const hourlyData = {
          time: hour.time,
          temperature: hour.temperature,
          condition: hour.condition,
          wind_speed: hour.wind_speed,
          humidity: hour.humidity,
          sunrise: day.sunrise,
          sunset: day.sunset,
        };
        await producer.send({
          topic: 'traffic-meteo',
          messages: [
            {
              value: JSON.stringify(hourlyData), // Convertir les données en chaîne JSON
            },
          ],
        });

        console.log('Hourly data sent to Kafka:', hourlyData);
      }
    }
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
