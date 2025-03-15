'use client'
import { createContext, useState } from "react";

export const AppContext = createContext(); // Creating context

export function AppProvider({ children }) {
    const [size, setSize] = useState(1);
    const [listening, setListening] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);


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
      }}>
        {children}
      </AppContext.Provider>
    );
  }
  