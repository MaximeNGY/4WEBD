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
 *     responses:
 *       200:
 *         description: Retourne tous les tickets de l'utilisateur courant
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
router.get("/mine", authMiddleware, getMyTickets); // Tickets de l'utilisateur
router.get("/event/:eventId", authMiddleware, getEventTickets); // Tickets d'un événement (EventCreator)
router.get("/all", authMiddleware, getAllTickets); // Tous les tickets (Admin)

export default router;
