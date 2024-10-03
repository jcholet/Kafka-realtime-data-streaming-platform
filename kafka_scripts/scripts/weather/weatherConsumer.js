const { Kafka } = require('kafkajs');
// const { MongoClient } = require('mongodb');
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

const kafkaInstance = new Kafka({
  clientId: 'my-weather-consumer',
  brokers: ['kafka1:9092', 'kafka2:9093', 'kafka3:9094'],
  ssl,
  retry: {
    initialRetryTime: 1500,
    retries: 10
  }
});

// MongoDB connection setup
// const mongoUri = 'mongodb://root:example@mongodb:27017/myDatabase?authSource=admin'; // Connection URI
// const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const consumer = kafkaInstance.consumer({ groupId: 'weather' });

const runWeatherConsumer = async (sendWeatherUpdate) => {
  // Connexion à MongoDB
  // await mongoClient.connect();
  console.log("IN RUN WEATHER CONSUMER");
  console.log("Connected to MongoDB");

  await consumer.connect();
  console.log("Connected to Kafka");
  await consumer.subscribe({ topic: 'weather', fromBeginning: true });
  console.log("Subscribed to Kafka");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("IN EACH MESSAGE");
      const msgValue = message.value.toString(); // Conversion en chaîne de caractères

      try {
        // Supposons que msgValue est un JSON. On essaie de le parser.
        const parsedMessage = JSON.parse(msgValue);

        console.log({
          partition,
          offset: message.offset,
          value: parsedMessage, // Affiche le message parse
        });

        // Insertion des données JSON parsées dans MongoDB
        // const db = mongoClient.db('myDatabase');
        // const collection = db.collection('myCollection');
        // await collection.insertOne({ ...parsedMessage, createdAt: new Date() });

        console.log("BEFORE SENDING WEATHER UPDATE");
        sendWeatherUpdate(parsedMessage); // Envoi des données au frontend

      } catch (error) {
        console.error('Failed to parse message as JSON:', error);
        console.log('Storing raw message as string');
        
        // Si le parsing échoue, stocker le message brut sous forme de texte
        // const db = mongoClient.db('myDatabase');
        // const collection = db.collection('myCollection');
        // await collection.insertOne({ message: msgValue, createdAt: new Date() });
      }
    },
  });
};

module.exports = { runWeatherConsumer };
