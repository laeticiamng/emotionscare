
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Smile, TrendingUp } from 'lucide-react';

const UnifiedEmotionCheckin: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { label: 'Excellent', value: 'excellent', color: 'bg-green-500', emoji: '😊' },
    { label: 'Bien', value: 'good', color: 'bg-blue-500', emoji: '🙂' },
    { label: 'Neutre', value: 'neutral', color: 'bg-gray-500', emoji: '😐' },
    { label: 'Difficile', value: 'difficult', color: 'bg-orange-500', emoji: '😟' },
    { label: 'Très difficile', value: 'very-difficult', color: 'bg-red-500', emoji: '😰' }
  ];

  const recentAnalyses = [
    {
      date: '2024-01-15',
      mood: 'Positif',
      score: 75,
      dominant: 'Joie'
    },
    {
      date: '2024-01-14',
      mood: 'Neutre',
      score: 60,
      dominant: 'Calme'
    },
    {
      date: '2024-01-13',
      mood: 'Positif',
      score: 82,
      dominant: 'Enthousiasme'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Check-in rapide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Check-in Émotionnel Rapide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Comment vous sentez-vous en ce moment ?
          </p>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`
                  p-3 rounded-lg text-center transition-all
                  ${selectedMood === mood.value 
                    ? 'ring-2 ring-primary scale-105' 
                    : 'hover:scale-102'
                  }
                  ${mood.color} text-white
                `}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs font-medium">{mood.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analyses récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            Analyses Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAnalyses.map((analysis, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">{analysis.date}</div>
                  <div className="text-sm text-muted-foreground">
                    Humeur: {analysis.mood} • Dominant: {analysis.dominant}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{analysis.score}%</Badge>
                  <Progress value={analysis.score} className="w-16 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Tendances de la Semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">+12%</div>
              <div className="text-sm text-muted-foreground">Amélioration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-muted-foreground">Objectifs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedEmotionCheckin;
