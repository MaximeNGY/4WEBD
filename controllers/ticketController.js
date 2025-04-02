import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import logger from "../config/logger.js";

/**
 * Voir les tickets de l'utilisateur connecté
 */
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).populate("event", "name date location price");
    res.json(tickets);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Voir les tickets d'un événement (uniquement pour l'EventCreator)
 */
export const getEventTickets = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Événement introuvable" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const tickets = await Ticket.find({ event: req.params.eventId }).populate("user", "email");

    res.status(200).json(tickets);
    
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Voir tous les tickets (Admin seulement)
 */
export const getAllTickets = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const tickets = await Ticket.find().populate("user", "email").populate("event", "name date location");
    res.json(tickets);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Achat de tickets pour un événement
 */
export const buyTicket = async (req, res) => {
    try {
      const { eventId, quantity } = req.body;
      const userId = req.user.id;
  
      if (!eventId || !quantity) {
        return res.status(400).json({ message: "Event ID et quantité requis" });
      }
  
      const event = await Event.findById(eventId);
      logger.info(`Price event ${event.price}`)
      if (!event) {
        return res.status(404).json({ message: "Événement introuvable" });
      }
  
      if (event.availableSeats < quantity) {
        return res.status(400).json({ message: "Pas assez de places disponibles" });
      }
  
      const totalPrice = quantity * event.price;
  
      logger.info(`💳 Paiement simulé de ${totalPrice}€ pour ${quantity} tickets de l'événement ${event.name}`);
  
      const ticket = await Ticket.create({
        event: eventId,
        user: userId,
        quantity,
        totalPrice,
      });

      event.availableSeats -= quantity;
      await event.save();
  
      res.status(201).json({
        message: "Achat réussi",
        ticket,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Erreur serveur" });
    }
};
