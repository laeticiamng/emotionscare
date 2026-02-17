/**
 * TestimonialsSection - Presentation des modules cles
 * Remplace les faux temoignages par une description des fonctionnalites
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Music, Shield, Clock, Sparkles } from 'lucide-react';

interface ModuleHighlight {
  title: string;
  description: string;
  icon: React.ElementType;
  highlight?: string;
}

const TestimonialsSection: React.FC = () => {
  const modules: ModuleHighlight[] = [
    {
      title: "Scan emotionnel IA",
      description: "Evaluez votre etat emotionnel en quelques questions et recevez des recommandations personnalisees adaptees a votre situation.",
      icon: Brain,
      highlight: 'Auto-evaluation',
    },
    {
      title: "Protocoles de respiration",
      description: "Coherence cardiaque, technique 4-7-8, box breathing : des exercices guides de 3 minutes pour retrouver le calme.",
      icon: Heart,
      highlight: '3 minutes',
    },
    {
      title: "Musicotherapie personnalisee",
      description: "Frequences binaurales, ambiances apaisantes et compositions adaptees a votre etat emotionnel du moment.",
      icon: Music,
      highlight: 'Adaptatif',
    },
    {
      title: "Coach IA Nyvee",
      description: "Un accompagnement bienveillant disponible 24/7, adapte aux professionnels de sante et etudiants.",
      icon: Sparkles,
      highlight: 'Disponible 24/7',
    },
    {
      title: "Protocole Night",
      description: "Un sas d'apaisement avant le sommeil avec respiration immersive et ambiance sonore pour un endormissement serein.",
      icon: Clock,
      highlight: 'Sommeil',
    },
    {
      title: "Donnees securisees",
      description: "Vos donnees emotionnelles restent les votres. Conforme RGPD, heberge en France, aucune revente a des tiers.",
      icon: Shield,
      highlight: 'RGPD conforme',
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      className="py-20 bg-gradient-to-b from-background to-primary/5"
      aria-labelledby="modules-title"
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <Badge variant="outline">
              <Sparkles className="h-3 w-3 mr-2" aria-hidden="true" />
              Nos modules
            </Badge>
            <h2 id="modules-title" className="text-3xl lg:text-4xl font-bold text-foreground">
              Des outils concrets pour votre bien-être
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Decouvrez les fonctionnalites d'EmotionsCare, concues pour les soignants et etudiants en sante.
            </p>
          </motion.div>

          {/* Modules Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-6"
            role="list"
            aria-label="Modules EmotionsCare"
          >
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.article
                  key={index}
                  variants={itemVariants}
                  role="listitem"
                  aria-label={module.title}
                >
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                    <CardContent className="p-6 space-y-4">
                      <Icon className="h-8 w-8 text-primary" />
                      <h3 className="text-lg font-semibold">{module.title}</h3>
                      <p className="text-foreground/90 leading-relaxed">
                        {module.description}
                      </p>
                      {module.highlight && (
                        <Badge variant="secondary" className="w-fit text-xs">
                          {module.highlight}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
