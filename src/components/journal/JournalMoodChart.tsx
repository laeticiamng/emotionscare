
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { JournalEntry } from '@/types/other';

interface JournalMoodChartProps {
  entries: JournalEntry[];
  className?: string;
}

const JournalMoodChart: React.FC<JournalMoodChartProps> = ({ entries, className }) => {
  // Convertir les données pour le graphique
  const chartData = useMemo(() => {
    return entries
      .filter(entry => entry.mood !== undefined || entry.mood_score !== undefined)
      .map(entry => {
        let value: number;
        let category: string;
        
        // Utiliser mood_score s'il existe, sinon convertir mood
        if (typeof entry.mood_score === 'number') {
          value = entry.mood_score;
          category = getMoodCategory(value);
        } else if (typeof entry.mood === 'number') {
          value = entry.mood;
          category = getMoodCategory(value);
        } else if (typeof entry.mood === 'string') {
          // Convertir la chaîne de caractères en nombre
          category = entry.mood;
          value = getMoodValue(category);
        } else {
          // Valeur par défaut
          value = 5;
          category = "neutre";
        }
        
        return {
          date: new Date(entry.date).toLocaleDateString(),
          value,
          category
        };
      });
  }, [entries]);

  // Fonction pour obtenir la catégorie d'humeur basée sur une valeur numérique
  function getMoodCategory(value: number): string {
    if (value >= 8) return 'excellent';
    if (value >= 6) return 'bon';
    if (value >= 4) return 'neutre';
    if (value >= 2) return 'mauvais';
    return 'terrible';
  }

  // Fonction pour obtenir une valeur numérique basée sur une catégorie d'humeur
  function getMoodValue(category: string): number {
    const lowerCategory = typeof category === 'string' ? category.toLowerCase() : '';
    
    switch (lowerCategory) {
      case 'excellent': return 9;
      case 'bon': return 7;
      case 'neutre': return 5;
      case 'mauvais': return 3;
      case 'terrible': return 1;
      default: return 5;
    }
  }

  // Fonction pour personnaliser la couleur de la ligne en fonction de la valeur
  const getLineColor = (value: number) => {
    if (value >= 8) return "#4ade80"; // vert
    if (value >= 6) return "#22d3ee"; // cyan
    if (value >= 4) return "#a78bfa"; // violet
    if (value >= 2) return "#fb923c"; // orange
    return "#f87171"; // rouge
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Évolution de l'humeur</CardTitle>
        <CardDescription>
          Visualisez l'évolution de votre humeur au fil du temps
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Pas assez de données pour afficher le graphique
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip
                formatter={(value: number) => [`${value}/10`, 'Humeur']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                dot={{ fill: (entry) => getLineColor(entry.value) }}
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalMoodChart;
