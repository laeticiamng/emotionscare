/**
 * Prediction Risks and Opportunities Component
 */

import {
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { EmotionalForecast, RiskIndicator, WellnessOpportunity } from '@/services/longTermPredictionsService';
import { cn } from '@/lib/utils';

interface PredictionRisksAndOpportunitiesProps {
  forecast: EmotionalForecast;
  className?: string;
}

export function PredictionRisksAndOpportunities({
  forecast,
  className,
}: PredictionRisksAndOpportunitiesProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Section Risques */}
      {forecast.riskIndicators && forecast.riskIndicators.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">
                Risques détectés ({forecast.riskIndicators.length})
              </h3>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {forecast.riskIndicators.map((risk, idx) => (
              <RiskIndicatorCard key={idx} risk={risk} />
            ))}
          </div>
        </div>
      )}

      {/* Section Opportunités */}
      {forecast.wellnessOpportunities && forecast.wellnessOpportunities.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">
                Opportunités de bien-être ({forecast.wellnessOpportunities.length})
              </h3>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {forecast.wellnessOpportunities.map((opportunity, idx) => (
              <WellnessOpportunityCard key={idx} opportunity={opportunity} />
            ))}
          </div>
        </div>
      )}

      {/* Si pas de risques ni d'opportunités */}
      {(!forecast.riskIndicators || forecast.riskIndicators.length === 0) &&
        (!forecast.wellnessOpportunities || forecast.wellnessOpportunities.length === 0) && (
          <div className="p-8 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">
              Pas assez de données pour identifier les risques et opportunités.
            </p>
          </div>
        )}
    </div>
  );
}

/**
 * Carte pour afficher un risque
 */
function RiskIndicatorCard({ risk }: { risk: RiskIndicator }) {
  const severityColors = {
    critical: 'bg-red-50 border-red-200 text-red-900',
    high: 'bg-orange-50 border-orange-200 text-orange-900',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    low: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  const severityBadgeColors = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
  };

  const riskTypeEmoji = {
    mood_decline: '📉',
    stress_buildup: '😰',
    isolation_risk: '🔒',
    burnout_risk: '🔥',
    seasonal_depression: '❄️',
  };

  return (
    <div className={cn('p-4 rounded-lg border', severityColors[risk.severity])}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{riskTypeEmoji[risk.type as keyof typeof riskTypeEmoji]}</div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold">{risk.description}</h4>
            <span className={cn('px-2 py-1 rounded-full text-xs font-semibold', severityBadgeColors[risk.severity])}>
              {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
            </span>
          </div>

          {/* Probabilité */}
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Probabilité: {Math.round(risk.probability * 100)}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full',
                  risk.severity === 'critical'
                    ? 'bg-red-600'
                    : risk.severity === 'high'
                      ? 'bg-orange-600'
                      : risk.severity === 'medium'
                        ? 'bg-yellow-600'
                        : 'bg-blue-600'
                )}
                style={{ width: `${risk.probability * 100}%` }}
              />
            </div>
          </div>

          {/* Mois estimé */}
          {risk.estimatedStartMonth && (
            <p className="text-sm text-gray-600 mb-2">
              <strong>Période estimée:</strong> {new Date(`${risk.estimatedStartMonth}-01`).toLocaleString('fr-FR', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}

          {/* Stratégies d'atténuation */}
          <div>
            <p className="text-sm font-semibold mb-2">Stratégies d'atténuation:</p>
            <ul className="space-y-1">
              {risk.mitigationStrategies.map((strategy, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                  <span>{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Carte pour afficher une opportunité
 */
function WellnessOpportunityCard({ opportunity }: { opportunity: WellnessOpportunity }) {
  const typeEmoji = {
    peak_energy: '⚡',
    positive_pattern: '✨',
    recovery_window: '🌱',
    growth_period: '🚀',
  };

  const priorityColors = {
    high: 'border-green-200 bg-green-50',
    medium: 'border-blue-200 bg-blue-50',
    low: 'border-gray-200 bg-gray-50',
  };

  return (
    <div className={cn('p-4 rounded-lg border', priorityColors[opportunity.priority])}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">
          {typeEmoji[opportunity.type as keyof typeof typeEmoji]}
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{opportunity.description}</h4>

          {/* Mois prévu */}
          {opportunity.expectedMonth && (
            <p className="text-sm text-gray-600 mb-2">
              <strong>Période:</strong> {new Date(`${opportunity.expectedMonth}-01`).toLocaleString('fr-FR', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}

          {/* Bénéfice attendu */}
          <p className="text-sm font-semibold mb-2 text-green-700">{opportunity.expectedBenefit}</p>

          {/* Actions recommandées */}
          <div>
            <p className="text-sm font-semibold mb-2">Actions recommandées:</p>
            <ul className="space-y-1">
              {opportunity.actionItems.map((action, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Badge de priorité */}
          <div className="mt-3 pt-3 border-t border-gray-300 border-opacity-50">
            <span className={cn(
              'inline-block px-3 py-1 rounded-full text-xs font-semibold',
              opportunity.priority === 'high'
                ? 'bg-green-600 text-white'
                : opportunity.priority === 'medium'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-white'
            )}>
              Priorité: {opportunity.priority.charAt(0).toUpperCase() + opportunity.priority.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
