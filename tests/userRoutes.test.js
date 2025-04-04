import User from '../models/User.js';
import jwt from 'jsonwebtoken';

let userToken;
let adminToken;

// Avant les tests, créer les utilisateurs et récupérer les tokens
beforeAll(async () => {

  // Trouver les utilisateurs ou les créer
  const user = await User.findOne({ email: 'user@test.com' }).select("+role");
  const admin = await User.findOne({ email: 'admin@test.com' }).select("+role");

  if (!admin || !user) {
    throw new Error("⚠️ Les utilisateurs de test ne sont pas trouvés !");
  }

  // Récupérer les tokens d'authentification
  userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });



});

describe("Users API", () => {
  test("✅ Devrait récupérer les informations de l'utilisateur connecté (/me)", async () => {
    const res = await global.api
      .get("/api/users/me")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "user@test.com");
    expect(res.body).toHaveProperty("pseudo", "UserPseudo");
  });

  test("❌ Devrait renvoyer une erreur 401 si aucun token n'est fourni (/me)", async () => {
    const res = await global.api.get("/api/users/me");
    expect(res.statusCode).toBe(401);
  });

  test("✅ Un admin peut récupérer la liste des utilisateurs (/)", async () => {
    const res = await global.api
      .get("/api/users/")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("❌ Un utilisateur normal ne peut pas voir la liste des utilisateurs (/)", async () => {
    const res = await global.api
      .get("/api/users/")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test("✅ Devrait créer un nouvel utilisateur", async () => {
    const res = await global.api.post("/api/users/")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "newuser@test.com",
        pseudo: "NewUser",
        password: "password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("email", "newuser@test.com");
  });

  test("✅ Un admin peut supprimer un utilisateur (/api/users/:id)", async () => {

    // 1. Créer un utilisateur à supprimer
    const newUserRes = await global.api
      .post("/api/users/")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "tobedeleted@test.com",
        pseudo: "ToDelete",
        password: "password123",
        role: "user"
      });
    expect(newUserRes.statusCode).toBe(201);

    const userId = newUserRes.body._id;

    // Supprimer l'utilisateur
    const deleteRes = await global.api
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toHaveProperty("message", "Utilisateur supprimé avec succès");
  });
});