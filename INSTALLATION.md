# Installation

## Prérequis
- Docker Desktop pour le déploiement

## Etapes d'installation

Lien de la docs Swagger: [localhost:5000/api-docs](localhost:5000/api-docs)

1. Cloner le repo
```sh
git clone https://github.com/MaximeNGY/4WEBD
cd 4WEBD
```

2. Créer le .env à la racine du projet.

```JSON
PORT=5000
MONGO_URI=mongodb://mongo:27017/concertdb
JWT_SECRET=super_secret_key
NODE_ENV=dev
```

3. Et enfin lancer le build
```sh
docker-compose up --build -d
```


---
Si tu veux stopper et supprimer les conteneurs :
```sh
docker-compose down
```

Si tu veux aussi supprimer les données MongoDB (⚠️ efface tout !) :
```sh
docker-compose down -v
```

### Visualiser les logs

Dans un fichier:
```sh
cat logs/combined.log
```

Erreurs seulement:
```sh
cat logs/errors.log
```

## Configuration .env

MONGO_URI=mongodb://localhost:27017/concertdb
JWT_SECRET=YOUR_JWT_SECRET

## Tests

Pour lancer les tests:
```sh
npm test
```
