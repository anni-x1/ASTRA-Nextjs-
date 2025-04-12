import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  personalityId: { type: Number, required: true }, // ID of the personality
  personalityName: { type: String, required: true }, // Personality name (e.g., Luna)
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password recommended
  transcriptions: [
    {
      role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    }
  ], // Array of transcriptions
  chats: [ChatSchema] // Array of chat sessions, each linked to a personality
});

// Check if the model exists before compiling it
const User = mongoose.models.AstraUser || mongoose.model('AstraUser', UserSchema);

export default User;
