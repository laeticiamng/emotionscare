import React from 'react';

const WorldPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Carte Monde émotionnelle</h1>
      <p className="text-muted-foreground mb-8">
        Visualisation des tendances émotionnelles globales.
      </p>
      <div className="h-96 flex items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">World map placeholder</p>
      </div>
    </div>
  );
};

export default WorldPage;
