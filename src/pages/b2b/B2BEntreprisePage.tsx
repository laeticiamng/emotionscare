/**
 * B2BEntreprisePage - Landing page B2B style Apple
 * Cohérente avec la homepage, typographie massive, animations framer-motion
 */

import React, { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePageSEO } from '@/hooks/usePageSEO';
import {
  Users,
  Shield,
  BarChart3,
  Heart,
  ArrowRight,
  KeyRound,
  Building2,
  Clock,
  TrendingDown,
  Eye,
  Lock,
  CheckCircle,
} from 'lucide-react';

/** Reusable animated section title */
const SectionTitle: React.FC<{
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  center?: boolean;
}> = ({ children, subtitle, className, center = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn('mb-16 md:mb-20', center && 'text-center', className)}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
        {children}
      </h2>
      {subtitle && (
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

const features = [
  {
    icon: Eye,
    title: 'Visibilité sans intrusion',
    description:
      'Suivez le bien-être collectif sans jamais accéder aux données individuelles. Seules les tendances anonymisées sont visibles.',
    gradient: 'from-primary to-accent',
  },
  {
    icon: Clock,
    title: '3 minutes par jour',
    description:
      'Vos collaborateurs accèdent à des exercices courts et concrets. Pas de formations longues, pas de rdv à planifier.',
    gradient: 'from-accent to-primary',
  },
  {
    icon: Shield,
    title: 'RGPD natif',
    description:
      'Anonymat garanti par design. Aucune donnée individuelle n\'est accessible aux managers. Conforme HDS.',
    gradient: 'from-primary/80 to-primary',
  },
  {
    icon: TrendingDown,
    title: 'Prévention du burnout',
    description:
      'Détectez les signaux faibles avant qu\'ils ne deviennent des arrêts. Alertes anonymes et recommandations proactives.',
    gradient: 'from-accent/80 to-accent',
  },
];

const steps = [
  {
    num: '01',
    title: 'Déploiement en 24h',
    desc: 'Un code d\'accès unique pour votre organisation. Aucune installation, aucun mot de passe à gérer.',
  },
  {
    num: '02',
    title: 'Adoption autonome',
    desc: 'Vos équipes découvrent les exercices à leur rythme. 3 minutes suffisent pour ressentir un effet.',
  },
  {
    num: '03',
    title: 'Insights anonymes',
    desc: 'Vous recevez des rapports de tendances. Jamais de données nominatives.',
  },
];

const stats = [
  { value: '3 min', label: 'par exercice', icon: Clock },
  { value: '100%', label: 'anonyme', icon: Lock },
  { value: '24h', label: 'pour déployer', icon: Building2 },
  { value: '0', label: 'données vendues', icon: Shield },
];

const B2BEntreprisePage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });

  usePageSEO({
    title: 'EmotionsCare Entreprise — Bien-être soignant pour vos équipes',
    description:
      'Offrez à vos équipes soignantes des exercices de régulation émotionnelle en 3 minutes. Anonyme, RGPD, déploiement en 24h.',
    keywords:
      'bien-être entreprise, QVT soignants, burn-out prévention, RGPD, RH santé',
  });

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-radial from-primary/8 via-primary/3 to-transparent rounded-full blur-3xl" />
        </div>

        <div ref={heroRef} className="container px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[0.95]">
                Prenez soin de vos
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                  équipes soignantes.
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 font-light"
            >
              Des exercices de régulation émotionnelle en 3 minutes.
              <span className="text-foreground font-medium"> Anonyme. RGPD. Déployé en 24h.</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base text-muted-foreground/70 max-w-xl mx-auto mb-12"
            >
              Pas de formations longues. Pas de données individuelles exposées.
              <br className="hidden sm:block" />
              Juste des outils concrets pour vos collaborateurs.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/signup?segment=b2b">
                <Button
                  size="lg"
                  className="group px-10 py-7 text-lg font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Nous contacter
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/b2b/access">
                <Button
                  variant="outline"
                  size="lg"
                  className="group px-8 py-6 text-lg rounded-full border-2 border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <KeyRound className="mr-2 h-5 w-5" />
                  Accès avec code
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground"
            >
              {[
                { label: 'Conforme RGPD', color: 'bg-green-500' },
                { label: 'Anonymat garanti', color: 'bg-primary' },
                { label: 'Made in France', color: 'bg-accent' },
              ].map((badge) => (
                <span key={badge.label} className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', badge.color)} />
                  {badge.label}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section className="py-16 bg-muted/30 border-y border-border/50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const isInView = useInView(ref, { once: true, amount: 0.5 });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="h-6 w-6 mx-auto mb-3 text-primary" />
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section className="py-28 md:py-36">
        <div className="container px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Des outils pensés pour le terrain, pas pour les PowerPoint."
          >
            Pourquoi les DRH nous{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              choisissent.
            </span>
          </SectionTitle>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const cardRef = useRef<HTMLDivElement>(null);
              const isCardInView = useInView(cardRef, { once: true, amount: 0.4 });
              return (
                <motion.div
                  key={index}
                  ref={cardRef}
                  initial={{ opacity: 0, y: 80 }}
                  animate={isCardInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative"
                >
                  <div className="relative bg-card/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-border/50 hover:border-border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                    <div
                      className={cn(
                        'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6',
                        'bg-gradient-to-br text-white shadow-lg shadow-primary/20',
                        feature.gradient
                      )}
                    >
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    {/* Hover glow */}
                    <div
                      className={cn(
                        'absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500',
                        'bg-gradient-to-br pointer-events-none blur-3xl -z-10',
                        feature.gradient
                      )}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ COMMENT ÇA MARCHE ═══════════════════ */}
      <section className="py-28 md:py-36 bg-foreground text-background">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <SectionTitle center className="text-background [&_p]:text-background/60">
              Comment ça{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                marche ?
              </span>
            </SectionTitle>

            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              {steps.map((step, i) => {
                const ref = useRef<HTMLDivElement>(null);
                const isInView = useInView(ref, { once: true, amount: 0.5 });
                return (
                  <motion.div
                    key={i}
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: i * 0.15 }}
                    className="text-center"
                  >
                    <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                      {step.num}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-background/60 leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ POUR QUI ═══════════════════ */}
      <section className="py-28 md:py-36">
        <div className="container px-4 sm:px-6 lg:px-8">
          <SectionTitle center subtitle="Chaque rôle y trouve son compte, dans le respect total de la confidentialité.">
            Collaborateurs{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              et managers.
            </span>
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'Pour les collaborateurs',
                icon: Heart,
                items: [
                  'Exercices de respiration et recentrage en 3 min',
                  'Journal émotionnel confidentiel',
                  'Coaching IA personnalisé',
                  'Aucune donnée partagée avec l\'employeur',
                ],
              },
              {
                title: 'Pour les managers RH',
                icon: BarChart3,
                items: [
                  'Tendances anonymisées par équipe',
                  'Alertes bien-être sans données nominatives',
                  'Rapports d\'impact pour la direction',
                  'Conformité RGPD intégrée',
                ],
              },
            ].map((persona, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const isInView = useInView(ref, { once: true, amount: 0.4 });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                  className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-border/50"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                      <persona.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">{persona.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {persona.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ ACCÈS INSTITUTIONNEL ═══════════════════ */}
      <section className="py-16 bg-muted/30 border-y border-border/50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex-shrink-0">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Votre organisation a déjà un accès ?</h3>
              <p className="text-muted-foreground">
                Entrez le code fourni par votre employeur pour accéder à l'espace bien-être en toute confidentialité.
              </p>
            </div>
            <Link to="/b2b/access">
              <Button size="lg" className="rounded-full px-8">
                Entrer le code
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ CTA FINAL ═══════════════════ */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[0.95]"
            >
              Prêt à prendre soin
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                de vos équipes ?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12"
            >
              Échangeons sur vos besoins. Sans engagement.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link to="/signup?segment=b2b">
                <Button
                  size="lg"
                  className="group px-12 py-8 text-xl font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-2xl shadow-foreground/20 transition-all duration-500 hover:scale-105"
                >
                  <Users className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                  Nous contacter
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(B2BEntreprisePage);
