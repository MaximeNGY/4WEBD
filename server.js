const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/concertdb";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connecté avec succès"))
  .catch((err) => console.error("❌ Erreur de connexion à MongoDB :", err));


  const express = require("express");
  const dotenv = require("dotenv");
  const connectDB = require("./config/db");
  
  dotenv.config(); // Charger les variables d'environnement
  
  connectDB(); // Connexion à MongoDB
  
  const app = express();
  app.use(express.json()); // Middleware pour parser le JSON
  
  // Route de test
  app.get("/", (req, res) => {
    res.send("🚀 API en ligne !");
  });
  
  // Importer et utiliser les routes
  const eventRoutes = require("./routes/events");
  const userRoutes = require("./routes/users");
  
  app.use("/api/events", eventRoutes);
  app.use("/api/users", userRoutes);
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
  