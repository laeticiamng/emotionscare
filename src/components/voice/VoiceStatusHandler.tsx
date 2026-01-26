// @ts-nocheck

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VoiceStatusHandlerProps {
  children: React.ReactNode;
  isVoiceFeatureEnabled?: boolean;
}

const VoiceStatusHandler: React.FC<VoiceStatusHandlerProps> = ({ 
  children, 
  isVoiceFeatureEnabled = false 
}) => {
  if (!isVoiceFeatureEnabled) {
    return (
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          Les fonctions vocales sont temporairement en maintenance. 
          Elles seront disponibles dans la prochaine mise à jour.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default VoiceStatusHandler;
