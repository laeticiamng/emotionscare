/**
 * AcademySection - Section Academy avec framing interventionnel
 * Vision: "Apprendre à ne plus dépendre du hasard pour aller mieux"
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Brain, Zap, Target, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Module {
  id: string;
  title: string;
  insight: string; // Ce que tu vas comprendre, pas "contenu"
  effect: string; // Ce que ça change concrètement
  icon: React.ReactNode;
  duration: string;
  color: string;
  link: string;
}

const modules: Module[] = [
  {
    id: 'nervous-system',
    title: 'Ton système nerveux',
    insight: 'Pourquoi ton corps réagit avant que tu comprennes',
    effect: 'Anticiper les montées au lieu de les subir',
    icon: <Brain className="h-6 w-6" />,
    duration: '8 min',
    color: 'text-purple-500',
    link: '/app/scan?context=learn',
  },
  {
    id: 'triggers',
    title: 'Tes déclencheurs',
    insight: 'Les patterns invisibles qui te font vriller',
    effect: 'Repérer le signal avant la crise',
    icon: <Target className="h-6 w-6" />,
    duration: '10 min',
    color: 'text-red-500',
    link: '/app/journal',
  },
  {
    id: 'regulation',
    title: 'La régulation',
    insight: 'Comment redescendre sans forcer',
    effect: 'Avoir une technique qui marche vraiment',
    icon: <Zap className="h-6 w-6" />,
    duration: '12 min',
    color: 'text-amber-500',
    link: '/app/coach',
  },
  {
    id: 'prevention',
    title: 'La prévention',
    insight: 'Construire une base stable au quotidien',
    effect: "Moins de crises, plus d'énergie",
    icon: <Shield className="h-6 w-6" />,
    duration: '15 min',
    color: 'text-emerald-500',
    link: '/app/vr-breath-guide',
  },
];

const AcademySection: React.FC = () => {
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
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Header - Nouveau framing */}
          <motion.div variants={itemVariants} className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge variant="outline" className="justify-center">
              <BookOpen className="h-3 w-3 mr-2" aria-hidden="true" />
              Comprendre pour reprendre la main
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Apprendre à ne plus dépendre du hasard pour aller mieux
            </h2>
            <p className="text-lg text-muted-foreground">
              Ici, tu comprends ce qui se passe dans ton système nerveux.
              <span className="text-foreground font-medium"> Et surtout comment reprendre la main quand ça déraille.</span>
            </p>
          </motion.div>

          {/* Modules Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {modules.map((module) => (
              <motion.div key={module.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-primary">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center ${module.color} group-hover:scale-110 transition-transform`}>
                        {module.icon}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {module.duration}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.insight}
                      </p>
                    </div>

                    {/* Effect */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">
                        <span className="text-primary font-medium">→ </span>
                        {module.effect}
                      </p>
                    </div>

                    {/* CTA */}
                    <Button className="w-full group/btn" variant="outline" size="sm" asChild>
                      <Link to={module.link}>
                        <span>Commencer</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom note */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-sm text-muted-foreground italic mb-4">
              "Tu n'as pas besoin de tout comprendre pour que ça marche. Mais comprendre t'aide à tenir sur la durée."
            </p>
            <Button variant="ghost" asChild>
              <Link to="/app/modules">
                Voir tous les modules
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AcademySection;
