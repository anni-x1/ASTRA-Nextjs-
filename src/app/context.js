'use client'
import { createContext, useState, useEffect } from "react";

export const AppContext = createContext(); // Creating context

export function AppProvider({ children }) {
  const [size, setSize] = useState(1);
  const [listening, setListening] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [personality, setPersonality] = useState(null);
  const [messages, setMessages] = useState([]); // ✅ Default empty array

  useEffect(() => {
    if (user && user.transcriptions && user.transcriptions.length > 0) {
      setMessages(user.transcriptions);
    }
  }, [messages]); // ✅ Depend only on `user`, not `user.transcriptions`

  return (
    <AppContext.Provider value={{
      size,
      setSize,
      listening,
      setListening,
      authenticated,
      setAuthenticated,
      user,
      setUser,
      audioBlob,
      setAudioBlob,
      thinking,
      setThinking,
      personality,
      setPersonality,
      messages,
      setMessages,
    }}>
      {children}
    </AppContext.Provider>
  );
}
