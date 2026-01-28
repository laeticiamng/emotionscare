/**
 * EmergencyAccessModal - Modal d'accès rapide aux protocoles d'urgence
 * Accessible sans authentification pour les situations critiques
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  StopCircle, 
  Moon, 
  Zap, 
  Wind, 
  Heart, 
  Phone,
  X,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmergencyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'stop' | 'night' | 'reset';
}

interface Protocol {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  duration: string;
  color: string;
  bgColor: string;
  path: string;
}

const protocols: Protocol[] = [
  {
    id: 'stop',
    title: 'Urgence Stop',
    subtitle: 'Montée anxieuse en cours',
    icon: <StopCircle className="h-6 w-6" />,
    duration: '2 min',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30',
    path: '/app/scan?mode=stop'
  },
  {
    id: 'night',
    title: 'Arrêt Mental',
    subtitle: 'Cerveau qui tourne, corps épuisé',
    icon: <Moon className="h-6 w-6" />,
    duration: '5 min',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30',
    path: '/app/scan?mode=mental-stop'
  },
  {
    id: 'reset',
    title: 'Reset Express',
    subtitle: 'Besoin de continuer sans craquer',
    icon: <Zap className="h-6 w-6" />,
    duration: '3 min',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30',
    path: '/app/scan?mode=reset'
  },
  {
    id: 'breath',
    title: 'Respiration Rapide',
    subtitle: 'Relâcher la tension physique',
    icon: <Wind className="h-6 w-6" />,
    duration: '3 min',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30',
    path: '/app/vr-breath-guide'
  }
];

const emergencyNumbers = [
  { name: '3114', label: 'Prévention du suicide', available: '24h/24' },
  { name: '15', label: 'SAMU', available: '24h/24' },
  { name: '112', label: 'Urgences européen', available: '24h/24' }
];

export const EmergencyAccessModal: React.FC<EmergencyAccessModalProps> = ({
  isOpen,
  onClose,
  defaultMode
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProtocolClick = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="h-5 w-5 text-primary" />
            Accès Rapide - Protocoles d'Urgence
          </DialogTitle>
          <DialogDescription>
            Choisissez le protocole adapté à votre situation. Aucune inscription requise.
          </DialogDescription>
        </DialogHeader>

        {/* Protocoles */}
        <div className="grid gap-3 mt-4">
          {protocols.map((protocol) => (
            <Card 
              key={protocol.id}
              className={cn(
                "cursor-pointer transition-all duration-200 border",
                protocol.bgColor,
                defaultMode === protocol.id && "ring-2 ring-primary"
              )}
              onClick={() => handleProtocolClick(protocol.path)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", protocol.bgColor, protocol.color)}>
                    {protocol.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        {protocol.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {protocol.duration}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {protocol.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Séparateur */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              En cas de détresse grave
            </span>
          </div>
        </div>

        {/* Numéros d'urgence */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Lignes d'écoute gratuites et confidentielles</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {emergencyNumbers.map((num) => (
              <a
                key={num.name}
                href={`tel:${num.name}`}
                className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
              >
                <Phone className="h-4 w-4 text-primary mb-1" />
                <span className="font-bold text-lg">{num.name}</span>
                <span className="text-xs text-muted-foreground">{num.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* CTA inscription */}
        {!user && (
          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-center text-muted-foreground mb-3">
              Créez un compte gratuit pour sauvegarder votre progression et accéder à plus de fonctionnalités.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Se connecter</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Créer un compte</Link>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyAccessModal;
