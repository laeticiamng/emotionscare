import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logger } from '@/lib/logger';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Video, Calendar, Users, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Webinar {
  id: string;
  title: string;
  date: string;
  speaker: string;
  attendees: number;
  live: boolean;
  registered?: boolean;
}

const STORAGE_KEY = 'emotionscare_webinars';
const REGISTRATION_KEY = 'emotionscare_webinar_registrations';

const initialWebinars: Webinar[] = [
  {
    id: 'webinar-1',
    title: 'Introduction au Bien-être Mental',
    date: '18 Nov 2025, 19:00',
    speaker: 'Dr. Sophie Martin',
    attendees: 234,
    live: false,
  },
  {
    id: 'webinar-2',
    title: 'Techniques de Méditation Moderne',
    date: 'En direct maintenant',
    speaker: 'Jean Dupont',
    attendees: 567,
    live: true,
  },
  {
    id: 'webinar-3',
    title: 'Gérer le Stress au Travail',
    date: '22 Nov 2025, 14:00',
    speaker: 'Marie Laurent',
    attendees: 189,
    live: false,
  },
];

export default function WebinarsPage() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Load webinars and registrations from localStorage
  useEffect(() => {
    const storedWebinars = localStorage.getItem(STORAGE_KEY);
    const storedRegistrations = localStorage.getItem(REGISTRATION_KEY);

    if (storedWebinars) {
      try {
        setWebinars(JSON.parse(storedWebinars));
      } catch (error) {
        logger.warn('Error loading webinars', { error }, 'STORAGE');
        setWebinars(initialWebinars);
      }
    } else {
      setWebinars(initialWebinars);
    }

    if (storedRegistrations) {
      try {
        setRegistrations(new Set(JSON.parse(storedRegistrations)));
      } catch (error) {
        logger.warn('Error loading registrations', { error }, 'STORAGE');
        setRegistrations(new Set());
      }
    }
  }, []);

  // Save webinars to localStorage whenever they change
  useEffect(() => {
    if (webinars.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(webinars));
    }
  }, [webinars]);

  // Save registrations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      REGISTRATION_KEY,
      JSON.stringify(Array.from(registrations))
    );
  }, [registrations]);

  const handleActionClick = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setShowDialog(true);
  };

  const handleConfirmAction = () => {
    if (!selectedWebinar) return;

    if (selectedWebinar.live) {
      // Join live webinar
      toast({
        title: 'Connexion au webinaire',
        description: `Vous rejoignez "${selectedWebinar.title}"`,
        variant: 'success',
      });

      // Update attendee count
      setWebinars((prev) =>
        prev.map((w) =>
          w.id === selectedWebinar.id ? { ...w, attendees: w.attendees + 1 } : w
        )
      );
    } else {
      // Register for upcoming webinar
      if (!registrations.has(selectedWebinar.id)) {
        setRegistrations((prev) => new Set(prev).add(selectedWebinar.id));

        toast({
          title: 'Inscription confirmée',
          description: `Vous êtes inscrit à "${selectedWebinar.title}"`,
          variant: 'success',
        });

        // Update attendee count
        setWebinars((prev) =>
          prev.map((w) =>
            w.id === selectedWebinar.id ? { ...w, attendees: w.attendees + 1 } : w
          )
        );
      } else {
        toast({
          title: 'Déjà inscrit',
          description: 'Vous êtes déjà inscrit à ce webinaire',
          variant: 'info',
        });
      }
    }

    setShowDialog(false);
    setSelectedWebinar(null);
  };

  const isRegistered = (webinarId: string) => registrations.has(webinarId);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link to="/app/home" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour au dashboard
      </Link>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Webinaires</h1>
        <p className="text-muted-foreground">
          Assistez à nos webinaires en direct et en replay
        </p>
      </div>

      <div className="space-y-4">
        {webinars.map((webinar) => (
          <Card key={webinar.id} className="p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{webinar.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Par {webinar.speaker}
                    </p>
                  </div>
                  {webinar.live && (
                    <Badge variant="destructive" className="animate-pulse">
                      LIVE
                    </Badge>
                  )}
                  {!webinar.live && isRegistered(webinar.id) && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Inscrit
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

              <Button onClick={() => handleActionClick(webinar)}>
                {webinar.live ? 'Rejoindre' : "S'inscrire"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedWebinar?.live
                ? 'Rejoindre le webinaire'
                : "Confirmer l'inscription"}
            </DialogTitle>
            <DialogDescription>
              {selectedWebinar?.live ? (
                <>
                  Vous allez rejoindre le webinaire en direct "
                  {selectedWebinar?.title}" avec {selectedWebinar?.speaker}.
                </>
              ) : (
                <>
                  Voulez-vous vous inscrire au webinaire "{selectedWebinar?.title}"
                  prévu le {selectedWebinar?.date} ?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirmAction}>
              {selectedWebinar?.live ? 'Rejoindre' : "S'inscrire"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
