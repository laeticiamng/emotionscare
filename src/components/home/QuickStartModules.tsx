/**
 * QuickStartModules - Sessions et Protocoles (pas playlists ni musiques)
 * Vision: Chaque session correspond à un moment vécu réel
 * Repositionnement sémantique: Musique → Session, Playlist → Protocole, Écoute → Activation
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, StopCircle, Moon, Zap, Heart, Wind, Target, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Protocol {
  id: string;
  title: string;
  situation: string; // Le moment vécu réel
  effect: string; // L'effet visible, pas la technique
  icon: React.ReactNode;
  color: string;
  gradient: string;
  duration: string;
  link: string;
  badge?: string;
  urgency?: 'low' | 'medium' | 'high';
}

const protocols: Protocol[] = [
  {
    id: 'stop-anxiety',
    title: 'Stop',
    situation: 'Montée anxieuse en cours',
    effect: 'Interrompre le cycle de pensées',
    icon: <StopCircle className="h-6 w-6" />,
    color: 'text-red-500',
    gradient: 'from-red-500/15 to-rose-500/5',
    duration: '2 min',
    link: '/app/scan?mode=stop',
    badge: 'Urgence',
    urgency: 'high',
  },
  {
    id: 'mental-stop',
    title: 'Arrêt mental',
    situation: 'Corps épuisé, cerveau qui tourne',
    effect: 'Forcer la déconnexion mentale',
    icon: <Moon className="h-6 w-6" />,
    color: 'text-indigo-500',
    gradient: 'from-indigo-500/15 to-purple-500/5',
    duration: '5 min',
    link: '/app/scan?mode=mental-stop',
    badge: 'Nuit',
    urgency: 'medium',
  },
  {
    id: 'reset',
    title: 'Reset',
    situation: 'Besoin de continuer sans craquer',
    effect: "Récupérer sans s'arrêter longtemps",
    icon: <Zap className="h-6 w-6" />,
    color: 'text-amber-500',
    gradient: 'from-amber-500/15 to-orange-500/5',
    duration: '3 min',
    link: '/app/scan?mode=reset',
    badge: 'Journée',
    urgency: 'medium',
  },
  {
    id: 'regulation',
    title: 'Régulation',
    situation: 'Émotions trop intenses',
    effect: 'Ramener à un niveau gérable',
    icon: <Heart className="h-6 w-6" />,
    color: 'text-pink-500',
    gradient: 'from-pink-500/15 to-rose-500/5',
    duration: '4 min',
    link: '/app/coach',
    urgency: 'medium',
  },
  {
    id: 'breath',
    title: 'Respiration',
    situation: 'Souffle court, tension physique',
    effect: "Relâcher le corps automatiquement",
    icon: <Wind className="h-6 w-6" />,
    color: 'text-cyan-500',
    gradient: 'from-cyan-500/15 to-blue-500/5',
    duration: '3 min',
    link: '/app/vr-breath-guide',
    urgency: 'low',
  },
  {
    id: 'focus',
    title: 'Concentration',
    situation: 'Impossible de se concentrer',
    effect: 'Retrouver la clarté mentale',
    icon: <Target className="h-6 w-6" />,
    color: 'text-emerald-500',
    gradient: 'from-emerald-500/15 to-green-500/5',
    duration: '5 min',
    link: '/app/music?mode=focus',
    urgency: 'low',
  },
];

const QuickStartModules: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-amber-500';
      default: return 'border-l-emerald-500';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/10">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Header - Pas de jargon technique */}
          <motion.div variants={itemVariants} className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge variant="secondary" className="justify-center">
              <Sparkles className="h-3 w-3 mr-2" aria-hidden="true" />
              Protocoles d'activation
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Chaque session correspond à un moment précis
            </h2>
            <p className="text-lg text-muted-foreground">
              Pas besoin de comprendre comment ça marche. 
              <span className="text-foreground font-medium"> Choisis ton moment, lance la session.</span>
            </p>
          </motion.div>

          {/* Protocols Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {protocols.map((protocol) => (
              <motion.div
                key={protocol.id}
                variants={itemVariants}
                onHoverStart={() => setHoveredId(protocol.id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                <Card 
                  className={cn(
                    "h-full hover:shadow-xl transition-all duration-300 border-l-4 overflow-hidden group cursor-pointer",
                    getUrgencyColor(protocol.urgency)
                  )}
                >
                  {/* Background Gradient on hover */}
                  <div
                    className={cn(
                      'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                      `bg-gradient-to-br ${protocol.gradient}`
                    )}
                  />

                  <CardHeader className="relative pb-2">
                    <div className="flex items-start justify-between">
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                        `bg-gradient-to-br ${protocol.gradient}`,
                        protocol.color
                      )}>
                        {protocol.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        {protocol.badge && (
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs",
                              protocol.urgency === 'high' && 'border-red-500/50 text-red-500',
                              protocol.urgency === 'medium' && 'border-amber-500/50 text-amber-500',
                              protocol.urgency === 'low' && 'border-emerald-500/50 text-emerald-500'
                            )}
                          >
                            {protocol.badge}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {protocol.duration}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative space-y-4 pt-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {protocol.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {protocol.situation}
                      </p>
                    </div>

                    {/* Effect - visible sur hover */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: hoveredId === protocol.id ? 1 : 0,
                        height: hoveredId === protocol.id ? 'auto' : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-foreground/80 py-2 border-t border-border/50">
                        <span className="text-primary font-medium">Effet :</span> {protocol.effect}
                      </p>
                    </motion.div>

                    {/* CTA */}
                    <Button className="w-full group/btn" size="sm" asChild>
                      <Link to={protocol.link}>
                        <span>Lancer</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover/btn:translate-x-0.5 transition-transform" aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom message - Rétention */}
          <motion.div
            variants={itemVariants}
            className="text-center pt-8 space-y-4"
          >
            <p className="text-muted-foreground italic">
              "Reviens avant que ton corps n'explose."
            </p>
            <Button size="lg" variant="outline" asChild>
              <Link to="/signup">
                Créer mon accès gratuit
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickStartModules;
