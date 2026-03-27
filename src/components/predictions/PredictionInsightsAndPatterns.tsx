// @ts-nocheck
/**
 * Prediction Insights and Patterns Component
 */

import React from 'react';
import { TrendingUp, TrendingDown, Zap, Lightbulb } from 'lucide-react';
import {
  EmotionalForecast,
  IdentifiedPattern,
} from '@/services/longTermPredictionsService';
import { cn } from '@/lib/utils';

interface PredictionInsightsAndPatternsProps {
  forecast: EmotionalForecast;
  className?: string;
}

export function PredictionInsightsAndPatterns({
  forecast,
  className,
}: PredictionInsightsAndPatternsProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* AI Insights */}
      {forecast.aiInsights && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">Insights IA Personnalisés</h3>
              <p className="text-indigo-800 leading-relaxed">{forecast.aiInsights}</p>
            </div>
          </div>
        </div>
      )}

      {/* Patterns */}
      {forecast.patterns && forecast.patterns.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">
                Patterns identifiés ({forecast.patterns.length})
              </h3>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {forecast.patterns.map((pattern, idx) => (
              <PatternCard key={idx} pattern={pattern} />
            ))}
          </div>
        </div>
      )}

      {/* Statistiques */}
      {forecast.stats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques de Prédiction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              label="Qualité des données"
              value={Math.round(forecast.stats.accuracyScore * 100)}
              unit="%"
              icon="📊"
              color="blue"
            />
            <StatCard
              label="Stabilité émotionnelle"
              value={Math.round((1 - forecast.stats.volatilityIndex) * 100)}
              unit="%"
              icon="⚖️"
              color="green"
            />
            <StatCard
              label="Tendance générale"
              value={forecast.stats.improvementTrend}
              unit={forecast.stats.improvementTrend > 0 ? '📈' : '📉'}
              icon={forecast.stats.improvementTrend > 0 ? '⬆️' : '⬇️'}
              color={forecast.stats.improvementTrend > 0 ? 'green' : 'red'}
            />
            <StatCard
              label="Données disponibles"
              value={forecast.stats.dataMonthsAvailable}
              unit="mois"
              icon="📅"
              color="purple"
            />
          </div>
        </div>
      )}

      {/* Data Quality */}
      {forecast && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualité de la Prédiction</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Confiance générale</span>
                <span className="text-sm font-bold text-indigo-600">
                  {Math.round(forecast.confidence * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${forecast.confidence * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {forecast.confidence >= 0.8
                  ? '✓ Excellente confiance - predictions très fiables'
                  : forecast.confidence >= 0.6
                    ? '✓ Bonne confiance - predictions raisonnablement fiables'
                    : '⚠ Confiance modérée - collecter plus de données pour améliorer'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">
                <strong>Points de données analysés:</strong> {forecast.dataPoints}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Plus il y a de données, plus les prédictions sont précises.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Carte pour afficher un pattern
 */
function PatternCard({ pattern }: { pattern: IdentifiedPattern }) {
  const getTypeEmoji = (type: string) => {
    const emojis: { [key: string]: string } = {
      weekly: '📅',
      monthly: '🗓️',
      seasonal: '🍂',
      contextual: '🎯',
      trend: '📈',
    };
    return emojis[type] || '✨';
  };

  const getImpactColor = (impact: number) => {
    if (impact > 15) return 'text-green-600 bg-green-50';
    if (impact > 0) return 'text-blue-600 bg-blue-50';
    if (impact > -15) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getTypeEmoji(pattern.type)}</div>

        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{pattern.description}</h4>

          <div className="space-y-2">
            {/* Type */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                <strong>Fréquence:</strong> {pattern.frequency}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                {pattern.type.charAt(0).toUpperCase() + pattern.type.slice(1)}
              </span>
            </div>

            {/* Impact */}
            <div className={cn('p-2 rounded', getImpactColor(pattern.emotionImpact))}>
              <span className="text-sm font-semibold">
                Impact émotionnel: {pattern.emotionImpact > 0 ? '+' : ''}{pattern.emotionImpact.toFixed(1)}
              </span>
            </div>

            {/* Confiance et occurrences */}
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-600">Confiance:</span>
                <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{ width: `${pattern.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{Math.round(pattern.confidence * 100)}%</span>
              </div>
              <div className="text-gray-600">
                <strong>{pattern.occurrences}</strong> occurrences
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Carte pour une statistique
 */
function StatCard({
  label,
  value,
  unit,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  unit: string;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <div className={cn('p-4 rounded-lg border', colorClasses[color as keyof typeof colorClasses])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            <span className="text-sm text-gray-600">{unit}</span>
          </div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
