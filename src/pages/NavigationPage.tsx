// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search, Home, Brain, Music, BookOpen, Wind, Eye, Palette, Wand2,
  Zap, Target, Heart, Users, Settings, BarChart3, Shield, HelpCircle,
  Star, Calendar, MessageCircle, Trophy, Compass, Film,
  Activity, Crown, Rocket, Globe, TrendingUp, Gift, Lock,
  RefreshCw, LayoutDashboard, FileText,
  ArrowLeft, Building2, Map, Bell, Download, X,
  Sparkles, type LucideIcon,
} from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { cn } from '@/lib/utils';

interface RouteItem {
  path: string;
  label: string;
  description: string;
  category: string;
  icon: LucideIcon;
  isNew?: boolean;
  isPremium?: boolean;
  requiresAuth?: boolean;
}

const allRoutes: RouteItem[] = [
  { path: '/', label: 'Accueil', description: 'Page d\'accueil EmotionsCare', category: 'Accueil', icon: Home },
  { path: '/app/home', label: 'Mon Espace', description: 'Tableau de bord personnel', category: 'Accueil', icon: LayoutDashboard, requiresAuth: true },
  { path: '/app/modules', label: 'Tous les Modules', description: 'Explorer les fonctionnalités', category: 'Accueil', icon: Compass, requiresAuth: true },
  { path: '/app/emotional-park', label: 'Parc Émotionnel', description: 'Carte interactive des modules', category: 'Accueil', icon: Map, requiresAuth: true },

  { path: '/app/scan', label: 'Scanner Émotionnel', description: 'Analyse IA multi-modale : visage, voix, texte, emoji', category: 'Comprendre', icon: Brain, requiresAuth: true },
  { path: '/app/insights', label: 'Insights', description: 'Analyses et tendances personnelles', category: 'Comprendre', icon: TrendingUp, requiresAuth: true },
  { path: '/app/trends', label: 'Tendances', description: 'Évolution de votre humeur dans le temps', category: 'Comprendre', icon: BarChart3, requiresAuth: true },
  { path: '/app/analytics', label: 'Analytics', description: 'Statistiques détaillées de votre parcours', category: 'Comprendre', icon: Activity, requiresAuth: true },
  { path: '/dashboard/assessments', label: 'Évaluations cliniques', description: 'Tests validés : PSS, MBI, PHQ-9', category: 'Comprendre', icon: FileText, requiresAuth: true },

  { path: '/app/breath-hub', label: 'Respiration Guidée', description: '4 modes : classique, gamifié, immersif, nuit', category: 'Agir', icon: Wind, requiresAuth: true, isNew: true },
  { path: '/app/coach', label: 'Coach IA', description: 'Assistant émotionnel personnalisé 24/7', category: 'Agir', icon: Brain, requiresAuth: true },
  { path: '/app/journal', label: 'Journal', description: 'Journal émotionnel texte et vocal', category: 'Agir', icon: BookOpen, requiresAuth: true },
  { path: '/app/flash-glow', label: 'Protocole Reset', description: 'Micro-session de récupération en 2 minutes', category: 'Agir', icon: Zap, isNew: true, requiresAuth: true },
  { path: '/app/screen-silk', label: 'Protocole Stop', description: 'Timer 20-20-20 et micro-pauses guidées', category: 'Agir', icon: RefreshCw, requiresAuth: true },
  { path: '/app/meditation', label: 'Méditation', description: 'Sessions guidées pour la pleine conscience', category: 'Agir', icon: Heart, requiresAuth: true },
  { path: '/app/coach/programs', label: 'Programmes Coach', description: 'Parcours guidés multi-semaines', category: 'Agir', icon: Target, requiresAuth: true },
  { path: '/calendar', label: 'Calendrier bien-être', description: 'Planifiez vos sessions et rappels', category: 'Agir', icon: Calendar, requiresAuth: true },

  { path: '/app/music-hub', label: 'Musicothérapie', description: 'Bibliothèque, mixer d\'ambiances et journal vocal', category: "S'évader", icon: Music, requiresAuth: true, isNew: true },
  { path: '/app/vr', label: 'Espace VR', description: 'Galaxie, nébuleuse et respiration immersive 3D', category: "S'évader", icon: Eye, isPremium: true, requiresAuth: true },
  { path: '/app/park-journey', label: 'Voyage Immersif', description: 'Parcours narratif dans le parc émotionnel', category: "S'évader", icon: Rocket, requiresAuth: true },
  { path: '/app/story-synth', label: 'Récits Thérapeutiques', description: 'Bibliothèque de récits guidés IA pour relaxation', category: "S'évader", icon: Wand2, requiresAuth: true },
  { path: '/app/themes', label: 'Thèmes', description: 'Personnaliser l\'apparence de l\'app', category: "S'évader", icon: Palette, requiresAuth: true },

  { path: '/gamification', label: 'Centre Gamification', description: 'XP, niveaux, badges et streaks', category: 'Progresser', icon: Star, requiresAuth: true },
  { path: '/app/daily-challenges', label: 'Défis Quotidiens', description: 'Un nouveau défi bien-être chaque jour', category: 'Progresser', icon: Zap, requiresAuth: true },
  { path: '/app/challenges', label: 'Tous les Défis', description: 'Persévérance, résilience et objectifs', category: 'Progresser', icon: Trophy, requiresAuth: true },
  { path: '/app/leaderboard', label: 'Classement', description: 'Top joueurs anonymisé', category: 'Progresser', icon: Trophy, requiresAuth: true },
  { path: '/app/goals', label: 'Objectifs', description: 'Définir et suivre vos objectifs personnels', category: 'Progresser', icon: Target, requiresAuth: true },
  { path: '/app/badges', label: 'Badges & Récompenses', description: 'Vos succès débloqués', category: 'Progresser', icon: Gift, requiresAuth: true },

  { path: '/app/entraide', label: 'Entraide', description: 'Cercles de soutien entre soignants', category: 'Communauté', icon: Users, requiresAuth: true },
  { path: '/app/buddies', label: 'Buddies', description: 'Trouver un binôme de soutien', category: 'Communauté', icon: Heart, requiresAuth: true },
  { path: '/app/group-sessions', label: 'Sessions Groupe', description: 'Pratiquer ensemble à distance', category: 'Communauté', icon: Users, requiresAuth: true },
  { path: '/app/visio', label: 'Visioconférence', description: 'Sessions de soutien en visio', category: 'Communauté', icon: Film, requiresAuth: true },

  { path: '/entreprise', label: 'Entreprise', description: 'Offre B2B pour les établissements', category: 'B2B', icon: Building2 },
  { path: '/app/rh', label: 'Dashboard RH', description: 'Bien-être anonymisé des équipes', category: 'B2B', icon: BarChart3, requiresAuth: true },
  { path: '/app/reports', label: 'Rapports Manager', description: 'Synthèses mensuelles anonymisées', category: 'B2B', icon: FileText, requiresAuth: true },
  { path: '/b2b/alerts', label: 'Alertes RH', description: 'Veille proactive sur le climat émotionnel', category: 'B2B', icon: Bell, requiresAuth: true },
  { path: '/b2b/prevention', label: 'Programme Prévention', description: 'Parcours prévention sur mesure', category: 'B2B', icon: Shield, requiresAuth: true },
  { path: '/app/teams', label: 'Équipes', description: 'Gestion des équipes', category: 'B2B', icon: Users, requiresAuth: true },
  { path: '/b2b/reports', label: 'Rapports B2B', description: 'Reporting avancé entreprise', category: 'B2B', icon: BarChart3, requiresAuth: true },
  { path: '/b2b/wellness', label: 'Wellness Hub', description: 'Hub bien-être entreprise', category: 'B2B', icon: Heart },

  { path: '/app/profile', label: 'Mon Profil', description: 'Informations personnelles', category: 'Paramètres', icon: Users, requiresAuth: true },
  { path: '/settings/general', label: 'Paramètres', description: 'Configuration générale', category: 'Paramètres', icon: Settings, requiresAuth: true },
  { path: '/settings/privacy', label: 'Confidentialité', description: 'Contrôle de vos données', category: 'Paramètres', icon: Lock, requiresAuth: true },
  { path: '/settings/notifications', label: 'Notifications', description: 'Préférences de notifications', category: 'Paramètres', icon: Bell, requiresAuth: true },
  { path: '/settings/accessibility', label: 'Accessibilité', description: 'Options d\'accessibilité', category: 'Paramètres', icon: Eye, requiresAuth: true },
  { path: '/settings/language', label: 'Langue', description: 'Changer la langue de l\'interface', category: 'Paramètres', icon: Globe, requiresAuth: true },
  { path: '/app/premium', label: 'Premium', description: 'Gestion de l\'abonnement', category: 'Paramètres', icon: Crown, isPremium: true, requiresAuth: true },
  { path: '/app/data-export', label: 'Export RGPD', description: 'Exporter toutes vos données', category: 'Paramètres', icon: Download, requiresAuth: true },

  { path: '/about', label: 'À propos', description: 'Notre mission pour les soignants', category: 'Public', icon: Heart },
  { path: '/pricing', label: 'Tarifs', description: 'Plans et abonnements', category: 'Public', icon: Crown },
  { path: '/contact', label: 'Contact', description: 'Nous contacter', category: 'Public', icon: MessageCircle },
  { path: '/demo', label: 'Démo', description: 'Essayer gratuitement', category: 'Public', icon: Rocket },
  { path: '/help', label: 'Aide', description: 'Centre d\'aide complet', category: 'Public', icon: HelpCircle },
  { path: '/faq', label: 'FAQ', description: 'Questions fréquentes', category: 'Public', icon: HelpCircle },
  { path: '/privacy', label: 'Confidentialité', description: 'Politique de confidentialité', category: 'Public', icon: Lock },
  { path: '/legal/terms', label: 'CGU', description: 'Conditions d\'utilisation', category: 'Public', icon: FileText },
];

type CategoryMeta = {
  name: string;
  tagline: string;
  icon: LucideIcon;
  // semantic gradient via tailwind classes
  gradient: string;
  ring: string;
  iconBg: string;
};

const CATEGORIES: CategoryMeta[] = [
  { name: 'Accueil', tagline: 'Vos points d\'entrée', icon: Home, gradient: 'from-primary/15 to-primary/5', ring: 'ring-primary/20', iconBg: 'bg-primary/10 text-primary' },
  { name: 'Comprendre', tagline: 'Analyser vos émotions', icon: Brain, gradient: 'from-info/15 to-info/5', ring: 'ring-info/20', iconBg: 'bg-info/10 text-info' },
  { name: 'Agir', tagline: 'Protocoles & accompagnement', icon: Wind, gradient: 'from-success/15 to-success/5', ring: 'ring-success/20', iconBg: 'bg-success/10 text-success' },
  { name: "S'évader", tagline: 'Musique, VR, créatif', icon: Sparkles, gradient: 'from-accent/15 to-accent/5', ring: 'ring-accent/20', iconBg: 'bg-accent/10 text-accent' },
  { name: 'Progresser', tagline: 'Gamification & défis', icon: Trophy, gradient: 'from-warning/15 to-warning/5', ring: 'ring-warning/20', iconBg: 'bg-warning/10 text-warning' },
  { name: 'Communauté', tagline: 'Soutien entre pairs', icon: Users, gradient: 'from-pink-500/15 to-pink-500/5', ring: 'ring-pink-500/20', iconBg: 'bg-pink-500/10 text-pink-500' },
  { name: 'B2B', tagline: 'Entreprise & RH', icon: Building2, gradient: 'from-secondary/30 to-secondary/10', ring: 'ring-secondary/30', iconBg: 'bg-secondary text-secondary-foreground' },
  { name: 'Paramètres', tagline: 'Compte & préférences', icon: Settings, gradient: 'from-muted/60 to-muted/20', ring: 'ring-border', iconBg: 'bg-muted text-foreground' },
  { name: 'Public', tagline: 'Pages institutionnelles', icon: Globe, gradient: 'from-muted/40 to-muted/10', ring: 'ring-border', iconBg: 'bg-muted text-muted-foreground' },
];

const categoryByName = Object.fromEntries(CATEGORIES.map((c) => [c.name, c]));

export default function NavigationPage() {
  usePageSEO({
    title: 'Navigation — EmotionsCare',
    description: 'Toutes les pages de la plateforme EmotionsCare organisées par catégorie.',
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRoutes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allRoutes.filter((route) => {
      const matchesSearch =
        q === '' ||
        route.label.toLowerCase().includes(q) ||
        route.description.toLowerCase().includes(q) ||
        route.path.toLowerCase().includes(q);
      const matchesCategory = !selectedCategory || route.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const routesByCategory = useMemo(() => {
    const grouped: Record<string, RouteItem[]> = {};
    filteredRoutes.forEach((route) => {
      if (!grouped[route.category]) grouped[route.category] = [];
      grouped[route.category].push(route);
    });
    return grouped;
  }, [filteredRoutes]);

  const totalCount = allRoutes.length;
  const visibleCount = filteredRoutes.length;
  const isFiltering = search !== '' || selectedCategory !== null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero gradient subtle */}
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-primary/8 via-accent/5 to-transparent pointer-events-none" aria-hidden="true" />

      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild aria-label="Retour au tableau de bord">
              <Link to="/app/home">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-semibold truncate">Navigation</h1>
              <p className="text-xs text-muted-foreground">
                {visibleCount} {visibleCount > 1 ? 'pages' : 'page'} {isFiltering && `sur ${totalCount}`}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-8 pb-16 relative">
        {/* Hero copy */}
        <section className="max-w-2xl mb-10">
          <Badge variant="secondary" className="mb-4">
            <Compass className="h-3 w-3 mr-1.5" aria-hidden="true" />
            Plan du site
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Toutes vos ressources, en un coup d'œil
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            {totalCount} pages organisées en {CATEGORIES.length} univers. Trouvez ce dont vous avez besoin en un instant.
          </p>
        </section>

        {/* Search bar — premium feel */}
        <div className="relative mb-6 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Rechercher une page (scan, journal, méditation…)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 pr-11 h-12 text-base bg-card/60 backdrop-blur border-border/60 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Rechercher une page"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap mb-10">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border',
              selectedCategory === null
                ? 'bg-foreground text-background border-foreground shadow-sm'
                : 'bg-card/60 text-foreground border-border hover:border-foreground/40'
            )}
          >
            Tout
            <span className="text-xs opacity-70">{totalCount}</span>
          </button>
          {CATEGORIES.map((cat) => {
            const count = allRoutes.filter((r) => r.category === cat.name).length;
            const active = selectedCategory === cat.name;
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(active ? null : cat.name)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border',
                  active
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'bg-card/60 text-foreground border-border hover:border-foreground/40'
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {cat.name}
                <span className="text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Sections */}
        {visibleCount === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="text-lg font-medium mb-1">Aucune page trouvée</p>
            <p className="text-sm text-muted-foreground mb-4">
              Aucun résultat pour « {search} »
            </p>
            <Button variant="outline" onClick={() => { setSearch(''); setSelectedCategory(null); }}>
              Réinitialiser
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {CATEGORIES.map((cat) => {
              const routes = routesByCategory[cat.name];
              if (!routes || routes.length === 0) return null;
              const HeaderIcon = cat.icon;
              return (
                <motion.section
                  key={cat.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  aria-labelledby={`cat-${cat.name}`}
                >
                  {/* Section header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={cn('flex items-center justify-center w-10 h-10 rounded-xl', cat.iconBg)}>
                      <HeaderIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 id={`cat-${cat.name}`} className="text-xl font-semibold flex items-center gap-2">
                        {cat.name}
                        <span className="text-sm font-normal text-muted-foreground">· {routes.length}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">{cat.tagline}</p>
                    </div>
                  </div>

                  {/* Cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {routes.map((route) => {
                      const Icon = route.icon;
                      return (
                        <Link
                          key={route.path}
                          to={route.path}
                          className={cn(
                            'group relative overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-sm p-4',
                            'transition-all duration-300',
                            'hover:bg-card hover:shadow-lg hover:-translate-y-0.5',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                            'border-border/60 hover:border-border'
                          )}
                          aria-label={`${route.label} — ${route.description}`}
                        >
                          {/* Subtle hover gradient */}
                          <div
                            className={cn(
                              'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br',
                              cat.gradient
                            )}
                            aria-hidden="true"
                          />
                          <div className="relative flex items-start gap-3">
                            <div className={cn('flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110', cat.iconBg)}>
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                <h4 className="font-semibold text-sm leading-tight">{route.label}</h4>
                                {route.isNew && (
                                  <Badge className="bg-success/15 text-success border-success/30 text-[10px] px-1.5 py-0 h-4 font-medium">
                                    Nouveau
                                  </Badge>
                                )}
                                {route.isPremium && (
                                  <Crown className="h-3 w-3 text-warning shrink-0" aria-label="Premium" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {route.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
