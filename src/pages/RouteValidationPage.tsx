import React, { useEffect, useState } from 'react';
import { ROUTE_MANIFEST } from '@/router/buildUnifiedRoutes';
import { validateRoutesUniqueness, findDuplicateRoutes } from '@/utils/routeValidator';
import { RoutesApi } from '@/api/routes';

const RouteValidationPage: React.FC = () => {
  const [validation, setValidation] = useState(validateRoutesUniqueness());
  const [apiHealth, setApiHealth] = useState<any>(null);

  useEffect(() => {
    const loadApiHealth = async () => {
      try {
        const health = await RoutesApi.getHealth();
        setApiHealth(health);
      } catch (error) {
        console.error('Erreur lors du chargement de la santé des routes:', error);
      }
    };

    loadApiHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔍 Validation des Routes</h1>
          <p className="text-xl text-blue-100">
            Diagnostic complet du système de routage EmotionsCare
          </p>
        </div>

        {/* Status Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-lg ${validation.valid ? 'bg-green-500/20 border-green-400' : 'bg-red-500/20 border-red-400'} border`}>
            <h3 className="text-2xl font-bold mb-2">
              {validation.valid ? '✅ Aucun doublon' : '🚨 Doublons détectés'}
            </h3>
            <p className="text-lg">
              Total des routes: {validation.totalRoutes}
            </p>
            {!validation.valid && (
              <div className="mt-3">
                <p className="font-semibold text-red-300">Routes en doublon:</p>
                <ul className="list-disc list-inside mt-2">
                  {validation.duplicates.map((duplicate, index) => (
                    <li key={index} className="text-red-200">{duplicate}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white/10 p-6 rounded-lg border border-white/20">
            <h3 className="text-2xl font-bold mb-2">📊 Statistiques</h3>
            <div className="space-y-2">
              <p>Routes uniques: {new Set(ROUTE_MANIFEST).size}</p>
              <p>Routes totales: {ROUTE_MANIFEST.length}</p>
              <p>Différence: {ROUTE_MANIFEST.length - new Set(ROUTE_MANIFEST).size}</p>
            </div>
          </div>
        </div>

        {/* API Health Status */}
        {apiHealth && (
          <div className="mb-8 p-6 bg-white/10 rounded-lg border border-white/20">
            <h3 className="text-2xl font-bold mb-4">🏥 Santé de l'API Routes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold">Status:</p>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  apiHealth.status === 'healthy' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {apiHealth.status}
                </span>
              </div>
              <div>
                <p className="font-semibold">Total Routes:</p>
                <p className="text-lg">{apiHealth.totalRoutes}</p>
              </div>
              <div>
                <p className="font-semibold">Timestamp:</p>
                <p className="text-sm">{new Date(apiHealth.timestamp).toLocaleString()}</p>
              </div>
            </div>
            
            {apiHealth.duplicates && apiHealth.duplicates.length > 0 && (
              <div className="mt-4 p-4 bg-red-500/20 rounded-lg border border-red-400">
                <p className="font-semibold text-red-300 mb-2">Doublons API détectés:</p>
                <ul className="list-disc list-inside">
                  {apiHealth.duplicates.map((dup: string, index: number) => (
                    <li key={index} className="text-red-200">{dup}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Liste des Routes */}
        <div className="bg-white/10 p-6 rounded-lg border border-white/20">
          <h3 className="text-2xl font-bold mb-4">📋 Toutes les Routes ({ROUTE_MANIFEST.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {ROUTE_MANIFEST.map((route, index) => {
              const isDuplicate = validation.duplicates.includes(route);
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm font-mono ${
                    isDuplicate 
                      ? 'bg-red-500/20 border border-red-400 text-red-200' 
                      : 'bg-gray-700/30 text-gray-200'
                  }`}
                >
                  {route}
                  {isDuplicate && <span className="ml-2 text-red-400">⚠️</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors mr-4"
          >
            🔄 Revalider
          </button>
          <a
            href="/"
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            🏠 Retour Accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default RouteValidationPage;