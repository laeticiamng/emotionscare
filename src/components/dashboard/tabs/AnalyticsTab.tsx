
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AnalyticsTabProps {
  className?: string;
  personalOnly?: boolean;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ className, personalOnly }) => {
  const recentAnalyses = [
    {
      date: '2024-01-15',
      emotion: 'Positif',
      score: 8.5,
      type: 'Texte'
    },
    {
      date: '2024-01-14',
      emotion: 'Calme',
      score: 7.2,
      type: 'Audio'
    },
    {
      date: '2024-01-13',
      emotion: 'Énergique',
      score: 9.1,
      type: 'Image'
    }
  ];

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'positif':
      case 'énergique':
        return 'bg-green-100 text-green-800';
      case 'calme':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analyses récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnalyses.map((analysis, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getEmotionColor(analysis.emotion)}>
                        {analysis.emotion}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{analysis.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{analysis.date}</p>
                  </div>
                  <div className="text-lg font-semibold">
                    {analysis.score}/10
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances émotionnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-48 flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">Graphique des tendances</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-500">↑ 15%</div>
                  <p className="text-sm text-muted-foreground">Humeur positive</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">↓ 8%</div>
                  <p className="text-sm text-muted-foreground">Niveau de stress</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;
