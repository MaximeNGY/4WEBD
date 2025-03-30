// tests/globalSetup.js
import { connect } from 'mongoose';
import User from '../models/User.js';

export default async () => {
  // Connexion à la base de données de test
  const mongoUri = 'mongodb://localhost:27017/test_database';
  await connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const existingAdmin = await User.findOne({ email: 'admin@test.com' });
  const existingEventCreator = await User.findOne({ email: 'eventcreator@test.com' });

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

  console.log('✅ Utilisateurs de test créés avec succès.');
  console.log('Base de données de test connectée');
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("MONGO_URI:", process.env.MONGO_URI);
  console.log("PORT:", process.env.PORT);

};
