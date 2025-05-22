
import React, { useState, useEffect } from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarPlus } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'emotion' | 'journal' | 'achievement' | 'music';
}

const TimelinePage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Sample timeline data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleEvents: TimelineEvent[] = [
        {
          id: '1',
          date: new Date(2023, 4, 25).toISOString(),
          title: 'Journal: Réflexion sur ma semaine',
          description: 'J\'ai écrit à propos des défis auxquels j\'ai été confronté cette semaine et comment je les ai surmontés.',
          type: 'journal'
        },
        {
          id: '2',
          date: new Date(2023, 4, 23).toISOString(),
          title: 'Émotion: Stress au travail',
          description: 'J\'ai ressenti un stress important suite à une réunion difficile.',
          type: 'emotion'
        },
        {
          id: '3',
          date: new Date(2023, 4, 23).toISOString(),
          title: 'Musique: Session de méditation',
          description: 'J\'ai écouté 20 minutes de musique pour me détendre après le travail.',
          type: 'music'
        },
        {
          id: '4',
          date: new Date(2023, 4, 20).toISOString(),
          title: 'Badge débloqué: Introspection',
          description: 'Vous avez débloqué le badge "Introspection" pour 5 entrées de journal consécutives.',
          type: 'achievement'
        },
        {
          id: '5',
          date: new Date(2023, 4, 18).toISOString(),
          title: 'Journal: Gratitude',
          description: 'J\'ai écrit à propos des choses pour lesquelles je suis reconnaissant aujourd\'hui.',
          type: 'journal'
        }
      ];
      
      setEvents(sampleEvents);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  const filterEvents = (type: string) => {
    setActiveFilter(type);
  };
  
  const filteredEvents = activeFilter === "all" 
    ? events 
    : events.filter(event => event.type === activeFilter);
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'emotion':
        return <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300 flex items-center justify-center">😊</div>;
      case 'journal':
        return <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center">📝</div>;
      case 'achievement':
        return <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 flex items-center justify-center">🏆</div>;
      case 'music':
        return <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 flex items-center justify-center">🎵</div>;
      default:
        return <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 flex items-center justify-center">📅</div>;
    }
  };
  
  return (
    <Shell>
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Timeline</h1>
              <p className="text-muted-foreground">
                Suivez votre parcours émotionnel et votre progression
              </p>
            </div>
            <Button className="mt-4 md:mt-0" size="sm">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Ajouter un événement
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger 
                value="all" 
                onClick={() => filterEvents("all")}
              >
                Tout
              </TabsTrigger>
              <TabsTrigger 
                value="emotion" 
                onClick={() => filterEvents("emotion")}
              >
                Émotions
              </TabsTrigger>
              <TabsTrigger 
                value="journal" 
                onClick={() => filterEvents("journal")}
              >
                Journal
              </TabsTrigger>
              <TabsTrigger 
                value="music" 
                onClick={() => filterEvents("music")}
              >
                Musique
              </TabsTrigger>
              <TabsTrigger 
                value="achievement" 
                onClick={() => filterEvents("achievement")}
              >
                Réussites
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border"></div>
              
              {/* Timeline events */}
              <div className="space-y-8">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative pl-14"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1">
                      {getEventIcon(event.type)}
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="text-sm text-muted-foreground mb-1">
                          {formatDate(event.date)}
                        </div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {event.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
              <p className="text-muted-foreground mb-4">
                Aucun événement à afficher pour ce filtre
              </p>
              <Button variant="outline" onClick={() => filterEvents("all")}>
                Voir tous les événements
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </Shell>
  );
};

export default TimelinePage;
