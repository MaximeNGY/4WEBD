import { verify } from "jsonwebtoken";

export default function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Accès refusé, token manquant" });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token invalide" });
  }
};
