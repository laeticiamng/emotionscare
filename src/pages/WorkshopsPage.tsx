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
import { Users, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Workshop {
  id: string;
  title: string;
  duration: string;
  maxParticipants: number;
  currentParticipants: number;
  level: string;
}

const STORAGE_KEY = 'emotionscare_workshops';
const REGISTRATION_KEY = 'emotionscare_workshop_registrations';

const initialWorkshops: Workshop[] = [
  {
    id: 'workshop-1',
    title: 'Techniques de Respiration',
    duration: '2h',
    maxParticipants: 12,
    currentParticipants: 5,
    level: 'Débutant',
  },
  {
    id: 'workshop-2',
    title: 'Méditation Avancée',
    duration: '3h',
    maxParticipants: 8,
    currentParticipants: 3,
    level: 'Avancé',
  },
  {
    id: 'workshop-3',
    title: 'Gestion des Émotions',
    duration: '2h30',
    maxParticipants: 15,
    currentParticipants: 15,
    level: 'Intermédiaire',
  },
  {
    id: 'workshop-4',
    title: 'Yoga et Pleine Conscience',
    duration: '1h30',
    maxParticipants: 20,
    currentParticipants: 8,
    level: 'Débutant',
  },
  {
    id: 'workshop-5',
    title: 'Art-thérapie',
    duration: '2h',
    maxParticipants: 10,
    currentParticipants: 6,
    level: 'Tous niveaux',
  },
  {
    id: 'workshop-6',
    title: 'Communication Non-Violente',
    duration: '3h',
    maxParticipants: 16,
    currentParticipants: 12,
    level: 'Intermédiaire',
  },
];

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Load workshops and registrations from localStorage
  useEffect(() => {
    const storedWorkshops = localStorage.getItem(STORAGE_KEY);
    const storedRegistrations = localStorage.getItem(REGISTRATION_KEY);

    if (storedWorkshops) {
      try {
        setWorkshops(JSON.parse(storedWorkshops));
      } catch (error) {
        logger.warn('Error loading workshops', { error }, 'STORAGE');
        setWorkshops(initialWorkshops);
      }
    } else {
      setWorkshops(initialWorkshops);
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

  // Save workshops to localStorage whenever they change
  useEffect(() => {
    if (workshops.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workshops));
    }
  }, [workshops]);

  // Save registrations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      REGISTRATION_KEY,
      JSON.stringify(Array.from(registrations))
    );
  }, [registrations]);

  const isAvailable = (workshop: Workshop) => {
    return workshop.currentParticipants < workshop.maxParticipants;
  };

  const isRegistered = (workshopId: string) => registrations.has(workshopId);

  const handleRegisterClick = (workshop: Workshop) => {
    if (!isAvailable(workshop)) {
      toast({
        title: 'Atelier complet',
        description: 'Cet atelier a atteint sa capacité maximale',
        variant: 'destructive',
      });
      return;
    }

    if (isRegistered(workshop.id)) {
      toast({
        title: 'Déjà inscrit',
        description: 'Vous êtes déjà inscrit à cet atelier',
        variant: 'info',
      });
      return;
    }

    setSelectedWorkshop(workshop);
    setShowDialog(true);
  };

  const handleConfirmRegistration = () => {
    if (!selectedWorkshop) return;

    // Add to registrations
    setRegistrations((prev) => new Set(prev).add(selectedWorkshop.id));

    // Update participant count
    setWorkshops((prev) =>
      prev.map((w) =>
        w.id === selectedWorkshop.id
          ? { ...w, currentParticipants: w.currentParticipants + 1 }
          : w
      )
    );

    toast({
      title: 'Inscription confirmée',
      description: `Vous êtes inscrit à l'atelier "${selectedWorkshop.title}"`,
      variant: 'success',
    });

    setShowDialog(false);
    setSelectedWorkshop(null);
  };

  const getSpotsLeft = (workshop: Workshop) => {
    return workshop.maxParticipants - workshop.currentParticipants;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link to="/app/home" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour au dashboard
      </Link>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Ateliers</h1>
        <p className="text-muted-foreground">
          Participez à nos ateliers pratiques pour développer vos compétences
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop) => {
          const available = isAvailable(workshop);
          const registered = isRegistered(workshop.id);
          const spotsLeft = getSpotsLeft(workshop);

          return (
            <Card key={workshop.id} className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold">{workshop.title}</h3>
                  {registered && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <Badge variant="outline">{workshop.level}</Badge>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Durée: {workshop.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {workshop.currentParticipants}/{workshop.maxParticipants}{' '}
                  participants
                </div>
                {available && spotsLeft <= 3 && spotsLeft > 0 && (
                  <p className="text-orange-500 font-medium">
                    Plus que {spotsLeft} place{spotsLeft > 1 ? 's' : ''} !
                  </p>
                )}
              </div>

              <Button
                className="w-full"
                disabled={!available || registered}
                onClick={() => handleRegisterClick(workshop)}
              >
                {registered
                  ? 'Inscrit'
                  : available
                  ? "S'inscrire"
                  : 'Complet'}
              </Button>
            </Card>
          );
        })}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'inscription</DialogTitle>
            <DialogDescription>
              Voulez-vous vous inscrire à l'atelier "{selectedWorkshop?.title}" ?
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Durée: {selectedWorkshop?.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Niveau: {selectedWorkshop?.level}</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirmRegistration}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
