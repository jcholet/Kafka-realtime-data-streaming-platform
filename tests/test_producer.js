const { Kafka } = require('kafkajs');
const fs = require('fs');

// Chargement du certificat de la CA
const ssl = {
  rejectUnauthorized: false,
  ca: [fs.readFileSync('../kafka_ssl_certs/ca-cert', 'utf-8')],
  key: fs.readFileSync('../kafka_ssl_certs/client.key', 'utf-8'),
  cert: fs.readFileSync('../kafka_ssl_certs/client.crt', 'utf-8'),
};

// Création d'une instance Kafka avec configuration SSL
const kafkaInstance = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
  ssl,
});

const producer = kafkaInstance.producer();

const runProducer = async () => {
  try {
    // Connexion du producer
    await producer.connect();
    
    // Envoi d'un message
    await producer.send({
      topic: 'my-topic',
      messages: [{ value: 'Hello, Kafka Cluster with SSL!' }],
    });
    
    console.log('Message envoyé avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message :', error);
  } finally {
    // Déconnexion du producer
    await producer.disconnect();
  }
};

runProducer();