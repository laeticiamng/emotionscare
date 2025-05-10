
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionalTeamViewProps } from '@/types/emotion';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, TrendingUp, BarChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EmotionalTeamView: React.FC<EmotionalTeamViewProps> = ({ 
  userId, 
  period, 
  teamId, 
  className,
  onRefresh 
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Simulation de données pour la démo
  const teamMoodScore = 7.2; // Score sur 10
  const teamMoodTrend = +0.5; // +0.5 points par rapport à la période précédente
  const dominantEmotion = 'satisfaction';

  const handleRefresh = async () => {
    if (onRefresh) {
      setLoading(true);
      try {
        await onRefresh();
      } finally {
        setLoading(false);
      }
    }
  };

  // Simuler des données de l'équipe
  const teamEmotions = [
    { emotion: 'satisfaction', percentage: 40 },
    { emotion: 'calme', percentage: 25 },
    { emotion: 'concentration', percentage: 15 },
    { emotion: 'stress', percentage: 10 },
    { emotion: 'inquiétude', percentage: 10 }
  ];

  // Indicateurs d'équipe simulés
  const teamIndicators = [
    { name: 'Cohésion', score: 8.3, trend: +0.2 },
    { name: 'Engagement', score: 7.5, trend: -0.1 },
    { name: 'Communication', score: 6.8, trend: +0.4 },
    { name: 'Bien-être', score: 7.9, trend: +0.3 }
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          État émotionnel de l'équipe
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Humeur d'équipe</div>
                <div className="text-3xl font-bold mt-1">{teamMoodScore.toFixed(1)}/10</div>
                <div className="flex items-center mt-1 text-sm">
                  <TrendingUp className={`h-3 w-3 mr-1 ${teamMoodTrend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={teamMoodTrend >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {teamMoodTrend >= 0 ? '+' : ''}{teamMoodTrend} pts
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Émotion dominante</div>
                <div className="mt-1">
                  <Badge variant="secondary" className="font-medium capitalize">
                    {dominantEmotion}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Période: {period || '7 jours'}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Répartition des émotions</div>
              <div className="space-y-2">
                {teamEmotions.map((item) => (
                  <div key={item.emotion} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize">{item.emotion}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div className="text-sm font-medium">Indicateurs d'équipe</div>
              <div className="grid grid-cols-2 gap-3">
                {teamIndicators.map((indicator) => (
                  <Card key={indicator.name} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">{indicator.name}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-semibold">{indicator.score.toFixed(1)}</span>
                        <span className={`text-xs ${indicator.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {indicator.trend >= 0 ? '+' : ''}{indicator.trend}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button 
                  variant="outline"
                  className="text-sm"
                  onClick={() => navigate('/admin/teams/report')}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Voir rapport détaillé
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmotionalTeamView;
