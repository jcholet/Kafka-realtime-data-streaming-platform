const { Kafka } = require('kafkajs');
const axios = require('axios');
const fs = require('fs');

const ssl = {
  rejectUnauthorized: false,
  ca: [fs.readFileSync('../kafka_ssl_certs/ca-cert', 'utf-8')],
  key: fs.readFileSync('../kafka_ssl_certs/client.key', 'utf-8'),
  cert: fs.readFileSync('../kafka_ssl_certs/client.crt', 'utf-8'),
};

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
  ssl,
});

const producer = kafka.producer();

const fetchDataFromAPI = async () => {
  try {
    // Appel de l'API pour obtenir la prévision météo pour Laval
    const response = await axios.get('https://api.weatherapi.com/v1/forecast.json?key=27f33547d58d4d68995124844243009&q=laval,france&days=10&aqi=no&alerts=no');
    const data = response.data;

    // Extraction des informations spécifiques pour chaque heure de chaque jour
    const weatherInfo = {
      location: data.location.name, // Nom de la ville
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

    return weatherInfo;

  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error; // Propager l'erreur pour l'utiliser plus tard
  }
};

const runProducer = async () => {
  // Connexion au producteur
  await producer.connect();
  console.log('Producer connected');

  try {
    const apiData = await fetchDataFromAPI();

    // Envoi des données récupérées pour chaque heure à Kafka
    for (const day of apiData.forecast) {
      for (const hour of day.hours) {
        const hourlyData = {
          location: apiData.location,
          date: day.date,
          time: hour.time,
          temperature: hour.temperature,
          condition: hour.condition,
          wind_speed: hour.wind_speed,
          humidity: hour.humidity,
          sunrise: day.sunrise,
          sunset: day.sunset,
        };

        await producer.send({
          topic: 'my-topic',
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
    console.error('Error sending data to Kafka:', error);
  }

  // Déconnexion du producteur
  await producer.disconnect();
  console.log('Producer disconnected');
};

runProducer().catch(console.error);
