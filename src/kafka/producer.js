const { Kafka } = require('kafkajs');
const axios = require('axios');
const fs = require('fs');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('f11c9b2ed94046bba2938ac3bc32e142'); // TODO RMV API KEY LATTER ZEBI
const { faker } = require('@faker-js/faker');

// Configuration Kafka
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

// Fonction pour récupérer les données de trafic
const fetchTrafficData = async () => {
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/future.json?key=27f33547d58d4d68995124844243009&q=laval, france&dt=2024-10-30`); //TODO RMV API MAYBE LATER ZBI

    const trafficData = response.data;
    console.log(trafficData)
    // Envoyer les données au topic Kafka
    await producer.send({
      topic: 'traffic-meteo',
      messages: [{ value: JSON.stringify(trafficData) }],
    });

    console.log('Données de trafic envoyées avec succès à Kafka.');
  } catch (error) {
    console.error('Erreur lors de la récupération des données de trafic :', error);
  }
};

const fetchNewsData = async () => {
  try {
    const response = await newsapi.v2.everything({
      q: 'meteo',
      language: 'fr'
    });
    await producer.send({
      topic: 'traffic-news',
      messages: [{ value: JSON.stringify(response)}]
    })
    console.log('Données de news envoyées avec succès à Kafka');
  } catch (error) {
    console.error('Erreur lors de la récupération des données de trafic :', error);
  }
}

const fetchFakerIpDatas = async () => {
  try {
    await producer.send({
      topic: 'traffic-ip',
      messages: [{ value: JSON.stringify(faker.internet.ipv4())}]
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des données de trafic :', error);
  }
}

// Démarrer le producer
const run = async () => {
  // Connexion du producer
  await producer.connect();

  // Récupération initiale des données
  await fetchTrafficData();
  await fetchNewsData();
  await fetchFakerIpDatas();

  // Récupérer les données toutes les minutes
  setInterval(fetchTrafficData, 10000);
  setInterval(fetchNewsData, 600000);
  setInterval(fetchFakerIpDatas, 1000);
};

run().catch(console.error);