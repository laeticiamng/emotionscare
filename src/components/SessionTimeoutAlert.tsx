
import React, { useEffect, useState } from 'react';
import { useSessionSecurity } from '@/hooks/use-session-security';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SessionTimeoutAlertProps {
  onContinue: () => void;
}

const SessionTimeoutAlert: React.FC<SessionTimeoutAlertProps> = ({ onContinue }) => {
  const { timeoutWarning, resetActivity } = useSessionSecurity();
  const [countdown, setCountdown] = useState(60);
  
  // Handle countdown when warning is displayed
  useEffect(() => {
    if (timeoutWarning) {
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeoutWarning]);
  
  // Handle continue session
  const handleContinue = () => {
    resetActivity();
    onContinue();
  };
  
  return (
    <AlertDialog open={timeoutWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session sur le point d'expirer</AlertDialogTitle>
          <AlertDialogDescription>
            Votre session va expirer dans {countdown} secondes pour des raisons de sécurité.
            Souhaitez-vous rester connecté?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleContinue}>
            Continuer la session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionTimeoutAlert;
