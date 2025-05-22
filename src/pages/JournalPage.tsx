
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Calendar, List, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface JournalEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  emotions: string[];
}

const JournalPage: React.FC = () => {
  // Données de démo
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: 1,
      date: '2025-05-22',
      title: 'Une journée productive',
      content: 'Aujourd\'hui j\'ai réussi à accomplir toutes mes tâches et je me sens très satisfait.',
      emotions: ['Satisfait', 'Fier', 'Énergique']
    },
    {
      id: 2,
      date: '2025-05-21',
      title: 'Réunion stressante',
      content: 'La réunion d\'équipe a été plus difficile que prévu, mais j\'ai réussi à défendre mon point de vue.',
      emotions: ['Stressé', 'Tendu', 'Soulagé']
    },
    {
      id: 3,
      date: '2025-05-20',
      title: 'Moment de détente',
      content: 'J\'ai pris du temps pour moi aujourd\'hui et j\'ai pratiqué la méditation pendant 30 minutes.',
      emotions: ['Calme', 'Serein', 'Détendu']
    }
  ]);

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-7 w-7" />
          Journal émotionnel
        </h1>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle entrée
        </Button>
      </div>

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Entrées
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Analyse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entries">
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {entries.map(entry => (
              <motion.div key={entry.id} variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{entry.title}</CardTitle>
                        <CardDescription>{formatDate(entry.date)}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {entry.emotions.map((emotion, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{entry.content}</p>
                    <div className="flex justify-end mt-4 gap-2">
                      <Button variant="outline" size="sm">Modifier</Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des entrées</CardTitle>
              <CardDescription>Visualisez vos entrées de journal sur un calendrier</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Calendrier des entrées du journal (à implémenter)</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des émotions</CardTitle>
              <CardDescription>Analysez l'évolution de vos émotions au fil du temps</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Graphiques d'analyse émotionnelle (à implémenter)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalPage;
