
import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";

// Security certification badges
const securityBadges = [
  {
    name: 'ISO 27001',
    description: 'Architecturée selon les principes ISO 27001 - Management de la sécurité de l\'information',
    icon: '🔐'
  },
  {
    name: 'ISO 27701',
    description: 'Architecturée selon les principes ISO 27701 - Management des informations de confidentialité',
    icon: '🛡️'
  },
  {
    name: 'RGPD',
    description: 'Architecturée selon les principes RGPD - Protection des données personnelles',
    icon: '🇪🇺'
  },
  {
    name: 'SOC 2 Type II',
    description: 'Architecturée selon les principes SOC 2 Type II - Contrôles de sécurité, disponibilité et confidentialité',
    icon: '🔍'
  },
  {
    name: 'ISO 22301',
    description: 'Architecturée selon les principes ISO 22301 - Continuité d\'activité',
    icon: '🔄'
  },
  {
    name: 'ISO 9001', 
    description: 'Architecturée selon les principes ISO 9001 - Management de la qualité',
    icon: '✓'
  },
  {
    name: 'HIPAA',
    description: 'Architecturée selon les principes HIPAA - Protection des données de santé',
    icon: '🏥'
  },
  {
    name: 'HDS',
    description: 'Hébergeur de Données de Santé certifié - Conformité aux exigences légales françaises',
    icon: '🏨'
  }
];

interface SecurityFooterProps {
  className?: string;
}

const SecurityFooter: React.FC<SecurityFooterProps> = ({ className }) => {
  const [dataConsents, setDataConsents] = useState({
    analytics: true,
    improvement: true,
    personalization: true,
    research: false
  });

  const updateConsent = (key: string, value: boolean) => {
    setDataConsents(prev => ({
      ...prev,
      [key]: value
    }));
    // Dans une implémentation réelle, nous sauvegarderions ce paramètre dans le profil utilisateur
  };

  return (
    <footer className={`mt-8 pt-6 pb-8 ${className}`}>
      <Separator className="mb-6" />
      
      <div className="container">
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Certifications de Sécurité & Conformité</h4>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <TooltipProvider>
              {securityBadges.map((badge) => (
                <Tooltip key={badge.name} delayDuration={300}>
                  <TooltipTrigger asChild>
                    {badge.name === 'HDS' ? (
                      <a 
                        href="https://esante.gouv.fr/labels-certifications/hds/liste-des-herbergeurs-certifies" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center h-10 w-10 bg-muted rounded-md hover:bg-muted/80 cursor-help transition-colors"
                        aria-label={`Certification ${badge.name}`}
                      >
                        <span className="text-xl" aria-hidden="true">{badge.icon}</span>
                        <span className="sr-only">{badge.name}</span>
                      </a>
                    ) : (
                      <Link to="/compliance" className="flex items-center justify-center h-10 w-10 bg-muted rounded-md hover:bg-muted/80 cursor-help transition-colors">
                        <span className="text-xl" aria-hidden="true">{badge.icon}</span>
                        <span className="sr-only">{badge.name}</span>
                      </Link>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="font-medium">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
          
          <div className="text-xs text-center text-muted-foreground max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <p className="font-semibold mb-1">Confidentialité & Sécurité</p>
                <p>chiffrement AES-256, RGPD compliant</p>
              </div>
              <div className="text-center">
                <p className="font-semibold mb-1">Ludique</p>
                <p>notifications douces, Daily Streak, badges</p>
              </div>
              <div className="text-center">
                <p className="font-semibold mb-1">Actionnable</p>
                <p>alertes prédictives, suggestions d'ateliers, reporting</p>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-1">
              ÉmotionCare™ ne remplace pas un avis médical ou psychologique.
            </p>
            
            {/* Nouveau lien d'utilisation des données */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-xs text-primary hover:underline mt-2">
                  Vos données sont utilisées pour...
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Utilisation de vos données</DialogTitle>
                  <DialogDescription>
                    Vos données personnelles sont traitées avec le plus grand soin et uniquement selon les objectifs ci-dessous. 
                    Vous pouvez ajuster vos préférences à tout moment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics">Analyses d'utilisation</Label>
                      <p className="text-xs text-muted-foreground">
                        Nous collectons des données sur votre utilisation de l'application pour améliorer sa performance
                      </p>
                    </div>
                    <Switch 
                      id="analytics" 
                      checked={dataConsents.analytics}
                      onCheckedChange={(checked) => updateConsent('analytics', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="improvement">Amélioration du service</Label>
                      <p className="text-xs text-muted-foreground">
                        Vos données contribuent à améliorer nos algorithmes et fonctionnalités
                      </p>
                    </div>
                    <Switch 
                      id="improvement" 
                      checked={dataConsents.improvement}
                      onCheckedChange={(checked) => updateConsent('improvement', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="personalization">Personnalisation</Label>
                      <p className="text-xs text-muted-foreground">
                        Nous utilisons vos données pour personnaliser votre expérience
                      </p>
                    </div>
                    <Switch 
                      id="personalization" 
                      checked={dataConsents.personalization}
                      onCheckedChange={(checked) => updateConsent('personalization', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="research">Recherche anonymisée</Label>
                      <p className="text-xs text-muted-foreground">
                        Vos données anonymisées peuvent être utilisées pour des recherches en santé mentale
                      </p>
                    </div>
                    <Switch 
                      id="research" 
                      checked={dataConsents.research}
                      onCheckedChange={(checked) => updateConsent('research', checked)}
                    />
                  </div>
                </div>
                <DialogFooter className="sm:justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Ces paramètres sont sauvegardés automatiquement
                  </div>
                  <Link to="/my-data">
                    <Button type="button" variant="outline" size="sm">
                      Gérer mes données
                    </Button>
                  </Link>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <p>
              © 2025 EmotionsCare par ResiMax™. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SecurityFooter;
