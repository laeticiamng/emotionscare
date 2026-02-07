/**
 * B2BSelectionPage - Sélection du type d'accès B2B
 * Style Apple premium avec framer-motion, glassmorphism
 */
import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Users,
  BarChart3,
  Shield,
  Heart,
  ArrowRight,
  Sparkles,
  Activity,
  Target,
  KeyRound,
  CheckCircle,
} from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { cn } from '@/lib/utils';

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const personas = [
  {
    id: 'user',
    title: 'Collaborateur',
    subtitle: 'Espace personnel & confidentiel',
    description: 'Accédez à vos outils de bien-être émotionnel. Aucune donnée partagée avec votre employeur.',
    icon: Heart,
    gradient: 'from-primary to-accent',
    features: [
      { icon: Heart, label: 'Suivi émotionnel personnel' },
      { icon: Sparkles, label: 'Activités bien-être guidées' },
      { icon: Activity, label: 'Scan et journal vocal' },
      { icon: Target, label: 'Objectifs personnalisés' },
    ],
    cta: 'Accéder à mon espace',
    loginUrl: '/login?segment=b2b&role=user',
  },
  {
    id: 'admin',
    title: 'Administrateur RH',
    subtitle: 'Vue agrégée & anonymisée',
    description: 'Tableau de bord avec indicateurs de tendances. Jamais de données nominatives.',
    icon: BarChart3,
    gradient: 'from-accent to-primary',
    features: [
      { icon: BarChart3, label: 'Tableau de bord agrégé' },
      { icon: Users, label: 'Vue équipes anonymisée' },
      { icon: Shield, label: 'Rapports conformes RGPD' },
      { icon: Target, label: 'Indicateurs bien-être' },
    ],
    cta: 'Accès Admin RH',
    loginUrl: '/login?segment=b2b&role=admin',
  },
];

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });

  usePageSEO({
    title: 'Connexion Entreprise — EmotionsCare B2B',
    description: 'Choisissez votre type d\'accès : collaborateur ou administrateur RH. Données sécurisées & conformes RGPD.',
    keywords: 'B2B, entreprise, bien-être, RH, collaborateur, EmotionsCare',
  });

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Aller au contenu principal
      </a>

      {/* Hero */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-primary/8 via-primary/3 to-transparent rounded-full blur-3xl" />
        </div>

        <div ref={heroRef} className="container px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm text-muted-foreground mb-8">
                <Shield className="h-4 w-4 text-primary" />
                Données sécurisées & conformes RGPD
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[0.95]">
                Espace{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Entreprise.
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light"
            >
              Choisissez votre type d'accès pour découvrir les outils adaptés à votre rôle.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Selection Cards */}
      <main id="main-content" className="container px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto" role="list" aria-label="Options d'accès">
          {personas.map((persona, i) => (
            <Reveal key={persona.id} delay={i * 0.15}>
              <div
                role="listitem"
                onClick={() => navigate(persona.loginUrl)}
                className="group relative cursor-pointer"
              >
                <div className="relative bg-card/50 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                  {/* Icon */}
                  <div
                    className={cn(
                      'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6',
                      'bg-gradient-to-br text-white shadow-lg shadow-primary/20',
                      persona.gradient,
                    )}
                  >
                    <persona.icon className="h-8 w-8" />
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
                    {persona.title}
                  </h2>
                  <p className="text-sm text-primary font-medium mb-3">{persona.subtitle}</p>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {persona.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8" aria-label={`Fonctionnalités ${persona.title}`}>
                    {persona.features.map(({ icon: Icon, label }) => (
                      <li key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        {label}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors rounded-full py-6 text-base"
                    variant="outline"
                  >
                    {persona.cta}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {/* Hover glow */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500',
                      'bg-gradient-to-br pointer-events-none blur-3xl -z-10',
                      persona.gradient,
                    )}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Access code link */}
        <Reveal delay={0.3}>
          <div className="max-w-5xl mx-auto mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-4 rounded-2xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <KeyRound className="h-4 w-4" />
                Vous avez un code d'accès employeur ?
              </div>
              <Link to="/b2b/access">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary font-medium">
                  Entrer le code
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Privacy notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-12">
          <Shield className="h-4 w-4 text-primary" />
          <span>Vos données personnelles ne sont jamais partagées avec votre employeur</span>
        </div>
      </main>
    </div>
  );
};

export default B2BSelectionPage;
