
import React from 'react';

console.log('%c[HomePage] Loading HomePage component', 'color:orange; font-weight:bold');

const HomePage: React.FC = () => {
  console.log('%c[HomePage] mounted', 'color:lime; font-weight:bold');
  
  React.useEffect(() => {
    console.log('%c[HomePage] useEffect mounted', 'color:cyan; font-weight:bold');
    return () => console.log('%c[HomePage] useEffect unmounted', 'color:red');
  }, []);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 text-white">EmotionsCare</h1>
          <p className="text-2xl mb-8 text-blue-100">
            Page d'accueil fonctionnelle - Test réussi !
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-green-300">✅ HomePage Active</h2>
            <p className="text-lg text-blue-100">
              La page d'accueil s'affiche correctement maintenant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
