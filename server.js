import express from "express";
import swaggerSetup from "./swaggerConfig.js";
import dotenv from 'dotenv';
import logger from "./config/logger.js";
import connectDB from './config/db.js';
import { checkDBConnection } from './config/db.js';
import cors from "cors";

// Importer et utiliser les routes
import eventRoutes from "./routes/events.js";
import ticketRoutes from "./routes/tickets.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

// Charger les variables d'environnement de .env
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();
app.use(express.json()); // Middleware pour parser le JSON

// Configuration Swagger
swaggerSetup(app);

app.use((req, res, next) => {
  if (!checkDBConnection()) {
    logger.error('🚨 Tentative d\'accès à l\'API sans connexion DB');
    return res.status(503).json({ message: "Base de données non disponible" });
  }
  next();
});

// Route de test
app.get("/", (req, res) => {
  res.send("🚀 API en ligne !");
});

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => logger.info(`🚀 Serveur démarré sur http://localhost:${PORT}`));
}

app.use((err, req, res, next) => {
  logger.error(`❌ Erreur : ${err.message}`);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

export default app;