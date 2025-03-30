import express from "express";
import { verifyRole } from "../middlewares/auth.js"; // Auth Middleware
import {
  createEvent,
  getEvent,
  getAllEvents,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";

const router = express.Router();

// Lire tous les événements (accessible à tous)
router.get("/", getAllEvents);

// Lire un événement spécifique (accessible à tous)
router.get("/:id", getEvent);

// Créer un événement (accessible uniquement à eventCreator ou admin)
router.post("/", verifyRole(['eventCreator', 'admin']), createEvent);

// Mettre à jour un événement (accessible uniquement à eventCreator ou admin)
router.put("/:id", verifyRole(['eventCreator', 'admin']), updateEvent);

// Supprimer un événement (accessible uniquement à admin)
router.delete("/:id", verifyRole(['admin']), deleteEvent);

export default router;
