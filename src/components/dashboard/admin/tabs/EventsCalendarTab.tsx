// @ts-nocheck

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';

export interface EventsCalendarTabProps {
  eventsData: Array<{
    date: string;
    title: string;
    status: string;
    attendees: number;
  }>;
  isLoading?: boolean;
}

const EventsCalendarTab: React.FC<EventsCalendarTabProps> = ({ eventsData, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-80 w-full col-span-1 md:col-span-2" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-card col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Événements planifiés</CardTitle>
          <CardDescription>Ateliers, sondages et challenges à venir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Événement</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Participants</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventsData.map((event, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 px-4">{new Date(event.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4">{event.title}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {event.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{event.attendees}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Modifier</Button>
                        <Button size="sm" variant="outline">Annuler</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <Button className="bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white">
              Nouvel événement
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
          <CardDescription>Vue mensuelle des événements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            [Composant Calendrier avec événements]
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Événements récurrents</CardTitle>
          <CardDescription>Automatisation des événements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Check-in hebdomadaire</h4>
                <p className="text-sm text-muted-foreground">Tous les lundis à 10h</p>
              </div>
              <Button variant="outline" size="sm">Modifier</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Pause bien-être</h4>
                <p className="text-sm text-muted-foreground">Tous les jours à 15h</p>
              </div>
              <Button variant="outline" size="sm">Modifier</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Bilan mensuel</h4>
                <p className="text-sm text-muted-foreground">Dernier vendredi du mois</p>
              </div>
              <Button variant="outline" size="sm">Modifier</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsCalendarTab;
