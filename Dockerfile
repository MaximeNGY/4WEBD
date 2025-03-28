# Utilisation de l'image officielle Node.js
FROM node:18

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Exposition du port utilisé par l'API
EXPOSE 3000

# Créer un volume pour les logs
VOLUME /usr/src/app/logs

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]
