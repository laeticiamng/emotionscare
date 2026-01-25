import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Brain } from 'lucide-react';

interface EmotionTrend {
  date: string;
  averageMood: number;
  peakEmotion: string;
}

interface EmotionPattern {
  id: string;
  name: string;
  description: string;
  confidence: number;
}

interface EmotionAnalyticsDashboardProps {
  trends: EmotionTrend[];
  weeklyStats?: Record<string, unknown>;
  patterns: EmotionPattern[];
  isLoading: boolean;
}

const EmotionAnalyticsDashboard: React.FC<EmotionAnalyticsDashboardProps> = ({
  trends, weeklyStats, patterns, isLoading
}) => {
  if (isLoading) {
    return <div>Chargement des analytics...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Tendances Émotionnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trends.slice(0, 7).map((trend, _index) => (
            <div key={trend.date} className="flex items-center justify-between py-2">
              <span className="text-sm">{new Date(trend.date).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${trend.averageMood}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{trend.peakEmotion}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Patterns Détectés
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patterns.slice(0, 5).map((pattern) => (
            <div key={pattern.id} className="p-3 bg-muted/30 rounded-lg mb-3">
              <h4 className="font-semibold text-sm">{pattern.name}</h4>
              <p className="text-xs text-muted-foreground">{pattern.description}</p>
              <div className="mt-2">
                <div className="text-xs">Confiance: {pattern.confidence.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionAnalyticsDashboard;