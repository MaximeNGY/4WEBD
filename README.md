# 4WEBD

Lancer le projet en 2 commandes :

Lien de la docs Swagger: [localhost:5000/api-docs](localhost:5000/api-docs)

```sh
git clone https://github.com/MaximeNGY/4WEBD
docker-compose up --build -d
```

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
