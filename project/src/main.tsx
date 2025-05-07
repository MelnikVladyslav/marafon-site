<<<<<<< Updated upstream
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
=======
import React from 'react'
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { LanguageProvider } from './context/LanguageContext'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)
>>>>>>> Stashed changes
