const { runWeatherProducer } = require('./weather/weatherProducer');
const { runWeatherConsumer } = require('./weather/weatherConsumer');
const { runIpProducer } = require('./ip/ipProducer');
const { runIpConsumer } = require('./ip/ipConsumer');
const { runNewsConsumer } = require('./news/newsConsumer');
const { runNewsProducer } = require('./news/newsProducer');
const http = require('http'); // Pour créer un serveur HTTP
const socketIo = require('socket.io'); // Socket.IO pour la communication en temps réel

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
  io.emit('news-update', data);
}

function sendIpUpdate(data) {
  console.log('Sending IP update:', data);
  io.emit('ip-update', data);
}

// 3. Exécuter les consumers et les producers
runIpProducer().catch((error) => {
  console.error("Erreur lors de l'exécution du producteur IP:", error);
});
runIpConsumer(sendIpUpdate).catch((error) => {
  console.error("Erreur lors de l'exécution du consommateur IP:", error);
});

runWeatherProducer().catch((error) => {
  console.error("Erreur lors de l'exécution du producteur Weather:", error);
});
runWeatherConsumer(sendWeatherUpdate).catch((error) => {
  console.error("Erreur lors de l'exécution du consommateur Weather:", error);
});

runNewsProducer().catch((error) => {
  console.error("Erreur lors de l'exécution du producteur News:", error);
});
runNewsConsumer(sendNewsUpdate).catch((error) => {
  console.error("Erreur lors de l'exécution du consommateur News:", error);
});