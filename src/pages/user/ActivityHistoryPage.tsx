
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Activity, Clock, TrendingUp } from 'lucide-react';

const ActivityHistoryPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activities = [
    { id: 1, type: 'emotion_scan', title: 'Scan émotionnel', time: '14:30', score: 85, duration: '2 min', category: 'Analyse' },
    { id: 2, type: 'breathing', title: 'Session de respiration', time: '12:15', score: 92, duration: '10 min', category: 'Respiration' },
    { id: 3, type: 'journal', title: 'Entrée journal', time: '09:45', score: 78, duration: '5 min', category: 'Journal' },
    { id: 4, type: 'music', title: 'Thérapie musicale', time: '08:30', score: 88, duration: '15 min', category: 'Musique' },
    { id: 5, type: 'vr', title: 'Méditation VR', time: '19:20', score: 95, duration: '20 min', category: 'VR' },
    { id: 6, type: 'coach', title: 'Chat avec coach IA', time: '16:00', score: 82, duration: '8 min', category: 'Coach' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'emotion_scan': return '🔍';
      case 'breathing': return '🫁';
      case 'journal': return '📝';
      case 'music': return '🎵';
      case 'vr': return '🥽';
      case 'coach': return '🤖';
      default: return '⚡';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Historique d'Activité</h1>
          <p className="text-muted-foreground">Suivez votre progression et vos habitudes de bien-être</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Total Activités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-sm text-muted-foreground">Cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Temps Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18h 32m</div>
              <p className="text-sm text-muted-foreground">Temps investi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Score Moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">86.4</div>
              <p className="text-sm text-muted-foreground">+5% vs sem. passée</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Série Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 jours</div>
              <p className="text-sm text-muted-foreground">Record personnel</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Activités Récentes</CardTitle>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    <SelectItem value="Analyse">Analyse</SelectItem>
                    <SelectItem value="Respiration">Respiration</SelectItem>
                    <SelectItem value="Journal">Journal</SelectItem>
                    <SelectItem value="Musique">Musique</SelectItem>
                    <SelectItem value="VR">VR</SelectItem>
                    <SelectItem value="Coach">Coach</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>Détail de vos sessions de bien-être</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities
                .filter(activity => selectedCategory === 'all' || activity.category === selectedCategory)
                .map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{activity.time}</span>
                        <span>•</span>
                        <span>{activity.duration}</span>
                        <Badge variant="outline" className="ml-2">
                          {activity.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(activity.score)}`}>
                      {activity.score}
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline">
                Charger plus d'activités
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityHistoryPage;
