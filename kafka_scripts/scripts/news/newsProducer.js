const { Kafka } = require('kafkajs');
const axios = require('axios');
const fs = require('fs');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('f11c9b2ed94046bba2938ac3bc32e142');
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
  clientId: 'my-news-producer',
  brokers: ['kafka1:9092', 'kafka2:9093', 'kafka3:9094'],
  ssl,
  retry: {
    initialRetryTime: 1500,
    retries: 10
  }
});

const producer = kafka.producer();

const fetchNewsData = async () => {
  try {
    const response = await newsapi.v2.everything({
      q: 'meteo',
      language: 'fr'
    });

    // Extraire uniquement les informations nécessaires
    const newsData = response.articles.map(article => ({
      title: article.title,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt
    }));

    console.log('newsData:', newsData);

    await producer.send({
      topic: 'news',
      messages: [{ value: JSON.stringify(newsData)}]
    })

    console.log('Données de news envoyées avec succès à Kafka');
  } catch (error) {
    console.error('Erreur lors de la récupération des données de trafic :', error);
  }
}

// Démarrer le producer
const runNewsProducer = async () => {
  // Connexion du producer
  await producer.connect();

  // Récupération initiale des données
  await fetchNewsData();

  // Récupérer les données toutes les minutes
  setInterval(fetchNewsData, 60000);
};

module.exports = { runNewsProducer };