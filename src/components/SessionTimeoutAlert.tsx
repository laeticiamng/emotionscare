
import React, { useEffect } from 'react';
import { useSessionSecurity } from '@/hooks/use-session-security';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SessionTimeoutAlert: React.FC = () => {
  const auth = useAuth();
  const { toast } = useToast();
  
  // Only proceed if user is authenticated
  const { showWarning, resetTimer, timeLeft } = useSessionSecurity();
  
  useEffect(() => {
    if (auth.isAuthenticated && showWarning) {
      toast({
        title: "Session expiration",
        description: (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-destructive">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Votre session va expirer dans {Math.round(timeLeft)} secondes.</span>
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
  }, [showWarning, toast, resetTimer, auth.isAuthenticated, timeLeft]);
  
  return null; // This is a non-visual component
};

export default SessionTimeoutAlert;
