import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';

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
  }
];

interface SecurityFooterProps {
  className?: string;
}

const SecurityFooter: React.FC<SecurityFooterProps> = ({ className }) => {
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
                    <Link to="/compliance" className="flex items-center justify-center h-10 w-10 bg-muted rounded-md hover:bg-muted/80 cursor-help transition-colors">
                      <span className="text-xl" aria-hidden="true">{badge.icon}</span>
                      <span className="sr-only">{badge.name}</span>
                    </Link>
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
