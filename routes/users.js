import { Router } from "express";
import User from "../models/User.js";
const router = Router();

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "67e6fdf8601516f4b62fff91"
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   pseudo:
 *                     type: string
 *                     example: "John Doe"
 *                   role:
 *                     type: string
 *                     enum: ["user", "admin", "eventCreator"]
 *                     example: "admin"
 *       403:
 *         description: Accès refusé (non admin)
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route POST create user
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
