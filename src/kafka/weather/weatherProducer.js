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
});

const producer = kafka.producer();

// Fonction pour récupérer les données de trafic
const fetchWeatherData = async () => {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=27f33547d58d4d68995124844243009&q=laval, france&aqi=yes`); //TODO RMV API MAYBE LATER ZBI

    const trafficData = response.data;
    console.log(trafficData)
    // Envoyer les données au topic Kafka
    const value = {
      pays: trafficData.location.country,
      ville: trafficData.location.name,
      local_time: trafficData.location.localtime,
      last_updated: trafficData.current.last_updated
    }
    await producer.send({
      topic: 'traffic-meteo',
      messages: [{ value: JSON.stringify(value) }],
    });

    console.log('Données de trafic envoyées avec succès à Kafka.');
  } catch (error) {
    console.error('Erreur lors de la récupération des données de trafic :', error);
  }
};

// Démarrer le producer
const runWeatherProducer = async () => {
  // Connexion du producer
  await producer.connect();
  // Récupération initiale des données
  await fetchWeatherData();
  // Récupérer les données toutes les minutes
  setInterval(fetchWeatherData, 10000);
};
module.exports = { runWeatherProducer };
