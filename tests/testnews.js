const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('f11c9b2ed94046bba2938ac3bc32e142');

newsapi.v2.everything({
  q: 'meteo',
  language: 'fr'
}).then(response => {
  //Affiche toutes les news ecrites en fr parlant de la meteo
  console.log(response);
});
