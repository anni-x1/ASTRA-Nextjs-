import "./globals.css";
import { AppProvider } from "./context";
import React from 'react'
import Navbar from './components/Navbar.jsx'
export const metadata = {
  title: "Astra",
  description: "Astra your personal AI assistant.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
