
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Clock, MapPin } from 'lucide-react';

const EventsPage: React.FC = () => {
  const events = [
    {
      title: "Session de méditation collective",
      date: "2024-01-25",
      time: "14:00",
      location: "Salle de conférence A",
      status: "À venir"
    },
    {
      title: "Atelier gestion du stress",
      date: "2024-01-28",
      time: "10:00",
      location: "En ligne",
      status: "Ouvert aux inscriptions"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Événements & Activités</h1>
              </div>
              <p className="text-muted-foreground">
                Organisez et gérez les événements bien-être
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvel événement
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {events.map((event, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{event.title}</span>
                  <Badge variant="secondary">{event.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">Modifier</Button>
                  <Button variant="outline" size="sm">Participants</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
