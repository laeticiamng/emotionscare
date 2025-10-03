import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GlowData {
  label: string;
  color: 'low' | 'medium' | 'high';
  emoji: string;
}

interface GlowGaugeProps {
  data?: GlowData;
}

/**
 * Jauge Instant Glow - État émotionnel du jour
 */
export const GlowGauge: React.FC<GlowGaugeProps> = ({ data }) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">État du jour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24 text-muted-foreground">
            <div className="animate-pulse">Chargement...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const colors = {
    low: { bg: 'bg-blue-100', text: 'text-blue-700' },
    medium: { bg: 'bg-green-100', text: 'text-green-700' },
    high: { bg: 'bg-orange-100', text: 'text-orange-700' }
  }[data.color];

  return (
    <Card className={`${colors.bg}/20`}>
      <CardHeader>
        <CardTitle className="text-lg">État du jour</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="text-4xl">{data.emoji}</div>
          <div>
            <h3 className={`text-xl font-semibold ${colors.text}`}>
              {data.label}
            </h3>
            <p className="text-sm text-muted-foreground">
              Votre ressenti actuel
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};