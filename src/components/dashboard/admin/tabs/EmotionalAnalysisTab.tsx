
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle, 
  Heart,
  Brain,
  Activity,
  Calendar
} from 'lucide-react';

interface EmotionTrend {
  emotion: string;
  percentage: number;
  trend: 'up' | 'down';
  color: string;
}

interface TeamMember {
  id: string;
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastUpdate: string;
}

const EmotionalAnalysisTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data - sera remplacé par les vraies données API
  const emotionTrends: EmotionTrend[] = [
    { emotion: 'Joie', percentage: 35, trend: 'up', color: 'bg-green-500' },
    { emotion: 'Sérénité', percentage: 28, trend: 'up', color: 'bg-blue-500' },
    { emotion: 'Stress', percentage: 20, trend: 'down', color: 'bg-red-500' },
    { emotion: 'Fatigue', percentage: 17, trend: 'down', color: 'bg-orange-500' },
  ];

  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Marie Dupont', score: 85, status: 'excellent', lastUpdate: '2h' },
    { id: '2', name: 'Pierre Martin', score: 72, status: 'good', lastUpdate: '4h' },
    { id: '3', name: 'Sophie Bernard', score: 58, status: 'warning', lastUpdate: '1h' },
    { id: '4', name: 'Jean Durand', score: 42, status: 'critical', lastUpdate: '30min' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec sélection de période */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analyse émotionnelle de l'équipe</h2>
          <p className="text-muted-foreground">Vue d'ensemble du bien-être de vos collaborateurs</p>
        </div>
        <div className="flex gap-2">
          {['day', 'week', 'month'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'day' ? 'Jour' : period === 'week' ? 'Semaine' : 'Mois'}
            </Button>
          ))}
        </div>
      </div>

      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score moyen</p>
                <p className="text-2xl font-bold">73</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Équipe active</p>
                <p className="text-2xl font-bold">24/32</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Amélioration</p>
                <p className="text-2xl font-bold">+8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alertes</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Tendances émotionnelles</TabsTrigger>
          <TabsTrigger value="team">Équipe individuelle</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Distribution des émotions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emotionTrends.map((emotion, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${emotion.color}`} />
                      <span className="font-medium">{emotion.emotion}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={emotion.percentage} className="w-32" />
                      <span className="text-sm font-medium">{emotion.percentage}%</span>
                      {emotion.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Suivi individuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">Dernière mise à jour: {member.lastUpdate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">{member.score}</span>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status === 'excellent' ? 'Excellent' :
                         member.status === 'good' ? 'Bon' :
                         member.status === 'warning' ? 'Attention' : 'Critique'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Insights et recommandations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">✅ Point positif</h4>
                  <p className="text-green-700">Le niveau de joie a augmenté de 15% cette semaine, particulièrement après la session de team building.</p>
                </div>
                
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">⚠️ Point d'attention</h4>
                  <p className="text-orange-700">3 collaborateurs montrent des signes de stress élevé. Considérez une session de méditation d'équipe.</p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">💡 Recommandation</h4>
                  <p className="text-blue-700">Planifiez des pauses Glow collectives le vendredi après-midi pour maintenir le bien-être.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmotionalAnalysisTab;
