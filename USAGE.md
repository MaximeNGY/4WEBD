# Utilisation du projet

## Endpoints API

### 1. Authentification
- **POST** `/auth/login` : Connectez un utilisateur.
- **POST** `/auth/register` : Inscription d'un nouvel utilisateur.

### 2. Gestion des événements
- **GET** `/events` : Liste des événements.
- **POST** `/events` : Créez un événement.

## Exemples
Voici un exemple d'appel API avec `curl` :
```bash
curl -X GET http://localhost:5000/events
```

Voir la docs Swagger pour plus de détails: [localhost:5000/api-docs](localhost:5000/api-docs)