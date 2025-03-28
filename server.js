import express from "express";
import { config } from "dotenv";
import logger from "./config/logger.js";
import connectDB from "./config/db.js";
import mongoose from "mongoose";

// Charger les variables d'environnement
config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)

const app = express();
app.use(express.json()); // Middleware pour parser le JSON


// Route de test
app.get("/", (req, res) => {
  res.send("🚀 API en ligne !");
});

// Importer et utiliser les routes
import eventRoutes from "./routes/events.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`🚀 Serveur démarré sur http://localhost:${PORT}`));

app.use((err, req, res, next) => {
  logger.error(`❌ Erreur : ${err.message}`);
  res.status(500).json({ message: "Erreur interne du serveur" });
});