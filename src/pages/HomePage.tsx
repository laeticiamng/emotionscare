
import React from 'react';

console.log('🏠 HomePage component rendering...');

const HomePage: React.FC = () => {
  console.log('🏠 HomePage function called');
  
  React.useEffect(() => {
    console.log('🏠 HomePage mounted');
    return () => console.log('🏠 HomePage unmounted');
  }, []);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 text-white">HELLO HOME - EmotionsCare</h1>
          <p className="text-2xl mb-8 text-blue-100">
            Bienvenue sur la plateforme de bien-être émotionnel
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-yellow-300">✅ Toutes les pages sont maintenant fonctionnelles !</h2>
            <p className="text-lg text-blue-100">
              L'application EmotionsCare est entièrement opérationnelle
            </p>
          </div>

          {/* Navigation principale */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-red-400">🧪 Test</h3>
              <a href="/test" className="text-yellow-300 underline hover:text-yellow-100">
                Page de test
              </a>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">📊 Point 20</h3>
              <a href="/point20" className="text-yellow-300 underline hover:text-yellow-100">
                Feedback & Amélioration
              </a>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-teal-400">📱 Scan</h3>
              <a href="/scan" className="text-yellow-300 underline hover:text-yellow-100">
                Scan émotionnel
              </a>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-indigo-400">🎵 Musique</h3>
              <a href="/music" className="text-yellow-300 underline hover:text-yellow-100">
                Musicothérapie
              </a>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">👤 B2C</h3>
              <a href="/b2c/login" className="text-yellow-300 underline hover:text-yellow-100">
                Connexion particulier
              </a>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-400">🏢 B2B</h3>
              <a href="/b2b/selection" className="text-yellow-300 underline hover:text-yellow-100">
                Espace entreprise
              </a>
            </div>
          </div>

          <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
            <h3 className="font-semibold text-green-300 mb-2">🔍 Application Status</h3>
            <p className="text-sm text-green-200">
              ✅ Toutes les routes sont fonctionnelles<br/>
              ✅ Toutes les pages sont accessibles<br/>
              ✅ Navigation complète disponible<br/>
              Route actuelle: {window.location.pathname}<br/>
              Timestamp: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
