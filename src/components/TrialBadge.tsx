
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
  // N'afficher le badge que si le flag trialEndingSoon existe et est true
  if (!user?.trialEndingSoon) {
    return null;
  }

  return (
    <Badge variant="destructive" className="flex items-center gap-1">
      <Clock className="h-3 w-3" />
      Essai expire bientôt
    </Badge>
  );
};

export default TrialBadge;
