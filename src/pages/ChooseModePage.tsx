import React, { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { User, Users, Shield, ArrowRight, Star, Zap, Heart, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EnhancedLoading } from '@/components/ui/enhanced-performance';
import { announce } from '@/components/ui/enhanced-accessibility';

interface UserMode {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<any>;
  features: string[];
  stats: { label: string; value: string }[];
  gradient: string;
  glowColor: string;
  route: string;
  badge?: string;
  popular?: boolean;
}

const MemoizedModeCard = memo<{
  mode: UserMode;
  index: number;
  onSelect: (route: string) => void;
  shouldReduceMotion: boolean;
}>(({ mode, index, onSelect, shouldReduceMotion }) => {
  const handleSelect = useCallback(() => {
    announce(`Navigation vers ${mode.title}`);
    onSelect(mode.route);
  }, [mode.route, mode.title, onSelect]);

  const cardVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 60,
      scale: shouldReduceMotion ? 1 : 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.8,
        delay: shouldReduceMotion ? 0 : index * 0.2,
        type: "spring",
        stiffness: 100
      }
    }
  }), [index, shouldReduceMotion]);

  const hoverVariants = useMemo(() => 
    shouldReduceMotion ? {} : {
      scale: 1.05,
      y: -10,
      rotateY: index % 2 === 0 ? 5 : -5,
      transition: { 
        duration: 0.4,
        type: "spring",
        stiffness: 200
      }
    }, [index, shouldReduceMotion]);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={hoverVariants}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      className="relative group"
    >
      <Card 
        className={cn(
          "relative h-full cursor-pointer overflow-hidden border-2 transition-all duration-500",
          "hover:border-primary/50 hover:shadow-premium-xl",
          "bg-gradient-to-br from-background/95 via-background/90 to-background/85",
          "backdrop-blur-xl",
          mode.popular && "ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
        )}
        onClick={handleSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect();
          }
        }}
        aria-label={`Sélectionner ${mode.title} - ${mode.description}`}
      >
        {/* Popular Badge */}
        {mode.popular && (
          <div className="absolute -top-2 -right-2 z-20">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-3 py-1">
              <Star className="h-3 w-3 mr-1" />
              Populaire
            </Badge>
          </div>
        )}
        
        {/* Custom Badge */}
        {mode.badge && (
          <div className="absolute top-4 left-4 z-20">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {mode.badge}
            </Badge>
          </div>
        )}

        {/* Background Effects */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700",
          mode.gradient
        )} />
        
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-primary/10",
          "group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-transparent",
          "transition-all duration-700"
        )} />

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <CardContent className="relative z-10 p-8 h-full flex flex-col">
          {/* Icon & Title Section */}
          <div className="text-center mb-6">
            <motion.div 
              className={cn(
                "w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center",
                "bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20",
                "group-hover:from-primary/30 group-hover:to-primary/10 group-hover:border-primary/30",
                "transition-all duration-500",
                `shadow-lg group-hover:shadow-${mode.glowColor}`
              )}
              whileHover={shouldReduceMotion ? {} : { 
                rotate: [0, -10, 10, 0],
                scale: 1.1 
              }}
              transition={{ duration: 0.6 }}
            >
              <mode.icon className={cn(
                "h-10 w-10 text-primary group-hover:text-primary",
                "transition-all duration-300"
              )} />
            </motion.div>
            
            <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {mode.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {mode.description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-around mb-6 py-4 bg-muted/30 rounded-xl">
            {mode.stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-lg font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="flex-1 mb-6">
            <div className="space-y-3">
              {mode.features.slice(0, 4).map((feature, idx) => (
                <motion.div 
                  key={idx}
                  className="flex items-center text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full mr-3 flex-shrink-0",
                    "bg-gradient-to-r from-primary to-primary/60"
                  )} />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {feature}
                  </span>
                </motion.div>
              ))}
              {mode.features.length > 4 && (
                <div className="text-xs text-muted-foreground italic">
                  +{mode.features.length - 4} autres fonctionnalités
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            className={cn(
              "w-full bg-gradient-to-r from-primary via-primary to-primary/90",
              "hover:from-primary/90 hover:via-primary hover:to-primary",
              "text-primary-foreground font-semibold py-3 rounded-xl",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "group-hover:scale-105"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
          >
            <span>Accéder à l'espace</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>

        {/* Glow Effect */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          "bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-xl"
        )} />
      </Card>
    </motion.div>
  );
});

MemoizedModeCard.displayName = 'MemoizedModeCard';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const userModes: UserMode[] = useMemo(() => [
    {
      id: 'b2c',
      title: 'Espace Particulier',
      description: 'Votre bien-être personnel avec des outils IA avancés',
      longDescription: 'Accès complet aux outils d\'intelligence émotionnelle pour votre développement personnel',
      icon: User,
      features: [
        'Scanner émotionnel IA temps réel',
        'Musique thérapeutique personnalisée', 
        'Coach IA 24/7 spécialisé',
        'Journal intime intelligent',
        'VR immersive anti-stress',
        'Gamification du bien-être'
      ],
      stats: [
        { label: 'Utilisateurs', value: '10K+' },
        { label: 'Satisfaction', value: '98%' },
        { label: 'Sessions', value: '50K+' }
      ],
      gradient: 'from-blue-500/20 via-blue-600/10 to-indigo-700/5',
      glowColor: 'blue-500/30',
      route: '/b2c/login',
      popular: true
    },
    {
      id: 'b2b_user',
      title: 'Collaborateur',
      description: 'Outils collaboratifs pour le bien-être en entreprise',
      longDescription: 'Espace dédié aux employés avec des fonctionnalités de groupe et de suivi d\'équipe',
      icon: Users,
      features: [
        'Outils personnels adaptés',
        'Sessions de groupe virtuelles',
        'Cocon social d\'entreprise',
        'Challenges bien-être équipe',
        'Suivi collectif anonymisé',
        'Ressources RH spécialisées'
      ],
      stats: [
        { label: 'Entreprises', value: '500+' },
        { label: 'Équipes', value: '2K+' },
        { label: 'Engagement', value: '95%' }
      ],
      gradient: 'from-green-500/20 via-green-600/10 to-teal-700/5',
      glowColor: 'green-500/30',
      route: '/b2b/user/login',
      badge: 'Équipe'
    },
    {
      id: 'b2b_admin',
      title: 'Administrateur RH',
      description: 'Interface complète de gestion et d\'analytics RH',
      longDescription: 'Dashboard avancé pour le pilotage du bien-être des équipes avec IA prédictive',
      icon: Shield,
      features: [
        'Dashboard analytics avancé',
        'Gestion équipes centralisée',
        'Rapports IA prédictifs',
        'Événements bien-être',
        'Optimisation automatique',
        'Conformité RGPD intégrée'
      ],
      stats: [
        { label: 'Données', value: '1M+' },
        { label: 'Insights', value: '500+' },
        { label: 'ROI', value: '+35%' }
      ],
      gradient: 'from-purple-500/20 via-purple-600/10 to-violet-700/5',
      glowColor: 'purple-500/30',
      route: '/b2b/admin/login',
      badge: 'Admin'
    }
  ], []);

  const handleModeSelect = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        staggerChildren: shouldReduceMotion ? 0 : 0.2
      }
    }
  }), [shouldReduceMotion]);

  const titleVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : -30,
      scale: shouldReduceMotion ? 1 : 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.8,
        type: "spring",
        stiffness: 100
      }
    }
  }), [shouldReduceMotion]);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden"
      data-testid="page-root"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/80" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-float animation-delay-2000" />
      
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.div variants={titleVariants}>
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl border border-primary/20 shadow-lg">
                  <Brain className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              <h1 className="text-fluid-4xl font-bold text-gradient mb-6 leading-tight">
                EmotionsCare
              </h1>
              
              <p className="text-fluid-xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
                Choisissez votre espace pour commencer votre parcours de bien-être mental avec l'IA
              </p>
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Analyse IA temps réel</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-muted-foreground/30 rounded-full" />
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span>100% confidentiel</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mode Cards */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
            variants={containerVariants}
          >
            {userModes.map((mode, index) => (
              <MemoizedModeCard
                key={mode.id}
                mode={mode}
                index={index}
                onSelect={handleModeSelect}
                shouldReduceMotion={!!shouldReduceMotion}
              />
            ))}
          </motion.div>

          {/* Footer Actions */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: shouldReduceMotion ? 0 : 1.4,
              duration: shouldReduceMotion ? 0.01 : 0.6
            }}
          >
            <p className="text-muted-foreground mb-6 text-lg">
              Vous n'avez pas encore de compte ?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/b2c/register')}
                className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 hover:border-primary/30"
              >
                Inscription Particulier
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/b2b/selection')}
                className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 hover:border-primary/30"
              >
                Inscription Entreprise
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span>✓ Essai gratuit 14 jours</span>
              <span>✓ Sans engagement</span>
              <span>✓ Support 24/7</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(ChooseModePage);