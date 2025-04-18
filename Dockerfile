# Utilisation de l'image officielle Node.js
FROM node:18

# Installation des dépendances système nécessaires
RUN apt-get update && apt-get install -y netcat-openbsd

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Exposition du port utilisé par l'API
EXPOSE 5000

# Créer un volume pour les logs
VOLUME /usr/src/app/logs

# Copie du script d'initialisation
COPY scripts/initData.js /app/scripts/initData.js

# Commande pour démarrer l'application
CMD ["npm", "start"]
