
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Calendar, Search, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  mood: number;
  tags: string[];
  content: string;
  emoji: string;
}

interface JournalTabProps {
  className?: string;
}

const JournalTab: React.FC<JournalTabProps> = ({ className }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [view, setView] = useState('recent');
  
  useEffect(() => {
    const loadJournalEntries = async () => {
      try {
        setIsLoading(true);
        
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées
        setEntries([
          {
            id: 'j1',
            date: new Date().toISOString(),
            title: "Journée productive",
            mood: 8,
            tags: ["travail", "succès", "équipe"],
            content: "J'ai terminé le projet en avance aujourd'hui. La réunion d'équipe s'est très bien passée.",
            emoji: "😊"
          },
          {
            id: 'j2',
            date: new Date(Date.now() - 86400000).toISOString(),
            title: "Difficultés avec le client",
            mood: 4,
            tags: ["stress", "client", "défi"],
            content: "Le client était mécontent des délais. J'ai essayé de rester calme et de trouver des solutions.",
            emoji: "😓"
          },
          {
            id: 'j3',
            date: new Date(Date.now() - 172800000).toISOString(),
            title: "Nouvelle initiative",
            mood: 9,
            tags: ["idée", "créativité", "projet"],
            content: "J'ai proposé une nouvelle approche pour le projet qui a été très bien reçue par l'équipe.",
            emoji: "🚀"
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement du journal :', error);
        setHasError(true);
        setIsLoading(false);
        toast.error('Impossible de charger votre journal', {
          description: 'Veuillez réessayer ultérieurement'
        });
      }
    };
    
    loadJournalEntries();
  }, []);
  
  const handleNewEntry = () => {
    navigate('/journal/new');
    toast.success('Création d'une nouvelle entrée', {
      description: 'Exprimez vos émotions et réflexions'
    });
  };
  
  const handleViewEntry = (entryId: string) => {
    navigate(`/journal/${entryId}`);
  };
  
  // Gestion de l'erreur
  if (hasError) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center p-8">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Impossible de charger votre journal</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Une erreur s'est produite lors du chargement de votre journal émotionnel. Veuillez réessayer.
          </p>
          <Button onClick={() => window.location.reload()} variant="default">
            Actualiser
          </Button>
        </div>
      </div>
    );
  }
  
  // Si aucune entrée
  const renderEmptyState = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="bg-primary/10 p-6 rounded-full mb-4"
        >
          <BookOpen className="h-10 w-10 text-primary" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">
          Votre journal est vide
        </h3>
        <p className="text-center text-muted-foreground mb-6 max-w-md">
          Commencez à noter vos pensées, émotions et réflexions pour suivre votre bien-être émotionnel au travail.
        </p>
        <Button onClick={handleNewEntry} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer une entrée
        </Button>
      </CardContent>
    </Card>
  );
  
  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Journal émotionnel</h2>
          <p className="text-muted-foreground">
            Suivez vos émotions et réflexions quotidiennes
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button onClick={handleNewEntry} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle entrée
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded-md w-3/4"></div>
                    <div className="h-4 bg-muted rounded-md w-1/2"></div>
                  </div>
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted/50 rounded-md"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : entries.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
            <Tabs value={view} onValueChange={setView}>
              <TabsList>
                <TabsTrigger value="recent" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Récentes
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendrier
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                className="pl-9 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Rechercher dans le journal..."
              />
            </div>
          </div>
          
          <TabsContent value="recent">
            <div className="grid gap-4">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{entry.title}</CardTitle>
                          <CardDescription>
                            {new Date(entry.date).toLocaleDateString('fr-FR', { 
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })} - Humeur: {entry.mood}/10
                          </CardDescription>
                        </div>
                        <div className="text-3xl">{entry.emoji}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-muted-foreground">
                        {entry.content}
                      </p>
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {entry.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="gap-4">
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2"
                        onClick={() => handleViewEntry(entry.id)}
                      >
                        <BookOpen className="h-4 w-4" />
                        Lire
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/journal/edit/${entry.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                        Modifier
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Calendar className="h-12 w-12 text-muted-foreground opacity-70" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Vue calendrier</h3>
                    <p className="text-muted-foreground mb-4">
                      La vue calendrier sera bientôt disponible. Vous pourrez visualiser vos entrées par mois.
                    </p>
                    <Button variant="outline" onClick={() => setView('recent')}>
                      Retour à la liste
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </>
      )}
    </div>
  );
};

export default JournalTab;
