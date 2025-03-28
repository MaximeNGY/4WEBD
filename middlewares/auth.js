import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization'); // Récupérer le token
  if (!token) {
    logger.warn("🚫 Accès refusé : aucun token fourni");
    return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
  }

  // Supprimer le préfixe "Bearer " et récupérer uniquement le token
  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) {
    logger.error("❌ Format du token invalide.");
    return res.status(401).json({ message: 'Format du token invalide.' });
  }

  try {
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET); // Vérifier le token
    
    req.user = decoded;
    logger.info(`✅ Token valide : utilisateur ${req.user.id}`);
    next(); // Passer à la prochaine étape
  } catch (err) {
    logger.error("❌ Token invalide ou expiré");
    logger.info(`Token reçu : ${token}`); 
    res.status(401).json({ message: "Token invalide." });
  }
};

export default authMiddleware;
