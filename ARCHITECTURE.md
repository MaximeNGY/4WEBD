# Architecture du projet

## Vue d'ensemble
Ce projet suit une architecture de microservices avec les composants suivants :
- **Service 1** : Gère les utilisateurs (authentification, gestion des comptes).
- **Service 2** : Gère les événements (création, modification, suppression).
- **Service 3** : Gère les tickets (achat, annulation, gestion des stocks).

## Diagramme de l'architecture
Voici un aperçu de l'architecture du projet :
![Diagramme Architecture](chemin/vers/diagramme.png)


## Load Balancer

### Description

Le Load Balancer améliore la scalabilité et la disponibilité de notre application. 
Il permet de répartir les requêtes entrantes entre plusieurs instances du backend afin d'éviter la surcharge d'un serveur unique.

#### Pourquoi un Load Balancer ?

1. Amélioration des performances : En répartissant la charge, chaque instance gère moins de requêtes, réduisant ainsi les temps de réponse.

2. Haute disponibilité : En cas de panne d'une instance, le Load Balancer redirige automatiquement les requêtes vers une autre instance.

3. Scalabilité : Permet d'ajouter dynamiquement des instances en fonction de la charge.

4. Sécurité : Peut masquer l'architecture interne en ne rendant accessible que l'IP du Load Balancer.

#### Configuration du Load Balancer

##### Utilisation avec NGINX (Reverse Proxy)

Nous utilisons NGINX pour jouer le rôle de Load Balancer entre plusieurs instances de notre backend.

##### Explication de la configuration

Voir [nginx.conf](nginx.conf).

- Utilisation d'upstream backend : Définit un groupe de serveurs (backend1:5000, backend2:5000) qui géreront les requêtes, les requêtes seront envoyés au serveur ayant le moins de charge avec le least_conn.

- proxy_pass : Redirige les requêtes vers l'un des serveurs du groupe backend selon la stratégie par défaut.

- proxy_set_header : Transmet les en-têtes HTTP importants pour la gestion des requêtes.


### Conclusion

L'ajout d'un Load Balancer avec NGINX permet de gérer efficacement la charge de notre application et garantit une meilleure résilience. Cela facilite également l'ajout de nouvelles instances backend à mesure que la demande augmente.
