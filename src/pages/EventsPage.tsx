
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

/**
 * Page de gestion des événements (Admin)
 */
const EventsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Calendar className="h-8 w-8 text-purple-600" />
          Gestion des Événements
        </h1>
        <p className="text-gray-600">
          Organisez et suivez les événements de bien-être
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendrier des Événements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Module de gestion d'événements en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventsPage;
