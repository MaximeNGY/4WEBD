import mongoose from 'mongoose';
import Event from '../models/Event.js';

const events = [
  {
    name: "Concert de Test 1",
    description: "Concert de test pour la démo",
    date: "2025-06-20T20:00:00Z",
    location: "Salle XYZ",
    maxSeats: 300,
    availableSeats: 150
  },
  {
    name: "Festival de Musique",
    description: "Festival annuel dans la ville",
    date: "2025-07-10T19:00:00Z",
    location: "Parc de la Ville",
    maxSeats: 500,
    availableSeats: 350
  },
  {
    name: "Conférence sur la Technologie",
    description: "Conférence sur les dernières tendances technologiques",
    date: "2025-08-15T09:00:00Z",
    location: "Salle de Conférence A",
    maxSeats: 100,
    availableSeats: 50
  }
];

// Fonction pour initialiser la base de données avec des événements
const initializeDatabase = async () => {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGO_URI);

    // Supprimer les événements existants avant d'ajouter de nouveaux événements
    await Event.deleteMany();

    // Insérer les nouveaux événements
    await Event.insertMany(events);

    console.log("✅ Base de données initialisée avec des événements");
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données", error);
    process.exit(1);
  }
};

initializeDatabase();
