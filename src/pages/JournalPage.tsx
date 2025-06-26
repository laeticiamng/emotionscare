
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, TrendingUp, Download, Bell, PlusCircle } from 'lucide-react';
import EmotionalCalendar from '@/components/journal/EmotionalCalendar';
import { useToast } from '@/hooks/use-toast';

const JournalPage: React.FC = () => {
  const { toast } = useToast();
  const [newEntry, setNewEntry] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Mock journal entries
  const journalEntries = [
    {
      id: '1',
      date: '2024-01-15',
      mood: 'good',
      title: 'Journée productive au travail',
      content: 'Aujourd\'hui a été une excellente journée. J\'ai réussi à terminer tous mes projets et j\'ai reçu des félicitations de mon manager...',
      tags: ['travail', 'productivité', 'satisfaction']
    },
    {
      id: '2',
      date: '2024-01-14',
      mood: 'excellent',
      title: 'Weekend relaxant en famille',
      content: 'Passé un merveilleux weekend avec ma famille. Nous avons fait une randonnée et j\'ai vraiment apprécié ce moment de déconnexion...',
      tags: ['famille', 'nature', 'détente']
    },
    {
      id: '3',
      date: '2024-01-13',
      mood: 'neutral',
      title: 'Réflexions sur mes objectifs',
      content: 'Aujourd\'hui j\'ai pris le temps de réfléchir à mes objectifs pour cette année. Il y a certaines choses que je veux améliorer...',
      tags: ['réflexion', 'objectifs', 'développement']
    }
  ];

  // Mock mood statistics
  const moodStats = {
    totalEntries: 42,
    currentStreak: 7,
    averageMood: 'Bien',
    improvementTrend: '+12%'
  };

  const handleSaveEntry = () => {
    if (!newEntry.trim()) return;
    
    toast({
      title: 'Entrée sauvegardée',
      description: 'Votre réflexion a été ajoutée à votre journal.',
    });
    setNewEntry('');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    toast({
      title: 'Date sélectionnée',
      description: `Affichage des entrées du ${new Date(date).toLocaleDateString('fr-FR')}`,
    });
  };

  const handleExportData = () => {
    toast({
      title: 'Export en cours',
      description: 'Vos données de journal sont en cours d\'export.',
    });
  };

  const handleSetReminder = () => {
    toast({
      title: 'Rappel configuré',
      description: 'Vous recevrez un rappel quotidien à 20h.',
    });
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      'excellent': 'bg-green-100 text-green-800',
      'good': 'bg-blue-100 text-blue-800',
      'neutral': 'bg-yellow-100 text-yellow-800',
      'bad': 'bg-orange-100 text-orange-800',
      'terrible': 'bg-red-100 text-red-800'
    };
    return colors[mood as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal Émotionnel</h1>
          <p className="text-muted-foreground">
            Exprimez vos pensées et suivez votre évolution émotionnelle
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSetReminder}>
            <Bell className="mr-2 h-4 w-4" />
            Rappels
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="write" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="write">Écrire</TabsTrigger>
          <TabsTrigger value="entries">Mes entrées</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Nouvelle entrée
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Comment vous sentez-vous aujourd'hui ?</label>
                    <Textarea
                      placeholder="Exprimez vos pensées, vos émotions, vos réflexions du jour..."
                      value={newEntry}
                      onChange={(e) => setNewEntry(e.target.value)}
                      className="mt-2 min-h-[200px]"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {newEntry.length} caractères
                    </span>
                    <Button onClick={handleSaveEntry} disabled={!newEntry.trim()}>
                      Sauvegarder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggestions d'écriture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-sm h-auto p-3 text-left">
                    Qu'est-ce qui vous a rendu heureux aujourd'hui ?
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm h-auto p-3 text-left">
                    Quel défi avez-vous surmonté récemment ?
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm h-auto p-3 text-left">
                    Pour quoi êtes-vous reconnaissant ?
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Votre progression</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Entrées ce mois</span>
                    <span className="font-medium">15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Série actuelle</span>
                    <span className="font-medium">7 jours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Humeur moyenne</span>
                    <span className="font-medium">Bien</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="entries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Mes Entrées Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journalEntries.map((entry) => (
                  <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{entry.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getMoodColor(entry.mood)}`}>
                            {entry.mood}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {entry.content}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <EmotionalCalendar onDateSelect={handleDateSelect} />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total entrées</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{moodStats.totalEntries}</div>
                <p className="text-xs text-muted-foreground">
                  Depuis le début
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Série actuelle</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{moodStats.currentStreak} jours</div>
                <p className="text-xs text-muted-foreground">
                  Écriture quotidienne
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Humeur moyenne</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{moodStats.averageMood}</div>
                <p className="text-xs text-muted-foreground">
                  Ce mois-ci
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Amélioration</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{moodStats.improvementTrend}</div>
                <p className="text-xs text-muted-foreground">
                  Depuis le mois dernier
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analyse des émotions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Émotions les plus fréquentes</h4>
                  <div className="space-y-2">
                    {[
                      { emotion: 'Sérénité', percentage: 35, color: 'bg-blue-500' },
                      { emotion: 'Joie', percentage: 28, color: 'bg-green-500' },
                      { emotion: 'Réflexion', percentage: 22, color: 'bg-purple-500' },
                      { emotion: 'Motivation', percentage: 15, color: 'bg-orange-500' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="text-sm font-medium w-20">{item.emotion}</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full transition-all`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Patterns identifiés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Tendances découvertes</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Vous écrivez principalement le soir après 19h</li>
                    <li>• Vos entrées sont plus positives en fin de semaine</li>
                    <li>• Les thèmes récurrents: famille, travail, nature</li>
                    <li>• Amélioration notable de votre humeur générale</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Pour optimiser votre pratique</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Essayez l'écriture matinale pour commencer la journée</li>
                    <li>• Explorez davantage les moments de gratitude</li>
                    <li>• Ajoutez des photos à vos entrées pour enrichir vos souvenirs</li>
                    <li>• Définissez des objectifs personnels à suivre</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalPage;
