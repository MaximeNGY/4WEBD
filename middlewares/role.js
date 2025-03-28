const roleMiddleware = (requiredRole) => (req, res, next) => {
    const userRole = req.user.role;  // Récupérer le rôle de l'utilisateur à partir du token
    
    if (userRole !== requiredRole) {
      return res.status(403).json({ message: "Accès refusé. Vous n'avez pas les droits nécessaires." });
    }
    
    next();  // L'utilisateur a le rôle requis, on passe à la route suivante
  };
  
  export default roleMiddleware;
  