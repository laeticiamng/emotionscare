// Configuration temporaire pour exclure les composants problématiques
// Cette approche permet de garder l'application fonctionnelle
// tout en préservant le code existant pour référence future

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import SimpleIndexPage from './components/SimpleIndexPage';
import UnifiedDashboard from './components/UnifiedDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<SimpleIndexPage />} />
              <Route path="/dashboard" element={<UnifiedDashboard />} />
              {/* Route par défaut pour toutes les autres pages */}
              <Route path="*" element={<SimpleIndexPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;