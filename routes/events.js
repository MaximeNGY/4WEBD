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

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Récupère tous les événements
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Liste des événements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Concert"
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-06-20T20:00:00Z"
 */
router.get("/", getAllEvents);

// Lire un événement spécifique (accessible à tous)
router.get("/:id", getEvent);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Créer un événement (nécessite authentification)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Événement créé
 */
router.post("/", verifyRole(['eventCreator', 'admin']), createEvent);

// Mettre à jour un événement (accessible uniquement à eventCreator ou admin)
router.put("/:id", verifyRole(['eventCreator', 'admin']), updateEvent);

// Supprimer un événement (accessible uniquement à admin)
router.delete("/:id", verifyRole(['admin']), deleteEvent);

export default router;
