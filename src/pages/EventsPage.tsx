
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventsCalendarTab from '@/components/dashboard/admin/tabs/EventsCalendarTab';

const EventsPage: React.FC = () => {
  // Sample events data for demonstration
  const eventsData = [
    {
      date: "2025-06-10",
      title: "Atelier de gestion du stress",
      status: "confirmed",
      attendees: 15
    },
    {
      date: "2025-06-15",
      title: "Méditation collective",
      status: "pending",
      attendees: 8
    },
    {
      date: "2025-06-22",
      title: "Challenge bien-être",
      status: "confirmed",
      attendees: 25
    },
    {
      date: "2025-07-01",
      title: "Formation bien-être au travail",
      status: "confirmed",
      attendees: 12
    },
  ];

  return (
    <Shell>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Événements & Activités</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gestion des événements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Planifiez et gérez les événements et activités pour améliorer le bien-être.
            </p>
            
            <div className="mt-6">
              <EventsCalendarTab eventsData={eventsData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default EventsPage;
