import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Home, 
  Brain, 
  Music, 
  BookOpen, 
  Wind, 
  Eye, 
  Palette, 
  Wand2,
  Zap,
  Target,
  Heart,
  Users,
  Settings,
  BarChart3,
  Shield,
  HelpCircle,
  Gamepad2,
  Star,
  Calendar,
  MessageCircle,
  Trophy,
  Compass,
  Film,
  Activity,
  Crown,
  Clock,
  Rocket,
  Globe,
  TrendingUp,
  Gift,
  Lock,
  Smartphone,
  RefreshCw,
  LayoutDashboard,
  Camera,
  Mic,
  FileText,
  Waves,
  ArrowLeft,
  ExternalLink,
  Building2,
  Store,
  CreditCard,
  Map,
  Sparkles,
  Volume2,
  Bell,
  Database,
  Download,
  Share2,
  type LucideIcon
} from 'lucide-react';

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
  // ═══════════════════════════════════════════════════════════
  // ACCUEIL & NAVIGATION
  // ═══════════════════════════════════════════════════════════
  { path: '/', label: 'Accueil', description: 'Page d\'accueil principale', category: 'Accueil', icon: Home },
  { path: '/app/home', label: 'Mon Espace', description: 'Tableau de bord personnel', category: 'Accueil', icon: LayoutDashboard, requiresAuth: true },
  { path: '/app/modules', label: 'Tous les Modules', description: 'Explorer les fonctionnalités', category: 'Accueil', icon: Compass, requiresAuth: true },
  { path: '/app/emotional-park', label: 'Parc Émotionnel', description: 'Carte interactive des modules', category: 'Accueil', icon: Map, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // PUBLIC & MARKETING
  // ═══════════════════════════════════════════════════════════
  { path: '/about', label: 'À propos', description: 'Notre mission', category: 'Public', icon: Heart },
  { path: '/pricing', label: 'Tarifs', description: 'Plans et abonnements', category: 'Public', icon: Crown },
  { path: '/contact', label: 'Contact', description: 'Nous contacter', category: 'Public', icon: MessageCircle },
  { path: '/demo', label: 'Démo', description: 'Essayer gratuitement', category: 'Public', icon: Rocket },
  { path: '/entreprise', label: 'Entreprise', description: 'Solutions B2B', category: 'Public', icon: Building2 },
  { path: '/b2c', label: 'Particuliers', description: 'Solution individuelle', category: 'Public', icon: Users },
  { path: '/store', label: 'Boutique', description: 'Produits et services', category: 'Public', icon: Store },
  { path: '/onboarding', label: 'Onboarding', description: 'Découvrir la plateforme', category: 'Public', icon: Rocket },
  
  // ═══════════════════════════════════════════════════════════
  // AUTHENTIFICATION
  // ═══════════════════════════════════════════════════════════
  { path: '/login', label: 'Connexion', description: 'Se connecter', category: 'Auth', icon: Lock },
  { path: '/signup', label: 'Inscription', description: 'Créer un compte', category: 'Auth', icon: Users },
  
  // ═══════════════════════════════════════════════════════════
  // ANALYSE ÉMOTIONNELLE
  // ═══════════════════════════════════════════════════════════
  { path: '/app/scan', label: 'Scanner Émotionnel', description: 'Analyse IA temps réel', category: 'Analyse', icon: Brain, requiresAuth: true },
  { path: '/app/scan/facial', label: 'Scan Facial', description: 'Détection par visage', category: 'Analyse', icon: Camera, requiresAuth: true },
  { path: '/app/scan/voice', label: 'Scan Vocal', description: 'Analyse de la voix', category: 'Analyse', icon: Mic, requiresAuth: true },
  { path: '/app/scan/text', label: 'Scan Texte', description: 'Analyse textuelle', category: 'Analyse', icon: FileText, requiresAuth: true },
  { path: '/app/scan/emoji', label: 'Scan Emoji', description: 'Sélection par emoji', category: 'Analyse', icon: Sparkles, requiresAuth: true },
  { path: '/app/hume-realtime', label: 'Hume AI Realtime', description: 'Détection temps réel avancée', category: 'Analyse', icon: Activity, isNew: true, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // BIEN-ÊTRE & RELAXATION
  // ═══════════════════════════════════════════════════════════
  { path: '/app/flash-glow', label: 'Flash Glow', description: 'Boost rapide 2 minutes', category: 'Bien-être', icon: Zap, isNew: true },
  { path: '/app/breath', label: 'Respiration', description: 'Exercices guidés', category: 'Bien-être', icon: Wind },
  { path: '/app/meditation', label: 'Méditation', description: 'Sessions guidées', category: 'Bien-être', icon: Heart, requiresAuth: true },
  { path: '/app/screen-silk', label: 'Screen Silk', description: 'Micro-pauses bien-être', category: 'Bien-être', icon: RefreshCw, requiresAuth: true },
  { path: '/app/bubble-beat', label: 'Bubble Beat', description: 'Défouloir ludique', category: 'Bien-être', icon: Waves, isNew: true },
  { path: '/app/seuil', label: 'Seuil', description: 'Gestion des seuils émotionnels', category: 'Bien-être', icon: Target, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // MUSIQUE & AUDIO
  // ═══════════════════════════════════════════════════════════
  { path: '/app/music', label: 'Musicothérapie', description: 'Vinyls adaptatifs', category: 'Musique', icon: Music, requiresAuth: true },
  { path: '/app/music-premium', label: 'Music Premium', description: 'Génération IA', category: 'Musique', icon: Crown, isPremium: true, requiresAuth: true },
  { path: '/app/mood-mixer', label: 'Mood Mixer', description: 'Mix personnalisé', category: 'Musique', icon: Palette, requiresAuth: true },
  { path: '/app/voice-journal', label: 'Journal Vocal', description: 'Dictée vocale', category: 'Musique', icon: Volume2, requiresAuth: true },
  { path: '/app/music/analytics', label: 'Analytics Musique', description: 'Statistiques d\'écoute', category: 'Musique', icon: BarChart3, requiresAuth: true },
  { path: '/app/music/profile', label: 'Profil Musical', description: 'Préférences audio', category: 'Musique', icon: Users, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // JOURNAL & RÉFLEXION
  // ═══════════════════════════════════════════════════════════
  { path: '/app/journal', label: 'Journal', description: 'Journal émotionnel', category: 'Journal', icon: BookOpen, requiresAuth: true },
  { path: '/app/journal-new', label: 'Nouvelle Entrée', description: 'Créer une entrée', category: 'Journal', icon: FileText, requiresAuth: true },
  { path: '/app/emotion-sessions', label: 'Historique Sessions', description: 'Toutes vos sessions', category: 'Journal', icon: Clock, requiresAuth: true },
  { path: '/app/insights', label: 'Insights', description: 'Analyses personnelles', category: 'Journal', icon: TrendingUp, requiresAuth: true },
  { path: '/app/journal/activity', label: 'Activité Journal', description: 'Historique activité', category: 'Journal', icon: Activity, requiresAuth: true },
  { path: '/app/journal/analytics', label: 'Analytics Journal', description: 'Statistiques journal', category: 'Journal', icon: BarChart3, requiresAuth: true },
  { path: '/app/journal/favorites', label: 'Favoris', description: 'Entrées favorites', category: 'Journal', icon: Star, requiresAuth: true },
  { path: '/app/journal/goals', label: 'Objectifs Journal', description: 'Objectifs d\'écriture', category: 'Journal', icon: Target, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // COACHING & ACCOMPAGNEMENT
  // ═══════════════════════════════════════════════════════════
  { path: '/app/coach', label: 'Coach IA', description: 'Assistant personnel', category: 'Coaching', icon: Brain, requiresAuth: true },
  { path: '/app/coach/programs', label: 'Programmes', description: 'Parcours guidés', category: 'Coaching', icon: Target, requiresAuth: true },
  { path: '/app/coach/sessions', label: 'Sessions Coach', description: 'Historique coaching', category: 'Coaching', icon: MessageCircle, requiresAuth: true },
  { path: '/app/coach/analytics', label: 'Analytics Coach', description: 'Statistiques coaching', category: 'Coaching', icon: BarChart3, requiresAuth: true },
  { path: '/app/coach-micro', label: 'Coach Micro', description: 'Micro-décisions', category: 'Coaching', icon: Zap, requiresAuth: true },
  { path: '/app/nyvee', label: 'Nyvee Cocon', description: 'Compagnon virtuel', category: 'Coaching', icon: Heart, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // IMMERSIF & VR
  // ═══════════════════════════════════════════════════════════
  { path: '/app/vr', label: 'Espace VR', description: 'Réalité virtuelle', category: 'Immersif', icon: Eye, isPremium: true, requiresAuth: true },
  { path: '/app/vr-galaxy', label: 'VR Galaxy', description: 'Exploration spatiale', category: 'Immersif', icon: Globe, requiresAuth: true },
  { path: '/app/vr-breath-guide', label: 'VR Respiration', description: 'Guidage immersif', category: 'Immersif', icon: Wind, requiresAuth: true },
  { path: '/app/face-ar', label: 'AR Filters', description: 'Filtres réalité augmentée', category: 'Immersif', icon: Camera, requiresAuth: true },
  { path: '/app/park-journey', label: 'Park Journey', description: 'Voyage dans le parc', category: 'Immersif', icon: Map, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // CRÉATIF & HISTOIRES
  // ═══════════════════════════════════════════════════════════
  { path: '/app/story-synth', label: 'Story Synth Lab', description: 'Histoires IA', category: 'Créatif', icon: Wand2, requiresAuth: true },
  { path: '/app/emotion-atlas', label: 'Atlas Émotions', description: 'Cartographie émotionnelle', category: 'Créatif', icon: Compass, requiresAuth: true },
  { path: '/app/discovery', label: 'Découverte', description: 'Exploration', category: 'Créatif', icon: Rocket, requiresAuth: true },
  { path: '/app/parcours-xl', label: 'Parcours XL', description: 'Immersion longue', category: 'Créatif', icon: Film },
  
  // ═══════════════════════════════════════════════════════════
  // GAMIFICATION & DÉFIS
  // ═══════════════════════════════════════════════════════════
  { path: '/app/boss-grit', label: 'Boss Level Grit', description: 'Défis persévérance', category: 'Gamification', icon: Target, requiresAuth: true },
  { path: '/app/ambition-arcade', label: 'Ambition Arcade', description: 'Jeux motivationnels', category: 'Gamification', icon: Gamepad2, requiresAuth: true },
  { path: '/app/bounce-back', label: 'Bounce Back', description: 'Résilience', category: 'Gamification', icon: Shield, requiresAuth: true },
  { path: '/app/daily-challenges', label: 'Défis Quotidiens', description: 'Challenges du jour', category: 'Gamification', icon: Zap, requiresAuth: true },
  { path: '/app/challenges', label: 'Tous les Défis', description: 'Liste complète', category: 'Gamification', icon: Trophy, requiresAuth: true },
  { path: '/gamification', label: 'Centre Gamification', description: 'XP et niveaux', category: 'Gamification', icon: Star, requiresAuth: true },
  { path: '/app/badges', label: 'Badges', description: 'Vos récompenses', category: 'Gamification', icon: Star, requiresAuth: true },
  { path: '/app/rewards', label: 'Récompenses', description: 'Débloquer bonus', category: 'Gamification', icon: Gift, requiresAuth: true },
  { path: '/app/leaderboard', label: 'Classements', description: 'Top joueurs', category: 'Gamification', icon: Trophy, requiresAuth: true },
  { path: '/app/tournaments', label: 'Tournois', description: 'Compétitions', category: 'Gamification', icon: Trophy, requiresAuth: true },
  { path: '/app/guilds', label: 'Guildes', description: 'Rejoindre une guilde', category: 'Gamification', icon: Users, requiresAuth: true },
  { path: '/app/park/achievements', label: 'Succès', description: 'Tous les succès', category: 'Gamification', icon: Star, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // ANALYTICS & STATISTIQUES
  // ═══════════════════════════════════════════════════════════
  { path: '/app/analytics', label: 'Analytics', description: 'Statistiques globales', category: 'Analytics', icon: BarChart3, requiresAuth: true },
  { path: '/app/weekly-bars', label: 'Weekly Bars', description: 'Graphiques hebdo', category: 'Analytics', icon: BarChart3, requiresAuth: true },
  { path: '/app/scores', label: 'Scores & Vibes', description: 'Heatmap quotidienne', category: 'Analytics', icon: Activity, requiresAuth: true },
  { path: '/app/activity', label: 'Activité', description: 'Historique activité', category: 'Analytics', icon: Activity },
  { path: '/app/trends', label: 'Tendances', description: 'Évolution', category: 'Analytics', icon: TrendingUp, requiresAuth: true },
  { path: '/app/sessions', label: 'Sessions', description: 'Historique complet', category: 'Analytics', icon: Clock, requiresAuth: true },
  { path: '/app/goals', label: 'Objectifs', description: 'Suivi objectifs', category: 'Analytics', icon: Target, requiresAuth: true },
  { path: '/app/analytics/advanced', label: 'Analytics Avancés', description: 'Analyses détaillées', category: 'Analytics', icon: BarChart3, requiresAuth: true },
  { path: '/reporting', label: 'Reporting', description: 'Rapports personnalisés', category: 'Analytics', icon: FileText, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // SOCIAL & COMMUNAUTÉ
  // ═══════════════════════════════════════════════════════════
  { path: '/app/community', label: 'Communauté', description: 'Groupes', category: 'Social', icon: Users, requiresAuth: true },
  { path: '/app/social-cocon', label: 'Social Cocon', description: 'Espace bienveillant', category: 'Social', icon: Heart, requiresAuth: true },
  { path: '/app/buddies', label: 'Buddies', description: 'Trouver un binôme', category: 'Social', icon: Users, requiresAuth: true },
  { path: '/app/group-sessions', label: 'Sessions Groupe', description: 'Pratique collective', category: 'Social', icon: Users, requiresAuth: true },
  { path: '/app/exchange', label: 'Exchange Hub', description: 'Partage ressources', category: 'Social', icon: RefreshCw, requiresAuth: true },
  { path: '/messages', label: 'Messages', description: 'Messagerie', category: 'Social', icon: MessageCircle, requiresAuth: true },
  { path: '/app/communaute', label: 'Communauté B2C', description: 'Forum communautaire', category: 'Social', icon: Users, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // OUTILS & INTÉGRATIONS
  // ═══════════════════════════════════════════════════════════
  { path: '/app/wearables', label: 'Wearables', description: 'Montres connectées', category: 'Outils', icon: Smartphone, requiresAuth: true },
  { path: '/app/data-export', label: 'Export Données', description: 'RGPD Export', category: 'Outils', icon: Download, requiresAuth: true },
  { path: '/calendar', label: 'Calendrier', description: 'Planning', category: 'Outils', icon: Calendar, requiresAuth: true },
  { path: '/app/notifications', label: 'Notifications', description: 'Centre notifs', category: 'Outils', icon: Bell, requiresAuth: true },
  { path: '/app/timecraft', label: 'TimeCraft', description: 'Gestion du temps', category: 'Outils', icon: Clock, requiresAuth: true },
  { path: '/export', label: 'Export', description: 'Exporter vos données', category: 'Outils', icon: Download, requiresAuth: true },
  { path: '/point20', label: 'Point 20', description: 'Récupération 20 minutes', category: 'Outils', icon: Clock, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // PARAMÈTRES
  // ═══════════════════════════════════════════════════════════
  { path: '/app/profile', label: 'Mon Profil', description: 'Infos personnelles', category: 'Paramètres', icon: Users, requiresAuth: true },
  { path: '/settings/general', label: 'Paramètres', description: 'Configuration', category: 'Paramètres', icon: Settings, requiresAuth: true },
  { path: '/settings/profile', label: 'Profil', description: 'Modifier le profil', category: 'Paramètres', icon: Users, requiresAuth: true },
  { path: '/settings/privacy', label: 'Confidentialité', description: 'Données privées', category: 'Paramètres', icon: Lock, requiresAuth: true },
  { path: '/settings/notifications', label: 'Notifications', description: 'Préférences notifs', category: 'Paramètres', icon: Bell, requiresAuth: true },
  { path: '/settings/accessibility', label: 'Accessibilité', description: 'Options a11y', category: 'Paramètres', icon: Eye, requiresAuth: true },
  { path: '/settings/language', label: 'Langue', description: 'Changer la langue', category: 'Paramètres', icon: Globe, requiresAuth: true },
  { path: '/settings/security', label: 'Sécurité', description: 'Mot de passe et 2FA', category: 'Paramètres', icon: Shield, requiresAuth: true },
  { path: '/app/premium', label: 'Premium', description: 'Abonnement', category: 'Paramètres', icon: Crown, isPremium: true, requiresAuth: true },
  { path: '/app/billing', label: 'Facturation', description: 'Paiements', category: 'Paramètres', icon: CreditCard, requiresAuth: true },
  { path: '/app/how-it-adapts', label: 'Comment ça marche', description: 'L\'adaptation IA', category: 'Paramètres', icon: Brain, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // SUPPORT & AIDE
  // ═══════════════════════════════════════════════════════════
  { path: '/help', label: 'Centre d\'Aide', description: 'Documentation', category: 'Support', icon: HelpCircle },
  { path: '/faq', label: 'FAQ', description: 'Questions fréquentes', category: 'Support', icon: HelpCircle },
  { path: '/app/support', label: 'Support', description: 'Contacter support', category: 'Support', icon: MessageCircle, requiresAuth: true },
  { path: '/app/tickets', label: 'Mes Tickets', description: 'Suivi demandes', category: 'Support', icon: FileText, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // LEGAL
  // ═══════════════════════════════════════════════════════════
  { path: '/privacy', label: 'Confidentialité', description: 'Politique de confidentialité', category: 'Légal', icon: Lock },
  { path: '/legal/terms', label: 'CGU', description: 'Conditions d\'utilisation', category: 'Légal', icon: FileText },
  { path: '/legal/mentions', label: 'Mentions Légales', description: 'Informations légales', category: 'Légal', icon: FileText },
  { path: '/legal/cookies', label: 'Cookies', description: 'Politique cookies', category: 'Légal', icon: FileText },
  { path: '/legal/sales', label: 'CGV', description: 'Conditions de vente', category: 'Légal', icon: FileText },
  
  // ═══════════════════════════════════════════════════════════
  // B2B ENTREPRISE
  // ═══════════════════════════════════════════════════════════
  { path: '/b2b/institutional', label: 'B2B Institutionnel', description: 'Offre institutions', category: 'B2B', icon: Building2 },
  { path: '/b2b/access', label: 'Accès Entreprise', description: 'Connexion B2B', category: 'B2B', icon: Lock },
  { path: '/b2b/wellness', label: 'Wellness Hub', description: 'Hub bien-être entreprise', category: 'B2B', icon: Heart },
  { path: '/app/collab', label: 'Dashboard Collaborateur', description: 'Espace employé', category: 'B2B', icon: Users, requiresAuth: true },
  { path: '/app/rh', label: 'Dashboard RH', description: 'Espace manager', category: 'B2B', icon: BarChart3, requiresAuth: true },
  { path: '/app/teams', label: 'Équipes', description: 'Gestion équipes', category: 'B2B', icon: Users, requiresAuth: true },
  { path: '/b2b/admin/dashboard', label: 'Admin Dashboard', description: 'Dashboard admin B2B', category: 'B2B', icon: BarChart3, requiresAuth: true },
  { path: '/b2b/admin/settings', label: 'Paramètres B2B', description: 'Configuration entreprise', category: 'B2B', icon: Settings, requiresAuth: true },
  { path: '/b2b/reports', label: 'Rapports B2B', description: 'Reporting entreprise', category: 'B2B', icon: BarChart3, requiresAuth: true },
];

const categories = [
  'Accueil', 'Public', 'Auth', 'Analyse', 'Bien-être', 'Musique', 'Journal', 
  'Coaching', 'Immersif', 'Créatif', 'Gamification', 'Analytics', 
  'Social', 'Outils', 'Paramètres', 'Support', 'Légal', 'B2B'
];

export default function NavigationPage() {
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
      if (!grouped[route.category]) {
        grouped[route.category] = [];
      }
      grouped[route.category].push(route);
    });
    return grouped;
  }, [filteredRoutes]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Navigation</h1>
              <p className="text-sm text-muted-foreground">
                {filteredRoutes.length} pages accessibles
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Search & Filters */}
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
            <div className="flex gap-2 pb-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Tout ({allRoutes.length})
              </Button>
              {categories.map(cat => {
                const count = allRoutes.filter(r => r.category === cat).length;
                if (count === 0) return null;
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

        {/* Routes Grid */}
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
                                  {route.isNew && (
                                    <Badge className="bg-green-500 text-xs">New</Badge>
                                  )}
                                  {route.isPremium && (
                                    <Crown className="h-3 w-3 text-amber-500" />
                                  )}
                                  {route.requiresAuth && (
                                    <Lock className="h-3 w-3 text-muted-foreground" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {route.description}
                                </p>
                                <p className="text-xs text-muted-foreground/60 mt-1 font-mono truncate">
                                  {route.path}
                                </p>
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
            <p className="text-muted-foreground">Aucune page trouvée pour "{search}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
