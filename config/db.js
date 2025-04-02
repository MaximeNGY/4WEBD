import mongoose from 'mongoose';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: './.env.test' });
} else {
  dotenv.config();
}

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI;
    console.log("🔎 MONGO_URI utilisé dans db.js:", process.env.MONGO_URI);
    
    const conn = await mongoose.connect(dbURI);
    
    console.log(`MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
