const { Kafka } = require('kafkajs');
const { MongoClient } = require('mongodb');
const fs = require('fs');

const ssl = {
  rejectUnauthorized: false,
  ca: [fs.readFileSync('../kafka_ssl_certs/ca-cert', 'utf-8')],
  key: fs.readFileSync('../kafka_ssl_certs/client.key', 'utf-8'),
  cert: fs.readFileSync('../kafka_ssl_certs/client.crt', 'utf-8'),
};

const kafkaInstance = new Kafka({
  clientId: 'my-consumer',
  brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
  ssl,
});

// MongoDB connection setup
const mongoUri = 'mongodb://root:example@localhost:27017/myDatabase?authSource=admin'; // Connection URI
const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const consumer = kafkaInstance.consumer({ groupId: 'my-group' });

const runConsumer = async () => {
  // Connexion à MongoDB
  await mongoClient.connect();
  console.log("Connected to MongoDB");

  await consumer.connect();
  await consumer.subscribe({ topic: 'traffic-meteo', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msgValue = message.value.toString(); // Conversion en chaîne de caractères

      try {
        // Supposons que msgValue est un JSON. On essaie de le parser.
        const parsedMessage = JSON.parse(msgValue);

        console.log({
          partition,
          offset: message.offset,
          value: parsedMessage, // Affiche le message parsé
        });

        // Insertion des données JSON parsées dans MongoDB
        const db = mongoClient.db('myDatabase');
        const collection = db.collection('myCollection');
        await collection.insertOne({ ...parsedMessage, createdAt: new Date() });

        console.log("Message inséré dans MongoDB");

      } catch (error) {
        console.error('Failed to parse message as JSON:', error);
        console.log('Storing raw message as string');
        
        // Si le parsing échoue, stocker le message brut sous forme de texte
        const db = mongoClient.db('myDatabase');
        const collection = db.collection('myCollection');
        await collection.insertOne({ message: msgValue, createdAt: new Date() });
      }
    },
  });
};

runConsumer().catch(console.error);
