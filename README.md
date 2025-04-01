# 4WEBD

## Lancer le projet en 2 commandes :

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

---

## Load Balancer - Documentation

### Introduction

Le Load Balancer (équilibreur de charge) est un composant essentiel pour améliorer la scalabilité et la disponibilité de notre application. Il permet de répartir les requêtes entrantes entre plusieurs instances du backend afin d'éviter la surcharge d'un serveur unique.

#### Pourquoi un Load Balancer ?

1. Amélioration des performances : En répartissant la charge, chaque instance gère moins de requêtes, réduisant ainsi les temps de réponse.

2. Haute disponibilité : En cas de panne d'une instance, le Load Balancer redirige automatiquement les requêtes vers une autre instance.

3. Scalabilité : Permet d'ajouter dynamiquement des instances en fonction de la charge.

4. Sécurité : Peut masquer l'architecture interne en ne rendant accessible que l'IP du Load Balancer.

#### Configuration du Load Balancer

##### Utilisation avec NGINX (Reverse Proxy)

Nous utilisons NGINX pour jouer le rôle de Load Balancer entre plusieurs instances de notre backend.

##### Étapes de configuration

1. Installation de NGINX (si non installé) :

```sh
sudo apt update
sudo apt install nginx -y
```

2. Modification du fichier de configuration NGINX
```sh
sudo nano /etc/nginx/nginx.conf
```
Exemple de configuration :

```js
http {
    upstream backend {
        server backend1:5000;
        server backend2:5000;
    }

    server {
        listen 80;
        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```
3. Rechargement de NGINX

```sh
sudo systemctl restart nginx
```

##### Explication de la configuration

- upstream backend : Définit un groupe de serveurs (backend1:5000, backend2:5000) qui géreront les requêtes.

- proxy_pass http://backend : Redirige les requêtes vers l'un des serveurs du groupe backend selon la stratégie par défaut (round-robin).

- proxy_set_header : Transmet les en-têtes HTTP importants pour la gestion des requêtes.

#### Simulation avec Docker Compose

Pour tester notre Load Balancer avec plusieurs instances backend, nous pouvons modifier notre docker-compose.yml :

```yml
version: '3'
services:
  backend1:
    build: .
    ports:
      - "5001:5000"
  backend2:
    build: .
    ports:
      - "5002:5000"
  nginx:
    image: nginx:latest
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "80:80"
    depends_on:
      - backend1
      - backend2
```

### Conclusion

L'ajout d'un Load Balancer avec NGINX permet de gérer efficacement la charge de notre application et garantit une meilleure résilience. Cela facilite également l'ajout de nouvelles instances backend à mesure que la demande augmente.
