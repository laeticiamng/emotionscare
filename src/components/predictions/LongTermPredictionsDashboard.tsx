/**
 * Long-Term Predictions Dashboard - Phase 4.2
 * Dashboard principal pour les prédictions IA long-terme
 */

import { RefreshCw, Calendar, TrendingUp } from 'lucide-react';
import { usePredictions, usePredictionsLoading, usePredictionsActions } from '@/contexts/PredictionsContext';
import { EmotionalForecastChart } from './EmotionalForecastChart';
import { PredictionRisksAndOpportunities } from './PredictionRisksAndOpportunities';
import { PredictionInsightsAndPatterns } from './PredictionInsightsAndPatterns';
import { cn } from '@/lib/utils';

export function LongTermPredictionsDashboard() {
  const { forecast, timeframe } = usePredictions();
  const { loading, error, lastRefresh } = usePredictionsLoading();
  const { changeTimeframe, refresh } = usePredictionsActions();

  if (loading && !forecast) {
    return <PredictionLoadingState />;
  }

  if (error && !forecast) {
    return <PredictionErrorState error={error} onRetry={refresh} />;
  }

  if (!forecast) {
    return <PredictionEmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prédictions Émotionnelles</h1>
            <p className="text-gray-600 mt-1">
              Analyse IA des tendances et prévisions pour votre bien-être
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            {loading ? 'Actualisation...' : 'Actualiser'}
          </button>
        </div>

        {/* Infos supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-600">Période analysée</p>
              <p className="font-semibold text-gray-900">
                {forecast.dataPoints} points de données
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Confiance</p>
              <p className="font-semibold text-gray-900">
                {Math.round(forecast.confidence * 100)}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-blue-600">🔄</div>
            <div>
              <p className="text-sm text-gray-600">Dernier calcul</p>
              <p className="font-semibold text-gray-900">
                {lastRefresh ? lastRefresh.toLocaleDateString('fr-FR') : 'Jamais'}
              </p>
            </div>
          </div>
        </div>

        {/* Sélecteur de timeframe */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Période de prédiction:</span>
          <div className="flex gap-2">
            {(['3months', '6months', '12months'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => changeTimeframe(tf)}
                className={cn(
                  'px-4 py-2 rounded-lg font-semibold transition-colors',
                  timeframe === tf
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {tf === '3months'
                  ? '3 mois'
                  : tf === '6months'
                    ? '6 mois'
                    : '12 mois'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message d'erreur si présent */}
      {error && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Attention:</strong> {error}
          </p>
        </div>
      )}

      {/* Graphiques et visualisations */}
      <EmotionalForecastChart forecast={forecast} />

      {/* Insights et patterns */}
      <PredictionInsightsAndPatterns forecast={forecast} />

      {/* Risques et opportunités */}
      <PredictionRisksAndOpportunities forecast={forecast} />

      {/* Section recommandations finales */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Recommandations Personnalisées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white bg-opacity-10 rounded-lg">
            <h3 className="font-semibold mb-2">🎯 À court terme (1 mois)</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Suivre quotidiennement vos émotions avec nos scans</li>
              <li>✓ Appliquer les stratégies recommandées pour les risques</li>
              <li>✓ Capitaliser sur les périodes d'énergie positive</li>
            </ul>
          </div>

          <div className="p-4 bg-white bg-opacity-10 rounded-lg">
            <h3 className="font-semibold mb-2">📊 À long terme</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Réviser les prédictions tous les mois</li>
              <li>✓ Construire des habitudes stables</li>
              <li>✓ Anticiper les défis saisonniers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * État de chargement
 */
function PredictionLoadingState() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Génération des prédictions
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            Analyse de vos données émotionnelles en cours. Cela peut prendre quelques secondes...
          </p>
        </div>
      </div>

      {/* Skeleton loaders */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  );
}

/**
 * État d'erreur
 */
function PredictionErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="bg-red-50 rounded-lg border border-red-200 p-8">
      <div className="flex items-start gap-4">
        <div className="text-4xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Erreur lors de la génération des prédictions
          </h3>
          <p className="text-red-800 mb-4">{error}</p>
          <div className="space-y-2">
            <p className="text-sm text-red-700">
              <strong>Causes possibles:</strong>
            </p>
            <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
              <li>Données historiques insuffisantes (minimum 7 points de données requis)</li>
              <li>Problème de connexion à l'API</li>
              <li>Quota OpenAI dépassé</li>
            </ul>
          </div>
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * État vide (pas assez de données)
 */
function PredictionEmptyState() {
  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-8">
      <div className="flex items-start gap-4">
        <div className="text-4xl">📈</div>
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Pas assez de données pour les prédictions
          </h3>
          <p className="text-blue-800 mb-4">
            Les prédictions IA nécessitent un minimum de données historiques.
          </p>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-blue-700">
              <strong>Pour activer les prédictions:</strong>
            </p>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Enregistrez au moins 7 scans émotionnels</li>
              <li>Répartissez-les sur une semaine ou plus</li>
              <li>Utilisez différentes sources (texte, voix, facial)</li>
            </ul>
          </div>
          <p className="text-sm text-blue-600">
            Une fois les données collectées, les prédictions s'activeront automatiquement.
          </p>
        </div>
      </div>
    </div>
  );
}
