// jest.setup.js
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from './models/User.js'; // Assurez-vous que le chemin est correct pour votre modèle

let mongoServer;

beforeAll(async () => {
  // Démarrer un serveur MongoDB en mémoire
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Se connecter à MongoDB en mémoire
  await mongoose.connect(mongoUri);

  // Créer des utilisateurs pour les tests (Admin et EventCreator)
  const admin = await User.findOne({ email: 'admin@test.com' }).select("+role");
  const eventCreator = await User.findOne({ email: 'eventcreator@test.com' }).select("+role");

  if (!admin) {
    await User.create({
      name: "Admin Test",
      email: "admin@test.com",
      password: "password123", // Assure-toi que la logique de hash fonctionne
      role: "admin"
    });
  }

  if (!eventCreator) {
    await User.create({
      name: "Event Creator Test",
      email: "eventcreator@test.com",
      password: "password123",
      role: "eventCreator"
    });
  }
});

afterAll(async () => {
  // Arrêter le serveur MongoDB en mémoire et fermer la connexion
  await mongoose.disconnect();
  await mongoServer.stop();
});
