// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Sparkles, Music, Wind, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Interface locale pour l'émotion avec name et color
export interface Emotion {
  name: string;
  color?: string;
  intensity?: number;
}

export interface EmotionFeedbackProps {
  emotion: Emotion;
}

interface PersonalizedRecommendation {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
}

const EmotionFeedback: React.FC<EmotionFeedbackProps> = ({ emotion }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [historicalContext, setHistoricalContext] = useState<{
    frequency: number;
    lastOccurrence: string | null;
    averageIntensity: number;
  } | null>(null);

  useEffect(() => {
    if (user && emotion.name) {
      loadHistoricalContext();
    }
  }, [user, emotion.name]);

  const loadHistoricalContext = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('clinical_signals')
        .select('valence, arousal, created_at, metadata')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filtrer par émotion similaire
      const emotionLower = emotion.name.toLowerCase();
      const similarSignals = (data || []).filter(signal => {
        const summary = ((signal.metadata as any)?.summary || '').toLowerCase();
        return summary.includes(emotionLower) || 
               (emotionLower.includes('joy') && signal.valence > 70) ||
               (emotionLower.includes('calm') && signal.valence > 60 && signal.arousal < 40) ||
               (emotionLower.includes('stress') && signal.valence < 40);
      });

      if (similarSignals.length > 0) {
        const avgIntensity = similarSignals.reduce((sum, s) => {
          // L'intensité est basée sur la distance par rapport au neutre
          const valenceIntensity = Math.abs(s.valence - 50);
          const arousalIntensity = Math.abs(s.arousal - 50);
          return sum + (valenceIntensity + arousalIntensity) / 2;
        }, 0) / similarSignals.length;

        setHistoricalContext({
          frequency: similarSignals.length,
          lastOccurrence: similarSignals[0]?.created_at || null,
          averageIntensity: Math.round(avgIntensity)
        });
      }
    } catch (error) {
      console.error('Failed to load historical context:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Feedback dynamique basé sur l'émotion et le contexte
  const getDynamicFeedback = (emotionName: string): string => {
    const feedbacks: Record<string, string[]> = {
      joy: [
        "La joie est une émotion positive qui peut améliorer votre bien-être général.",
        "Profitez de ce moment de joie pour renforcer vos liens sociaux.",
        "Cette émotion positive booste votre système immunitaire."
      ],
      happy: [
        "Le bonheur actuel est un excellent indicateur de bien-être.",
        "Prenez note de ce qui contribue à ce sentiment positif.",
        "Partagez cette énergie positive avec votre entourage."
      ],
      sadness: [
        "La tristesse est une émotion normale et nécessaire.",
        "Accordez-vous le temps de ressentir cette émotion.",
        "Parler à quelqu'un de confiance peut aider."
      ],
      sad: [
        "La tristesse fait partie du spectre émotionnel naturel.",
        "Prenez soin de vous dans ces moments.",
        "Cette émotion passera avec le temps."
      ],
      anger: [
        "La colère peut indiquer que vos limites ont été franchies.",
        "Prenez quelques respirations profondes avant de réagir.",
        "Identifiez la source de cette colère pour mieux la gérer."
      ],
      fear: [
        "La peur est un mécanisme de protection naturel.",
        "Analysez si cette peur est proportionnelle à la situation.",
        "Des techniques de respiration peuvent aider à la calmer."
      ],
      surprise: [
        "La surprise nous aide à rester adaptables.",
        "Cette émotion augmente temporairement votre vigilance.",
        "Elle peut ouvrir la voie à de nouvelles perspectives."
      ],
      calm: [
        "Le calme vous permet de prendre des décisions réfléchies.",
        "C'est un excellent état pour la méditation et la réflexion.",
        "Profitez de ce moment de sérénité."
      ],
      serene: [
        "La sérénité est un état précieux pour le bien-être mental.",
        "Votre corps et votre esprit sont en harmonie.",
        "C'est le moment idéal pour des activités créatives."
      ],
      anxiety: [
        "L'anxiété peut être canalisée pour vous préparer.",
        "Des exercices de respiration peuvent réduire ces sensations.",
        "Identifiez ce qui déclenche cette anxiété."
      ],
      stressed: [
        "Le stress chronique nécessite une attention particulière.",
        "Prenez des pauses régulières dans votre journée.",
        "L'activité physique peut aider à réduire le stress."
      ],
      neutral: [
        "Un état neutre permet d'évaluer objectivement les situations.",
        "C'est un bon moment pour la prise de décision.",
        "Vous êtes en équilibre émotionnel."
      ]
    };
    
    const options = feedbacks[emotionName.toLowerCase()] || 
      ["Chaque émotion a un rôle important dans votre expérience quotidienne."];
    
    // Sélection basée sur le contexte historique
    if (historicalContext && historicalContext.frequency > 5) {
      return `${options[0]} Cette émotion revient régulièrement dans votre historique.`;
    }
    
    return options[Math.floor(Math.random() * options.length)];
  };

  // Recommandations personnalisées
  const getPersonalizedRecommendations = (): PersonalizedRecommendation[] => {
    const emotionLower = emotion.name.toLowerCase();
    const recommendations: PersonalizedRecommendation[] = [];

    // Toujours proposer la respiration
    recommendations.push({
      icon: <Wind className="h-4 w-4 text-cyan-500" />,
      title: 'Respiration guidée',
      description: 'Prenez quelques minutes pour respirer profondément',
      action: () => navigate('/app/breathwork'),
      actionLabel: 'Commencer'
    });

    // Musique adaptée à l'émotion
    if (['stress', 'anxiety', 'sad', 'sadness'].includes(emotionLower)) {
      recommendations.push({
        icon: <Music className="h-4 w-4 text-purple-500" />,
        title: 'Musique apaisante',
        description: 'Écoutez une playlist relaxante adaptée à votre état',
        action: () => navigate('/app/music'),
        actionLabel: 'Écouter'
      });
    } else if (['joy', 'happy', 'excited'].includes(emotionLower)) {
      recommendations.push({
        icon: <Music className="h-4 w-4 text-purple-500" />,
        title: 'Musique énergisante',
        description: 'Prolongez cette bonne énergie avec de la musique',
        action: () => navigate('/app/music'),
        actionLabel: 'Écouter'
      });
    }

    // Journal pour les émotions négatives
    if (['sad', 'sadness', 'anxiety', 'anger', 'fear'].includes(emotionLower)) {
      recommendations.push({
        icon: <BookOpen className="h-4 w-4 text-amber-500" />,
        title: 'Journal émotionnel',
        description: 'Notez vos pensées pour mieux comprendre cette émotion',
        action: () => navigate('/app/journal'),
        actionLabel: 'Écrire'
      });
    }

    // Communauté pour le soutien
    if (historicalContext && historicalContext.frequency > 3 && 
        ['sad', 'anxiety', 'stressed'].includes(emotionLower)) {
      recommendations.push({
        icon: <Users className="h-4 w-4 text-green-500" />,
        title: 'Communauté de soutien',
        description: 'Connectez-vous avec d\'autres personnes',
        action: () => navigate('/app/community'),
        actionLabel: 'Rejoindre'
      });
    }

    return recommendations.slice(0, 4);
  };

  const formatLastOccurrence = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "aujourd'hui";
    if (diffDays === 1) return "hier";
    if (diffDays < 7) return `il y a ${diffDays} jours`;
    return `il y a ${Math.floor(diffDays / 7)} semaine(s)`;
  };

  const recommendations = getPersonalizedRecommendations();

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm mt-6 space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        Analyse émotionnelle
      </h3>
      
      <div className="flex items-center gap-2 mb-3">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: emotion.color || 'hsl(var(--primary))' }}
        >
          <span className="text-white text-sm font-bold">
            {emotion.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-medium capitalize">{emotion.name}</span>
        {historicalContext && (
          <span className="text-xs text-muted-foreground ml-2">
            ({historicalContext.frequency}x ce mois)
          </span>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analyse en cours...
        </div>
      ) : (
        <>
          <p className="text-muted-foreground">{getDynamicFeedback(emotion.name)}</p>
          
          {historicalContext && historicalContext.lastOccurrence && (
            <p className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-3">
              Dernière occurrence: {formatLastOccurrence(historicalContext.lastOccurrence)}
              {historicalContext.averageIntensity > 30 && (
                <span> • Intensité moyenne: {historicalContext.averageIntensity}%</span>
              )}
            </p>
          )}
        </>
      )}
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-3">Recommandations personnalisées</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="mt-0.5">{rec.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{rec.title}</p>
                <p className="text-xs text-muted-foreground">{rec.description}</p>
                {rec.action && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-xs mt-1"
                    onClick={rec.action}
                  >
                    {rec.actionLabel} →
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionFeedback;
