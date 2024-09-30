const { Kafka } = require('kafkajs');
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

const consumer = kafkaInstance.consumer({ groupId: 'my-group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'traffic-meteo', fromBeginning: false });
  await consumer.subscribe({ topic: 'traffic-news', fromBeginning: false });
  await consumer.subscribe({ topic: 'traffic-ip', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      switch (topic) {
        case 'traffic-meteo':
          //console.log('traffic-meteo');
          console.log('c les meteo')
          break;
        case 'traffic-news':
          //console.log(message.value.toString())
          console.log('c le news')
          break;
        case 'traffic-ip':
          console.log(message.value.toString())
      }
    },
  });
};

runConsumer().catch(console.error);
