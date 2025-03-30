import Event from "../models/Event.js";
import logger from "../config/logger.js";


// Récupérer tous les événements
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    logger.error(`❌ Erreur lors de la récupération des événements : ${err.message}`);
    res.status(500).json({ message: "Erreur lors de la récupération des événements" });
  }
};

// Récupérer un événement spécifique
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    res.status(200).json(event);
  } catch (err) {
    logger.error(`❌ Erreur lors de la récupération de l'événement : ${err.message}`);
    res.status(500).json({ message: "Erreur lors de la récupération de l'événement" });
  }
};

// Créer un nouvel événement
export const createEvent = async (req, res) => {
  const { name,description, date, location, maxSeats, availableSeats } = req.body;
  try {
    const event = new Event({
      name,
      description,
      date,
      location,
      maxSeats,
      availableSeats,
      createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    logger.error(`❌ Erreur lors de la création de l'événement : ${err.message}`);
    res.status(500).json({ message: "Erreur lors de la création de l'événement" });
  }
};

// Mettre à jour un événement existant
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    // Vérifier si l'utilisateur est autorisé à modifier cet événement
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Accès interdit : vous ne pouvez pas modifier cet événement" });
    }

    event.name = req.body.name || event.name;
    event.date = req.body.date || event.date;
    event.location = req.body.location || event.location;
    event.capacity = req.body.capacity || event.capacity;
    event.price = req.body.price || event.price;

    await event.save();
    res.status(200).json(event);
  } catch (err) {
    logger.error(`❌ Erreur lors de la mise à jour de l'événement : ${err.message}`);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'événement" });
  }
};

// Supprimer un événement
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    // Vérifier si l'utilisateur est administrateur
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Accès interdit : vous ne pouvez pas supprimer cet événement" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Événement supprimé avec succès" });
  } catch (err) {
    logger.error(`❌ Erreur lors de la suppression de l'événement : ${err.message}`);
    res.status(500).json({ message: "Erreur lors de la suppression de l'événement" });
  }
};
