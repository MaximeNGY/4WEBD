import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { getMyTickets, getEventTickets, getAllTickets, buyTicket } from "../controllers/ticketController.js";

const router = express.Router();

/**
 * @swagger
 * /api/tickets/buy:
 *   post:
 *     summary: Ajoute un tickets dans la BDD et décompte les places disponibles
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Créer un tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   eventId:
 *                     type: string
 *                     example: "67e9bec457c8af0388b38766"
 *                   quantity:
 *                     type: number
 *                     example: 2
 */
router.post("/buy", authMiddleware, buyTicket); // Achat d'un ticket

/**
 * @swagger
 * /api/tickets/mine:
 *   get:
 *     summary: Retourne les tickets de l'utilisateur
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des tickets achetés par l'utilisateur connecté
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "67ec329b9cc91b42cb8123ed"
 *                   event:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "67ec328d9cc91b42cb8123ea"
 *                       name:
 *                         type: string
 *                         example: "nameTest3"
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-30T00:00:00.000Z"
 *                       location:
 *                         type: string
 *                         example: "Berlin"
 *                       price:
 *                         type: number
 *                         example: 50
 *                   user:
 *                     type: string
 *                     example: "67e6fdf8601516f4b62fff91"
 *                   quantity:
 *                     type: integer
 *                     example: 2
 *                   totalPrice:
 *                     type: number
 *                     example: 100
 *                   purchaseDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-01T18:38:19.519Z"
 */
router.get("/mine", authMiddleware, getMyTickets); // Tickets de l'utilisateur

/**
 * @swagger
 * /api/tickets/event/{eventId}:
 *   get:
 *     summary: Retourne les tickets d'un événement spécifique
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement
 *     responses:
 *       200:
 *         description: Liste des tickets achetés pour un événement donné
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "67ec329b9cc91b42cb8123ed"
 *                   event:
 *                     type: string
 *                     example: "67ec328d9cc91b42cb8123ea"
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "67e6fdf8601516f4b62fff91"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                   quantity:
 *                     type: integer
 *                     example: 2
 *                   totalPrice:
 *                     type: number
 *                     example: 100
 *                   purchaseDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-01T18:38:19.519Z"
 */
router.get("/event/:eventId", authMiddleware, getEventTickets); // Tickets d'un événement (EventCreator)

/**
 * @swagger
 * /api/tickets/all:
 *   get:
 *     summary: Retourne tous les tickets du système (Admin uniquement)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste complète des tickets achetés dans le système
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "67ec329b9cc91b42cb8123ed"
 *                   event:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "67ec328d9cc91b42cb8123ea"
 *                       name:
 *                         type: string
 *                         example: "nameTest3"
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-30T00:00:00.000Z"
 *                       location:
 *                         type: string
 *                         example: "Berlin"
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "67e6fdf8601516f4b62fff91"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                   quantity:
 *                     type: integer
 *                     example: 2
 *                   totalPrice:
 *                     type: number
 *                     example: 100
 *                   purchaseDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-01T18:38:19.519Z"
 *       403:
 *         description: Accès refusé (non admin)
 */
router.get("/all", authMiddleware, getAllTickets); // Tous les tickets (Admin)

export default router;
