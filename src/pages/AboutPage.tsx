/**
 * ABOUT PAGE - EMOTIONSCARE
 * Page À propos — style Apple, cohérente avec homepage
 */

import React, { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePageSEO } from '@/hooks/usePageSEO';
import {
  Heart,
  Shield,
  Users,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Clock,
  Lock,
  Brain,
  Target,
} from 'lucide-react';

/** Scroll-reveal wrapper */
const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });

  usePageSEO({
    title: 'À propos - EmotionsCare | Bien-être des soignants',
    description:
      'EmotionsCare est une plateforme créée par le Dr Laeticia Motongane, médecin urgentiste, pour accompagner les soignants vers un meilleur équilibre émotionnel.',
    keywords:
      'EmotionsCare, à propos, bien-être soignants, santé mentale, Dr Motongane',
  });

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Aller au contenu principal
      </a>

      <div className="min-h-screen bg-background">
        <main id="main-content">
          {/* ═══════════════════ HERO ═══════════════════ */}
          <section className="relative py-24 md:py-36 overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-primary/8 via-primary/3 to-transparent rounded-full blur-3xl" />
            </div>

            <div
              ref={heroRef}
              className="container px-4 sm:px-6 lg:px-8 relative z-10"
            >
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
                >
                  <Stethoscope className="h-4 w-4" />
                  Créée par une médecin urgentiste
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[0.95]"
                >
                  Prendre soin de ceux qui{' '}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    prennent soin.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light"
                >
                  EmotionsCare accompagne les soignants vers un meilleur
                  équilibre émotionnel, avec des exercices courts et
                  scientifiquement fondés.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <Button
                    size="lg"
                    onClick={() => navigate('/signup')}
                    className="rounded-full py-6 px-8 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:scale-[1.02] transition-all"
                    aria-label="Créer un compte EmotionsCare gratuitement"
                  >
                    Découvrir EmotionsCare
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/contact')}
                    className="rounded-full py-6 px-8 text-base"
                    aria-label="Contacter l'équipe EmotionsCare"
                  >
                    Nous contacter
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ═══════════════════ FONDATRICE ═══════════════════ */}
          <section className="py-24 md:py-32 bg-muted/30 border-y border-border/50">
            <div className="container px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <Reveal>
                  <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 items-center">
                    {/* Avatar */}
                    <div className="flex justify-center">
                      <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground text-4xl md:text-5xl font-bold shadow-2xl shadow-primary/20">
                        LM
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                        Dr Laeticia Motongane
                      </h2>
                      <p className="text-lg text-primary font-medium mb-4">
                        Médecin urgentiste · Fondatrice d'EmotionsCare
                      </p>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        Confrontée au quotidien à l'épuisement des soignants,
                        le Dr Motongane a créé EmotionsCare pour offrir des
                        outils concrets et accessibles de gestion émotionnelle
                        — parce que ceux qui soignent méritent aussi d'être
                        accompagnés.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ═══════════════════ MISSION ═══════════════════ */}
          <section className="py-24 md:py-32">
            <div className="container px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <Reveal>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center mb-6">
                    Notre{' '}
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      mission
                    </span>
                  </h2>
                  <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-16 font-light">
                    Rendre le bien-être émotionnel accessible à chaque soignant,
                    avec des outils simples, scientifiques et respectueux de la
                    vie privée.
                  </p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: Clock,
                      title: 'Exercices de 3 minutes',
                      description:
                        "Des micro-pauses conçues pour s'intégrer dans le rythme intense des soignants. Respiration, scan émotionnel, recentrage.",
                    },
                    {
                      icon: Brain,
                      title: 'Approche scientifique',
                      description:
                        'Chaque exercice est fondé sur les neurosciences et la psychologie positive. Pas de promesses vagues, des résultats mesurables.',
                    },
                    {
                      icon: Shield,
                      title: 'Confidentialité absolue',
                      description:
                        'Vos données émotionnelles restent les vôtres. Conforme RGPD, hébergé en France, aucune revente à des tiers.',
                    },
                    {
                      icon: Target,
                      title: 'Accompagnement personnalisé',
                      description:
                        "Un coach IA qui s'adapte à votre profil émotionnel et vous propose les bons exercices au bon moment.",
                    },
                  ].map((item, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                      <div className="group rounded-3xl border border-border/50 p-8 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 h-full">
                        <item.icon className="h-8 w-8 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-3">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════ VALEURS ═══════════════════ */}
          <section className="py-24 md:py-32 bg-muted/30 border-y border-border/50">
            <div className="container px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <Reveal>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center mb-16">
                    Nos{' '}
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      valeurs
                    </span>
                  </h2>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    {
                      icon: Heart,
                      title: 'Empathie',
                      text: "Chaque soignant mérite d'être écouté et accompagné avec bienveillance.",
                    },
                    {
                      icon: Lock,
                      title: 'Confidentialité',
                      text: 'Vos émotions sont privées. Nous ne vendons ni ne partageons jamais vos données.',
                    },
                    {
                      icon: Sparkles,
                      title: 'Simplicité',
                      text: "3 minutes suffisent. Pas de jargon, pas de complexité — juste l'essentiel.",
                    },
                    {
                      icon: Users,
                      title: 'Collectif',
                      text: 'La force du groupe pour se soutenir, sans jugement, en toute sécurité.',
                    },
                  ].map((val, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                      <div className="flex items-start gap-5">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <val.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            {val.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {val.text}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════ CONFIANCE ═══════════════════ */}
          <section className="py-16">
            <div className="container px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
                {[
                  { icon: Shield, label: 'Conforme RGPD' },
                  { icon: Lock, label: 'Hébergé en France' },
                  { icon: Stethoscope, label: 'Créé par un médecin' },
                  { icon: Heart, label: 'Made in France' },
                ].map((badge, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="flex flex-col items-center gap-2">
                      <badge.icon className="h-6 w-6 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {badge.label}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════ CTA FINAL ═══════════════════ */}
          <section className="py-28 md:py-36">
            <div className="container px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Prêt à prendre soin de{' '}
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      vous ?
                    </span>
                  </h2>
                  <p className="text-xl text-muted-foreground mb-10 font-light">
                    Rejoignez les soignants qui ont déjà adopté EmotionsCare
                    pour retrouver un équilibre émotionnel au quotidien.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      size="lg"
                      onClick={() => navigate('/signup')}
                      className="rounded-full py-6 px-8 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:scale-[1.02] transition-all"
                    >
                      Essayer gratuitement
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate('/pricing')}
                      className="rounded-full py-6 px-8 text-base"
                    >
                      Voir les tarifs
                    </Button>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default memo(AboutPage);
