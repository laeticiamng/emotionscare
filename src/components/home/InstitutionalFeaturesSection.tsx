/**
 * InstitutionalFeaturesSection - Outils cliniques et institutionnels
 * 5 cartes B2B/cliniques visibles depuis la homepage
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ClipboardCheck,
  Users,
  BookOpen,
  FileBarChart,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface InstitutionalFeature {
  title: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'outline';
  authHref: string;
  anonHref: string;
}

const features: InstitutionalFeature[] = [
  {
    title: 'Évaluation Burnout MBI-HSS',
    description:
      'Questionnaire validé scientifiquement — 22 items, 3 sous-échelles, radar chart avec zones colorées et comparaison aux normes soignantes.',
    icon: ClipboardCheck,
    badge: 'MBI-HSS validé',
    badgeVariant: 'default',
    authHref: '/app/assess/burnout',
    anonHref: '/signup',
  },
  {
    title: 'Dashboard équipe',
    description:
      'Score collectif anonymisé dans le temps, heatmap shifts/semaines et alertes seuils automatiques pour les cadres de santé.',
    icon: Users,
    badge: 'Temps réel',
    badgeVariant: 'secondary',
    authHref: '/b2b/team-wellbeing',
    anonHref: '/signup',
  },
  {
    title: "Bibliothèque d'interventions",
    description:
      "Pratiques basées sur les preuves : respiration, soutien par les pairs, débriefing post-traumatique. Niveaux d'évidence et planification équipe.",
    icon: BookOpen,
    badge: 'Evidence-based',
    badgeVariant: 'secondary',
    authHref: '/b2b/interventions',
    anonHref: '/signup',
  },
  {
    title: 'Export recherche',
    description:
      'Jeux de données anonymisés avec k-anonymat, gestion du consentement RGPD intégrée pour vos partenaires académiques.',
    icon: FileBarChart,
    badge: 'RGPD',
    badgeVariant: 'outline',
    authHref: '/b2b/research-export',
    anonHref: '/signup',
  },
  {
    title: 'Rapports institutionnels',
    description:
      "Rapports QVT prêts pour le CHSCT avec indicateurs clés et recommandations d'amélioration.",
    icon: FileText,
    badge: 'CHSCT-ready',
    badgeVariant: 'outline',
    authHref: '/b2b/institutional-report',
    anonHref: '/signup',
  },
];

const FeatureCard: React.FC<{
  feature: InstitutionalFeature;
  index: number;
  isAuthenticated: boolean;
}> = memo(({ feature, index, isAuthenticated }) => {
  const Icon = feature.icon as React.FC<{ className?: string; 'aria-hidden'?: boolean }>;
  const href = isAuthenticated ? feature.authHref : feature.anonHref;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={href} className="group block h-full" aria-label={feature.title}>
        <div
          className={cn(
            'relative h-full rounded-3xl border border-border/50 p-6 md:p-8 overflow-hidden',
            'bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm',
            'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500'
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center justify-center rounded-2xl w-12 h-12 bg-background/80 shadow-sm">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <Badge variant={feature.badgeVariant} className="text-[10px] font-semibold uppercase tracking-wide">
                {feature.badge}
              </Badge>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>

            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {feature.description}
            </p>

            <div className="mt-5 flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
              {isAuthenticated ? 'Ouvrir' : 'Découvrir'}
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" aria-hidden />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

FeatureCard.displayName = 'FeatureCard';

const InstitutionalFeaturesSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section
      className="py-24 md:py-32 bg-muted/20"
      aria-labelledby="institutional-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            <Users className="h-3 w-3 mr-2" aria-hidden />
            Institutions &amp; Recherche
          </Badge>
          <h2
            id="institutional-title"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4"
          >
            Outils cliniques et{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              institutionnels
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pour les cadres de santé, les institutions et la recherche — évaluation validée, pilotage d'équipe et conformité.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to={isAuthenticated ? '/b2b/team-wellbeing' : '/signup'}>
              {isAuthenticated ? 'Accéder au tableau de bord' : 'Essayer gratuitement'}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(InstitutionalFeaturesSection);
