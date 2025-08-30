import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  Filter,
  Download,
  Activity,
  Heart,
  Music,
  Mic,
  Camera,
  Zap,
  BookOpen,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

interface ActivitySession {
  id: string;
  type: string;
  title: string;
  date: string;
  duration: number;
  mood: string;
  impact: string;
  icon: React.ReactNode;
}

const B2CActivityHistoryPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivitySession[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate activity data
    const mockActivities: ActivitySession[] = [
      {
        id: '1',
        type: 'flash-glow',
        title: 'Séance Flash Glow',
        date: 'Aujourd\'hui, 14:30',
        duration: 3,
        mood: 'Énergisé',
        impact: 'gain mesurable',
        icon: <Zap className="h-4 w-4" />
      },
      {
        id: '2',
        type: 'music',
        title: 'Musicothérapie apaisante',
        date: 'Aujourd\'hui, 11:15',
        duration: 12,
        mood: 'Calme',
        impact: 'très relaxant',
        icon: <Music className="h-4 w-4" />
      },
      {
        id: '3',
        type: 'journal',
        title: 'Journal vocal',
        date: 'Hier, 19:45',
        duration: 5,
        mood: 'Pensif',
        impact: 'clarté mentale',
        icon: <Mic className="h-4 w-4" />
      },
      {
        id: '4',
        type: 'scan',
        title: 'Scan émotionnel',
        date: 'Hier, 16:20',
        duration: 2,
        mood: 'Neutre',
        impact: 'état stable',
        icon: <Camera className="h-4 w-4" />
      },
      {
        id: '5',
        type: 'breath',
        title: 'Cohérence cardiaque',
        date: 'Hier, 09:00',
        duration: 8,
        mood: 'Centré',
        impact: 'cohérence élevée',
        icon: <Heart className="h-4 w-4" />
      },
      {
        id: '6',
        type: 'coach',
        title: 'Session coach IA',
        date: 'Avant-hier, 20:30',
        duration: 15,
        mood: 'Motivé',
        impact: 'perspectives nouvelles',
        icon: <BookOpen className="h-4 w-4" />
      }
    ];
    
    setActivities(mockActivities);
  }, []);

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

  const getTotalStats = () => {
    const totalSessions = activities.length;
    const totalMinutes = activities.reduce((sum, activity) => sum + activity.duration, 0);
    const thisWeek = activities.filter(activity => 
      activity.date.includes('Aujourd\'hui') || activity.date.includes('Hier')
    ).length;
    
    return { totalSessions, totalMinutes, thisWeek };
  };

  const stats = getTotalStats();

  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'énergisé': return 'bg-orange-100 text-orange-800';
      case 'calme': return 'bg-blue-100 text-blue-800';
      case 'pensif': return 'bg-purple-100 text-purple-800';
      case 'neutre': return 'bg-gray-100 text-gray-800';
      case 'centré': return 'bg-green-100 text-green-800';
      case 'motivé': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportData = () => {
    // Simulate GDPR export
    const csvData = activities.map(activity => ({
      Date: activity.date,
      Type: activity.title,
      Duration: `${activity.duration} min`,
      Mood: activity.mood,
      Impact: activity.impact
    }));
    
    console.log('Exporting personal data:', csvData);
    // In real app, this would trigger a secure download
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Historique d'Activité</h1>
              <p className="text-muted-foreground">
                Timeline de vos sessions bien-être
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export RGPD
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessions totales</p>
                  <p className="text-2xl font-bold">{stats.totalSessions}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Temps total</p>
                  <p className="text-2xl font-bold">{stats.totalMinutes} min</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cette semaine</p>
                  <p className="text-2xl font-bold">{stats.thisWeek}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content with Tabs */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">Tous les modules</option>
                <option value="flash-glow">Flash Glow</option>
                <option value="music">Musicothérapie</option>
                <option value="journal">Journal</option>
                <option value="scan">Scan émotionnel</option>
                <option value="breath">Respiration</option>
                <option value="coach">Coach IA</option>
              </select>
            </div>
          </div>

          <TabsContent value="timeline" className="space-y-4">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-muted rounded-full">
                        {activity.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getMoodColor(activity.mood)}>
                          {activity.mood}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.duration} min • {activity.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredActivities.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Aucune activité trouvée</h3>
                  <p className="text-muted-foreground">
                    Commencez une session pour voir votre historique ici
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Modules les plus utilisés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Flash Glow</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Musicothérapie</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Journal vocal</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Autres</span>
                      <span className="text-sm font-medium">17%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progression cette semaine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement quotidien</span>
                        <span>Excellent</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Diversité modules</span>
                        <span>Très bien</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Régularité</span>
                        <span>Stable</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: '70%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patterns détectés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <h4 className="font-medium mb-2">🌅 Routine matinale</h4>
                    <p className="text-sm text-muted-foreground">
                      Vous utilisez souvent la cohérence cardiaque le matin entre 8h-10h. 
                      Cette routine semble vous aider à bien commencer la journée.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                    <h4 className="font-medium mb-2">🎵 Détente en fin de journée</h4>
                    <p className="text-sm text-muted-foreground">
                      La musicothérapie est votre choix préféré après 18h. 
                      Un excellent moyen de décompresser après le travail.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
                    <h4 className="font-medium mb-2">⚡ Boost d'énergie</h4>
                    <p className="text-sm text-muted-foreground">
                      Flash Glow en milieu d'après-midi vous aide à maintenir votre énergie. 
                      Parfait pour éviter le coup de fatigue de 14h.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Continuer votre pratique</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/app/flash-glow">
                  <Zap className="h-4 w-4 mr-2" />
                  Flash Glow
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/app/music">
                  <Music className="h-4 w-4 mr-2" />
                  Musicothérapie
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/app/journal">
                  <Mic className="h-4 w-4 mr-2" />
                  Journal
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/app/scan">
                  <Camera className="h-4 w-4 mr-2" />
                  Scan
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CActivityHistoryPage;