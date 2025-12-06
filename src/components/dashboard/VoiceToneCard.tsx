import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VoiceToneCardProps {
  data: {
    valence_voice_avg: number;
    lexical_sentiment_avg: number;
  };
}

const toneColor = (v: number) => {
  const hue = Math.min(Math.max(v, 0), 1) * 120; // 0 red -> 120 green
  return `hsl(${hue},70%,50%)`;
};

export const VoiceToneCard: React.FC<VoiceToneCardProps> = ({ data }) => {
  const { valence_voice_avg, lexical_sentiment_avg } = data;
  const color = toneColor(valence_voice_avg);
  return (
    <Card aria-label={`Valence moyenne voix ${valence_voice_avg.toFixed(2)} sur 1`}>
      <CardHeader className="pb-2">
        <CardTitle>Ton de la voix</CardTitle>
      </CardHeader>
      <CardContent className="relative overflow-hidden p-6">
        <div
          className="h-20 rounded-lg w-full"
          style={{
            background: `linear-gradient(90deg, ${color}, #eee)`,
            maskImage: 'radial-gradient(circle at 50% 50%, white, transparent)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, white, transparent)'
          }}
        ></div>
        <div className="text-sm text-muted-foreground mt-2">
          Sentiment lexical moyen : {(lexical_sentiment_avg * 100).toFixed(0)}% positif
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceToneCard;
