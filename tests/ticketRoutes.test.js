import supertest from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';
import jwt from 'jsonwebtoken';

let api;
let adminToken;
let userToken;
let eventCreatorToken;
let eventId;

// Avant les tests, créer les utilisateurs et récupérer les tokens
beforeAll(async () => {

  // Trouver les utilisateurs ou les créer
  const user = await User.findOne({ email: "user@test.com" }).select("+role");
  const admin = await User.findOne({ email: 'admin@test.com' }).select("+role");
  const eventCreator = await User.findOne({ email: 'eventcreator@test.com' }).select("+role");
  const TestEvent = await Event.findOne({ name: 'TestEventName' }).select("+role");
  const TestTicket = await Ticket.findOne({ event: TestEvent._id, user: user._id}).select("+role");

  if (!admin || !user || !TestEvent) {
    throw new Error("⚠️ Les utilisateurs de test ne sont pas trouvés !");
  }

  // Récupérer les tokens d'authentification
  userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  eventCreatorToken = jwt.sign({ id: eventCreator._id, role: eventCreator.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  eventId= TestEvent._id;

  // Lancer le serveur de test
  api = supertest(app);
});

// 🧪 TESTS TICKETS
describe("🧪 Test des routes Tickets", () => {
  
    it("✅ Achat d'un ticket (utilisateur authentifié)", async () => {
      const res = await api
        .post("/api/tickets/buy")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          eventId: eventId,
          quantity: 2,
        });
  
      expect(res.statusCode).toBe(201);
    });
  
    it("❌ Achat d'un ticket sans token", async () => {
      const res = await api.post("/api/tickets/buy").send({
        eventId: eventId,
        quantity: 2,
      });
  
      expect(res.statusCode).toBe(401);
    });
  
    it("✅ Récupération des tickets de l'utilisateur", async () => {
      const res = await api
        .get("/api/tickets/mine")
        .set("Authorization", `Bearer ${userToken}`);
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
    it("✅ Récupération des tickets d'un événement", async () => {
      const res = await api
        .get(`/api/tickets/event/${eventId}`)
        .set("Authorization", `Bearer ${eventCreatorToken}`);
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
    it("❌ Accès refusé pour récupérer tous les tickets sans être admin", async () => {
      const res = await api
        .get("/api/tickets/all")
        .set("Authorization", `Bearer ${userToken}`);
  
      expect(res.statusCode).toBe(403);
    });
  
    it("✅ Accès autorisé pour récupérer tous les tickets (admin)", async () => {
      const res = await api
        .get("/api/tickets/all")
        .set("Authorization", `Bearer ${adminToken}`);
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
  });
  
