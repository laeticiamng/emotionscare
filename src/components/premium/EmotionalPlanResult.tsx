/**
 * EmotionalPlanResult - Écran de résultat du plan émotionnel
 * Structure claire : résumé, actions immédiates, recommandations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Music, 
  Sun, 
  Clock, 
  Bookmark, 
  RotateCcw, 
  ChevronRight,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmotionalPlanResultProps {
  summary?: {
    emotion: string;
    intensity: string;
    insight: string;
  };
  actions?: Array<{
    id: string;
    title: string;
    duration: string;
    type: 'breathing' | 'movement' | 'grounding';
  }>;
  recommendations?: {
    music?: {
      title: string;
      artist: string;
      duration: string;
      coverUrl?: string;
    };
    light?: {
      mode: string;
      description: string;
    };
  };
  onSave?: () => void;
  onRestart?: () => void;
}

const EmotionalPlanResult: React.FC<EmotionalPlanResultProps> = ({
  summary = {
    emotion: 'Tension légère',
    intensity: 'Modérée',
    insight: 'Ton corps montre des signes de stress accumulé. C\'est normal après une journée chargée.',
  },
  actions = [
    { id: '1', title: 'Respiration carrée', duration: '2 min', type: 'breathing' as const },
    { id: '2', title: 'Étirement des épaules', duration: '1 min', type: 'movement' as const },
    { id: '3', title: 'Ancrage 5-4-3-2-1', duration: '3 min', type: 'grounding' as const },
  ],
  recommendations = {
    music: {
      title: 'Calm Waters',
      artist: 'Ambient Therapy',
      duration: '8:24',
    },
    light: {
      mode: 'Lumière chaude',
      description: 'Teinte ambrée apaisante',
    },
  },
  onSave,
  onRestart,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'breathing': return '🌬️';
      case 'movement': return '🧘';
      case 'grounding': return '🌳';
      default: return '✨';
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-background via-background to-[hsl(var(--warmth-cream))] dark:to-background pb-32"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container-mobile pt-8">
        {/* Transition */}
        <motion.div variants={itemVariants} className="mb-8">
          <p className="text-base text-muted-foreground">
            Voilà ce que je te propose.
          </p>
        </motion.div>

        {/* Section 1: Résumé émotionnel */}
        <motion.section variants={itemVariants} className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Voici ce que je comprends de ce que tu vis.
          </h3>
          <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl border border-primary/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-foreground">{summary.emotion}</h2>
                  <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                    {summary.intensity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {summary.insight}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 2: Actions immédiates */}
        <motion.section variants={itemVariants} className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            À ton rythme, tu peux essayer…
          </h3>
          
          <div className="space-y-2">
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link to={`/app/action/${action.id}`}>
                  <div className="flex items-center gap-4 p-4 bg-card hover:bg-card/80 rounded-2xl border border-border/50 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <span className="text-xl">{getActionIcon(action.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.duration}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 3: Pour prolonger ce moment */}
        <motion.section variants={itemVariants} className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Un moment pour t'accompagner.
          </h3>
          <p className="text-xs text-muted-foreground/70 mb-4">
            Tu peux t'arrêter ici, ou prendre encore quelques minutes pour toi.
          </p>
          
          {/* Carte musique */}
          {recommendations.music && (
            <div className="p-6 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-950/40 dark:via-violet-950/30 dark:to-purple-950/20 rounded-3xl border border-indigo-100/80 dark:border-indigo-900/50 shadow-lg shadow-indigo-500/5 mb-4 relative overflow-hidden">
              {/* Onde subtile en arrière-plan */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-violet-300/20 to-purple-400/10 blur-2xl pointer-events-none" />
              
              <p className="text-sm text-foreground mb-4 relative z-10">
                Un moment de musique pour t'accompagner
              </p>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 via-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{recommendations.music.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{recommendations.music.artist}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">{recommendations.music.duration}</p>
                </div>
              </div>
              
              <Button className="w-full mt-4 h-12 rounded-xl shadow-md shadow-primary/15 gap-2">
                <Play className="h-4 w-4" />
                Écouter la musique
              </Button>
            </div>
          )}
          
          {/* Carte lumière */}
          {recommendations.light && (
            <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/50">
              <div className="w-10 h-10 rounded-xl bg-amber-200 dark:bg-amber-800 flex items-center justify-center">
                <Sun className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">Une ambiance lumineuse apaisante</p>
                <p className="text-xs text-muted-foreground">Si tu peux ajuster la lumière autour de toi.</p>
              </div>
            </div>
          )}
        </motion.section>

      </div>

      {/* Bottom actions */}
      <div className="bottom-bar-mobile px-4 pt-4 pb-2">
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 rounded-xl"
            onClick={onSave}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Enregistrer cette session
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-10 rounded-xl text-muted-foreground text-sm"
            >
              Revenir plus tard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-10 rounded-xl text-muted-foreground text-sm"
              onClick={onRestart}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Nouvelle session
            </Button>
          </div>
        </div>
        
        <p className="text-center text-xs text-muted-foreground/60 mt-3">
          Tu peux revenir sur ce plan quand tu le souhaites.
        </p>
      </div>
    </motion.div>
  );
};

export default EmotionalPlanResult;
