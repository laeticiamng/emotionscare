
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, Plus } from 'lucide-react';

const EventsPage: React.FC = () => {
  const events = [
    {
      id: 1,
      title: "Séance de méditation en groupe",
      description: "Une session de méditation guidée pour réduire le stress",
      date: "2024-01-20",
      time: "14:00",
      participants: 12,
      location: "Salle de bien-être",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Atelier gestion du stress",
      description: "Techniques pratiques pour gérer le stress au travail",
      date: "2024-01-18",
      time: "10:30",
      participants: 8,
      location: "Salle de formation",
      status: "completed"
    },
    {
      id: 3,
      title: "Session de coaching collectif",
      description: "Améliorer la communication en équipe",
      date: "2024-01-25",
      time: "16:00",
      participants: 15,
      location: "Espace collaboratif",
      status: "upcoming"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Événements</h1>
          <p className="text-muted-foreground">
            Gérez les événements et sessions de bien-être
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Créer un événement
        </Button>
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <p className="text-muted-foreground">{event.description}</p>
                </div>
                <Badge variant={event.status === 'completed' ? 'secondary' : 'default'}>
                  {event.status === 'completed' ? 'Terminé' : 'À venir'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{event.participants} participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
