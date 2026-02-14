/**
 * FeaturesPage - Premium Apple-style showcase of all features
 * /features
 */

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Scan, Wind, BookOpen, ClipboardCheck,
  Bot, Music, Headphones, Sparkles,
  ArrowRight, Shield, Clock, Zap,
  Heart, CheckCircle2, Gamepad2, Users,
  BarChart3, Lock, Bell, Globe, Eye,
  Calendar, Video, Smartphone, FileText,
  Activity, Map, Brain, Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePageSEO } from '@/hooks/usePageSEO';
import { SeoHead } from '@/lib/seo/SeoHead';

/* ─── Scroll-reveal wrapper ─── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = ''
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

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

/* ─── Data ─── */
interface FeatureModule {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  highlights: string[];
  gradient: string;
  iconBg: string;
}

interface CompactModule {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: {
  label: string;
  title: string;
  subtitle: string;
  modules: FeatureModule[];
}[] = [
  {
    label: 'Comprendre',
    title: 'Comprenez vos émotions',
    subtitle: 'Des outils cliniques pour analyser et mesurer votre état émotionnel en toute confiance.',
    modules: [
      {
        id: 'scan',
        title: 'Scanner Émotionnel IA',
        tagline: 'Comprenez vos émotions en 60 secondes',
        description: 'Notre IA analyse vos expressions faciales et votre voix pour identifier vos émotions avec précision. Obtenez un rapport détaillé sur 5 dimensions : humeur, énergie, stress, sommeil et charge mentale.',
        icon: Scan,
        highlights: ['Analyse faciale IA', 'Détection en temps réel', 'Score sur 5 dimensions'],
        gradient: 'from-rose-500 to-pink-600',
        iconBg: 'bg-rose-500/20 text-rose-400',
      },
      {
        id: 'assessments',
        title: 'Évaluations Cliniques',
        tagline: 'Questionnaires validés internationalement',
        description: 'Évaluez votre bien-être avec les outils WHO-5 et PHQ-9, reconnus par l\'OMS. Suivez votre évolution avec des graphiques détaillés.',
        icon: ClipboardCheck,
        highlights: ['WHO-5 (OMS)', 'PHQ-9 (Dépression)', 'Graphiques d\'évolution'],
        gradient: 'from-emerald-500 to-teal-600',
        iconBg: 'bg-emerald-500/20 text-emerald-400',
      },
    ],
  },
  {
    label: 'Agir',
    title: 'Passez à l\'action',
    subtitle: 'Des techniques validées scientifiquement pour réguler votre stress et renforcer votre résilience.',
    modules: [
      {
        id: 'breathing',
        title: 'Protocoles de Respiration',
        tagline: '6 protocoles pour calmer le stress en 3 min',
        description: 'Cohérence cardiaque, 4-7-8, Box Breathing et plus. Animations visuelles apaisantes et sons ambiants. Inclut les protocoles Stop, Reset, Night et Respirez.',
        icon: Wind,
        highlights: ['6 protocoles validés', 'Cohérence cardiaque', 'Protocole Stop / Reset / Night'],
        gradient: 'from-cyan-500 to-blue-600',
        iconBg: 'bg-cyan-500/20 text-cyan-400',
      },
      {
        id: 'coach',
        title: 'Coach IA Nyvée',
        tagline: 'Un accompagnateur empathique, disponible 24/7',
        description: 'Votre coach émotionnel IA disponible 24/7. Conversations bienveillantes avec techniques CBT validées, adaptées aux professionnels de santé.',
        icon: Bot,
        highlights: ['Conversations naturelles', 'Techniques CBT', 'Disponible 24/7'],
        gradient: 'from-amber-500 to-orange-600',
        iconBg: 'bg-amber-500/20 text-amber-400',
      },
      {
        id: 'journal',
        title: 'Journal Émotionnel',
        tagline: 'Documentez votre parcours intérieur',
        description: 'Journal chiffré pour consigner pensées et émotions. Écriture libre, dictée vocale, tags personnalisés et partage sécurisé avec votre coach IA.',
        icon: BookOpen,
        highlights: ['Écriture & dictée vocale', 'Tags personnalisés', 'Export RGPD'],
        gradient: 'from-violet-500 to-purple-600',
        iconBg: 'bg-violet-500/20 text-violet-400',
      },
    ],
  },
  {
    label: 'S\'évader',
    title: 'Évadez-vous',
    subtitle: 'Des expériences immersives pour une relaxation profonde et une reconnexion à soi.',
    modules: [
      {
        id: 'music',
        title: 'Musicothérapie',
        tagline: 'Sons conçus pour réguler votre humeur',
        description: 'Musiques thérapeutiques IA, fréquences binaurales, vinyles thématiques et playlists personnalisées qui s\'adaptent à vos émotions et préférences.',
        icon: Music,
        highlights: ['Génération IA Suno', 'Fréquences binaurales', 'Playlists adaptatives'],
        gradient: 'from-indigo-500 to-blue-700',
        iconBg: 'bg-indigo-500/20 text-indigo-400',
      },
      {
        id: 'immersive',
        title: 'Expériences Immersives',
        tagline: 'Réalité virtuelle et augmentée thérapeutique',
        description: 'Galaxie VR pour la méditation, respiration guidée 3D, filtres AR émotionnels et environnements adaptatifs pour une relaxation profonde.',
        icon: Headphones,
        highlights: ['Galaxie VR', 'Filtres AR', 'Environnements 3D adaptatifs'],
        gradient: 'from-fuchsia-500 to-pink-700',
        iconBg: 'bg-fuchsia-500/20 text-fuchsia-400',
      },
      {
        id: 'park',
        title: 'Parc Émotionnel',
        tagline: 'Explorez votre monde intérieur',
        description: 'Espace interactif et immersif pour décompresser. Zones thématiques, parcours guidés, atlas des émotions et quêtes dans un univers apaisant.',
        icon: Map,
        highlights: ['Atlas des émotions', 'Parcours guidés', 'Badges & quêtes'],
        gradient: 'from-teal-500 to-emerald-600',
        iconBg: 'bg-teal-500/20 text-teal-400',
      },
    ],
  },
  {
    label: 'Progresser',
    title: 'Suivez vos progrès',
    subtitle: 'Gamification, analytics et suivi longitudinal pour maintenir votre engagement au quotidien.',
    modules: [
      {
        id: 'gamification',
        title: 'Gamification',
        tagline: 'Transformez votre bien-être en jeu',
        description: 'Système XP, niveaux, badges, défis quotidiens et classement communautaire anonymisé. Restez motivé avec des streaks et des récompenses.',
        icon: Gamepad2,
        highlights: ['Système XP & niveaux', 'Défis quotidiens', 'Classement anonymisé'],
        gradient: 'from-orange-500 to-red-600',
        iconBg: 'bg-orange-500/20 text-orange-400',
      },
      {
        id: 'analytics',
        title: 'Suivi & Analytics',
        tagline: 'Visualisez votre évolution sur 7, 30 ou 90 jours',
        description: 'Tableau de bord personnel avec tendances d\'humeur, fréquence de sessions, durée moyenne, engagement et recommandations IA personnalisées.',
        icon: BarChart3,
        highlights: ['Tendances visuelles', 'Corrélations multi-modules', 'Export PDF/CSV'],
        gradient: 'from-sky-500 to-blue-600',
        iconBg: 'bg-sky-500/20 text-sky-400',
      },
    ],
  },
  {
    label: 'Collaborer',
    title: 'Solution B2B / RH',
    subtitle: 'Des outils dédiés aux managers et établissements pour un suivi collectif du bien-être, dans le respect total de la confidentialité.',
    modules: [
      {
        id: 'b2b-dashboard',
        title: 'Dashboard RH',
        tagline: 'Bien-être collectif anonymisé',
        description: 'Tableau de bord manager avec KPIs agrégés, indicateurs de charge et de récupération, alertes anonymisées et rapports mensuels conformes RGPD.',
        icon: Activity,
        highlights: ['KPIs anonymisés', 'Alertes bien-être', 'Rapports conformes RGPD'],
        gradient: 'from-slate-500 to-gray-600',
        iconBg: 'bg-slate-500/20 text-slate-400',
      },
      {
        id: 'community',
        title: 'Communauté & Entraide',
        tagline: 'Cercles de soutien entre pairs soignants',
        description: 'Forum d\'entraide, groupes de parole, parrainage et bibliothèque de ressources. Terminologie adaptée au contexte hospitalier.',
        icon: Users,
        highlights: ['Cercles de soutien', 'Parrainage entre pairs', 'Ressources validées'],
        gradient: 'from-lime-500 to-green-600',
        iconBg: 'bg-lime-500/20 text-lime-400',
      },
    ],
  },
];

/* ─── Compact modules: the remaining modules from the 37 ─── */
const ADDITIONAL_MODULES: { category: string; modules: CompactModule[] }[] = [
  {
    category: 'Rappels & Notifications',
    modules: [
      { title: 'Rappels personnalisés', description: 'Rappels quotidiens, alertes streak et notifications intelligentes selon votre activité.', icon: Bell },
      { title: 'Notifications push', description: 'Push mobiles et desktop pour ne manquer aucun rappel bien-être ou défi quotidien.', icon: Smartphone },
    ],
  },
  {
    category: 'Export & Conformité',
    modules: [
      { title: 'Export RGPD', description: 'Exportez toutes vos données personnelles aux formats PDF, JSON ou CSV.', icon: FileText },
      { title: 'Paramètres confidentialité', description: 'Contrôle fin de vos données : caméra, micro, analytics et consentements.', icon: Lock },
      { title: 'Conformité HDS', description: 'Hébergement de Données de Santé conforme à la réglementation française.', icon: Shield },
    ],
  },
  {
    category: 'Accessibilité & Personnalisation',
    modules: [
      { title: 'Accessibilité WCAG 2.1 AA', description: 'Contraste élevé, mode daltonien, taille du texte, navigation clavier et lecteur d\'écran.', icon: Eye },
      { title: 'Support multilingue', description: 'Interface disponible en Français et English.', icon: Globe },
      { title: 'Mode hors ligne (PWA)', description: 'Installez EmotionsCare sur votre appareil et accédez aux protocoles essentiels sans connexion.', icon: Smartphone },
    ],
  },
  {
    category: 'Intégrations & Outils avancés',
    modules: [
      { title: 'Intégration calendrier', description: 'Planifiez vos sessions bien-être avec rappels automatiques dans votre agenda.', icon: Calendar },
      { title: 'Visioconférence', description: 'Sessions de soutien en visio avec consentement renforcé et cercles de parole.', icon: Video },
      { title: 'Programme de prévention B2B', description: 'Parcours de prévention sur mesure pour les établissements avec suivi d\'impact.', icon: Heart },
      { title: 'FAQ interactive', description: 'Questions fréquentes en 5 catégories avec recherche instantanée.', icon: BookOpen },
    ],
  },
];

const STATS = [
  { value: '37', label: 'modules intégrés', icon: Zap },
  { value: '3 min', label: 'par exercice', icon: Clock },
  { value: '100%', label: 'RGPD & HDS', icon: Shield },
  { value: '24/7', label: 'disponible', icon: Heart },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Scannez', description: 'Analysez votre état émotionnel en quelques secondes grâce à l\'IA.' },
  { step: '02', title: 'Comprenez', description: 'Recevez des insights personnalisés et des recommandations adaptées.' },
  { step: '03', title: 'Agissez', description: 'Choisissez l\'exercice le plus adapté : respiration, coaching, musique ou VR.' },
];

/* ─── Component ─── */
const FeaturesPage: React.FC = () => {
  usePageSEO({
    title: 'Fonctionnalités - EmotionsCare | 37 modules intégrés',
    description: 'Découvrez les 37 modules EmotionsCare : scanner émotionnel IA, coach Nyvée, musicothérapie, réalité virtuelle, gamification, journal émotionnel et plus.',
    keywords: 'gestion du stress, bien-être au travail, santé mentale soignants, scanner émotionnel, respiration guidée, journal émotionnel, musicothérapie, réalité virtuelle, coach IA, gamification',
  });

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <SeoHead
        title="Fonctionnalités"
        description="37 modules intégrés pour gérer votre stress et améliorer votre bien-être émotionnel. Scanner IA, respiration, journal, coach Nyvée, musicothérapie, VR et plus."
        url="/features"
      />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              37 modules intégrés
            </span>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
              37 modules.{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent">
                3 minutes.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              La plateforme la plus complète de régulation émotionnelle pour soignants
              et étudiants en santé — scientifiquement validée, accessible partout.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="text-base px-8 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  Essayer gratuitement
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Button>
              </Link>
              <a href="#comprendre">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-full">
                  Explorer les modules
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="py-12 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center">
                    <Icon className="h-5 w-5 text-primary mx-auto mb-2" aria-hidden="true" />
                    <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FEATURE SECTIONS (5 thematic blocks with featured modules) ═══ */}
      {SECTIONS.map((section, sectionIdx) => (
        <section
          key={section.label}
          id={section.label.toLowerCase().replace(/'/g, '')}
          className={`py-20 md:py-28 ${sectionIdx % 2 === 1 ? 'bg-muted/20' : ''}`}
        >
          <div className="container mx-auto px-4">
            {/* Section header */}
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-3 block">
                  {section.label}
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  {section.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {section.subtitle}
                </p>
              </div>
            </Reveal>

            {/* Module cards */}
            <div className={`grid gap-8 ${section.modules.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} max-w-5xl mx-auto`}>
              {section.modules.map((mod, modIdx) => {
                const Icon = mod.icon;
                return (
                  <Reveal key={mod.id} delay={modIdx * 0.15}>
                    <div className="group relative h-full rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 flex flex-col">
                      {/* Gradient glow on hover */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${mod.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                      <div className="relative z-10 flex flex-col h-full">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl ${mod.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-7 w-7" aria-hidden="true" />
                        </div>

                        {/* Title & tagline */}
                        <h3 className="text-2xl font-bold mb-2">{mod.title}</h3>
                        <p className={`text-sm font-medium bg-gradient-to-r ${mod.gradient} bg-clip-text text-transparent mb-4`}>
                          {mod.tagline}
                        </p>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                          {mod.description}
                        </p>

                        {/* Highlights */}
                        <ul className="space-y-2 mb-8" aria-label={`Points clés de ${mod.title}`}>
                          {mod.highlights.map((h, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary/60" aria-hidden="true" />
                              {h}
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <Link to="/signup" className="mt-auto" aria-label={`Essayer ${mod.title}`}>
                          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 rounded-xl">
                            Essayer gratuitement
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* ═══ ADDITIONAL MODULES (compact grid) ═══ */}
      <section className="py-20 md:py-28 bg-muted/10">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-3 block">
                Et bien plus encore
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                Tous les outils réunis
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Rappels, export, accessibilité, intégrations — tout ce dont vous avez besoin pour un suivi complet.
              </p>
            </div>
          </Reveal>

          <div className="max-w-5xl mx-auto space-y-12">
            {ADDITIONAL_MODULES.map((group, gIdx) => (
              <Reveal key={group.category} delay={gIdx * 0.1}>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                    {group.category}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.modules.map((mod, mIdx) => {
                      const Icon = mod.icon;
                      return (
                        <div key={mIdx} className="flex items-start gap-3 p-4 rounded-2xl border border-border/50 bg-card/60 hover:border-primary/20 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-1">{mod.title}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{mod.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-3 block">
                Comment ça marche
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                Simple comme 1, 2, 3
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="text-center">
                  <div className="text-6xl font-black text-primary/20 mb-4">{step.step}</div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-background/70 leading-relaxed">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST + CTA FINAL ═══ */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <Reveal>
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                { icon: Shield, text: 'RGPD Compliant' },
                { icon: Lock, text: 'HDS Certifié' },
                { icon: Heart, text: 'Made in France' },
                { icon: Eye, text: 'WCAG 2.1 AA' },
              ].map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm text-muted-foreground">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    {badge.text}
                  </span>
                );
              })}
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Prêt à prendre soin de{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                vous ?
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Rejoignez les professionnels de santé qui améliorent leur bien-être émotionnel
              au quotidien avec EmotionsCare.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="text-base px-8 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  Essayer gratuitement
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-full">
                  Voir les tarifs
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
