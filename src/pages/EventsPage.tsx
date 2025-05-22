
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, MapPin, Users, Clock, Plus, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'atelier' | 'conference' | 'teambuilding' | 'formation';
  date: string;
  time: string;
  location: string;
  capacity: number;
  participants: number;
  registered?: boolean;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Atelier gestion du stress',
    description: 'Découvrez des techniques efficaces pour gérer le stress au quotidien.',
    type: 'atelier',
    date: '30 mai 2025',
    time: '14:00 - 15:30',
    location: 'Salle Harmonie',
    capacity: 20,
    participants: 12,
  },
  {
    id: '2',
    title: 'Conférence sur le bien-être au travail',
    description: 'Explorez les meilleures pratiques pour maintenir un équilibre sain entre vie professionnelle et personnelle.',
    type: 'conference',
    date: '2 juin 2025',
    time: '10:00 - 12:00',
    location: 'Auditorium Central',
    capacity: 100,
    participants: 45,
  },
  {
    id: '3',
    title: 'Team building: Construction d\'équipe',
    description: 'Renforcez les liens au sein de votre équipe avec des activités ludiques et collaboratives.',
    type: 'teambuilding',
    date: '10 juin 2025',
    time: '09:00 - 17:00',
    location: 'Parc des Expositions',
    capacity: 30,
    participants: 28,
  },
  {
    id: '4',
    title: 'Formation méditation mindfulness',
    description: 'Initiez-vous à la méditation de pleine conscience et ses bienfaits pour la concentration.',
    type: 'formation',
    date: '15 juin 2025',
    time: '16:00 - 17:30',
    location: 'Salle Zen',
    capacity: 15,
    participants: 8,
  },
];

const EventsPage: React.FC = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filter, setFilter] = useState<string>('all');
  
  const registerForEvent = (id: string) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, registered: true, participants: event.participants + 1 } : event
    ));
    
    toast({
      title: "Inscription confirmée",
      description: "Vous êtes inscrit à cet événement",
    });
  };
  
  const cancelRegistration = (id: string) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, registered: false, participants: event.participants - 1 } : event
    ));
    
    toast({
      title: "Inscription annulée",
      description: "Votre inscription a été annulée",
    });
  };
  
  const showCreateEventModal = () => {
    toast({
      title: "Création d'événement",
      description: "Cette fonctionnalité sera disponible prochainement",
    });
  };
  
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.type === filter);
  
  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Événements</h1>
          <p className="text-muted-foreground">Découvrez les événements bien-être à venir et inscrivez-vous</p>
        </div>
        <Button onClick={showCreateEventModal}>
          <Plus className="mr-2 h-4 w-4" />
          Créer un événement
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="myevents">Mes inscriptions</TabsTrigger>
            <TabsTrigger value="past">Passés</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="atelier">Atelier</SelectItem>
                <SelectItem value="conference">Conférence</SelectItem>
                <SelectItem value="teambuilding">Team building</SelectItem>
                <SelectItem value="formation">Formation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="upcoming" className="space-y-4">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event}
                  onRegister={() => registerForEvent(event.id)}
                  onCancel={() => cancelRegistration(event.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun événement trouvé pour ce filtre.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setFilter('all')}
              >
                Voir tous les événements
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="myevents">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.filter(e => e.registered).length > 0 ? (
              events
                .filter(e => e.registered)
                .map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event}
                    onRegister={() => {}}
                    onCancel={() => cancelRegistration(event.id)}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Vous n'êtes inscrit à aucun événement.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setFilter('all')}
                >
                  Parcourir les événements
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="past">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Les événements passés seront affichés ici.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface EventCardProps {
  event: Event;
  onRegister: () => void;
  onCancel: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRegister, onCancel }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'atelier':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'conference':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'teambuilding':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'formation':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="mb-2">{event.title}</CardTitle>
          <Badge className={getTypeColor(event.type)} variant="outline">
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Badge>
        </div>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 py-2 flex-grow">
        <div className="flex items-center text-sm">
          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="mr-2 h-4 w-4 opacity-70" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center text-sm">
          <MapPin className="mr-2 h-4 w-4 opacity-70" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center text-sm">
          <Users className="mr-2 h-4 w-4 opacity-70" />
          <span>{event.participants} / {event.capacity} participants</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        {event.registered ? (
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full"
          >
            Annuler l'inscription
          </Button>
        ) : (
          <Button 
            variant={event.participants >= event.capacity ? "outline" : "default"} 
            disabled={event.participants >= event.capacity}
            onClick={onRegister}
            className="w-full"
          >
            {event.participants >= event.capacity ? "Complet" : "S'inscrire"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventsPage;
