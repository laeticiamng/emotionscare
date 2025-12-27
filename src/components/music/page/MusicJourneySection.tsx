/**
 * MusicJourneySection - Section parcours musicaux guidés
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { MusicJourneyPlayer } from '@/components/music/MusicJourneyPlayer';
import { useToast } from '@/hooks/use-toast';
import { useMusicJourney } from '@/hooks/useMusicJourney';

export const MusicJourneySection: React.FC = () => {
  const { toast } = useToast();
  const { createJourney } = useMusicJourney();
  const [showJourney, setShowJourney] = useState(false);
  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(null);

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

  const handleStartJourney = async (from: string, to: string) => {
    const journey = await createJourney(from, to);
    if (journey) {
      setActiveJourneyId(journey.id);
      setShowJourney(true);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          Parcours Musical Guidé
        </CardTitle>
        <p className="text-muted-foreground">
          Un voyage progressif de 3 à 5 étapes pour transformer votre état émotionnel
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showJourney ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {journeyOptions.map((option) => (
                <Button
                  key={`${option.from}-${option.to}`}
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 hover:bg-purple-500/10 transition-all"
                  onClick={() => handleStartJourney(option.from, option.to)}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-xs font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.duration}</span>
                </Button>
              ))}
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Choisissez votre parcours pour commencer une transformation émotionnelle guidée
            </p>
          </div>
        ) : activeJourneyId ? (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => setShowJourney(false)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux parcours
            </Button>
            <MusicJourneyPlayer 
              journeyId={activeJourneyId}
              onComplete={() => {
                setShowJourney(false);
                setActiveJourneyId(null);
                toast({ 
                  title: '🎉 Parcours terminé !',
                  description: 'Félicitations pour votre progression'
                });
              }}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default MusicJourneySection;
