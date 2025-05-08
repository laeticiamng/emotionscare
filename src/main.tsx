
import { createRoot } from 'react-dom/client';
import React from 'react';

// 1️⃣ Stub racine pour isoler l'erreur
function RootStub() {
  return (
    <div style={{ padding: '2rem', background: '#cff' }}>
      ✅ RootStub OK
    </div>
  );
}

const initializeApp = () => {
  console.info(`🚀 Application EmotionsCare - Démarrage [${new Date().toISOString()}]`);
  console.info(`📌 Version: ${import.meta.env.VITE_APP_VERSION || '1.0.0'}`);
  console.info(`📌 Environnement: ${import.meta.env.MODE}`);
  
  // Get root element
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("❌ Root element not found! Application cannot start.");
    return;
  }
  
  // Create and render root with stub component
  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <RootStub />
    </React.StrictMode>
  );
  
  console.info("✅ Application initialization with RootStub completed");
};

// Start the application
initializeApp();
