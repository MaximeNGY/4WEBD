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

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Récupère les détails d'un événement
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement à récupérer
 *     responses:
 *       200:
 *         description: Détails de l'événement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "67ec328d9cc91b42cb8123ea"
 *                 name:
 *                   type: string
 *                   example: "nameTest3"
 *                 description:
 *                   type: string
 *                   example: "description"
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-30T00:00:00.000Z"
 *                 location:
 *                   type: string
 *                   example: "Berlin"
 *                 maxSeats:
 *                   type: integer
 *                   example: 100
 *                 availableSeats:
 *                   type: integer
 *                   example: 13
 *                 price:
 *                   type: number
 *                   example: 50
 *                 createdBy:
 *                   type: string
 *                   example: "67e6fdf8601516f4b62fff91"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-01T18:38:05.202Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-01T18:38:19.521Z"
 *       404:
 *         description: Événement introuvable
 */
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

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Met à jour un événement
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nouveau nom de l'événement"
 *               description:
 *                 type: string
 *                 example: "Nouvelle description"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T20:00:00.000Z"
 *               location:
 *                 type: string
 *                 example: "Paris"
 *               maxSeats:
 *                 type: integer
 *                 example: 200
 *               availableSeats:
 *                 type: integer
 *                 example: 150
 *               price:
 *                 type: number
 *                 example: 75
 *     responses:
 *       200:
 *         description: Événement mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "67ec328d9cc91b42cb8123ea"
 *                 name:
 *                   type: string
 *                   example: "Nouveau nom de l'événement"
 *                 description:
 *                   type: string
 *                   example: "Nouvelle description"
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-31T20:00:00.000Z"
 *                 location:
 *                   type: string
 *                   example: "Paris"
 *                 maxSeats:
 *                   type: integer
 *                   example: 200
 *                 availableSeats:
 *                   type: integer
 *                   example: 150
 *                 price:
 *                   type: number
 *                   example: 75
 *                 createdBy:
 *                   type: string
 *                   example: "67e6fdf8601516f4b62fff91"
 *       403:
 *         description: Accès refusé (non eventCreator ou admin)
 *       404:
 *         description: Événement introuvable
 */
router.put("/:id", verifyRole(['eventCreator', 'admin']), updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Supprime un événement (Admin uniquement)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement à supprimer
 *     responses:
 *       200:
 *         description: Événement supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Événement supprimé avec succès"
 *       403:
 *         description: Accès refusé (non admin)
 *       404:
 *         description: Événement introuvable
 */
router.delete("/:id", verifyRole(['admin']), deleteEvent);

export default router;
