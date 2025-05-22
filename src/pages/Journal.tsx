
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Edit, BookOpen, BarChart3, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Journal: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Journal émotionnel</h1>
          <p className="text-muted-foreground">
            Suivez et comprenez vos émotions au quotidien
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Edit className="h-4 w-4" /> Nouvelle entrée
        </Button>
      </div>

      <Tabs defaultValue="entries">
        <TabsList>
          <TabsTrigger value="entries" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Entrées
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Statistiques
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Calendrier
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="entries" className="space-y-6 mt-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{`${i === 1 ? "Aujourd'hui" : i === 2 ? "Hier" : "15 mai 2025"}, ${i === 1 ? "09:30" : i === 2 ? "19:45" : "14:15"}`}</span>
                    </div>
                    <CardTitle className="text-xl">{
                      i === 1 ? "Journée productive" : 
                      i === 2 ? "Moment de stress" : 
                      "Réflexions du week-end"
                    }</CardTitle>
                  </div>
                  <Badge>
                    {i === 1 ? "Satisfaction" : i === 2 ? "Inquiétude" : "Sérénité"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {i === 1 
                    ? "Aujourd'hui a été une journée particulièrement productive. J'ai pu finaliser plusieurs projets et j'ai reçu des retours positifs de mon équipe." 
                    : i === 2 
                    ? "J'ai ressenti beaucoup de stress aujourd'hui à cause de la présentation à venir. Besoin de travailler sur mes techniques de respiration." 
                    : "Le week-end m'a permis de me reconnecter avec moi-même, de méditer et de prendre du recul par rapport aux défis professionnels."}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(i === 1 
                    ? ["Travail", "Accomplissement", "Équipe"] 
                    : i === 2 
                    ? ["Stress", "Présentation", "Anxiété"] 
                    : ["Détente", "Méditation", "Introspection"]
                  ).map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Voir plus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-center mt-6">
            <Button variant="outline">Charger plus d'entrées</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendances émotionnelles</CardTitle>
              <CardDescription>
                Analyse de vos émotions sur les 30 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">
                Les graphiques de tendances émotionnelles seront disponibles après plus d'entrées.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier émotionnel</CardTitle>
              <CardDescription>
                Visualisez vos émotions jour après jour
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground mb-6">
                Le calendrier émotionnel sera disponible après plus d'entrées.
              </p>
              <Button>Commencer à journaliser</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Journal;
