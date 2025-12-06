import React, { useEffect } from 'react';
import { useSessionSecurity } from '@/hooks/use-session-security';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SessionTimeoutAlert: React.FC = () => {
  const auth = useAuth();
  
  // Only proceed if user is authenticated
  const { showWarning, resetTimer, timeLeft } = useSessionSecurity();
  const { toast } = useToast();
  
  useEffect(() => {
    if (auth.isAuthenticated && showWarning) {
      toast({
        title: "Session expiration",
        description: `Votre session va expirer dans ${Math.round(timeLeft)} secondes. Cliquez sur "Prolonger" pour continuer.`,
        action: (
          <Button 
            size="sm" 
            onClick={resetTimer} 
            variant="outline"
          >
            Prolonger
          </Button>
        )
      });
    }
  }, [showWarning, resetTimer, auth.isAuthenticated, timeLeft, toast]);
  
  return null; // This is a non-visual component
};

export default SessionTimeoutAlert;
