import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Version progressive - étape 1: React Router + TanStack Query
function App() {
  console.log('📱 App: Version progressive - React Router OK');
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background p-4">
          <h1 className="text-2xl font-bold mb-4">EmotionsCare</h1>
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="p-8 bg-white rounded-lg shadow">
                  <h2 className="text-xl mb-4">Tableau de bord</h2>
                  <p className="text-gray-600">Application fonctionnelle avec React Router</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded">
                      <h3 className="font-semibold">Scan Émotionnel</h3>
                      <p className="text-sm text-gray-600">Analysez vos émotions</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded">
                      <h3 className="font-semibold">Musicothérapie</h3>
                      <p className="text-sm text-gray-600">Écoutez des musiques adaptées</p>
                    </div>
                  </div>
                </div>
              } 
            />
            <Route 
              path="*" 
              element={
                <div className="p-8 text-center">
                  <h2 className="text-xl text-red-500">Page non trouvée</h2>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;