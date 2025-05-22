
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const EventsPage: React.FC = () => {
  // Mock events data
  const upcomingEvents = [
    {
      id: 1,
      title: 'Atelier de méditation',
      date: '2025-05-25',
      time: '10:00 - 11:30',
      location: 'Salle de conférence A'
    },
    {
      id: 2,
      title: 'Webinaire sur la gestion du stress',
      date: '2025-05-28',
      time: '14:00 - 15:30',
      location: 'En ligne'
    },
    {
      id: 3,
      title: 'Conférence sur l\'intelligence émotionnelle',
      date: '2025-06-03',
      time: '09:30 - 12:00',
      location: 'Auditorium principal'
    }
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Événements</h1>
        <button className="btn bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md">
          Ajouter un événement
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Événements à venir</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{event.title}</h3>
                    <p className="text-muted-foreground mt-1">
                      {formatDate(event.date)}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{event.time}</span>
                    </div>
                    <p className="mt-1 text-sm">{event.location}</p>
                  </div>
                  <div className="space-x-2">
                    <button className="text-sm text-blue-500 hover:text-blue-700">
                      Modifier
                    </button>
                    <button className="text-sm text-red-500 hover:text-red-700">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted/20 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Calendrier des événements</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsPage;
