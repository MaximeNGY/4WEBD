// tests/globalSetup.js
import { connect } from 'mongoose';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';

export default async () => {

  process.env.NODE_ENV = 'test';

  
  // Connexion à la base de données de test
  const mongoUri = process.env.MONGO_URI;
  await connect(mongoUri);
  
  const existingUser = await User.findOne({ email: 'user@test.com' });
  const existingAdmin = await User.findOne({ email: 'admin@test.com' });
  const existingEventCreator = await User.findOne({ email: 'eventcreator@test.com' });
  const existingEvent = await Event.findOne({ name: 'TestEventName' });
  
  
  
   // Créer des utilisateurs de test
   if (!existingAdmin) {
    await new User({
      email: 'admin@test.com',
      password: 'adminpassword',
      role: 'admin',
      pseudo: 'AdminPseudo'
    }).save();
  }

  if (!existingEventCreator) {
    await new User({
      email: 'eventcreator@test.com',
      password: 'eventcreatorpassword',
      role: 'eventCreator',
      pseudo: 'EventCreatorPseudo'
    }).save();
  }

  if (!existingUser) {
    await new User({
      email: 'user@test.com',
      password: 'userpassword',
      role: 'user',
      pseudo: 'UserPseudo'
    }).save();
  }

  if (!existingEvent) {
    const eventCreator = await User.findOne({ email: "eventcreator@test.com" });

    await new Event({
      name: 'TestEventName',
      description: 'DescriptionEventTest',
      date: '2024-12-31T00:00:01',
      location: 'Paris',
      maxSeats: 100,
      availableSeats: 6,
      price: 50,
      createdBy: eventCreator._id
    }).save();
  }
  

  const TestUser = await User.findOne({ email: 'user@test.com' });
  const TestEvent = await Event.findOne({ name: 'TestEventName' });

  const existingTicket = await Ticket.findOne({ event:  TestUser._id, user: TestEvent._id  });
  if (!existingTicket) {
    const ticket = new Ticket({
      event: TestEvent._id,  
      user: TestUser._id, 
      quantity: 1,
      totalPrice: TestEvent.price * 1,
    }).save(); 
  }

  console.log('✅ Données de test créés avec succès.');
  console.log('Base de données de test connectée');
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("MONGO_URI:", process.env.MONGO_URI);
  console.log("PORT:", process.env.PORT);

};
