const { runWeatherProducer } = require('./weather/weatherProducer');
const { runWeatherConsumer } = require('./weather/weatherConsumer');
const { runIpProducer } = require('./ip/ipProducer');
const { runIpConsumer } = require('./ip/ipConsumer');
const { runNewsConsumer } = require('./news/newsConsumer');
const { runNewsProducer } = require('./news/newsProducer');
const { Kafka } = require('kafkajs');
const http = require('http'); // Pour créer un serveur HTTP
const socketIo = require('socket.io'); // Socket.IO pour la communication en temps réel
const fs = require('fs');
const path = require('path');

const caPath = path.join(__dirname, '../kafka_ssl_certs/ca-cert');
const keyPath = path.join(__dirname, '../kafka_ssl_certs/client.key');
const certPath = path.join(__dirname, '../kafka_ssl_certs/client.crt');

const ssl = {
  rejectUnauthorized: false,
  ca: [fs.readFileSync(caPath, 'utf-8')],
  key: fs.readFileSync(keyPath, 'utf-8'),
  cert: fs.readFileSync(certPath, 'utf-8'),
};

const kafka = new Kafka({
  clientId: 'admin-client',
  brokers: ['kafka1:9092', 'kafka2:9093', 'kafka3:9094'], // Replace with your broker addresses
  ssl: ssl,
});

const admin = kafka.admin();

async function createTopics() {
  await admin.connect();
  
  // Create topics array
  const topicsToCreate = [
    { topic: 'ip', numPartitions: 1, replicationFactor: 3 },
    { topic: 'weather', numPartitions: 1, replicationFactor: 3 },
    { topic: 'news', numPartitions: 1, replicationFactor: 3 }
  ];

  try {
    // Create topics
    await admin.createTopics({
      topics: topicsToCreate,
      waitForLeaders: true
    });
    console.log('Topics created successfully.');
  } catch (error) {
    console.error('Error creating topics:', error);
  } finally {
    await admin.disconnect();
  }
}


createTopics().then(() => {
  // 1. Créer un serveur WebSocket
  const server = http.createServer();
  const io = socketIo(server, {
    cors: {
      origin: '*', // À ajuster pour la sécurité en production
    },
  });

  server.listen(8080, () => {
    console.log('Socket.IO server listening on port 8080');
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // 2. Fonction pour émettre des messages aux clients WebSocket
  function sendWeatherUpdate(data) {
    console.log('Sending weather update:', data);
    io.emit('weather-update', data);
  }

  function sendNewsUpdate(data) {
    console.log('Sending news update:', data);
    io.emit('news-update', data);
  }

  function sendIpUpdate(data) {
    console.log('Sending IP update:', data);
    io.emit('ip-update', data);
  }

  // 3. Exécuter les consumers et les producers
  runIpConsumer(sendIpUpdate).catch((error) => {
    console.error("Erreur lors de l'exécution du consommateur IP:", error);
  });

  runIpProducer().catch((error) => {
    console.error("Erreur lors de l'exécution du producteur IP:", error);
  });

  runWeatherConsumer(sendWeatherUpdate).catch((error) => {
    console.error("Erreur lors de l'exécution du consommateur Weather:", error);
  });

  runWeatherProducer().catch((error) => {
    console.error("Erreur lors de l'exécution du producteur Weather:", error);
  });

  runNewsConsumer(sendNewsUpdate).catch((error) => {
    console.error("Erreur lors de l'exécution du consommateur News:", error);
  });

  runNewsProducer().catch((error) => {
    console.error("Erreur lors de l'exécution du producteur News:", error);
  });
}).catch(error => {
  console.error('Failed to create topics:', error);
});