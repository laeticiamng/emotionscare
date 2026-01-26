/**
 * Emotional Forecast Chart - Graphique des prédictions
 */

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { EmotionalForecast, MonthlyForecast } from '@/services/longTermPredictionsService';
import { cn } from '@/lib/utils';

interface EmotionalForecastChartProps {
  forecast: EmotionalForecast;
  className?: string;
}

export function EmotionalForecastChart({
  forecast,
  className,
}: EmotionalForecastChartProps) {
  if (!forecast.monthlyForecasts || forecast.monthlyForecasts.length === 0) {
    return (
      <div className={cn('p-6 bg-gray-50 rounded-lg text-center', className)}>
        <p className="text-gray-600">Données insuffisantes pour afficher les prédictions</p>
      </div>
    );
  }

  // Préparer les données pour le graphique
  const chartData = forecast.monthlyForecasts.map((forecast) => ({
    month: forecast.month.slice(5), // "01", "02", etc.
    balance: forecast.predictedEmotionBalance,
    confidence: Math.round(forecast.confidence * 100),
  }));

  return (
    <div className={cn('space-y-6', className)}>
      {/* Graphique en ligne */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tendance émotionnelle prédite
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'Bien-être émotionnel', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value) => [`${value}/100`, 'Bien-être']}
              labelFormatter={(label) => `Mois ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 5 }}
              activeDot={{ r: 7 }}
              name="Balance émotionnelle"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique de confiance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Confiance des prédictions
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value) => [`${value}%`, 'Confiance']}
              labelFormatter={(label) => `Mois ${label}`}
            />
            <Bar
              dataKey="confidence"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
              name="Confiance des prédictions"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Détails mensuels */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Détails par mois
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forecast.monthlyForecasts.map((monthForecast) => (
            <MonthForecastCard key={monthForecast.month} monthForecast={monthForecast} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Carte pour chaque mois
 */
function MonthForecastCard({
  monthForecast,
}: {
  monthForecast: MonthlyForecast;
}) {
  const monthName = new Date(`${monthForecast.month}-01`).toLocaleString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  const getBalanceColor = (balance: number) => {
    if (balance >= 70) return 'text-green-600 bg-green-50';
    if (balance >= 50) return 'text-blue-600 bg-blue-50';
    if (balance >= 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getBalanceEmoji = (balance: number) => {
    if (balance >= 70) return '😊';
    if (balance >= 50) return '🙂';
    if (balance >= 30) return '😐';
    return '😟';
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-900 mb-3">
        {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </h4>

      {/* Balance score */}
      <div className={cn('p-3 rounded-lg mb-3 text-center', getBalanceColor(monthForecast.predictedEmotionBalance))}>
        <div className="text-2xl font-bold">
          {getBalanceEmoji(monthForecast.predictedEmotionBalance)}
        </div>
        <div className="text-lg font-bold mt-1">
          {monthForecast.predictedEmotionBalance}/100
        </div>
        <div className="text-xs mt-1">Bien-être émotionnel</div>
      </div>

      {/* Émotions dominantes */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-600 mb-2">Émotions probables:</p>
        <div className="flex flex-wrap gap-1">
          {monthForecast.dominantEmotions.slice(0, 2).map((emotion) => (
            <span
              key={emotion.emotion}
              className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full"
            >
              {emotion.emotion} ({Math.round(emotion.probability * 100)}%)
            </span>
          ))}
        </div>
      </div>

      {/* Défis et opportunités */}
      {monthForecast.expectedChallenge && (
        <div className="mb-2 p-2 bg-red-50 rounded border border-red-200 text-xs text-red-700">
          <strong>Défi:</strong> {monthForecast.expectedChallenge}
        </div>
      )}

      {monthForecast.expectedOpportunity && (
        <div className="p-2 bg-green-50 rounded border border-green-200 text-xs text-green-700">
          <strong>Opportunité:</strong> {monthForecast.expectedOpportunity}
        </div>
      )}

      {/* Confiance */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          Confiance: {Math.round(monthForecast.confidence * 100)}%
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div
            className="bg-indigo-600 h-1.5 rounded-full"
            style={{ width: `${monthForecast.confidence * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
