// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  Accessibility, 
  Award, 
  Lock, 
  Heart 
} from 'lucide-react';

const TRUST_INDICATORS = [
  {
    icon: Shield,
    title: 'RGPD Compliant',
    description: 'Conformité européenne données personnelles'
  },
  {
    icon: Eye,
    title: 'Anonymat Garanti',
    description: 'Aucune donnée individuelle visible RH'
  },
  {
    icon: Accessibility,
    title: 'Accessibilité AA',
    description: 'WCAG 2.1 niveau double-A certifié'
  },
  {
    icon: Lock,
    title: 'Chiffrement E2E',
    description: 'Données chiffrées de bout en bout'
  },
  {
    icon: Award,
    title: 'ISO 27001',
    description: 'Sécurité information certifiée'
  },
  {
    icon: Heart,
    title: 'Éthique by Design',
    description: 'Bien-être avant tout, pas de dark patterns'
  }
];

/**
 * Bande d'indicateurs de confiance
 */
export const TrustStrip: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Votre confiance, notre priorité
        </h2>
        <p className="text-muted-foreground">
          Sécurité, confidentialité et éthique au cœur de notre plateforme
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TRUST_INDICATORS.map((indicator, index) => {
          const Icon = indicator.icon;
          
          return (
            <div 
              key={indicator.title}
              className="flex items-start gap-3 p-4 rounded-lg bg-white border"
            >
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm">
                    {indicator.title}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    Certifié
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {indicator.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legal links */}
      <div className="mt-8 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <Link to="/legal/privacy" className="hover:text-primary transition-colors">
            Politique de confidentialité
          </Link>
          <Link to="/legal/terms" className="hover:text-primary transition-colors">
            Conditions d'utilisation
          </Link>
          <Link to="/legal/cookies" className="hover:text-primary transition-colors">
            Gestion des cookies
          </Link>
          <Link to="/legal/accessibility" className="hover:text-primary transition-colors">
            Déclaration d'accessibilité
          </Link>
        </div>
      </div>
    </div>
  );
};