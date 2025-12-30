/**
 * ParkPreviewCard - Aperçu de la carte du parc émotionnel avec accès direct
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, Sparkles, Wind, Brain, Music, Target, ArrowRight, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const PARK_ZONES = [
  { icon: Sparkles, label: 'Hub Central', color: 'bg-violet-500' },
  { icon: Wind, label: 'Zone Calme', color: 'bg-blue-500' },
  { icon: Brain, label: 'Zone Mind', color: 'bg-emerald-500' },
  { icon: Music, label: 'Zone Créative', color: 'bg-pink-500' },
  { icon: Target, label: 'Zone Défis', color: 'bg-amber-500' },
];

const ParkPreviewCard: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary blur-3xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-blue-500 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500 blur-3xl" />
            </div>

            <CardContent className="relative z-10 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                {/* Left side - Map icon and info */}
                <div className="flex-shrink-0 text-center md:text-left">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/30"
                  >
                    <Map className="h-10 w-10 md:h-12 md:w-12" />
                  </motion.div>
                </div>

                {/* Center - Title and description */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      Carte du Parc Émotionnel
                    </h2>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <Compass className="h-3 w-3 mr-1" />
                      Explorable
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 max-w-xl">
                    Explore ton univers émotionnel à travers des zones thématiques. 
                    Chaque attraction est un module interactif pour ton bien-être.
                  </p>

                  {/* Mini zones preview */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                    {PARK_ZONES.map((zone, index) => (
                      <motion.div
                        key={zone.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50"
                      >
                        <div className={`w-2 h-2 rounded-full ${zone.color}`} />
                        <zone.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">{zone.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right side - CTA Button */}
                <div className="flex-shrink-0">
                  <Link to="/app/park">
                    <Button 
                      size="lg" 
                      className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    >
                      <Map className="h-5 w-5" />
                      Explorer le Parc
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Bottom stats */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">25+</p>
                    <p className="text-xs text-muted-foreground">Attractions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-violet-500">5</p>
                    <p className="text-xs text-muted-foreground">Zones thématiques</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-500">∞</p>
                    <p className="text-xs text-muted-foreground">Possibilités</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ParkPreviewCard;
