import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AssessmentExperience } from '@/components/assess/AssessmentExperience';
import { useAssessmentIntegration } from '@/hooks/useAssessmentIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Brain, Sparkles, Calendar, TrendingUp } from 'lucide-react';

export function HomePageEnhanced() {
  const [showAssessment, setShowAssessment] = useState(false);
  const [cardOrder, setCardOrder] = useState(['activity', 'mood', 'journal', 'music']);
  
  const {
    isEnabled,
    shouldShow,
    currentBadge,
    getColorAdaptation,
    getContentAdaptation,
    triggerAssessment
  } = useAssessmentIntegration({
    instrument: 'WHO5',
    context: 'weekly',
    onBadgeUpdate: (badge, hints) => {
      console.log('Badge WHO5 mis à jour:', badge);
      
      // Réorganiser les cartes selon le badge
      if (badge.includes('douceur') || badge.includes('délicat')) {
        // Mettre les activités relaxantes en premier
        setCardOrder(['breathing', 'music', 'journal', 'activity']);
      } else if (badge.includes('énergie') || badge.includes('rayonnant')) {
        // Mettre les activités énergisantes en premier  
        setCardOrder(['activity', 'vr', 'social', 'music']);
      }
    }
  });

  const handleStartWeeklyCheckIn = () => {
    setShowAssessment(true);
  };

  const handleAssessmentComplete = (badges: string[]) => {
    setShowAssessment(false);
    // L'intégration hook gère déjà la logique de badge
  };

  // Adaptations visuelles basées sur le badge
  const primaryGradient = getColorAdaptation('primary') || 'from-blue-500 to-purple-500';
  const greeting = getContentAdaptation('greeting') || 'Bonjour ! Comment vous sentez-vous ?';

  if (showAssessment) {
    return (
      <AssessmentExperience
        instrument="WHO5"
        title="Check-in Bien-être Hebdomadaire"
        description="Prenez un moment pour faire le point sur votre bien-être cette semaine. Cette évaluation nous aide à personnaliser votre expérience."
        context="weekly"
        theme="wellness"
        onComplete={handleAssessmentComplete}
        immersive={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header avec greeting adaptatif */}
      <motion.div 
        className="p-6 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl font-bold mb-2">{greeting}</h1>
        
        {/* Badge de bien-être actuel */}
        {currentBadge && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 mt-4"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <Badge variant="outline" className="px-3 py-1">
              {currentBadge}
            </Badge>
          </motion.div>
        )}

        {/* Check-in hebdomadaire */}
        {isEnabled && shouldShow && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Card className="max-w-md mx-auto bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-rose-200 dark:border-rose-800">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Check-in Hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Évaluez votre bien-être cette semaine en 2 minutes
                </p>
                <Button 
                  onClick={handleStartWeeklyCheckIn}
                  className={`bg-gradient-to-r ${primaryGradient} hover:opacity-90 text-white`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Commencer
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Grille de cartes réorganisée selon le badge */}
      <div className="p-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          layout
        >
          {cardOrder.map((cardType, index) => (
            <motion.div
              key={cardType}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {renderCard(cardType, primaryGradient, currentBadge)}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function renderCard(type: string, gradient: string, badge: string | null) {
  const cardConfig = {
    activity: {
      title: 'Activités',
      description: 'Découvrez des exercices personnalisés',
      icon: Activity,
      route: '/app/activity'
    },
    mood: {
      title: 'Humeur',
      description: 'Suivez votre état émotionnel',
      icon: Heart,
      route: '/app/scan'
    },
    journal: {
      title: 'Journal',
      description: 'Exprimez vos pensées',
      icon: Brain,
      route: '/app/journal'
    },
    music: {
      title: 'Thérapie Musicale',
      description: 'Musique adaptée à votre état',
      icon: Sparkles,
      route: '/app/music'
    },
    breathing: {
      title: 'Respiration',
      description: 'Exercices de respiration guidée',
      icon: Activity,
      route: '/app/breath'
    },
    vr: {
      title: 'Réalité Virtuelle',
      description: 'Expériences immersives relaxantes',
      icon: Sparkles,
      route: '/app/vr-breath'
    },
    social: {
      title: 'Social Cocon',
      description: 'Connectez-vous avec la communauté',
      icon: Heart,
      route: '/app/social-cocon'
    }
  };

  const config = cardConfig[type as keyof typeof cardConfig];
  if (!config) return null;

  const Icon = config.icon;
  
  // Adapter l'apparence selon le badge
  let cardStyle = 'bg-card border-border';
  let priority = false;
  
  if (badge?.includes('douceur') && ['breathing', 'music'].includes(type)) {
    cardStyle = 'bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 border-blue-200 dark:border-blue-800';
    priority = true;
  } else if (badge?.includes('énergie') && ['activity', 'vr'].includes(type)) {
    cardStyle = 'bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border-orange-200 dark:border-orange-800';
    priority = true;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`${cardStyle} cursor-pointer transition-all duration-300 hover:shadow-lg ${priority ? 'ring-2 ring-primary/20' : ''}`}>
        <CardHeader className="pb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center mb-3 ${priority ? 'animate-pulse' : ''}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-lg">{config.title}</CardTitle>
          {priority && (
            <Badge variant="secondary" className="w-fit">
              Recommandé
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {config.description}
          </p>
          <Button variant="outline" className="w-full">
            Accéder
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}