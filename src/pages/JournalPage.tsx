
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Clock, Calendar, Star } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: 'happy' | 'neutral' | 'sad';
}

const JournalPage: React.FC = () => {
  const [entries, setEntries] = React.useState<JournalEntry[]>([
    {
      id: '1',
      title: 'Une journée productive',
      content: 'Aujourd\'hui j\'ai réussi à accomplir toutes mes tâches et je me sens très bien.',
      date: new Date(2025, 4, 20),
      mood: 'happy'
    },
    {
      id: '2',
      title: 'Réflexions sur mon travail',
      content: 'Je me pose des questions sur la direction de ma carrière, je dois prendre du temps pour y réfléchir.',
      date: new Date(2025, 4, 18),
      mood: 'neutral'
    },
    {
      id: '3',
      title: 'Journée difficile',
      content: 'J\'ai eu des difficultés à me concentrer aujourd\'hui, je me sens un peu déprimé.',
      date: new Date(2025, 4, 15),
      mood: 'sad'
    }
  ]);
  
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      default: return '';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Journal émotionnel
          </h1>
          <p className="text-muted-foreground mt-1">
            Suivez vos émotions et vos pensées au quotidien
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Nouvelle entrée
        </Button>
      </motion.div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Toutes les entrées</TabsTrigger>
          <TabsTrigger value="recent">Récentes</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl flex items-center gap-2">
                      {entry.title}
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    </CardTitle>
                    <Button variant="ghost" size="icon">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {format(entry.date, 'PP', { locale: fr })}
                    <Clock className="h-3 w-3 ml-2" />
                    {format(entry.date, 'p', { locale: fr })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2">{entry.content}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="link" className="px-0">Lire plus</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
        
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Entrées récentes</CardTitle>
              <CardDescription>
                Vos entrées des 7 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {entries.slice(0, 2).map(entry => (
                <div key={entry.id} className="mb-4 last:mb-0">
                  <h3 className="font-medium flex items-center gap-2">
                    {entry.title}
                    <span>{getMoodEmoji(entry.mood)}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {format(entry.date, 'PPP', { locale: fr })}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Entrées favorites</CardTitle>
              <CardDescription>
                Les entrées que vous avez marquées comme favorites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Vous n'avez pas encore d'entrées favorites
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalPage;
