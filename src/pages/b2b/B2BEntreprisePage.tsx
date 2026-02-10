/**
 * B2BEntreprisePage - Landing page B2B style Apple
 * Cohérente avec la homepage, typographie massive, animations framer-motion
 */

import React, { memo, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Calculator,
  Hospital,
  GraduationCap,
  Home as HomeIcon,
  Stethoscope,
  Quote,
  Send,
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

/* ──────────────── Use Cases ──────────────── */
const useCases = [
  {
    icon: Hospital,
    title: 'Hôpitaux',
    description: 'Réduisez le turnover des soignants en offrant des micro-pauses émotionnelles intégrées aux roulements.',
    stat: '-30% absentéisme',
  },
  {
    icon: Stethoscope,
    title: 'Cliniques privées',
    description: 'Améliorez la satisfaction patient en prenant soin du bien-être de vos équipes soignantes.',
    stat: '+25% satisfaction',
  },
  {
    icon: GraduationCap,
    title: 'Facultés de médecine',
    description: 'Accompagnez vos étudiants face au stress des examens et des premiers stages cliniques.',
    stat: '-40% stress étudiant',
  },
  {
    icon: HomeIcon,
    title: 'EHPAD',
    description: 'Soutenez vos aides-soignants face à la charge émotionnelle du soin aux personnes âgées.',
    stat: '+35% rétention',
  },
];

/* ──────────────── Testimonials ──────────────── */
const testimonials = [
  {
    quote: 'En 3 mois, nos indicateurs de bien-être ont progressé de 28%. Les équipes utilisent EmotionsCare avant et après les gardes.',
    author: 'Dr. Sophie Martin',
    role: 'Directrice RH',
    org: 'CHU de Lyon',
  },
  {
    quote: 'Le déploiement a pris moins d\'une journée. L\'anonymat total a convaincu même les plus réticents.',
    author: 'Marc Dubois',
    role: 'DRH',
    org: 'Clinique Saint-Joseph, Paris',
  },
  {
    quote: 'Nos internes utilisent la respiration guidée entre deux blocs opératoires. C\'est devenu un réflexe.',
    author: 'Pr. Claire Lefèvre',
    role: 'Doyenne',
    org: 'Faculté de Médecine, Strasbourg',
  },
];

/* ──────────────── ROI Calculator ──────────────── */
const ROICalculator: React.FC = () => {
  const [employees, setEmployees] = useState(50);
  const [absentRate, setAbsentRate] = useState(5);

  const avgDailyCost = 250;
  const workDaysPerYear = 220;
  const currentAbsentCost = employees * (absentRate / 100) * workDaysPerYear * avgDailyCost;
  const reductionPercent = 0.30;
  const annualSavings = currentAbsentCost * reductionPercent;
  const monthlyCost = employees * 9.90;
  const annualCost = monthlyCost * 12;
  const netSavings = annualSavings - annualCost;
  const roi = annualCost > 0 ? Math.round((netSavings / annualCost) * 100) : 0;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div>
          <label htmlFor="roi-employees" className="block text-sm font-medium mb-2">
            Nombre de collaborateurs
          </label>
          <Input
            id="roi-employees"
            type="number"
            min={10}
            max={10000}
            value={employees}
            onChange={(e) => setEmployees(Math.max(10, parseInt(e.target.value) || 10))}
            className="text-lg py-6"
          />
        </div>
        <div>
          <label htmlFor="roi-absent" className="block text-sm font-medium mb-2">
            Taux d'absentéisme actuel (%)
          </label>
          <Input
            id="roi-absent"
            type="number"
            min={1}
            max={30}
            value={absentRate}
            onChange={(e) => setAbsentRate(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
            className="text-lg py-6"
          />
        </div>
      </div>

      <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border/50 p-8 space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-border/30">
          <span className="text-muted-foreground">Coût absentéisme actuel</span>
          <span className="text-xl font-bold">{currentAbsentCost.toLocaleString('fr-FR')} &euro;/an</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/30">
          <span className="text-muted-foreground">Réduction estimée (30%)</span>
          <span className="text-xl font-bold text-primary">{annualSavings.toLocaleString('fr-FR')} &euro;/an</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/30">
          <span className="text-muted-foreground">Coût EmotionsCare</span>
          <span className="text-xl font-bold">{annualCost.toLocaleString('fr-FR')} &euro;/an</span>
        </div>
        <div className="flex justify-between items-center py-3 bg-primary/5 rounded-xl px-4">
          <span className="font-semibold">Économies nettes</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {netSavings.toLocaleString('fr-FR')} &euro;/an
          </span>
        </div>
        <div className="text-center pt-2">
          <span className="text-sm text-muted-foreground">ROI estimé : </span>
          <span className="text-lg font-bold text-primary">{roi}%</span>
        </div>
      </div>
    </div>
  );
};

/* ──────────────── Demo Form ──────────────── */
const DemoRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    size: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  }, []);

  const handleChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Demande envoyée</h3>
        <p className="text-muted-foreground">
          Notre équipe vous contactera sous 24h pour planifier votre démo personnalisée.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor="demo-name" className="block text-sm font-medium mb-1.5">Nom complet</label>
        <Input id="demo-name" required placeholder="Dr. Jean Dupont" value={formData.name} onChange={handleChange('name')} className="py-5" />
      </div>
      <div>
        <label htmlFor="demo-email" className="block text-sm font-medium mb-1.5">Email professionnel</label>
        <Input id="demo-email" type="email" required placeholder="jean.dupont@hopital.fr" value={formData.email} onChange={handleChange('email')} className="py-5" />
      </div>
      <div>
        <label htmlFor="demo-org" className="block text-sm font-medium mb-1.5">Organisation</label>
        <Input id="demo-org" required placeholder="CHU de Lyon" value={formData.organization} onChange={handleChange('organization')} className="py-5" />
      </div>
      <div>
        <label htmlFor="demo-role" className="block text-sm font-medium mb-1.5">Fonction</label>
        <Input id="demo-role" required placeholder="DRH, Directeur..." value={formData.role} onChange={handleChange('role')} className="py-5" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="demo-size" className="block text-sm font-medium mb-1.5">Nombre de collaborateurs</label>
        <select
          id="demo-size"
          required
          value={formData.size}
          onChange={handleChange('size')}
          className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Sélectionner...</option>
          <option value="10-50">10 - 50</option>
          <option value="50-200">50 - 200</option>
          <option value="200-500">200 - 500</option>
          <option value="500-1000">500 - 1 000</option>
          <option value="1000+">1 000+</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full rounded-full text-lg py-6 group">
          <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
          Demander une démo gratuite
        </Button>
      </div>
    </form>
  );
};

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
              <Link to="/contact">
                <Button
                  size="lg"
                  className="group px-10 py-7 text-lg font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Échanger avec notre équipe
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

            {/* "Déjà inscrit?" link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              Déjà inscrit ?{' '}
              <Link to="/b2b/selection" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground"
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

      {/* ═══════════════════ CAS D'USAGE ═══════════════════ */}
      <section className="py-28 md:py-36">
        <div className="container px-4 sm:px-6 lg:px-8">
          <SectionTitle center subtitle="Des solutions adaptées à chaque établissement de santé.">
            Pensé pour le{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              terrain.
            </span>
          </SectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {useCases.map((uc, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const isInView = useInView(ref, { once: true, amount: 0.4 });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="bg-card/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 hover:border-border hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent text-white mb-4">
                    <uc.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{uc.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{uc.description}</p>
                  <div className="text-sm font-semibold text-primary">{uc.stat}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TÉMOIGNAGES ═══════════════════ */}
      <section className="py-28 md:py-36 bg-muted/30">
        <div className="container px-4 sm:px-6 lg:px-8">
          <SectionTitle center subtitle="Ils ont déployé EmotionsCare dans leur établissement.">
            Retours{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              d'établissements pilotes.
            </span>
          </SectionTitle>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const isInView = useInView(ref, { once: true, amount: 0.4 });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  className="bg-card/60 backdrop-blur-xl rounded-2xl p-8 border border-border/50"
                >
                  <Quote className="h-8 w-8 text-primary/30 mb-4" aria-hidden="true" />
                  <blockquote className="text-muted-foreground leading-relaxed mb-6">
                    &laquo; {t.quote} &raquo;
                  </blockquote>
                  <div>
                    <div className="font-semibold">{t.author}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                    <div className="text-sm text-primary">{t.org}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ DASHBOARD RH PREVIEW ═══════════════════ */}
      <section className="py-28 md:py-36">
        <div className="container px-4 sm:px-6 lg:px-8">
          <SectionTitle center subtitle="Un aperçu de ce que les RH voient — sans aucune donnée individuelle.">
            Dashboard RH{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              anonyme.
            </span>
          </SectionTitle>

          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="bg-card/60 backdrop-blur-xl rounded-3xl border border-border/50 p-6 md:p-10 shadow-2xl"
            >
              {/* Dashboard header mock */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Tableau de bord bien-être</div>
                    <div className="text-xs text-muted-foreground">Données agrégées &middot; Anonymes</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  <Lock className="h-3 w-3" aria-hidden="true" />
                  Aucune donnée individuelle
                </div>
              </div>

              {/* Dashboard KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Bien-être moyen', value: '72/100', trend: '+8%', color: 'text-emerald-500' },
                  { label: 'Taux d\'utilisation', value: '64%', trend: '+12%', color: 'text-primary' },
                  { label: 'Sessions/semaine', value: '3.2', trend: '+0.5', color: 'text-blue-500' },
                  { label: 'Satisfaction', value: '4.6/5', trend: '+0.3', color: 'text-amber-500' },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-muted/30 rounded-2xl p-4">
                    <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <div className={cn('text-xs font-medium mt-1', kpi.color)}>{kpi.trend} ce mois</div>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/20 rounded-2xl p-5">
                  <div className="text-sm font-medium mb-4">Tendance bien-être (6 mois)</div>
                  <div className="flex items-end gap-2 h-32">
                    {[45, 52, 58, 63, 68, 72].map((val, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${val}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t-lg"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Sept</span><span>Oct</span><span>Nov</span><span>Déc</span><span>Jan</span><span>Fév</span>
                  </div>
                </div>
                <div className="bg-muted/20 rounded-2xl p-5">
                  <div className="text-sm font-medium mb-4">Modules les plus utilisés</div>
                  <div className="space-y-3">
                    {[
                      { name: 'Respiration guidée', pct: 85 },
                      { name: 'Musicothérapie', pct: 72 },
                      { name: 'Coach IA Nyvée', pct: 61 },
                      { name: 'Journal émotionnel', pct: 48 },
                    ].map((mod) => (
                      <div key={mod.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{mod.name}</span>
                          <span className="text-muted-foreground">{mod.pct}%</span>
                        </div>
                        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${mod.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <Shield className="h-3 w-3 text-emerald-500" aria-hidden="true" />
                  Données fictives à titre illustratif — aucune donnée individuelle n'est jamais accessible
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ROI CALCULATOR ═══════════════════ */}
      <section className="py-28 md:py-36">
        <div className="container px-4 sm:px-6 lg:px-8">
          <SectionTitle center subtitle="Estimez vos économies en réduisant l'absentéisme lié au stress et à l'épuisement.">
            <Calculator className="inline h-10 w-10 mr-3 text-primary" aria-hidden="true" />
            Calculateur de{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ROI.
            </span>
          </SectionTitle>

          <div className="max-w-4xl mx-auto">
            <ROICalculator />
          </div>
        </div>
      </section>

      {/* ═══════════════════ DEMANDE DE DÉMO ═══════════════════ */}
      <section className="py-28 md:py-36 bg-muted/30" id="demo">
        <div className="container px-4 sm:px-6 lg:px-8">
          <SectionTitle center subtitle="Planifiez une démonstration personnalisée avec notre équipe.">
            Demander une{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              démo gratuite.
            </span>
          </SectionTitle>

          <div className="max-w-2xl mx-auto bg-card/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-border/50">
            <DemoRequestForm />
          </div>
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
              <Link to="/contact">
                <Button
                  size="lg"
                  className="group px-12 py-8 text-xl font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-2xl shadow-foreground/20 transition-all duration-500 hover:scale-105"
                >
                  <Users className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                  Échanger avec notre équipe
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
