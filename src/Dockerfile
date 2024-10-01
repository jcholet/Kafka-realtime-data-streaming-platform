# Utilisez l'image officielle Node.js comme image de base
FROM node:21

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json
COPY ./src/package*.json ./

# Installez toutes les dépendances nécessaires

# Copiez les répertoires nécessaires dans le conteneur
COPY ./src/kafka/ ./kafka/

COPY ../kafka_ssl_certs/ ./kafka_ssl_certs/

RUN npm install
# Commande pour démarrer votre script principal
CMD ["node", "kafka/main.js"]