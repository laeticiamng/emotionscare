
import React from 'react';

const MusicotherapiePage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Musicothérapie</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Thérapie Musicale</h2>
            <p className="text-muted-foreground mb-4">
              Découvrez le pouvoir de guérison de la musique
            </p>
            {/* TODO: Implémenter l'interface de musicothérapie complète */}
            <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"></div>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Playlist Adaptative</h2>
            <p className="text-muted-foreground">
              Musique personnalisée selon votre état émotionnel
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MusicotherapiePage;
