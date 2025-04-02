import mongoose from "mongoose";

export default async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase(); 
  }

  await mongoose.connection.close();

  console.log("📌 Base de données de test déconnectée.");
};