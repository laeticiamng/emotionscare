
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, Plus } from 'lucide-react';

const EventsPage: React.FC = () => {
  const events = [
    { 
      id: 1, 
      title: 'Session Bien-être Équipe', 
      date: '2024-01-20', 
      time: '14:00', 
      participants: 25, 
      location: 'Salle de conférence A',
      status: 'confirmed'
    },
    { 
      id: 2, 
      title: 'Atelier Gestion du Stress', 
      date: '2024-01-22', 
      time: '10:00', 
      participants: 15, 
      location: 'En ligne',
      status: 'pending'
    },
    { 
      id: 3, 
      title: 'Formation Mindfulness', 
      date: '2024-01-25', 
      time: '16:30', 
      participants: 30, 
      location: 'Espace détente',
      status: 'confirmed'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Événements & Sessions</h1>
          <p className="text-muted-foreground">
            Organisez et gérez les événements bien-être
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Événement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements ce Mois</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">348</div>
            <p className="text-xs text-muted-foreground">Inscriptions confirmées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Participation</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6/5</div>
            <p className="text-xs text-muted-foreground">Note moyenne</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Événements Programmés</CardTitle>
          <CardDescription>Liste des prochains événements organisés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between border-b pb-4">
                <div className="space-y-2">
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{event.participants} participants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                    {event.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Gérer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsPage;
