
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PenLine, Calendar, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Journal: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateNewEntry = () => {
    navigate('/journal/new');
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Journal d'émotions</h1>
        <Button 
          onClick={handleCreateNewEntry} 
          className="flex items-center gap-2"
        >
          <PenLine className="h-4 w-4" />
          Nouvelle entrée
        </Button>
      </div>

      <p className="text-muted-foreground">
        Suivez et visualisez vos émotions au fil du temps pour mieux comprendre votre bien-être émotionnel.
      </p>

      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <PenLine className="h-4 w-4" /> Liste
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Calendrier
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" /> Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entrées récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Vous n'avez pas encore d'entrées de journal. Commencez par créer votre première entrée.
              </p>
              <div className="flex justify-center mt-4">
                <Button onClick={handleCreateNewEntry}>Créer ma première entrée</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier émotionnel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Le calendrier émotionnel vous permettra de visualiser vos émotions jour par jour.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Les statistiques de vos émotions seront disponibles une fois que vous aurez créé quelques entrées.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Journal;
