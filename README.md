# Todolist

Bienvenue dans l'application Todolist ! Ce projet vous offre la possibilité de gérer vos tâches quotidiennes de manière simple et efficace.

![DocAPI](https://github.com/AlexandreKleinJean/Draw-Art/assets/127552834/f3c9c4a6-00e6-4ffa-aa4b-e2e0849918fb)

## Introduction

Cette application Todolist est structurée en deux parties : le frontend et le backend (API). Elle vous permet d'ajouter, de modifier, de supprimer et de visualiser les tâches à réaliser.

## Technologies

Node.js et Express.js pour la gestion du côté serveur.

Sequelize comme ORM (Object-Relational Mapping) pour interagir avec la base de données.

PostgreSQL comme système de gestion de base de données.

HTML, CSS et Typescript pour le développement front-end.

Typescript pour l'ensemble du développement back-end.

## Caractéristiques

### Frontend

- Le dossier "front" contient l'interface utilisateur de l'application.
- Pour l'utiliser, ouvrez le fichier `index.html` dans un navigateur web.

### Backend (API)

- Le dossier "back" contient l'API qui fournit les données au frontend.
- Pour démarrer l'API, suivez les instructions fournies dans le dossier `back`.

## Initialisation

### Base de Données

- Créer une nouvelle base de données PostgreSQL dans votre environnement local.
- Importez les tables et les données d'exemple à l'aide du fichier SQL dans le répertoire `back/data/table.sql`.

### Démarrage de l'API

Pour lancer l'API :

1. Accédez au dossier "back".
2. Installez les dépendances en exécutant `npm install`.
3. Lancez le serveur Node.js avec `npm run start`.

## Fonctionnalités

1. Récupération des tâches
2. Ajout de tâches
3. Modification des tâches
4. Suppression de tâches

## Contributeur

Alexandre Klein a développé ce projet