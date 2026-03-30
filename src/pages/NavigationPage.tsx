// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, Home, Brain, Music, BookOpen, Wind, Eye, Palette, Wand2,
  Zap, Target, Heart, Users, Settings, BarChart3, Shield, HelpCircle,
  Gamepad2, Star, Calendar, MessageCircle, Trophy, Compass, Film,
  Activity, Crown, Clock, Rocket, Globe, TrendingUp, Gift, Lock,
  Smartphone, RefreshCw, LayoutDashboard, Mic, FileText, Waves,
  ArrowLeft, ExternalLink, Building2, CreditCard, Map, Sparkles,
  Volume2, Bell, Download, Moon, type LucideIcon,
} from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';

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

/**
 * NAVIGATION CONSOLIDÉE — ~80 routes utilisateur
 * Admin/Système masqués, doublons fusionnés, sous-pages regroupées
 */
const allRoutes: RouteItem[] = [
  // ═══════════════════════════════════════════════════════════
  // ACCUEIL (4)
  // ═══════════════════════════════════════════════════════════
  { path: '/', label: 'Accueil', description: 'Page d\'accueil EmotionsCare', category: 'Accueil', icon: Home },
  { path: '/app/home', label: 'Mon Espace', description: 'Tableau de bord personnel', category: 'Accueil', icon: LayoutDashboard, requiresAuth: true },
  { path: '/app/modules', label: 'Tous les Modules', description: 'Explorer les fonctionnalités', category: 'Accueil', icon: Compass, requiresAuth: true },
  { path: '/app/emotional-park', label: 'Parc Émotionnel', description: 'Carte interactive des modules', category: 'Accueil', icon: Map, requiresAuth: true },

  // ═══════════════════════════════════════════════════════════
  // COMPRENDRE — Analyse émotionnelle (5)
  // ═══════════════════════════════════════════════════════════
  { path: '/app/scan', label: 'Scanner Émotionnel', description: 'Analyse IA multi-modale : visage, voix, texte, emoji', category: 'Comprendre', icon: Brain, requiresAuth: true },
  { path: '/app/insights', label: 'Insights', description: 'Analyses et tendances personnelles', category: 'Comprendre', icon: TrendingUp, requiresAuth: true },
  { path: '/app/trends', label: 'Tendances', description: 'Évolution de votre humeur dans le temps', category: 'Comprendre', icon: BarChart3, requiresAuth: true },
  { path: '/app/analytics', label: 'Analytics', description: 'Statistiques détaillées de votre parcours', category: 'Comprendre', icon: Activity, requiresAuth: true },
  { path: '/dashboard/assessments', label: 'Évaluations cliniques', description: 'Tests validés : PSS, MBI, PHQ-9', category: 'Comprendre', icon: FileText, requiresAuth: true },

  // ═══════════════════════════════════════════════════════════
  // AGIR — Protocoles & Accompagnement (8)
  // ═══════════════════════════════════════════════════════════
  { path: '/app/breath-hub', label: 'Respiration Guidée', description: '4 modes : classique, gamifié, immersif, nuit', category: 'Agir', icon: Wind, requiresAuth: true, isNew: true },
  { path: '/app/coach', label: 'Coach IA', description: 'Assistant émotionnel personnalisé 24/7', category: 'Agir', icon: Brain, requiresAuth: true },
  { path: '/app/journal', label: 'Journal', description: 'Journal émotionnel texte et vocal', category: 'Agir', icon: BookOpen, requiresAuth: true },
  { path: '/app/flash-glow', label: 'Protocole Reset', description: 'Micro-session de récupération en 2 minutes', category: 'Agir', icon: Zap, isNew: true, requiresAuth: true },
  { path: '/app/screen-silk', label: 'Protocole Stop', description: 'Timer 20-20-20 et micro-pauses guidées', category: 'Agir', icon: RefreshCw, requiresAuth: true },
  { path: '/app/meditation', label: 'Méditation', description: 'Sessions guidées pour la pleine conscience', category: 'Agir', icon: Heart, requiresAuth: true },
  { path: '/app/coach/programs', label: 'Programmes Coach', description: 'Parcours guidés multi-semaines', category: 'Agir', icon: Target, requiresAuth: true },
  { path: '/calendar', label: 'Calendrier bien-être', description: 'Planifiez vos sessions et rappels', category: 'Agir', icon: Calendar, requiresAuth: true },

  // ═══════════════════════════════════════════════════════════
  // S'ÉVADER — Musique, VR, Créatif (5)
  // ═══════════════════════════════════════════════════════════
  { path: '/app/music-hub', label: 'Musicothérapie', description: 'Bibliothèque, mixer d\'ambiances et journal vocal', category: "S'évader", icon: Music, requiresAuth: true, isNew: true },
  { path: '/app/vr', label: 'Espace VR', description: 'Galaxie, nébuleuse et respiration immersive 3D', category: "S'évader", icon: Eye, isPremium: true, requiresAuth: true },
  { path: '/app/park-journey', label: 'Voyage Immersif', description: 'Parcours narratif dans le parc émotionnel', category: "S'évader", icon: Rocket, requiresAuth: true },
  { path: '/app/story-synth', label: 'Récits Thérapeutiques', description: 'Bibliothèque de récits guidés IA pour relaxation', category: "S'évader", icon: Wand2, requiresAuth: true },
  { path: '/app/themes', label: 'Thèmes', description: 'Personnaliser l\'apparence de l\'app', category: "S'évader", icon: Palette, requiresAuth: true },

  // ═══════════════════════════════════════════════════════════
  // PROGRESSER — Gamification & Défis (6)
  // ═══════════════════════════════════════════════════════════
  { path: '/gamification', label: 'Centre Gamification', description: 'XP, niveaux, badges et streaks', category: 'Progresser', icon: Star, requiresAuth: true },
  { path: '/app/daily-challenges', label: 'Défis Quotidiens', description: 'Un nouveau défi bien-être chaque jour', category: 'Progresser', icon: Zap, requiresAuth: true },
  { path: '/app/challenges', label: 'Tous les Défis', description: 'Persévérance, résilience et objectifs', category: 'Progresser', icon: Trophy, requiresAuth: true },
  { path: '/app/leaderboard', label: 'Classement', description: 'Top joueurs anonymisé', category: 'Progresser', icon: Trophy, requiresAuth: true },
  { path: '/app/goals', label: 'Objectifs', description: 'Définir et suivre vos objectifs personnels', category: 'Progresser', icon: Target, requiresAuth: true },
  { path: '/app/badges', label: 'Badges & Récompenses', description: 'Vos succès débloqués', category: 'Progresser', icon: Gift, requiresAuth: true },

  // ═══════════════════════════════════════════════════════════
  // COMMUNAUTÉ (4)
  // ═══════════════════════════════════════════════════════════
  { path: '/app/entraide', label: 'Entraide', description: 'Cercles de soutien entre soignants', category: 'Communauté', icon: Users, requiresAuth: true },
  { path: '/app/buddies', label: 'Buddies', description: 'Trouver un binôme de soutien', category: 'Communauté', icon: Heart, requiresAuth: true },
  { path: '/app/group-sessions', label: 'Sessions Groupe', description: 'Pratiquer ensemble à distance', category: 'Communauté', icon: Users, requiresAuth: true },
  { path: '/app/visio', label: 'Visioconférence', description: 'Sessions de soutien en visio', category: 'Communauté', icon: Film, requiresAuth: true },

  // ═══════════════════════════════════════════════════════════
  // B2B — Entreprise & RH (8)
  // ═══════════════════════════════════════════════════════════
  { path: '/entreprise', label: 'Entreprise', description: 'Offre B2B pour les établissements', category: 'B2B', icon: Building2 },
  { path: '/app/rh', label: 'Dashboard RH', description: 'Bien-être anonymisé des équipes', category: 'B2B', icon: BarChart3, requiresAuth: true },
  { path: '/app/reports', label: 'Rapports Manager', description: 'Synthèses mensuelles anonymisées', category: 'B2B', icon: FileText, requiresAuth: true },
  { path: '/b2b/alerts', label: 'Alertes RH', description: 'Veille proactive sur le climat émotionnel', category: 'B2B', icon: Bell, requiresAuth: true },
  { path: '/b2b/prevention', label: 'Programme Prévention', description: 'Parcours prévention sur mesure', category: 'B2B', icon: Shield, requiresAuth: true },
  { path: '/app/teams', label: 'Équipes', description: 'Gestion des équipes', category: 'B2B', icon: Users, requiresAuth: true },
  { path: '/b2b/reports', label: 'Rapports B2B', description: 'Reporting avancé entreprise', category: 'B2B', icon: BarChart3, requiresAuth: true },
  { path: '/b2b/wellness', label: 'Wellness Hub', description: 'Hub bien-être entreprise', category: 'B2B', icon: Heart },

  // ═══════════════════════════════════════════════════════════
  // PARAMÈTRES (8)
  // ═══════════════════════════════════════════════════════════
  { path: '/app/profile', label: 'Mon Profil', description: 'Informations personnelles', category: 'Paramètres', icon: Users, requiresAuth: true },
  { path: '/settings/general', label: 'Paramètres', description: 'Configuration générale', category: 'Paramètres', icon: Settings, requiresAuth: true },
  { path: '/settings/privacy', label: 'Confidentialité', description: 'Contrôle de vos données', category: 'Paramètres', icon: Lock, requiresAuth: true },
  { path: '/settings/notifications', label: 'Notifications', description: 'Préférences de notifications', category: 'Paramètres', icon: Bell, requiresAuth: true },
  { path: '/settings/accessibility', label: 'Accessibilité', description: 'Options d\'accessibilité', category: 'Paramètres', icon: Eye, requiresAuth: true },
  { path: '/settings/language', label: 'Langue', description: 'Changer la langue de l\'interface', category: 'Paramètres', icon: Globe, requiresAuth: true },
  { path: '/app/premium', label: 'Premium', description: 'Gestion de l\'abonnement', category: 'Paramètres', icon: Crown, isPremium: true, requiresAuth: true },
  { path: '/app/data-export', label: 'Export RGPD', description: 'Exporter toutes vos données', category: 'Paramètres', icon: Download, requiresAuth: true },

  // ═══════════════════════════════════════════════════════════
  // PUBLIC (8)
  // ═══════════════════════════════════════════════════════════
  { path: '/about', label: 'À propos', description: 'Notre mission pour les soignants', category: 'Public', icon: Heart },
  { path: '/pricing', label: 'Tarifs', description: 'Plans et abonnements', category: 'Public', icon: Crown },
  { path: '/contact', label: 'Contact', description: 'Nous contacter', category: 'Public', icon: MessageCircle },
  { path: '/demo', label: 'Démo', description: 'Essayer gratuitement', category: 'Public', icon: Rocket },
  { path: '/help', label: 'Aide', description: 'Centre d\'aide complet', category: 'Public', icon: HelpCircle },
  { path: '/faq', label: 'FAQ', description: 'Questions fréquentes', category: 'Public', icon: HelpCircle },
  { path: '/privacy', label: 'Confidentialité', description: 'Politique de confidentialité', category: 'Public', icon: Lock },
  { path: '/legal/terms', label: 'CGU', description: 'Conditions d\'utilisation', category: 'Public', icon: FileText },
];

const categories = [
  'Accueil', 'Comprendre', 'Agir', "S'évader", 'Progresser',
  'Communauté', 'B2B', 'Paramètres', 'Public',
];

export default function NavigationPage() {
  usePageSEO({
    title: 'Navigation - EmotionsCare',
    description: 'Toutes les pages de la plateforme EmotionsCare organisées par catégorie.',
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRoutes = useMemo(() => {
    return allRoutes.filter(route => {
      const matchesSearch = search === '' || 
        route.label.toLowerCase().includes(search.toLowerCase()) ||
        route.description.toLowerCase().includes(search.toLowerCase()) ||
        route.path.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || route.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const routesByCategory = useMemo(() => {
    const grouped: Record<string, RouteItem[]> = {};
    filteredRoutes.forEach(route => {
      if (!grouped[route.category]) grouped[route.category] = [];
      grouped[route.category].push(route);
    });
    return grouped;
  }, [filteredRoutes]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/app/home">
              <Button variant="ghost" size="icon" aria-label="Retour">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Navigation</h1>
              <p className="text-sm text-muted-foreground">
                {filteredRoutes.length} pages · {categories.length} catégories
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une page..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Tout ({allRoutes.length})
              </Button>
              {categories.map(cat => {
                const count = allRoutes.filter(r => r.category === cat).length;
                return (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat} ({count})
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-8">
          {categories.map(category => {
            const routes = routesByCategory[category];
            if (!routes || routes.length === 0) return null;
            return (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {category}
                  <Badge variant="secondary">{routes.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {routes.map(route => {
                    const IconComponent = route.icon;
                    return (
                      <Link key={route.path} to={route.path}>
                        <Card className="h-full hover:bg-muted/50 hover:border-primary/50 transition-all group cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium truncate">{route.label}</h3>
                                  {route.isNew && <Badge className="bg-emerald-500 text-xs">New</Badge>}
                                  {route.isPremium && <Crown className="h-3 w-3 text-amber-500" />}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{route.description}</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </motion.section>
            );
          })}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune page trouvée pour « {search} »</p>
          </div>
        )}
      </main>
    </div>
  );
}
