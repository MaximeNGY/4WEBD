import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js";
import bcrypt from 'bcryptjs';

dotenv.config();

// Fonction d'initialisation des données
const initializeDatabase = async () => {
  try {
    console.log("🔄 Initialisation des données...");
    
    await mongoose.connect(process.env.MONGO_URI);

    const salt = await bcrypt.genSalt(10);
    const hashedPasswordAdmin = await bcrypt.hash('admin123', salt);
    const existingAdmin = await User.findOne({ email: "admin@test.com" });
    if (!existingAdmin) {
      console.log("Création de l'utilisateur admin...");
      const newAdmin = new User({
        email: "admin@test.com",
        password: hashedPasswordAdmin,
        role: "admin",
        pseudo: "AdminPseudo"
      });
      await newAdmin.save();
      console.log("Utilisateur admin créé.");
    }

    const salt2 = await bcrypt.genSalt(10);
    const hashedPasswordEventCreator = await bcrypt.hash('password123', salt2);
    const existingEventCreator = await User.findOne({ email: "eventcreator@test.com" });
    if (!existingEventCreator) {
      console.log("Création de l'utilisateur eventCreator...");
      const newEventCreator = new User({
        email: "eventcreator@test.com",
        password: hashedPasswordEventCreator,
        role: "eventCreator",
        pseudo: "EventCreatorPseudo"
      });
      await newEventCreator.save();
      console.log("Utilisateur eventCreator créé.");
    }

    const salt3 = await bcrypt.genSalt(10);
    const hashedPasswordUser = await bcrypt.hash('password123', salt3);
    const existingUser = await User.findOne({ email: "user@test.com" });
    if (!existingUser) {
      console.log("Création de l'utilisateur user...");
      const newUser = new User({
        email: "user@test.com",
        password: hashedPasswordUser,
        role: "user",
        pseudo: "UserPseudo"
      });
      await newUser.save();
      console.log("Utilisateur user créé.");
    }

    const eventCreator = await User.findOne({ email: "eventcreator@test.com" });

    const existingEvent = await Event.findOne({ name: "TestEventName" });
    if (!existingEvent) {
      await new Event({
        name: "TestEventName",
        description: "DescriptionEventTest",
        date: "2024-12-31T00:00:01",
        location: "Paris",
        maxSeats: 100,
        availableSeats: 6,
        price: 50,
        createdBy: eventCreator._id
      }).save();
    }

    const existingEvent2 = await Event.findOne({ name: "Concert Accor Arena" });
    if (!existingEvent2) {
      await new Event({
        name: "Concert Accor Arena",
        description: "Concert Kendrick Lamar",
        date: "2025-07-20T20:00:00",
        location: "Paris",
        maxSeats: 5000,
        availableSeats: 6,
        price: 100,
        createdBy: eventCreator._id
      }).save();
    }

    const existingEvent3 = await Event.findOne({ name: "Astroworld Concert" });
    if (!existingEvent3) {
      await new Event({
        name: "Astroworld Concert",
        description: "Travis Scott Astroworld Concert",
        date: "2025-05-15T20:00:00",
        location: "Houston",
        maxSeats: 50000,
        availableSeats: 3,
        price: 80,
        createdBy: eventCreator._id
      }).save();
    }

    const TestUser = await User.findOne({ email: "user@test.com" });
    const TestEvent = await Event.findOne({ name: "TestEventName" });

    const existingTicket = await Ticket.findOne({ event: TestEvent._id, user: TestUser._id });
    if (!existingTicket) {
      await new Ticket({
        event: TestEvent._id,
        user: TestUser._id,
        quantity: 1,
        totalPrice: TestEvent.price * 1,
      }).save();
    }

    console.log("✅ Données initialisées avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des données :", error);
    mongoose.connection.close();
  }
};

export default initializeDatabase;
