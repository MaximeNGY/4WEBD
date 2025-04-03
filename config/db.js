import mongoose from 'mongoose';
import dotenv from 'dotenv';
import initializeDatabase from '../scripts/initData.js';

let isDBConnected = false; 

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
    isDBConnected = true;
    console.log(`MongoDB connecté : ${conn.connection.host}`);

    await initializeDatabase();

  } catch (error) {
    console.error(`❌ Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export function checkDBConnection() {
  return isDBConnected;
}

export default connectDB;
