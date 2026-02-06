/**
 * FeaturesPage - Showcase of all features
 * /features
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Scan, Wind, BookOpen, ClipboardCheck, 
  Bot, Music, Headphones, Sparkles,
  ArrowRight, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePageSEO } from '@/hooks/usePageSEO';

interface Feature {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  bgGradient: string;
  highlights: string[];
  available: boolean;
}

const availableFeatures: Feature[] = [
  {
    id: 'scan',
    title: 'Scanner Émotionnel',
    description: 'Analysez vos émotions en temps réel',
    longDescription: 'Notre technologie d\'IA analyse vos expressions faciales et votre voix pour identifier vos émotions avec précision. Obtenez un rapport détaillé de votre état émotionnel.',
    icon: Scan,
    href: '/app/scan',
    color: 'text-primary',
    bgGradient: 'from-primary/20 to-accent/20',
    highlights: ['Analyse faciale IA', 'Détection en temps réel', 'Historique des scans'],
    available: true,
  },
  {
    id: 'breathing',
    title: 'Respiration Guidée',
    description: '6 protocoles de respiration scientifiques',
    longDescription: 'Maîtrisez votre stress avec nos exercices de respiration validés : Cohérence cardiaque, 4-7-8, Box Breathing, et plus. Animations visuelles apaisantes et sons ambiants.',
    icon: Wind,
    href: '/dashboard/breathing',
    color: 'text-primary',
    bgGradient: 'from-primary/20 to-accent/20',
    highlights: ['6 protocoles', 'Animation visuelle', 'Suivi des sessions'],
    available: true,
  },
  {
    id: 'journal',
    title: 'Journal Émotionnel',
    description: 'Documentez votre parcours émotionnel',
    longDescription: 'Enregistrez vos émotions quotidiennes avec notre journal intuitif. Sélectionnez votre émotion, son intensité, et ajoutez des notes personnelles. Visualisez votre évolution.',
    icon: BookOpen,
    href: '/dashboard/journal',
    color: 'text-primary',
    bgGradient: 'from-primary/20 to-accent/20',
    highlights: ['8 émotions', 'Tags personnalisés', 'Export RGPD'],
    available: true,
  },
  {
    id: 'assessments',
    title: 'Évaluations Cliniques',
    description: 'Questionnaires WHO-5 et PHQ-9 validés',
    longDescription: 'Évaluez votre bien-être avec des outils cliniques reconnus internationalement. Suivez votre évolution avec des graphiques détaillés et des recommandations personnalisées.',
    icon: ClipboardCheck,
    href: '/dashboard/assessments',
    color: 'text-primary',
    bgGradient: 'from-primary/20 to-accent/20',
    highlights: ['WHO-5 (OMS)', 'PHQ-9 (Dépression)', 'Graphiques évolution'],
    available: true,
  },
  {
    id: 'coach',
    title: 'Coach IA',
    description: 'Votre accompagnateur personnel 24/7',
    longDescription: 'Un coach conversationnel alimenté par l\'IA qui vous accompagne dans vos moments difficiles avec empathie et des techniques validées scientifiquement.',
    icon: Bot,
    href: '/app/coach',
    color: 'text-primary',
    bgGradient: 'from-primary/20 to-accent/20',
    highlights: ['Conversations naturelles', 'Techniques CBT', 'Disponible 24/7'],
    available: true,
  },
  {
    id: 'music',
    title: 'Musique Thérapeutique',
    description: 'Sons et mélodies pour votre bien-être',
    longDescription: 'Bibliothèque de paysages sonores, musiques relaxantes et battements binauraux scientifiquement conçus pour réguler votre humeur et améliorer votre concentration.',
    icon: Music,
    href: '/app/music',
    color: 'text-primary',
    bgGradient: 'from-primary/20 to-accent/20',
    highlights: ['Sons nature', 'Battements binauraux', 'Playlists personnalisées'],
    available: true,
  },
  {
    id: 'immersive',
    title: 'Expériences Immersives',
    description: 'VR et AR pour une relaxation profonde',
    longDescription: 'Plongez dans des environnements virtuels apaisants grâce à la réalité virtuelle et augmentée. Méditations guidées et exercices de pleine conscience immersifs.',
    icon: Headphones,
    href: '/app/vr',
    color: 'text-primary',
    bgGradient: 'from-primary/20 to-accent/20',
    highlights: ['Réalité virtuelle', 'Filtres AR', 'Environnements 3D'],
    available: true,
  },
];

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`h-full hover:shadow-lg transition-all duration-300 ${!feature.available ? 'opacity-80' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.bgGradient}`}>
              <Icon className={`h-8 w-8 ${feature.color}`} />
            </div>
          </div>
          <CardTitle className="text-xl mt-4">{feature.title}</CardTitle>
          <CardDescription className="text-base">{feature.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.longDescription}
          </p>
          
          <ul className="space-y-2">
            {feature.highlights.map((highlight, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className={`h-4 w-4 ${feature.color}`} />
                {highlight}
              </li>
            ))}
          </ul>

          {feature.available ? (
            <Link to={feature.href}>
              <Button className="w-full mt-4">
                Découvrir
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button disabled className="w-full mt-4" variant="secondary">
              Bientôt disponible
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FeaturesPage: React.FC = () => {
  usePageSEO({
    title: 'Fonctionnalités - EmotionsCare',
    description: 'Découvrez toutes les fonctionnalités d\'EmotionsCare : Scanner émotionnel, respiration guidée, journal émotionnel, évaluations cliniques et plus.',
    keywords: 'fonctionnalités, scanner émotionnel, respiration, journal, WHO-5, PHQ-9',
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="outline" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Plateforme complète
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Toutes les fonctionnalités pour votre{' '}
              <span className="text-primary">bien-être émotionnel</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Des outils innovants et scientifiquement validés pour comprendre, 
              gérer et améliorer votre santé mentale au quotidien.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <Button size="lg">
                  Commencer gratuitement
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <a href="#available">
                <Button size="lg" variant="outline">
                  Voir les fonctionnalités
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Available Features */}
      <section id="available" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fonctionnalités disponibles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Commencez dès maintenant avec nos outils de bien-être émotionnel
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableFeatures.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer votre parcours ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Rejoignez les professionnels de santé qui améliorent leur bien-être 
            émotionnel avec EmotionsCare.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg">
                Créer un compte gratuit
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                Voir les tarifs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
