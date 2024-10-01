const { Kafka } = require('kafkajs');
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
  clientId: 'my-ip-consumer',
  brokers: ['kafka1:9092', 'kafka2:9093', 'kafka3:9094'],
  ssl,
  retry: {
    initialRetryTime: 1500,
    retries: 5,
    factor: 0.2,
    multiplier: 2,
  }
});

const consumer = kafkaInstance.consumer({ groupId: 'ip' });

const runIpConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'traffic-ip', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(message.value.toString());
    },
  });
};

module.exports = { runIpConsumer };