/**
 * MusicJourneySection - Section parcours musicaux guidés
 * Avec historique des parcours et création personnalisée
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles, ArrowLeft, History, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { MusicJourneyPlayer } from '@/components/music/MusicJourneyPlayer';
import { useToast } from '@/hooks/use-toast';
import { useMusicJourney, type MusicJourney } from '@/hooks/useMusicJourney';

export const MusicJourneySection: React.FC = () => {
  const { toast } = useToast();
  const { createJourney, isCreating, getUserJourneys, loadJourney } = useMusicJourney();
  const [showJourney, setShowJourney] = useState(false);
  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(null);
  const [pastJourneys, setPastJourneys] = useState<MusicJourney[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const journeyOptions = [
    { from: 'anxious', to: 'calm', emoji: '😰 → 😌', label: 'Anxiété → Calme', duration: '15 min' },
    { from: 'sad', to: 'joy', emoji: '😢 → 😊', label: 'Tristesse → Joie', duration: '20 min' },
    { from: 'anger', to: 'calm', emoji: '😠 → 😌', label: 'Colère → Calme', duration: '12 min' },
    { from: 'stressed', to: 'energetic', emoji: '😓 → ⚡', label: 'Stress → Énergie', duration: '18 min' },
    { from: 'tired', to: 'focused', emoji: '😴 → 🎯', label: 'Fatigue → Focus', duration: '10 min' },
    { from: 'lonely', to: 'connected', emoji: '😔 → 💕', label: 'Solitude → Connexion', duration: '25 min' },
    { from: 'overwhelmed', to: 'peaceful', emoji: '😵 → 🕊️', label: 'Submergé → Paisible', duration: '22 min' },
    { from: 'unmotivated', to: 'inspired', emoji: '😑 → 🚀', label: 'Démotivé → Inspiré', duration: '15 min' },
  ];

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoadingHistory(true);
      const journeys = await getUserJourneys();
      setPastJourneys(journeys);
      setIsLoadingHistory(false);
    };
    loadHistory();
  }, [getUserJourneys]);

  const handleStartJourney = async (from: string, to: string) => {
    const journey = await createJourney(from, to);
    if (journey) {
      setActiveJourneyId(journey.id);
      setShowJourney(true);
    }
  };

  const handleResumeJourney = async (journeyId: string) => {
    const journey = await loadJourney(journeyId);
    if (journey) {
      setActiveJourneyId(journeyId);
      setShowJourney(true);
    }
  };

  const handleComplete = () => {
    setShowJourney(false);
    setActiveJourneyId(null);
    // Refresh history
    getUserJourneys().then(setPastJourneys);
    toast({ 
      title: '🎉 Parcours terminé !',
      description: 'Félicitations pour votre progression'
    });
  };

  if (showJourney && activeJourneyId) {
    return (
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="pt-6 space-y-4">
          <Button
            variant="ghost"
            onClick={() => setShowJourney(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux parcours
          </Button>
          <MusicJourneyPlayer 
            journeyId={activeJourneyId}
            onComplete={handleComplete}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          Parcours Musical Guidé
        </CardTitle>
        <CardDescription>
          Un voyage progressif de 3 à 5 étapes pour transformer votre état émotionnel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="new" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">
              <Sparkles className="h-4 w-4 mr-2" />
              Nouveau parcours
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {journeyOptions.map((option) => (
                <Button
                  key={`${option.from}-${option.to}`}
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 hover:bg-purple-500/10 transition-all"
                  onClick={() => handleStartJourney(option.from, option.to)}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <span className="text-2xl">{option.emoji}</span>
                  )}
                  <span className="text-xs font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.duration}</span>
                </Button>
              ))}
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Choisissez votre parcours pour commencer une transformation émotionnelle guidée
            </p>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : pastJourneys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun parcours effectué</p>
                <p className="text-sm">Lancez votre premier parcours !</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pastJourneys.map((journey) => (
                  <Card key={journey.id} className="bg-card/50">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{journey.title}</p>
                            <Badge 
                              variant={journey.status === 'completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {journey.status === 'completed' ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Terminé
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3 mr-1" />
                                  En cours
                                </>
                              )}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <Progress value={journey.progress_percentage || 0} className="h-1.5" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {journey.current_step || 0}/{journey.total_steps} étapes • {Math.round(journey.progress_percentage || 0)}%
                            </p>
                          </div>
                        </div>
                        {journey.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResumeJourney(journey.id)}
                          >
                            Reprendre
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MusicJourneySection;
