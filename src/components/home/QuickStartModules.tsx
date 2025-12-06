/**
 * QuickStartModules - Cartes de démarrage rapide avec aperçu interactif
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  features: string[];
  link: string;
  badge?: string;
  demo?: boolean;
}

const modules: Module[] = [
  {
    id: 'scan',
    title: 'Scan émotionnel IA',
    description: 'Analysez vos émotions en 30 secondes avec notre IA de reconnaissance faciale',
    icon: '👁️',
    color: 'text-green-500',
    gradient: 'from-green-500 to-emerald-500',
    features: ['99% de précision', 'Analyse instantanée', 'Rapports détaillés'],
    link: '/app/scan',
    badge: 'Populaire',
    demo: true,
  },
  {
    id: 'music',
    title: 'Musique thérapeutique',
    description: 'Écoutez des compositions musicales générées par IA adaptées à votre état',
    icon: '🎵',
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-pink-500',
    features: ['Génération en temps réel', 'Binaural beats', 'Sessions guidées'],
    link: '/app/music',
    badge: 'Nouveau',
  },
  {
    id: 'coach',
    title: 'Coach personnel Nyvée',
    description: 'Discutez avec votre assistant IA pour un soutien émotionnel 24/7',
    icon: '🧠',
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Disponibilité 24/7', 'Conseils personnalisés', 'Suivi émotionnel'],
    link: '/app/coach',
  },
  {
    id: 'journal',
    title: 'Journal intelligent',
    description: 'Écrivez vos pensées et laissez l\'IA analyser vos tendances émotionnelles',
    icon: '📔',
    color: 'text-orange-500',
    gradient: 'from-orange-500 to-red-500',
    features: ['Chiffrement e2e', 'Analyse de sentiments', 'Historique complet'],
    link: '/app/journal',
  },
  {
    id: 'vr',
    title: 'Expériences VR',
    description: 'Immergez-vous dans des environnements thérapeutiques en réalité virtuelle',
    icon: '🥽',
    color: 'text-indigo-500',
    gradient: 'from-indigo-500 to-purple-500',
    features: ['Environnements 3D', 'Respiration guidée', 'Réalité mixte'],
    link: '/app/vr-breath-guide',
  },
  {
    id: 'analytics',
    title: 'Analytics wellness',
    description: 'Visualisez votre progression émotionnelle avec des graphiques détaillés',
    icon: '📊',
    color: 'text-teal-500',
    gradient: 'from-teal-500 to-blue-500',
    features: ['Métriques détaillées', 'Tendances long-terme', 'Rapports exportables'],
    link: '/app/analytics',
  },
];

const QuickStartModules: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
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
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <Badge variant="secondary" className="justify-center">
              <Zap className="h-3 w-3 mr-2" aria-hidden="true" />
              Démarrage rapide
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold">
              Explorez nos modules
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez chaque fonctionnalité et commencez immédiatement votre voyage vers le bien-être émotionnel
            </p>
          </motion.div>

          {/* Modules Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {modules.map((module) => (
              <motion.div
                key={module.id}
                variants={itemVariants}
                onHoverStart={() => setHoveredId(module.id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group">
                  {/* Background Gradient */}
                  <div
                    className={cn(
                      'absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300',
                      `bg-gradient-to-br ${module.gradient}`
                    )}
                  />

                  <CardHeader className="relative pb-3">
                    <div className="flex items-start justify-between">
                      <div className="text-5xl" aria-hidden="true">{module.icon}</div>
                      {module.badge && (
                        <Badge className="text-xs">{module.badge}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
                      {module.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {module.description}
                    </p>

                    {/* Features List */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: hoveredId === module.id ? 1 : 0,
                        height: hoveredId === module.id ? 'auto' : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2 overflow-hidden"
                    >
                      {module.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* CTA Button */}
                    <Button className="w-full group/btn" size="sm" asChild>
                      <Link to={module.link} aria-label={`Essayer ${module.title}`}>
                        <span>Essayer maintenant</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover/btn:translate-x-0.5 transition-transform" aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardContent>

                  {/* Hover indicator */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${module.gradient}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredId === module.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center pt-8"
          >
            <p className="text-muted-foreground mb-4">
              Prêt à commencer ? Chacun de nos modules peut être exploré gratuitement pendant 30 jours.
            </p>
            <Button size="lg" asChild>
              <Link to="/signup">
                Créer mon compte gratuit
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
