
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, CalendarCheck, RefreshCw, Trophy, Headset, BookOpen } from 'lucide-react';
import { useCoach } from '@/hooks/useCoach';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import UserAvatar from '@/components/community/UserAvatar';

interface CoachAssistantProps {
  className?: string;
}

export function CoachAssistant({ className }: CoachAssistantProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { triggerDailyReminder, triggerAfterScan, triggerAlert, isProcessing } = useCoach();
  const [lastRecommendation, setLastRecommendation] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // Simuler une recommandation basée sur l'heure de la journée
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    let recommendation = '';
    if (hour < 10) {
      recommendation = 'Bonjour ! Commencez votre journée avec un scan émotionnel pour calibrer votre bien-être.';
    } else if (hour < 14) {
      recommendation = 'Une courte session VR de 5 minutes pourrait vous aider à vous recentrer avant l\'après-midi.';
    } else if (hour < 18) {
      recommendation = 'Avez-vous fait votre scan émotionnel aujourd\'hui ? C\'est un bon moment pour une pause bien-être.';
    } else {
      recommendation = 'Avant de terminer votre journée, prenez un moment pour noter vos pensées dans votre journal.';
    }
    
    setLastRecommendation(recommendation);
    
    // Masquer le message de bienvenue après 5 secondes
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDailyReminder = () => {
    if (!user?.id) return;
    triggerDailyReminder();
    toast({
      title: "Coach IA activé",
      description: "Rappel quotidien envoyé",
    });
    setLastRecommendation("N'oubliez pas de faire votre scan émotionnel quotidien pour suivre votre bien-être.");
  };

  const handleScanTest = () => {
    if (!user?.id) return;
    triggerAfterScan('tristesse', 0.85);
    toast({
      title: "Coach IA",
      description: "Une routine adaptée à votre émotion actuelle a été activée",
    });
    setLastRecommendation("J'ai détecté que vous pourriez avoir besoin de soutien. Une session de méditation guidée pourrait vous aider à vous recentrer.");
    setShowWelcome(false);
  };

  const handleAlertTest = () => {
    if (!user?.id) return;
    triggerAlert('negative_trend');
    toast({
      title: "Coach IA",
      description: "Alerte préventive activée",
    });
    setLastRecommendation("J'ai analysé vos données récentes et préparé une routine de bien-être personnalisée pour prévenir le stress.");
    setShowWelcome(false);
  };

  return (
    <Card className={`${className} h-full flex flex-col`}>
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center">
              <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
              Coach IA
            </CardTitle>
            <CardDescription>
              Votre accompagnateur personnalisé
            </CardDescription>
          </div>
          {user && (
            <UserAvatar user={user} size="sm" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 flex-1 overflow-auto space-y-4">
        {showWelcome ? (
          <div className="flex items-center p-3 bg-primary/10 rounded-lg animate-pulse">
            <div className="flex-1">
              <p className="text-sm font-medium">
                Bonjour{user?.name ? ` ${user.name}` : ''} ! Je suis votre Coach IA personnel.
              </p>
            </div>
          </div>
        ) : lastRecommendation ? (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
            <p className="text-sm">
              {lastRecommendation}
            </p>
          </div>
        ) : null}
        
        <div className="space-y-2 flex flex-wrap gap-1">
          <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
            Bien-être
          </Badge>
          <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
            Personnalisation
          </Badge>
          <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
            Routines adaptatives
          </Badge>
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Headset className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span>Sessions VR recommandées selon vos émotions</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span>Journal guidé pour réflexion personnelle</span>
          </div>
          <div className="flex items-center">
            <Trophy className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span>Suivi de progression et défis adaptés</span>
          </div>
        </div>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="pt-3 pb-3 px-4">
        <div className="grid grid-cols-3 gap-2 w-full">
          <Button 
            variant="outline" 
            className="w-full text-xs" 
            onClick={handleDailyReminder}
            size="sm"
            disabled={isProcessing}
          >
            <CalendarCheck className="mr-1 h-3 w-3" />
            Rappel
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full text-xs" 
            onClick={handleScanTest}
            size="sm"
            disabled={isProcessing}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Scan
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full text-xs" 
            onClick={handleAlertTest}
            size="sm"
            disabled={isProcessing}
          >
            <BrainCircuit className="mr-1 h-3 w-3" />
            Alerte
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default CoachAssistant;
