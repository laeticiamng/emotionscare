
import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    console.log('🏠 Home: Composant Home monté');
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Page d'accueil</h1>
      <p className="mb-4">
        Si vous voyez ce texte, la page d'accueil est correctement rendue.
      </p>
    </div>
  );
};

export default Home;
