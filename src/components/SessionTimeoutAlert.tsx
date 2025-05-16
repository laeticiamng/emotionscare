
import React, { useEffect } from 'react';
import { useSessionSecurity } from '@/hooks/use-session-security';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SessionTimeoutAlert: React.FC = () => {
  const { showWarning, resetTimer, timeLeft } = useSessionSecurity();
  const { toast } = useToast();
  
  useEffect(() => {
    if (showWarning) {
      toast({
        title: "Alerte de sécurité",
        description: (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-destructive">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Votre session va expirer dans moins d'une minute.</span>
            </div>
            <Button 
              size="sm" 
              onClick={resetTimer} 
              variant="outline"
            >
              Prolonger la session
            </Button>
          </div>
        ),
        variant: "warning",
        duration: 10000
      });
    }
  }, [showWarning, toast, resetTimer]);
  
  return null; // This is a non-visual component
};

export default SessionTimeoutAlert;
