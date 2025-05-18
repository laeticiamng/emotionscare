import React from 'react';
import { useOrchestration } from '@/contexts/OrchestrationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TimelinePage: React.FC = () => {
  const { events } = useOrchestration();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Timeline émotionnelle</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-muted-foreground">Aucun événement enregistré.</p>
          ) : (
            <ul className="space-y-4">
              {events.map((event) => (
                <li key={event.id} className="flex flex-col">
                  <span className="font-medium">{event.mood}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString()} ({event.source})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelinePage;
