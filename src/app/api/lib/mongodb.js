import mongoose from "mongoose";

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

// Global cache to store the connection
let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached; // Ensure global cache is used

export async function connectToMongoDB() {
  if (cached.conn) return cached.conn; // Return cached connection if available

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Prevents mongoose from buffering commands
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("🔥 MongoDB Connected!");
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Failed:", error);
    throw error;
  }

  return cached.conn;
}
