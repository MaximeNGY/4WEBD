// auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
const router = express.Router();
import logger from "../config/logger.js";

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { email, pseudo, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      logger.warn(`❌ Utilisateur déjà existant avec l'email : ${email}`);
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    logger.info(`🔐 Mot de passe hashé avant insertion :${hashedPassword}`);

    user = new User({ email, pseudo, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    logger.error(`❌ Erreur lors de l'inscription : ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`📩 Email reçu : ${email}`);
    logger.info(`🔑 Mot de passe reçu : ${password}`);

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`❌ Utilisateur introuvable avec l'email : ${email}`);
      return res.status(400).json({ message: "Identifiants incorrects" });
    }

    // Comparer le mot de passe hashé
    const isMatch = await bcrypt.compare(password, user.password);
    logger.info(`🔍 bcrypt.compare() retourne : ${isMatch}`);

    if (!isMatch) {
      logger.warn(`❌ Mauvais mot de passe pour l'email : ${isMatch}`);
      return res.status(400).json({ message: "Identifiants incorrects" });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    logger.info(`🎟️ Token généré pour l'email : ${email}`);
    res.json({ token });
  } catch (err) {
    logger.error(`❌ Erreur serveur lors de la connexion : ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

export default router;