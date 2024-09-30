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
    // Remplacez l'URL par celle de votre API
    const response = await axios.get('https://api.weatherapi.com/v1/future.json?key=27f33547d58d4d68995124844243009&q=laval, france&dt=2024-10-30');
    return response.data; // Retourne les données de l'API
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

    // Envoi des données récupérées à Kafka
    await producer.send({
      topic: 'my-topic',
      messages: [
        {
          value: JSON.stringify(apiData), // Convertir les données en chaîne JSON
        },
      ],
    });

    console.log('Data sent to Kafka:', apiData);
  } catch (error) {
    console.error('Error sending data to Kafka:', error);
  }

  // Déconnexion du producteur
  await producer.disconnect();
  console.log('Producer disconnected');
};

runProducer().catch(console.error);
