import React from 'react';
import AppProviders from './AppProviders';

function App() {
  return (
    <AppProviders>
      <div className="min-h-screen bg-background text-foreground">
        <header className="p-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            EmotionsCare
          </h1>
          <p className="text-lg text-muted-foreground">
            Plateforme de bien-être émotionnel
          </p>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Mode Particulier</h2>
              <p className="text-muted-foreground">
                Suivi personnel du bien-être émotionnel
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Mode Collaborateur</h2>
              <p className="text-muted-foreground">
                Outils de bien-être en entreprise
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Mode Administrateur</h2>
              <p className="text-muted-foreground">
                Gestion RH et analytics
              </p>
            </div>
          </div>
        </main>
      </div>
    </AppProviders>
  );
}

export default App;