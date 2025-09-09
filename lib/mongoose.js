// lib/mongoose.js
import mongoose from "mongoose";

console.log("MONGO_URI from env:", process.env.MONGO_URI);
const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGO_URI in environment variables");
}

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
