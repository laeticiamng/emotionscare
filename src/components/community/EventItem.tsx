import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { CommunityEvent } from '@/types/community';

interface EventItemProps {
  event: CommunityEvent;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const dateString = typeof event.date === 'string' ? event.date : event.date.toISOString();
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">{format(new Date(dateString), 'PPP p')}</span>
        </div>
        <h3 className="text-lg font-semibold mt-1">{event.title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{event.description}</p>
        {event.location && (
          <p className="text-xs text-muted-foreground mt-2">{event.location}</p>
        )}
      </CardContent>
      {event.participants !== undefined && (
        <CardFooter className="text-sm text-muted-foreground">
          {event.participants} participants
        </CardFooter>
      )}
    </Card>
  );
};

export default EventItem;
