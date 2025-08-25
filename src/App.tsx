import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Page d'accueil progressive avec authentification
const HomePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">EmotionsCare</h1>
        <p className="text-xl text-muted-foreground">Votre plateforme de bien-être émotionnel</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Scan Émotionnel */}
        <div className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🧠</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Scan Émotionnel</h3>
          <p className="text-muted-foreground mb-4">Analysez vos émotions en temps réel avec notre IA</p>
          <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
            Commencer le scan
          </button>
        </div>

        {/* Musicothérapie */}
        <div className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🎵</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Musicothérapie</h3>
          <p className="text-muted-foreground mb-4">Écoutez des musiques adaptées à votre état émotionnel</p>
          <button className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-lg hover:bg-secondary/90 transition-colors">
            Explorer la musique
          </button>
        </div>

        {/* Journal Émotionnel */}
        <div className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Journal Émotionnel</h3>
          <p className="text-muted-foreground mb-4">Tenez un journal de vos émotions et suivez vos progrès</p>
          <button className="w-full bg-accent text-accent-foreground py-2 px-4 rounded-lg hover:bg-accent/90 transition-colors">
            Ouvrir le journal
          </button>
        </div>

        {/* Coach IA */}
        <div className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Coach IA</h3>
          <p className="text-muted-foreground mb-4">Recevez des conseils personnalisés de notre IA</p>
          <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
            Parler au coach
          </button>
        </div>

        {/* Exercices de respiration */}
        <div className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🫁</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Respiration</h3>
          <p className="text-muted-foreground mb-4">Pratiquez des exercices de respiration guidés</p>
          <button className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-lg hover:bg-secondary/90 transition-colors">
            Commencer
          </button>
        </div>

        {/* VR Therapy */}
        <div className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🥽</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Thérapie VR</h3>
          <p className="text-muted-foreground mb-4">Immersion thérapeutique en réalité virtuelle</p>
          <button className="w-full bg-accent text-accent-foreground py-2 px-4 rounded-lg hover:bg-accent/90 transition-colors">
            Lancer l'expérience
          </button>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  console.log('📱 App: EmotionsCare - Version complète progressive');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="emotions-care-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/login" 
                element={
                  <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="p-8 bg-card rounded-xl shadow-lg">
                      <h2 className="text-2xl font-bold mb-4">Connexion</h2>
                      <p>Page de connexion à implémenter</p>
                    </div>
                  </div>
                } 
              />
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-foreground mb-2">Page non trouvée</h2>
                      <p className="text-muted-foreground">La page que vous cherchez n'existe pas.</p>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;