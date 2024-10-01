const { Kafka } = require('kafkajs');
const fs = require('fs');
const { faker } = require('@faker-js/faker');
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
  clientId: 'my-ip-producer',
  brokers: ['kafka1:9092', 'kafka2:9093', 'kafka3:9094'],
  ssl,
  retry: {
    initialRetryTime: 1500,
    retries: 5,
    factor: 0.2,
    multiplier: 2,
  }
});

const producer = kafka.producer();
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
const runIpProducer = async () => {
  // Connexion du producer
  await producer.connect();

  await fetchFakerIpDatas();

  setInterval(fetchFakerIpDatas, 1000);
};


module.exports = { runIpProducer };