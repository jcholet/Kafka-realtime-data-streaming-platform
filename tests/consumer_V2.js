const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-streams-app',
  brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
  logLevel: logLevel.INFO,
});

const stream = kafka.streams;

// Créer un stream pour transformer les données
const processStream = async () => {
  const admin = kafka.admin();
  await admin.connect();
  // Assurez-vous que le topic existe
  const topics = await admin.listTopics();
  if (!topics.includes('my-topic')) {
    console.error('Le topic my-topic n\'existe pas.');
    return;
  }
  await admin.disconnect();

  const consumer = kafka.consumer({ groupId: 'my-streams-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = JSON.parse(message.value.toString());
      // Transformation des données
      const transformedData = transformData(value);
      // Envoi des données transformées à un autre topic
      await sendToTopic('my-transformed-topic', transformedData);
    },
  });
};

const transformData = (data) => {
  // Implémentez ici votre logique de transformation, d'agrégation ou de filtrage
  // Par exemple, filtrez les données basées sur une condition
  return {
    ...data,
    transformed: true, // Exemple de transformation
  };
};

const sendToTopic = async (topic, data) => {
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: topic,
    messages: [{ value: JSON.stringify(data) }],
  });
  await producer.disconnect();
};

processStream().catch(console.error);
