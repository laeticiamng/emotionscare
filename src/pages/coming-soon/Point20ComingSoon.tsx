import React from 'react';
import { ComingSoon } from '@/components/coming-soon/ComingSoon';
import { Target } from 'lucide-react';

/**
 * Page Coming Soon pour le module Point20
 */
export const Point20ComingSoon: React.FC = () => {
  return (
    <ComingSoon
      moduleName="Point20"
      description="Check-ins réguliers de 20 secondes pour suivre votre état émotionnel en continu"
      icon={<Target className="h-16 w-16 text-primary" />}
      features={[
        'Check-ins rapides de 20 secondes',
        'Suivi émotionnel en temps réel',
        'Graphiques de tendances émotionnelles',
        'Détection de patterns et alertes',
        'Recommandations contextuelles',
        'Export des données pour analyse',
      ]}
      estimatedRelease="Q3 2025"
      notifyEnabled
    />
  );
};

export default Point20ComingSoon;
