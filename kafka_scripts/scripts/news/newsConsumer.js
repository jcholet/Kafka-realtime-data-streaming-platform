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
  clientId: 'my-news-consumer',
  brokers: ['kafka1:9092', 'kafka2:9093', 'kafka3:9094'],
  ssl,
  retry: {
    initialRetryTime: 1500,
    retries: 10
  }
});

const consumer = kafkaInstance.consumer({ groupId: 'news' });

const runNewsConsumer = async (sendNewsUpdate) => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'news', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msgValue = message.value.toString();

      try {
        const parsedMessage = JSON.parse(msgValue);

        console.log({
          partition,
          offset: message.offset,
          value: parsedMessage,
        });

        sendNewsUpdate(parsedMessage);
      } catch (error) {
        console.error(`Error parsing message value: ${error.message}`);
      }
    },
  });
};

module.exports = { runNewsConsumer };