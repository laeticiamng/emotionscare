// @ts-nocheck
import React from 'react';
import { Shield, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AnonymityGuardProps {
  minN: number;
  currentN?: number;
}

export const AnonymityGuard: React.FC<AnonymityGuardProps> = ({ minN, currentN }) => {
  return (
    <Alert>
      <Shield className="h-4 w-4" />
      <AlertDescription className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span>
          Échantillon insuffisant pour garantir l'anonymat 
          ({currentN ? `${currentN} < ` : ''}≥ {minN} requis)
        </span>
      </AlertDescription>
    </Alert>
  );
};