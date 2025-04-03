import User from '../models/User.js';
import jwt from 'jsonwebtoken';

let adminToken;
let eventCreatorToken;
let eventId;

// Avant les tests, créer les utilisateurs et récupérer les tokens
beforeAll(async () => {

  // Trouver les utilisateurs ou les créer
  const admin = await User.findOne({ email: 'admin@test.com' }).select("+role");
  const eventCreator = await User.findOne({ email: 'eventcreator@test.com' }).select("+role");

  if (!admin || !eventCreator) {
    throw new Error("⚠️ Les utilisateurs de test ne sont pas trouvés !");
  }

  // Récupérer les tokens d'authentification
  adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  eventCreatorToken = jwt.sign({ id: eventCreator._id, role: eventCreator.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

describe("Test Event Routes", () => {

  // Test pour la route GET /api/events
  it("should get all events", async () => {
    const res = await global.api.get("/api/events");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Test pour la route POST /api/events (création d'événement) en tant qu'eventCreator
  it("should create an event (as eventCreator)", async () => {
    const res = await global.api
      .post("/api/events")
      .set("Authorization", `Bearer ${eventCreatorToken}`)
      .send({
        name: "Concert Test",
        description: "test desc",
        date: "2025-06-20T20:00:00Z",
        location: "Salle XYZ, Arena Paris",
        maxSeats: 200,
        availableSeats: 15,
        price: 50
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("name", "Concert Test");
    eventId = res.body._id;
  });

  // Test pour la route PUT /api/events/:id (mise à jour d'événement) en tant qu'eventCreator
  it("should update an event (as eventCreator)", async () => {
    const res = await global.api
      .put(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${eventCreatorToken}`)
      .send({
        name: "Updated Concert Test",
        date: "2025-06-22T20:00:00Z",
        location: "Salle ABC",
        price: 70
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Updated Concert Test");
  });

  // Test pour la route DELETE /api/events/:id (suppression d'événement) en tant qu'admin
  it("should delete an event (as admin)", async () => {
    const res = await global.api
      .delete(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Événement supprimé avec succès");
  });
});
