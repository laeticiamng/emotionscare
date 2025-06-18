
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Calendar, TrendingUp } from 'lucide-react';

const JournalPage: React.FC = () => {
  const [entries] = useState([
    {
      id: 1,
      date: '2024-01-18',
      mood: 'Joyeux',
      content: 'Aujourd\'hui a été une excellente journée. J\'ai réussi à terminer mon projet...',
      tags: ['travail', 'accomplissement']
    },
    {
      id: 2,
      date: '2024-01-17',
      mood: 'Calme',
      content: 'Une journée paisible. J\'ai pris le temps de méditer ce matin...',
      tags: ['méditation', 'bien-être']
    }
  ]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Journal personnel</h1>
        <p className="text-muted-foreground">
          Suivez votre parcours émotionnel et vos progrès au quotidien
        </p>
      </div>

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="entries">Mes entrées</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
          <TabsTrigger value="new">Nouvelle entrée</TabsTrigger>
        </TabsList>

        <TabsContent value="entries">
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {new Date(entry.date).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="text-sm font-normal bg-primary/10 px-3 py-1 rounded-full">
                      {entry.mood}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3">{entry.content}</p>
                  <div className="flex gap-2">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analyses de votre bien-être
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <h3 className="text-2xl font-bold text-primary">7</h3>
                  <p className="text-sm text-muted-foreground">Jours consécutifs</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <h3 className="text-2xl font-bold text-primary">85%</h3>
                  <p className="text-sm text-muted-foreground">Humeur positive</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <h3 className="text-2xl font-bold text-primary">12</h3>
                  <p className="text-sm text-muted-foreground">Entrées ce mois</p>
                </div>
              </div>
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Graphique des tendances émotionnelles</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nouvelle entrée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Comment vous sentez-vous aujourd'hui ?
                  </label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Joyeux</option>
                    <option>Calme</option>
                    <option>Anxieux</option>
                    <option>Triste</option>
                    <option>Énergique</option>
                    <option>Fatigué</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Racontez votre journée
                  </label>
                  <textarea 
                    className="w-full h-32 p-3 border rounded-md resize-none"
                    placeholder="Qu'est-ce qui s'est passé aujourd'hui ? Comment vous êtes-vous senti ?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tags (optionnel)
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    placeholder="ex: travail, famille, sport..."
                  />
                </div>
                <Button className="w-full">
                  Enregistrer l'entrée
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalPage;
