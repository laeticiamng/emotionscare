import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

// Simple working homepage for the updated template
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EmotionsCare
          </h1>
          <p className="text-2xl text-gray-600 font-light">
            Plateforme moderne de bien-être émotionnel
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Intelligence Émotionnelle</h3>
            <p className="text-gray-600">Développez votre compréhension des émotions</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold mb-2">Bien-être Personnel</h3>
            <p className="text-gray-600">Outils pour votre santé mentale</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Dernière Version Lovable</h3>
            <p className="text-gray-600">Template mis à jour avec nouvelles fonctionnalités</p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-green-50 rounded-2xl border border-green-200">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">✅</span>
            <h2 className="text-2xl font-bold text-green-800">Template Lovable Mis à Jour!</h2>
          </div>
          <div className="text-green-700 space-y-2">
            <p>• Configuration Vite optimisée pour la dernière version</p>
            <p>• Système d'icônes moderne avec fallbacks</p>
            <p>• Build configuration stable</p>
            <p>• Prêt pour les nouvelles fonctionnalités Lovable</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Accéder au Dashboard
          </button>
          <button 
            onClick={() => console.log('Guide de démarrage')}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            Guide de Démarrage
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple dashboard component
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard EmotionsCare</h1>
          <p className="text-gray-600">Interface moderne mise à jour avec le dernier template Lovable</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">📊 Analyses</h3>
            <p className="text-gray-600 mb-4">Visualisez vos données émotionnelles</p>
            <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-4xl">📈</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">🎵 Musique Thérapeutique</h3>
            <p className="text-gray-600 mb-4">Musique adaptée à votre humeur</p>
            <div className="h-32 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-4xl">🎧</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">🧘 Méditation</h3>
            <p className="text-gray-600 mb-4">Exercices de pleine conscience</p>
            <div className="h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <span className="text-4xl">🕯️</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;