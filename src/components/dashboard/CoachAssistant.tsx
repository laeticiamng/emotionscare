
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, CalendarCheck, RefreshCw } from 'lucide-react';
import { triggerCoachEvent } from '@/lib/coachService';

interface CoachAssistantProps {
  className?: string;
}

export function CoachAssistant({ className }: CoachAssistantProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDailyReminder = () => {
    if (!user?.id) return;
    
    triggerCoachEvent('daily_reminder', user.id);
    toast({
      title: "Coach IA activé",
      description: "Rappel quotidien envoyé",
    });
  };

  const handleScanTest = () => {
    if (!user?.id) return;
    
    // Simuler un événement de scan complété
    triggerCoachEvent('scan_completed', user.id, {
      emotion: 'tristesse',
      confidence: 0.85
    });
    
    toast({
      title: "Test déclenché",
      description: "Simulation d'un scan émotionnel négatif",
    });
  };

  const handleAlertTest = () => {
    if (!user?.id) return;
    
    // Simuler une alerte préventive
    triggerCoachEvent('predictive_alert', user.id, {
      alertType: 'negative_trend'
    });
    
    toast({
      title: "Test déclenché",
      description: "Simulation d'une alerte préventive",
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BrainCircuit className="mr-2 h-4 w-4" />
          Coach IA
        </CardTitle>
        <CardDescription>
          Orchestrateur de routines bien-être personnalisées
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-sm">
        <p>
          Le Coach IA orchestre vos rituels bien-être en se basant sur vos scans émotionnels
          et vous propose des sessions VR, de la musique adaptée et du support quand nécessaire.
        </p>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2 w-full">
          <Button 
            variant="outline" 
            className="w-full text-xs" 
            onClick={handleDailyReminder}
            size="sm"
          >
            <CalendarCheck className="mr-1 h-3 w-3" />
            Rappel
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full text-xs" 
            onClick={handleScanTest}
            size="sm"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Test Scan
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full text-xs" 
            onClick={handleAlertTest}
            size="sm"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Test Alerte
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default CoachAssistant;
