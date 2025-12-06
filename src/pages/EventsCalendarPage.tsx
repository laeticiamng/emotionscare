import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function EventsCalendarPage() {
  const events = [
    {
      title: 'Atelier Méditation',
      date: '15 Nov 2025',
      time: '18:00',
      location: 'En ligne',
      type: 'Atelier',
    },
    {
      title: 'Webinaire Gestion du Stress',
      date: '20 Nov 2025',
      time: '14:00',
      location: 'En ligne',
      type: 'Webinaire',
    },
    {
      title: 'Session Coaching Groupe',
      date: '25 Nov 2025',
      time: '10:00',
      location: 'Paris',
      type: 'Coaching',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Calendrier d'Événements</h1>
          <p className="text-muted-foreground">Participez à nos événements communautaires</p>
        </div>
        <Button>Créer un événement</Button>
      </div>

      <div className="space-y-4">
        {events.map((event, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <Badge variant="secondary">{event.type}</Badge>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                </div>
              </div>
              
              <Button>S'inscrire</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
