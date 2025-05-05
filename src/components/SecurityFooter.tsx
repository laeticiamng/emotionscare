
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

// Security certification badges
const securityBadges = [
  {
    name: 'ISO 27001',
    description: 'Certifié ISO 27001 - Management de la sécurité de l\'information',
    icon: '🔐' // Using emojis as placeholder, replace with actual badge images
  },
  {
    name: 'SOC 2 Type II',
    description: 'Certifié SOC 2 Type II - Contrôles de sécurité, disponibilité et confidentialité',
    icon: '🛡️'
  },
  {
    name: 'GDPR Compliant',
    description: 'Conforme au RGPD - Protection des données personnelles',
    icon: '🇪🇺'
  },
  {
    name: 'Penetration Tested',
    description: 'Système testé régulièrement par des tests d\'intrusion indépendants',
    icon: '🔍'
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
          
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <TooltipProvider>
              {securityBadges.map((badge) => (
                <Tooltip key={badge.name} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center h-12 w-12 bg-muted rounded-md hover:bg-muted/80 cursor-help transition-colors">
                      <span className="text-2xl" aria-hidden="true">{badge.icon}</span>
                      <span className="sr-only">{badge.name}</span>
                    </div>
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
            <p className="mb-2">
              Données chiffrées AES-256 avec BYOK, authentification multi-facteur,
              conformité GDPR et certification ISO 27001. Audits de sécurité semestriels.
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
