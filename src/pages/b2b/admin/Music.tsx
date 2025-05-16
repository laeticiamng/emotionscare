
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  BarChart, 
  Music, 
  Users, 
  PlayCircle, 
  Clock, 
  ThumbsUp, 
  Loader2,
  FileSpreadsheet,
  MessageCircle,
  PieChart,
  Calendar
} from 'lucide-react';

const B2BAdminMusic: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  const [department, setDepartment] = useState('all');
  
  // Mock data for the demo
  const topPlaylists = [
    { id: '1', name: 'Focus Intense', plays: 154, likes: 47 },
    { id: '2', name: 'Relaxation Pro', plays: 123, likes: 39 },
    { id: '3', name: 'Motivation Matin', plays: 98, likes: 32 }
  ];
  
  const emotionTrends = [
    { emotion: 'Calme', percentage: 35 },
    { emotion: 'Concentration', percentage: 28 },
    { emotion: 'Motivation', percentage: 22 },
    { emotion: 'Détente', percentage: 15 }
  ];
  
  const usageData = [
    { period: 'Lun', value: 78 },
    { period: 'Mar', value: 65 },
    { period: 'Mer', value: 82 },
    { period: 'Jeu', value: 88 },
    { period: 'Ven', value: 72 }
  ];
  
  const teamRecommendations = [
    { 
      id: '1', 
      name: 'Ambiance Focus', 
      description: 'Idéale pour les sessions de travail concentré en équipe',
      usage: 'Sessions de travail' 
    },
    { 
      id: '2', 
      name: 'Brainstorm Créatif', 
      description: 'Stimule la créativité lors des réunions d\'idéation',
      usage: 'Réunions créatives' 
    },
    { 
      id: '3', 
      name: 'Pause Zen', 
      description: 'Parfaite pour les moments de détente collective',
      usage: 'Pauses café' 
    }
  ];
  
  const handleExport = () => {
    setIsLoading(true);
    
    // Mock export process
    setTimeout(() => {
      setIsLoading(false);
      alert('Rapport exporté avec succès');
    }, 1500);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Musical</h1>
          <p className="text-muted-foreground">
            Analyse de l'utilisation des fonctionnalités musicales par votre équipe
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="development">Développement</SelectItem>
              <SelectItem value="sales">Commercial</SelectItem>
              <SelectItem value="hr">Ressources Humaines</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Utilisateurs actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">87%</div>
              <div className="ml-2 text-sm text-green-500">+12%</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pourcentage d'employés utilisant activement la fonctionnalité musicale
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sessions par jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">124</div>
              <div className="ml-2 text-sm text-green-500">+8%</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nombre moyen de sessions musicales quotidiennes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Temps moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">36 min</div>
              <div className="ml-2 text-sm text-green-500">+5%</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Durée moyenne d'écoute par session
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Utilisation par jour
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  [Graphique d'utilisation]
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Répartition émotionnelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emotionTrends.map((item) => (
                    <div key={item.emotion}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{item.emotion}</span>
                        <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Playlists populaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topPlaylists.map((playlist) => (
                  <Card key={playlist.id}>
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <h4 className="font-medium">{playlist.name}</h4>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <PlayCircle className="h-4 w-4" />
                          {playlist.plays}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {playlist.likes}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recommandations pour l'équipe
              </CardTitle>
              <CardDescription>
                Suggestions musicales basées sur l'analyse des préférences de l'équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamRecommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{rec.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <Button size="sm">Activer</Button>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Utilisation recommandée: {rec.usage}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Créer une playlist d'équipe</CardTitle>
              <CardDescription>
                Configurez une ambiance musicale partagée pour des moments spécifiques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nom de la playlist</label>
                <Input placeholder="Ex: Réunion hebdomadaire" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Objectif</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un objectif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="focus">Concentration</SelectItem>
                    <SelectItem value="creativity">Créativité</SelectItem>
                    <SelectItem value="relaxation">Relaxation</SelectItem>
                    <SelectItem value="energy">Énergie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Occasion</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Réunion</SelectItem>
                    <SelectItem value="break">Pause</SelectItem>
                    <SelectItem value="work">Travail individuel</SelectItem>
                    <SelectItem value="brainstorm">Brainstorming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full">Créer une playlist personnalisée</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports et analyses</CardTitle>
              <CardDescription>
                Exportez des données sur l'utilisation de la musique par votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <FileSpreadsheet className="h-8 w-8 mb-2" />
                  <span>Rapport d'utilisation</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <PieChart className="h-8 w-8 mb-2" />
                  <span>Analyse émotionnelle</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <MessageCircle className="h-8 w-8 mb-2" />
                  <span>Feedback utilisateurs</span>
                </Button>
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <h4 className="font-medium">Rapport personnalisé</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Période</label>
                    <Select defaultValue="last30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last7">7 derniers jours</SelectItem>
                        <SelectItem value="last30">30 derniers jours</SelectItem>
                        <SelectItem value="last90">90 derniers jours</SelectItem>
                        <SelectItem value="custom">Personnalisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Format</label>
                    <Select defaultValue="excel">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  onClick={handleExport}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    'Exporter le rapport'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminMusic;
