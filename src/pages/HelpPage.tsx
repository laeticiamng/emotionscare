/**
 * HelpPage - Centre d'aide EmotionsCare
 * Design Apple-style avec glassmorphism, scroll-reveal, catégories colorées
 */
import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Search,
  HelpCircle,
  Sparkles,
  Zap,
  Settings,
  CreditCard,
  Shield,
  Users,
  ChevronRight,
  ArrowRight,
  Mail,
  Book,
  FileText,
  Video,
  Lock,
  Heart,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { usePageSEO } from '@/hooks/usePageSEO';
import SeoHead from '@/components/seo/SeoHead';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ──────────────────── Reveal wrapper ──────────────────── */
const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ──────────────────── Data ──────────────────── */
interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  articles: Array<{ title: string; href: string }>;
}

const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Premiers pas',
    description: 'Commencez votre parcours bien-être',
    icon: Sparkles,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10 dark:bg-rose-500/20',
    articles: [
      { title: 'Créer un compte', href: '/signup' },
      { title: 'Configurer votre profil', href: '/signup' },
      { title: 'Votre premier scan émotionnel', href: '/features' },
      { title: 'Comprendre vos résultats', href: '/features' },
    ],
  },
  {
    id: 'features',
    title: 'Fonctionnalités',
    description: 'Explorez tous les modules',
    icon: Zap,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    articles: [
      { title: 'Scanner émotionnel', href: '/features' },
      { title: 'Journal vocal', href: '/features' },
      { title: 'Musicothérapie', href: '/features' },
      { title: 'Respiration guidée', href: '/features' },
    ],
  },
  {
    id: 'account',
    title: 'Compte & Paramètres',
    description: 'Gérez votre profil et vos préférences',
    icon: Settings,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10 dark:bg-violet-500/20',
    articles: [
      { title: 'Modifier mes informations', href: '/signup' },
      { title: 'Notifications', href: '/signup' },
      { title: 'Confidentialité', href: '/legal/privacy' },
      { title: 'Supprimer mon compte', href: '/contact' },
    ],
  },
  {
    id: 'billing',
    title: 'Abonnement & Facturation',
    description: 'Plans, paiements et factures',
    icon: CreditCard,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    articles: [
      { title: 'Changer de plan', href: '/pricing' },
      { title: 'Historique des paiements', href: '/pricing' },
      { title: 'Annuler mon abonnement', href: '/contact' },
      { title: 'Codes promotionnels', href: '/pricing' },
    ],
  },
  {
    id: 'privacy',
    title: 'Sécurité & Confidentialité',
    description: 'Protection de vos données',
    icon: Shield,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
    articles: [
      { title: 'Politique de confidentialité', href: '/legal/privacy' },
      { title: 'Gestion des cookies', href: '/legal/cookies' },
      { title: 'Exporter mes données', href: '/contact' },
      { title: 'Conformité RGPD', href: '/legal/privacy' },
    ],
  },
  {
    id: 'b2b',
    title: 'Espace Entreprise',
    description: 'Solutions B2B pour les organisations',
    icon: Users,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    articles: [
      { title: 'Offre entreprise', href: '/b2b' },
      { title: 'Gérer les équipes', href: '/b2b' },
      { title: 'Rapports et analytics', href: '/b2b' },
      { title: 'Conformité RGPD B2B', href: '/legal/privacy' },
    ],
  },
];

interface QuickAnswer {
  question: string;
  answer: string;
  category: string;
}

const QUICK_ANSWERS: QuickAnswer[] = [
  {
    question: 'Comment créer un compte ?',
    answer:
      "Cliquez sur \"S'inscrire\" en haut à droite et suivez les étapes. C'est gratuit et ne prend que 30 secondes.",
    category: 'Général',
  },
  {
    question: "L'application est-elle gratuite ?",
    answer:
      'Oui, nous proposons un plan gratuit avec des fonctionnalités de base. Des plans premium sont disponibles pour accéder à tous les modules.',
    category: 'Facturation',
  },
  {
    question: 'Comment fonctionne le scan émotionnel ?',
    answer:
      "Le scan utilise l'IA pour analyser vos expressions faciales afin d'identifier votre état émotionnel en temps réel, de manière confidentielle.",
    category: 'Fonctionnalités',
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer:
      'Absolument. Toutes vos données sont chiffrées et stockées conformément au RGPD. Vous gardez le contrôle total sur vos informations.',
    category: 'Sécurité',
  },
  {
    question: 'Comment annuler mon abonnement ?',
    answer:
      "Allez dans Paramètres > Abonnement et cliquez sur \"Annuler\". Votre accès reste actif jusqu'à la fin de la période en cours.",
    category: 'Facturation',
  },
  {
    question: "Puis-je utiliser l'app sur mobile ?",
    answer:
      "Oui, EmotionsCare est une application web responsive accessible depuis n'importe quel appareil — smartphone, tablette ou ordinateur.",
    category: 'Général',
  },
];

/* ──────────────────── Component ──────────────────── */
const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  usePageSEO({
    title: "Centre d'Aide - EmotionsCare",
    description:
      "Trouvez des réponses à vos questions sur EmotionsCare. Guide utilisateur, FAQ, support technique et contact.",
    keywords: 'aide,support,FAQ,EmotionsCare,bien-être,santé mentale',
  });

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return HELP_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return HELP_CATEGORIES.map((cat) => ({
      ...cat,
      articles: cat.articles.filter((a) => a.title.toLowerCase().includes(q)),
    })).filter(
      (cat) =>
        cat.articles.length > 0 ||
        cat.title.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const filteredFAQ = useMemo(() => {
    if (!searchQuery.trim()) return QUICK_ANSWERS;
    const q = searchQuery.toLowerCase();
    return QUICK_ANSWERS.filter(
      (qa) => qa.question.toLowerCase().includes(q) || qa.answer.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <>
      <SeoHead
        title="Centre d'Aide - EmotionsCare"
        description="Trouvez des réponses à vos questions sur EmotionsCare. FAQ, guides et contact support."
        keywords="aide,support,FAQ,EmotionsCare,bien-être,santé mentale"
      />

      <div className="min-h-screen bg-background">
        {/* Skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Aller au contenu principal
        </a>

        <main id="main-content" role="main">
          {/* ────── Hero ────── */}
          <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-accent/5 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08)_0%,transparent_50%)]" />

            <div className="container px-4 sm:px-6 relative z-10">
              <Reveal>
                <div className="text-center max-w-3xl mx-auto">
                  <Badge
                    variant="outline"
                    className="mb-6 px-4 py-1.5 text-sm border-primary/30 bg-primary/5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                    Centre d'aide
                  </Badge>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                    Comment pouvons-nous{' '}
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      vous aider ?
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                    Trouvez des réponses instantanées, explorez nos guides ou contactez notre équipe.
                  </p>

                  {/* Search */}
                  <div className="relative max-w-xl mx-auto">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      placeholder="Rechercher dans l'aide…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 py-6 text-base md:text-lg rounded-xl border-primary/20 shadow-lg bg-card/80 backdrop-blur-sm"
                      aria-label="Rechercher dans le centre d'aide"
                    />
                    {searchQuery && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        {filteredCategories.reduce((a, c) => a + c.articles.length, 0)} résultats
                        pour « {searchQuery} »
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ────── FAQ ────── */}
          {filteredFAQ.length > 0 && (
            <section className="py-16 md:py-24">
              <div className="container px-4 sm:px-6 max-w-3xl mx-auto">
                <Reveal>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
                    Questions{' '}
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      fréquentes
                    </span>
                  </h2>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="rounded-2xl border bg-card/60 backdrop-blur-sm p-2 md:p-4">
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFAQ.map((qa, i) => (
                        <AccordionItem
                          key={i}
                          value={`qa-${i}`}
                          className="border-b last:border-b-0 px-2"
                        >
                          <AccordionTrigger className="text-left hover:no-underline py-4 gap-3">
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="outline"
                                className="text-xs shrink-0 border-primary/20"
                              >
                                {qa.category}
                              </Badge>
                              <span className="font-medium">{qa.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pb-4 pl-2">
                            {qa.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </Reveal>

                <Reveal delay={0.2}>
                  <div className="mt-8 text-center">
                    <Button variant="outline" className="rounded-full" asChild>
                      <Link to="/faq">
                        Voir toutes les questions
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </Reveal>
              </div>
            </section>
          )}

          {/* ────── Categories ────── */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container px-4 sm:px-6">
              <Reveal>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">
                  Explorer par{' '}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    catégorie
                  </span>
                </h2>
                <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                  Parcourez nos guides organisés par thème pour trouver rapidement ce que vous
                  cherchez.
                </p>
              </Reveal>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {filteredCategories.map((cat, index) => {
                  const IconComp = cat.icon;
                  return (
                    <Reveal key={cat.id} delay={index * 0.08}>
                      <div className="group rounded-2xl border bg-card/60 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={cn(
                              'h-11 w-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
                              cat.bgColor,
                            )}
                          >
                            <IconComp className={cn('h-5 w-5', cat.color)} aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{cat.title}</h3>
                            <p className="text-sm text-muted-foreground">{cat.description}</p>
                          </div>
                        </div>

                        <ul className="space-y-2">
                          {cat.articles.map((article, idx) => (
                            <li key={idx}>
                              <Link
                                to={article.href}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1 group/link"
                              >
                                <ChevronRight className="h-3 w-3 text-muted-foreground/50 group-hover/link:text-primary transition-colors" />
                                {article.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ────── Ressources ────── */}
          <section className="py-16 md:py-24">
            <div className="container px-4 sm:px-6 max-w-4xl mx-auto">
              <Reveal>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
                  Ressources{' '}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    utiles
                  </span>
                </h2>
              </Reveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: Book,
                    title: 'Guide de démarrage',
                    sub: 'Tutoriel interactif',
                    href: '/features',
                  },
                  {
                    icon: Video,
                    title: 'Vidéos tutoriels',
                    sub: 'Démonstrations',
                    href: '/features',
                  },
                  {
                    icon: Shield,
                    title: 'Confidentialité',
                    sub: 'Vos droits RGPD',
                    href: '/legal/privacy',
                  },
                  {
                    icon: FileText,
                    title: 'CGU',
                    sub: "Conditions d'utilisation",
                    href: '/legal/terms',
                  },
                ].map((res, i) => (
                  <Reveal key={res.title} delay={i * 0.08}>
                    <Button
                      variant="outline"
                      className="h-auto py-5 justify-start w-full rounded-xl hover:shadow-md transition-all"
                      asChild
                    >
                      <Link to={res.href}>
                        <res.icon
                          className="h-5 w-5 mr-3 text-primary shrink-0"
                          aria-hidden="true"
                        />
                        <div className="text-left">
                          <div className="font-medium">{res.title}</div>
                          <div className="text-xs text-muted-foreground">{res.sub}</div>
                        </div>
                      </Link>
                    </Button>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ────── Contact CTA ────── */}
          <section className="py-20 md:py-28 bg-muted/30">
            <div className="container px-4 sm:px-6">
              <Reveal>
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Vous ne trouvez pas{' '}
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      votre réponse ?
                    </span>
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Notre équipe vous répond dans les meilleurs délais. Écrivez-nous et nous
                    reviendrons vers vous rapidement.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="rounded-full text-base px-8" asChild>
                      <Link to="/contact">
                        <Mail className="h-4 w-4 mr-2" />
                        Nous contacter
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full text-base px-8"
                      asChild
                    >
                      <Link to="/faq">Voir la FAQ complète</Link>
                    </Button>
                  </div>

                  {/* Trust badges */}
                  <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4 text-emerald-500" />
                      <span>Données chiffrées</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-emerald-500" />
                      <span>100% RGPD</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <span>Made in France</span>
                    </div>
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

export default HelpPage;
