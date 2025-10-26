import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Users } from 'lucide-react';

export default function WebinarsPage() {
  const webinars = [
    {
      title: 'Introduction au Bien-être Mental',
      date: '18 Nov 2025, 19:00',
      speaker: 'Dr. Sophie Martin',
      attendees: 234,
      live: false,
    },
    {
      title: 'Techniques de Méditation Moderne',
      date: 'En direct maintenant',
      speaker: 'Jean Dupont',
      attendees: 567,
      live: true,
    },
    {
      title: 'Gérer le Stress au Travail',
      date: '22 Nov 2025, 14:00',
      speaker: 'Marie Laurent',
      attendees: 189,
      live: false,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Webinaires</h1>
        <p className="text-muted-foreground">
          Assistez à nos webinaires en direct et en replay
        </p>
      </div>

      <div className="space-y-4">
        {webinars.map((webinar, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{webinar.title}</h3>
                    <p className="text-sm text-muted-foreground">Par {webinar.speaker}</p>
                  </div>
                  {webinar.live && (
                    <Badge variant="destructive" className="animate-pulse">
                      LIVE
                    </Badge>
                  )}
                </div>

                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {webinar.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {webinar.attendees} participants
                  </div>
                </div>
              </div>

              <Button>
                {webinar.live ? 'Rejoindre' : 'S\'inscrire'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
