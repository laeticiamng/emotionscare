import { createBrowserRouter } from 'react-router-dom';

// Page d'accueil simple
const HomePage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        EmotionsCare
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Plateforme de bien-être émotionnel
      </p>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-green-600 font-semibold">
          ✅ Application démarrée avec succès !
        </p>
        <p className="text-gray-500 mt-2">
          Migration JavaScript terminée
        </p>
      </div>
    </div>
  </div>
);

// Routeur minimal
export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '*',
    element: <HomePage />,
  },
]);