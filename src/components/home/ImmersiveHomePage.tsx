
import React, { useEffect } from 'react';

const ImmersiveHomePage: React.FC = () => {
  useEffect(() => {
    console.log('🏠 ImmersiveHomePage: Composant monté');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center text-white">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold mb-4">EmotionsCare</h1>
        <p className="text-2xl mb-8">Plateforme de bien-être émotionnel</p>
        <div className="max-w-md mx-auto bg-white/20 backdrop-blur-lg rounded-lg p-6">
          <p className="text-lg mb-4">
            Si vous voyez cette page, le composant ImmersiveHomePage est correctement rendu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveHomePage;
