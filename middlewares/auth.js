import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log("🔎 Token reçu : ", token);

  if (!token) {
    logger.warn("🚫 Accès refusé : aucun token fourni");
    return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token :", decoded);
    req.user = decoded;
    console.log("📌 Utilisateur extrait du token :", req.user);

    // ✅ Correction : Utiliser `req.user` au lieu de `user`
    console.log("📌 Utilisateur extrait du token :", req.user);
    console.log("📌 Role de l'utilisateur extrait :", req.user?.role);

    next();
  } catch (e) {
    logger.error("❌ Erreur lors de la vérification du token : " + e.message);
    return res.status(401).send({ error: 'Token invalide ou expiré' });
  }
};


// Middleware pour vérifier le rôle de l'utilisateur
const verifyRole = (allowedRoles) => (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Accès refusé" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("📌 Décodage du token : ", decoded);
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

export { authMiddleware, verifyRole };