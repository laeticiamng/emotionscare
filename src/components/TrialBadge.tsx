
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { isTrialEndingSoon } from '@/utils/trialHelpers';

interface TrialBadgeProps {
  trialEndsAt: string | null;
}

const TrialBadge: React.FC<TrialBadgeProps> = ({ trialEndsAt }) => {
  if (!trialEndsAt || !isTrialEndingSoon(trialEndsAt)) {
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
