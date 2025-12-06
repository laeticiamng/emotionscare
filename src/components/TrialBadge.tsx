
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface TrialBadgeProps {
  user?: {
    trialEndingSoon?: boolean;
    trialEndsAt?: string;
  } | null;
}

const TrialBadge: React.FC<TrialBadgeProps> = ({ user }) => {
  // N'afficher le badge QUE si le flag trialEndingSoon existe et est true
  // Plus d'erreur console si le flag n'existe pas
  if (!user?.trialEndingSoon) {
    return null;
  }

  // Calculer les jours restants si trialEndsAt est disponible
  const daysRemaining = user.trialEndsAt ? 
    Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
    null;

  return (
    <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
      <Clock className="h-3 w-3" />
      {daysRemaining !== null && daysRemaining <= 1 ? 
        'Essai expire demain' : 
        'Essai expire bientôt'
      }
    </Badge>
  );
};

export default TrialBadge;
