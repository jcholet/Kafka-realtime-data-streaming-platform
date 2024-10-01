const { runIpConsumer } = require('./ip/ipConsumer');
const {runWeatherProducer} = require("./weather/weatherProducer");
const {runWeatherConsumer} = require("./weather/weatherConsumer");
const {runIpProducer} = require("./ip/ipProducer");
const {runNewsConsumer} = require("./news/newsConsumer");

runIpConsumer().catch(error => {
  console.error('Erreur lors de l\'exécution du consommateur:', error);
});
runIpProducer().catch(error => {
  console.error('Erreur lors de l\'exécution du producteur:', error);
});

runWeatherConsumer().catch(error => {
  console.error('Erreur lors de l\'exécution du consommateur:', error);
});
runWeatherProducer().catch(error => {
  console.error('Erreur lors de l\'exécution du producteur:', error);
});

runNewsConsumer().catch(error => {
  console.error('Erreur lors de l\'exécution du consommateur:', error);
});
runWeatherProducer().catch(error => {
  console.error('Erreur lors de l\'exécution du producteur:', error);
});