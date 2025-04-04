import { Router } from "express";
import { authMiddleware, verifyRole } from "../middlewares/auth.js";
import { getUsers, getMe, createUser, deleteUser } from "../controllers/usersController.js";

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
router.get("/", authMiddleware, verifyRole("admin"), getUsers);


/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Récupère les informations de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur connecté
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "67e6fdf8601516f4b62fff91"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 pseudo:
 *                   type: string
 *                   example: "John Doe"
 *                 role:
 *                   type: string
 *                   enum: ["user", "admin", "eventCreator"]
 *                   example: "user"
 *       401:
 *         description: Non authentifié
 */
router.get("/me", authMiddleware, getMe);

/**
 * @swagger
 * /api/users/:
 *   post:
 *     summary: Créer un nouvel utilisateur (admin uniquement)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - pseudo
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *               pseudo:
 *                 type: string
 *                 example: "NewUser"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               role:
 *                 type: string
 *                 enum: ["user", "admin", "eventCreator"]
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "67e6fdf8601516f4b62fff91"
 *                 email:
 *                   type: string
 *                   example: "newuser@example.com"
 *                 pseudo:
 *                   type: string
 *                   example: "NewUser"
 *                 role:
 *                   type: string
 *                   enum: ["user", "admin", "eventCreator"]
 *                   example: "user"
 *       400:
 *         description: Erreur de validation des données
 */
router.post("/", verifyRole("admin"), createUser);


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur par son ID (admin uniquement)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *         schema:
 *           type: string
 *           example: "6613f45fd862e6e2e1bc1234"
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur supprimé avec succès"
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", verifyRole("admin"), deleteUser);

export default router;