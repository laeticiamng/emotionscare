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
  AlertTriangle,
  Terminal,
  Cpu,
  Server,
  Webhook,
  TestTube,
  Mail,
  Bug,
  Code,
  Gauge,
  LineChart,
  PieChart,
  Table,
  Wrench,
  Key,
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

/**
 * LISTE EXHAUSTIVE DE TOUTES LES ROUTES DU REGISTRE
 * Synchronisée avec src/routerV2/registry.ts
 */
const allRoutes: RouteItem[] = [
  // ═══════════════════════════════════════════════════════════
  // ACCUEIL & NAVIGATION
  // ═══════════════════════════════════════════════════════════
  { path: '/', label: 'Accueil', description: 'Page d\'accueil principale', category: 'Accueil', icon: Home },
  { path: '/app/home', label: 'Mon Espace', description: 'Tableau de bord personnel', category: 'Accueil', icon: LayoutDashboard, requiresAuth: true },
  { path: '/app', label: 'App Gate', description: 'Point d\'entrée application', category: 'Accueil', icon: Compass, requiresAuth: true },
  { path: '/app/modules', label: 'Tous les Modules', description: 'Explorer les fonctionnalités', category: 'Accueil', icon: Compass, requiresAuth: true },
  { path: '/app/emotional-park', label: 'Parc Émotionnel', description: 'Carte interactive des modules', category: 'Accueil', icon: Map, requiresAuth: true },
  { path: '/app/park-journey', label: 'Park Journey', description: 'Voyage immersif', category: 'Accueil', icon: Rocket, requiresAuth: true },
  { path: '/app/discovery', label: 'Découverte', description: 'Explorer nouvelles fonctionnalités', category: 'Accueil', icon: Compass, requiresAuth: true },
  { path: '/mode-selection', label: 'Mode Selection', description: 'Choisir B2C ou B2B', category: 'Accueil', icon: Users },
  { path: '/app/unified', label: 'Dashboard Unifié', description: 'Vue consolidée', category: 'Accueil', icon: LayoutDashboard, requiresAuth: true },
  { path: '/unified-home', label: 'Unified Home', description: 'Accueil unifié', category: 'Accueil', icon: Home },
  
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
  { path: '/help', label: 'Aide', description: 'Centre d\'aide', category: 'Public', icon: HelpCircle },
  { path: '/faq', label: 'FAQ', description: 'Questions fréquentes', category: 'Public', icon: HelpCircle },
  { path: '/exam-mode', label: 'Mode Examen', description: 'Préparation examens', category: 'Public', icon: BookOpen },
  { path: '/system-health', label: 'Santé Système', description: 'Status plateforme', category: 'Public', icon: Activity },
  { path: '/k6-analytics', label: 'K6 Analytics', description: 'Tests de charge', category: 'Public', icon: Gauge },
  
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
  { path: '/app/voice-analysis', label: 'Voice Analysis', description: 'Analyse vocale avancée', category: 'Analyse', icon: Mic, requiresAuth: true },
  { path: '/app/emotion-atlas', label: 'Atlas Émotions', description: 'Cartographie émotionnelle', category: 'Analyse', icon: Map, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // BIEN-ÊTRE & RELAXATION
  // ═══════════════════════════════════════════════════════════
  { path: '/app/flash-glow', label: 'Flash Glow', description: 'Boost rapide 2 minutes', category: 'Bien-être', icon: Zap, isNew: true },
  { path: '/app/breath', label: 'Respiration', description: 'Exercices guidés', category: 'Bien-être', icon: Wind },
  { path: '/app/meditation', label: 'Méditation', description: 'Sessions guidées', category: 'Bien-être', icon: Heart, requiresAuth: true },
  { path: '/app/screen-silk', label: 'Screen Silk', description: 'Micro-pauses bien-être', category: 'Bien-être', icon: RefreshCw, requiresAuth: true },
  { path: '/app/bubble-beat', label: 'Bubble Beat', description: 'Défouloir ludique', category: 'Bien-être', icon: Waves, isNew: true },
  { path: '/app/seuil', label: 'Seuil', description: 'Gestion seuils émotionnels', category: 'Bien-être', icon: Target, requiresAuth: true },
  { path: '/app/activity', label: 'Activité', description: 'Historique activité', category: 'Bien-être', icon: Activity },
  { path: '/point20', label: 'Point 20', description: 'Récupération 20 minutes', category: 'Bien-être', icon: Clock, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // MUSIQUE & AUDIO
  // ═══════════════════════════════════════════════════════════
  { path: '/app/music', label: 'Musicothérapie', description: 'Vinyls adaptatifs', category: 'Musique', icon: Music, requiresAuth: true },
  { path: '/app/music-premium', label: 'Music Premium', description: 'Génération IA', category: 'Musique', icon: Crown, isPremium: true, requiresAuth: true },
  { path: '/app/mood-mixer', label: 'Mood Mixer', description: 'Mix personnalisé', category: 'Musique', icon: Palette, requiresAuth: true },
  { path: '/app/mood-presets', label: 'Mood Presets', description: 'Préréglages humeur', category: 'Musique', icon: Sparkles, requiresAuth: true },
  { path: '/app/voice-journal', label: 'Journal Vocal', description: 'Dictée vocale', category: 'Musique', icon: Volume2, requiresAuth: true },
  { path: '/app/music/analytics', label: 'Analytics Musique', description: 'Statistiques d\'écoute', category: 'Musique', icon: BarChart3, requiresAuth: true },
  { path: '/app/music/profile', label: 'Profil Musical', description: 'Préférences audio', category: 'Musique', icon: Users, requiresAuth: true },
  { path: '/app/parcours-xl', label: 'Parcours XL', description: 'Immersion longue', category: 'Musique', icon: Film },
  
  // ═══════════════════════════════════════════════════════════
  // JOURNAL & RÉFLEXION
  // ═══════════════════════════════════════════════════════════
  { path: '/app/journal', label: 'Journal', description: 'Journal émotionnel', category: 'Journal', icon: BookOpen, requiresAuth: true },
  { path: '/app/journal-new', label: 'Nouvelle Entrée', description: 'Créer une entrée', category: 'Journal', icon: FileText, requiresAuth: true },
  { path: '/app/emotion-sessions', label: 'Sessions Émotions', description: 'Historique sessions', category: 'Journal', icon: Clock, requiresAuth: true },
  { path: '/app/emotion-sessions/new', label: 'Nouvelle Session', description: 'Démarrer session', category: 'Journal', icon: Zap, requiresAuth: true },
  { path: '/app/insights', label: 'Insights', description: 'Analyses personnelles', category: 'Journal', icon: TrendingUp, requiresAuth: true },
  { path: '/app/journal/activity', label: 'Activité Journal', description: 'Historique activité', category: 'Journal', icon: Activity, requiresAuth: true },
  { path: '/app/journal/analytics', label: 'Analytics Journal', description: 'Statistiques journal', category: 'Journal', icon: BarChart3, requiresAuth: true },
  { path: '/app/journal/archive', label: 'Archives', description: 'Entrées archivées', category: 'Journal', icon: Database, requiresAuth: true },
  { path: '/app/journal/favorites', label: 'Favoris', description: 'Entrées favorites', category: 'Journal', icon: Star, requiresAuth: true },
  { path: '/app/journal/goals', label: 'Objectifs Journal', description: 'Objectifs d\'écriture', category: 'Journal', icon: Target, requiresAuth: true },
  { path: '/app/journal/notes', label: 'Notes', description: 'Notes rapides', category: 'Journal', icon: FileText, requiresAuth: true },
  { path: '/app/journal/search', label: 'Recherche', description: 'Chercher dans le journal', category: 'Journal', icon: Search, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // COACHING & ACCOMPAGNEMENT
  // ═══════════════════════════════════════════════════════════
  { path: '/app/coach', label: 'Coach IA', description: 'Assistant personnel', category: 'Coaching', icon: Brain, requiresAuth: true },
  { path: '/app/coach/programs', label: 'Programmes', description: 'Parcours guidés', category: 'Coaching', icon: Target, requiresAuth: true },
  { path: '/app/coach/sessions', label: 'Sessions Coach', description: 'Historique coaching', category: 'Coaching', icon: MessageCircle, requiresAuth: true },
  { path: '/app/coach/analytics', label: 'Analytics Coach', description: 'Statistiques coaching', category: 'Coaching', icon: BarChart3, requiresAuth: true },
  { path: '/app/coach-micro', label: 'Coach Micro', description: 'Micro-décisions', category: 'Coaching', icon: Zap, requiresAuth: true },
  { path: '/app/nyvee', label: 'Nyvee Cocon', description: 'Compagnon virtuel', category: 'Coaching', icon: Heart, requiresAuth: true },
  { path: '/app/how-it-adapts', label: 'Comment ça marche', description: 'L\'adaptation IA', category: 'Coaching', icon: Brain, requiresAuth: true },
  { path: '/app/support/chatbot', label: 'Support Chatbot', description: 'Assistance IA', category: 'Coaching', icon: MessageCircle, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // IMMERSIF & VR
  // ═══════════════════════════════════════════════════════════
  { path: '/app/vr', label: 'Espace VR', description: 'Réalité virtuelle', category: 'Immersif', icon: Eye, isPremium: true, requiresAuth: true },
  { path: '/app/vr-galaxy', label: 'VR Galaxy', description: 'Exploration spatiale', category: 'Immersif', icon: Globe, requiresAuth: true },
  { path: '/app/vr-breath-guide', label: 'VR Respiration', description: 'Guidage immersif', category: 'Immersif', icon: Wind, requiresAuth: true },
  { path: '/app/face-ar', label: 'AR Filters', description: 'Filtres réalité augmentée', category: 'Immersif', icon: Camera, requiresAuth: true },
  { path: '/app/immersive', label: 'Mode Immersif', description: 'Expérience pleine page', category: 'Immersif', icon: Film, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // CRÉATIF & HISTOIRES
  // ═══════════════════════════════════════════════════════════
  { path: '/app/story-synth', label: 'Story Synth Lab', description: 'Histoires IA', category: 'Créatif', icon: Wand2, requiresAuth: true },
  { path: '/app/themes', label: 'Thèmes', description: 'Personnaliser l\'apparence', category: 'Créatif', icon: Palette, requiresAuth: true },
  { path: '/app/customization', label: 'Customization', description: 'Personnaliser l\'app', category: 'Créatif', icon: Settings, requiresAuth: true },
  { path: '/app/widgets', label: 'Widgets', description: 'Widgets personnalisés', category: 'Créatif', icon: LayoutDashboard, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // GAMIFICATION & DÉFIS
  // ═══════════════════════════════════════════════════════════
  { path: '/app/boss-grit', label: 'Boss Level Grit', description: 'Défis persévérance', category: 'Gamification', icon: Target, requiresAuth: true },
  { path: '/app/ambition-arcade', label: 'Ambition Arcade', description: 'Jeux motivationnels', category: 'Gamification', icon: Gamepad2, requiresAuth: true },
  { path: '/app/bounce-back', label: 'Bounce Back', description: 'Résilience', category: 'Gamification', icon: Shield, requiresAuth: true },
  { path: '/app/daily-challenges', label: 'Défis Quotidiens', description: 'Challenges du jour', category: 'Gamification', icon: Zap, requiresAuth: true },
  { path: '/app/challenges', label: 'Tous les Défis', description: 'Liste complète', category: 'Gamification', icon: Trophy, requiresAuth: true },
  { path: '/app/challenges/create', label: 'Créer Défi', description: 'Nouveau défi', category: 'Gamification', icon: Zap, requiresAuth: true },
  { path: '/app/challenges/history', label: 'Historique Défis', description: 'Défis passés', category: 'Gamification', icon: Clock, requiresAuth: true },
  { path: '/gamification', label: 'Centre Gamification', description: 'XP et niveaux', category: 'Gamification', icon: Star, requiresAuth: true },
  { path: '/app/badges', label: 'Badges', description: 'Vos récompenses', category: 'Gamification', icon: Star, requiresAuth: true },
  { path: '/app/rewards', label: 'Récompenses', description: 'Débloquer bonus', category: 'Gamification', icon: Gift, requiresAuth: true },
  { path: '/app/rewards/premium', label: 'Récompenses Premium', description: 'Bonus exclusifs', category: 'Gamification', icon: Crown, isPremium: true, requiresAuth: true },
  { path: '/app/leaderboard', label: 'Classements', description: 'Top joueurs', category: 'Gamification', icon: Trophy, requiresAuth: true },
  { path: '/app/tournaments', label: 'Tournois', description: 'Compétitions', category: 'Gamification', icon: Trophy, requiresAuth: true },
  { path: '/app/competitive-seasons', label: 'Saisons Compétitives', description: 'Classements saisonniers', category: 'Gamification', icon: Calendar, requiresAuth: true },
  { path: '/app/guilds', label: 'Guildes', description: 'Rejoindre une guilde', category: 'Gamification', icon: Users, requiresAuth: true },
  { path: '/app/park/achievements', label: 'Succès Parc', description: 'Tous les succès', category: 'Gamification', icon: Star, requiresAuth: true },
  { path: '/app/achievements', label: 'Achievements', description: 'Succès débloqués', category: 'Gamification', icon: Trophy, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // ANALYTICS & STATISTIQUES
  // ═══════════════════════════════════════════════════════════
  { path: '/app/analytics', label: 'Analytics', description: 'Statistiques globales', category: 'Analytics', icon: BarChart3, requiresAuth: true },
  { path: '/app/analytics/advanced', label: 'Analytics Avancés', description: 'Analyses détaillées', category: 'Analytics', icon: LineChart, requiresAuth: true },
  { path: '/app/weekly-bars', label: 'Weekly Bars', description: 'Graphiques hebdo', category: 'Analytics', icon: BarChart3, requiresAuth: true },
  { path: '/app/scores', label: 'Scores & Vibes', description: 'Heatmap quotidienne', category: 'Analytics', icon: Activity, requiresAuth: true },
  { path: '/app/trends', label: 'Tendances', description: 'Évolution', category: 'Analytics', icon: TrendingUp, requiresAuth: true },
  { path: '/app/sessions', label: 'Sessions', description: 'Historique complet', category: 'Analytics', icon: Clock, requiresAuth: true },
  { path: '/app/goals', label: 'Objectifs', description: 'Suivi objectifs', category: 'Analytics', icon: Target, requiresAuth: true },
  { path: '/app/goals/new', label: 'Nouvel Objectif', description: 'Créer objectif', category: 'Analytics', icon: Target, requiresAuth: true },
  { path: '/reporting', label: 'Reporting', description: 'Rapports personnalisés', category: 'Analytics', icon: FileText, requiresAuth: true },
  { path: '/app/reports/weekly', label: 'Rapport Hebdo', description: 'Résumé semaine', category: 'Analytics', icon: Calendar, requiresAuth: true },
  { path: '/app/reports/monthly', label: 'Rapport Mensuel', description: 'Résumé mois', category: 'Analytics', icon: Calendar, requiresAuth: true },
  { path: '/app/activity-logs', label: 'Logs Activité', description: 'Historique complet', category: 'Analytics', icon: FileText, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // SOCIAL & COMMUNAUTÉ
  // ═══════════════════════════════════════════════════════════
  { path: '/app/community', label: 'Communauté', description: 'Groupes', category: 'Social', icon: Users, requiresAuth: true },
  { path: '/app/communaute', label: 'Communauté B2C', description: 'Forum communautaire', category: 'Social', icon: Users, requiresAuth: true },
  { path: '/app/social-cocon', label: 'Social Cocon', description: 'Espace bienveillant', category: 'Social', icon: Heart, requiresAuth: true },
  { path: '/app/buddies', label: 'Buddies', description: 'Trouver un binôme', category: 'Social', icon: Users, requiresAuth: true },
  { path: '/app/group-sessions', label: 'Sessions Groupe', description: 'Pratique collective', category: 'Social', icon: Users, requiresAuth: true },
  { path: '/app/exchange', label: 'Exchange Hub', description: 'Partage ressources', category: 'Social', icon: RefreshCw, requiresAuth: true },
  { path: '/messages', label: 'Messages', description: 'Messagerie', category: 'Social', icon: MessageCircle, requiresAuth: true },
  { path: '/app/friends', label: 'Amis', description: 'Liste d\'amis', category: 'Social', icon: Users, requiresAuth: true },
  { path: '/app/groups', label: 'Groupes', description: 'Mes groupes', category: 'Social', icon: Users, requiresAuth: true },
  { path: '/app/feed', label: 'Feed', description: 'Fil d\'actualité', category: 'Social', icon: Activity, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // OUTILS & INTÉGRATIONS
  // ═══════════════════════════════════════════════════════════
  { path: '/app/wearables', label: 'Wearables', description: 'Montres connectées', category: 'Outils', icon: Smartphone, requiresAuth: true },
  { path: '/app/data-export', label: 'Export Données', description: 'RGPD Export', category: 'Outils', icon: Download, requiresAuth: true },
  { path: '/calendar', label: 'Calendrier', description: 'Planning', category: 'Outils', icon: Calendar, requiresAuth: true },
  { path: '/app/notifications', label: 'Notifications', description: 'Centre notifs', category: 'Outils', icon: Bell, requiresAuth: true },
  { path: '/app/timecraft', label: 'TimeCraft', description: 'Gestion du temps', category: 'Outils', icon: Clock, requiresAuth: true },
  { path: '/export', label: 'Export', description: 'Exporter vos données', category: 'Outils', icon: Download, requiresAuth: true },
  { path: '/app/export/pdf', label: 'Export PDF', description: 'Générer PDF', category: 'Outils', icon: FileText, requiresAuth: true },
  { path: '/app/export/csv', label: 'Export CSV', description: 'Générer CSV', category: 'Outils', icon: Table, requiresAuth: true },
  { path: '/app/share', label: 'Partage', description: 'Partager données', category: 'Outils', icon: Share2, requiresAuth: true },
  { path: '/app/integrations', label: 'Intégrations', description: 'Apps tierces', category: 'Outils', icon: RefreshCw, requiresAuth: true },
  { path: '/app/api-keys', label: 'Clés API', description: 'Gérer clés', category: 'Outils', icon: Key, requiresAuth: true },
  { path: '/app/webhooks', label: 'Webhooks', description: 'Automatisations', category: 'Outils', icon: Webhook, requiresAuth: true },
  { path: '/app/api-docs', label: 'API Docs', description: 'Documentation API', category: 'Outils', icon: Code },
  
  // ═══════════════════════════════════════════════════════════
  // ÉVÉNEMENTS & ATELIERS
  // ═══════════════════════════════════════════════════════════
  { path: '/app/events/calendar', label: 'Calendrier Événements', description: 'Tous les événements', category: 'Événements', icon: Calendar, requiresAuth: true },
  { path: '/app/workshops', label: 'Ateliers', description: 'Ateliers bien-être', category: 'Événements', icon: Users, requiresAuth: true },
  { path: '/app/webinars', label: 'Webinaires', description: 'Sessions en ligne', category: 'Événements', icon: Film, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // PARAMÈTRES
  // ═══════════════════════════════════════════════════════════
  { path: '/app/profile', label: 'Mon Profil', description: 'Infos personnelles', category: 'Paramètres', icon: Users, requiresAuth: true },
  { path: '/settings/general', label: 'Paramètres', description: 'Configuration', category: 'Paramètres', icon: Settings, requiresAuth: true },
  { path: '/settings/profile', label: 'Profil', description: 'Modifier le profil', category: 'Paramètres', icon: Users, requiresAuth: true },
  { path: '/settings/privacy', label: 'Confidentialité', description: 'Données privées', category: 'Paramètres', icon: Lock, requiresAuth: true },
  { path: '/settings/data', label: 'Données', description: 'Gestion données', category: 'Paramètres', icon: Database, requiresAuth: true },
  { path: '/settings/notifications', label: 'Notifications', description: 'Préférences notifs', category: 'Paramètres', icon: Bell, requiresAuth: true },
  { path: '/settings/accessibility', label: 'Accessibilité', description: 'Options a11y', category: 'Paramètres', icon: Eye, requiresAuth: true },
  { path: '/settings/language', label: 'Langue', description: 'Changer la langue', category: 'Paramètres', icon: Globe, requiresAuth: true },
  { path: '/settings/security', label: 'Sécurité', description: 'Mot de passe et 2FA', category: 'Paramètres', icon: Shield, requiresAuth: true },
  { path: '/settings/journal', label: 'Journal Settings', description: 'Config journal', category: 'Paramètres', icon: BookOpen, requiresAuth: true },
  { path: '/app/premium', label: 'Premium', description: 'Abonnement', category: 'Paramètres', icon: Crown, isPremium: true, requiresAuth: true },
  { path: '/subscribe', label: 'S\'abonner', description: 'Choisir un plan', category: 'Paramètres', icon: CreditCard, requiresAuth: true },
  { path: '/app/billing', label: 'Facturation', description: 'Paiements', category: 'Paramètres', icon: CreditCard, requiresAuth: true },
  { path: '/app/accessibility-settings', label: 'Accessibilité App', description: 'Options accessibilité', category: 'Paramètres', icon: Eye, requiresAuth: true },
  { path: '/app/shortcuts', label: 'Raccourcis', description: 'Raccourcis clavier', category: 'Paramètres', icon: Zap, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // SUPPORT & AIDE
  // ═══════════════════════════════════════════════════════════
  { path: '/app/support', label: 'Support', description: 'Contacter support', category: 'Support', icon: MessageCircle, requiresAuth: true },
  { path: '/app/tickets', label: 'Mes Tickets', description: 'Suivi demandes', category: 'Support', icon: FileText, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // LEGAL
  // ═══════════════════════════════════════════════════════════
  { path: '/privacy', label: 'Confidentialité', description: 'Politique de confidentialité', category: 'Légal', icon: Lock },
  { path: '/legal/terms', label: 'CGU', description: 'Conditions d\'utilisation', category: 'Légal', icon: FileText },
  { path: '/legal/mentions', label: 'Mentions Légales', description: 'Informations légales', category: 'Légal', icon: FileText },
  { path: '/legal/privacy', label: 'Politique Confidentialité', description: 'Protection données', category: 'Légal', icon: Shield },
  { path: '/legal/cookies', label: 'Cookies', description: 'Politique cookies', category: 'Légal', icon: FileText },
  { path: '/legal/sales', label: 'CGV', description: 'Conditions de vente', category: 'Légal', icon: FileText },
  { path: '/legal/licenses', label: 'Licences', description: 'Licences logicielles', category: 'Légal', icon: FileText },
  
  // ═══════════════════════════════════════════════════════════
  // B2B ENTREPRISE
  // ═══════════════════════════════════════════════════════════
  { path: '/b2b/institutional', label: 'B2B Institutionnel', description: 'Offre institutions', category: 'B2B', icon: Building2 },
  { path: '/b2b/access', label: 'Accès Entreprise', description: 'Connexion B2B', category: 'B2B', icon: Lock },
  { path: '/b2b/wellness', label: 'Wellness Hub', description: 'Hub bien-être entreprise', category: 'B2B', icon: Heart },
  { path: '/app/collab', label: 'Dashboard Collaborateur', description: 'Espace employé', category: 'B2B', icon: Users, requiresAuth: true },
  { path: '/app/collab/coach', label: 'Coach Collaborateur', description: 'Coach B2B', category: 'B2B', icon: Brain, requiresAuth: true },
  { path: '/app/rh', label: 'Dashboard RH', description: 'Espace manager', category: 'B2B', icon: BarChart3, requiresAuth: true },
  { path: '/app/teams', label: 'Équipes', description: 'Gestion équipes', category: 'B2B', icon: Users, requiresAuth: true },
  { path: '/app/social', label: 'Social Cocon B2B', description: 'Espace social entreprise', category: 'B2B', icon: Heart, requiresAuth: true },
  { path: '/b2b/admin/dashboard', label: 'Admin Dashboard', description: 'Dashboard admin B2B', category: 'B2B', icon: BarChart3, requiresAuth: true },
  { path: '/b2b/admin/settings', label: 'Paramètres B2B', description: 'Configuration entreprise', category: 'B2B', icon: Settings, requiresAuth: true },
  { path: '/b2b/admin/timecraft', label: 'TimeCraft B2B', description: 'Gestion temps équipe', category: 'B2B', icon: Clock, requiresAuth: true },
  { path: '/b2b/reports', label: 'Rapports B2B', description: 'Reporting entreprise', category: 'B2B', icon: BarChart3, requiresAuth: true },
  { path: '/b2b/institutional/reports', label: 'Rapports Institutionnels', description: 'Rapports B2B avancés', category: 'B2B', icon: FileText, requiresAuth: true },
  { path: '/b2b/selection', label: 'Sélection B2B', description: 'Choix modules B2B', category: 'B2B', icon: Settings, requiresAuth: true },
  { path: '/b2b/teams', label: 'Teams B2B', description: 'Équipes entreprise', category: 'B2B', icon: Users, requiresAuth: true },
  { path: '/b2b/events', label: 'Événements B2B', description: 'Événements entreprise', category: 'B2B', icon: Calendar, requiresAuth: true },
  { path: '/b2b/alerts', label: 'Alertes B2B', description: 'Alertes bien-être', category: 'B2B', icon: Bell, requiresAuth: true },
  { path: '/b2b/social-cocon', label: 'Social Cocon B2B', description: 'Collaboration B2B', category: 'B2B', icon: Heart, requiresAuth: true },
  { path: '/app/b2b/analytics', label: 'Analytics B2B', description: 'Stats entreprise', category: 'B2B', icon: BarChart3, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // B2B ADMIN (MANAGER)
  // ═══════════════════════════════════════════════════════════
  { path: '/app/reports', label: 'Rapports', description: 'Rapports manager', category: 'Admin B2B', icon: FileText, requiresAuth: true },
  { path: '/app/events', label: 'Événements', description: 'Gestion événements', category: 'Admin B2B', icon: Calendar, requiresAuth: true },
  { path: '/app/optimization', label: 'Optimisation', description: 'Performance équipes', category: 'Admin B2B', icon: TrendingUp, requiresAuth: true },
  { path: '/app/security', label: 'Sécurité', description: 'Sécurité données', category: 'Admin B2B', icon: Shield, requiresAuth: true },
  { path: '/app/audit', label: 'Audit', description: 'Logs et audits', category: 'Admin B2B', icon: FileText, requiresAuth: true },
  { path: '/app/accessibility', label: 'Accessibilité', description: 'Conformité a11y', category: 'Admin B2B', icon: Eye, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // ADMINISTRATION SYSTÈME
  // ═══════════════════════════════════════════════════════════
  { path: '/admin/gdpr', label: 'GDPR Dashboard', description: 'Conformité RGPD', category: 'Admin Système', icon: Shield, requiresAuth: true },
  { path: '/admin/api-monitoring', label: 'API Monitoring', description: 'Surveillance APIs', category: 'Admin Système', icon: Gauge, requiresAuth: true },
  { path: '/admin/cron-monitoring', label: 'Cron Monitoring', description: 'Jobs planifiés', category: 'Admin Système', icon: Clock, requiresAuth: true },
  { path: '/admin/cron-setup', label: 'Cron Setup', description: 'Config jobs', category: 'Admin Système', icon: Settings, requiresAuth: true },
  { path: '/admin/music-queue', label: 'Music Queue', description: 'File d\'attente musique', category: 'Admin Système', icon: Music, requiresAuth: true },
  { path: '/admin/music-metrics', label: 'Music Metrics', description: 'Métriques musique', category: 'Admin Système', icon: BarChart3, requiresAuth: true },
  { path: '/admin/user-roles', label: 'Rôles Utilisateurs', description: 'Gestion des rôles', category: 'Admin Système', icon: Users, requiresAuth: true },
  { path: '/admin/system-health', label: 'System Health', description: 'Santé système', category: 'Admin Système', icon: Activity, requiresAuth: true },
  { path: '/admin/system-health/dashboard', label: 'Health Dashboard', description: 'Dashboard santé', category: 'Admin Système', icon: Gauge, requiresAuth: true },
  { path: '/admin/monitoring', label: 'Monitoring', description: 'Surveillance générale', category: 'Admin Système', icon: Activity, requiresAuth: true },
  { path: '/admin/ai-monitoring', label: 'AI Monitoring', description: 'Surveillance IA', category: 'Admin Système', icon: Brain, requiresAuth: true },
  { path: '/admin/executive', label: 'Executive Dashboard', description: 'Vue exécutive', category: 'Admin Système', icon: BarChart3, requiresAuth: true },
  { path: '/admin/unified', label: 'Admin Unifié', description: 'Dashboard admin complet', category: 'Admin Système', icon: LayoutDashboard, requiresAuth: true },
  { path: '/admin/incidents', label: 'Incidents', description: 'Gestion incidents', category: 'Admin Système', icon: AlertTriangle, requiresAuth: true },
  { path: '/admin/recommendation-engine', label: 'Recommendation Engine', description: 'Moteur de recommandations', category: 'Admin Système', icon: Sparkles, requiresAuth: true },
  { path: '/admin/team-skills', label: 'Team Skills', description: 'Compétences équipe', category: 'Admin Système', icon: Users, requiresAuth: true },
  { path: '/admin/ml-assignment-rules', label: 'ML Assignment', description: 'Règles assignation ML', category: 'Admin Système', icon: Cpu, requiresAuth: true },
  { path: '/gdpr/cron-monitoring', label: 'GDPR Cron', description: 'Jobs RGPD', category: 'Admin Système', icon: Clock, requiresAuth: true },
  { path: '/gdpr/blockchain-backups', label: 'Blockchain Backups', description: 'Sauvegardes blockchain', category: 'Admin Système', icon: Database, requiresAuth: true },
  { path: '/app/admin/music-analytics', label: 'Music Analytics Admin', description: 'Analytics musique admin', category: 'Admin Système', icon: Music, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // ALERTES & MONITORING
  // ═══════════════════════════════════════════════════════════
  { path: '/admin/alert-config', label: 'Alert Config', description: 'Configuration alertes', category: 'Alertes', icon: Bell, requiresAuth: true },
  { path: '/admin/alert-analytics', label: 'Alert Analytics', description: 'Analytics alertes', category: 'Alertes', icon: BarChart3, requiresAuth: true },
  { path: '/admin/alert-templates', label: 'Alert Templates', description: 'Templates alertes', category: 'Alertes', icon: FileText, requiresAuth: true },
  { path: '/admin/alert-playground', label: 'Alert Playground', description: 'Test alertes', category: 'Alertes', icon: TestTube, requiresAuth: true },
  { path: '/admin/alert-tester', label: 'Alert Tester', description: 'Testeur alertes', category: 'Alertes', icon: Bug, requiresAuth: true },
  { path: '/admin/alert-escalation', label: 'Escalation Config', description: 'Config escalade', category: 'Alertes', icon: TrendingUp, requiresAuth: true },
  { path: '/admin/escalation/monitoring', label: 'Escalation Monitoring', description: 'Surveillance escalade', category: 'Alertes', icon: Activity, requiresAuth: true },
  { path: '/admin/escalation/ab-tests', label: 'A/B Tests Escalation', description: 'Tests A/B escalade', category: 'Alertes', icon: TestTube, requiresAuth: true },
  { path: '/admin/escalation/webhooks', label: 'Webhooks Escalation', description: 'Webhooks notifs', category: 'Alertes', icon: Webhook, requiresAuth: true },
  { path: '/admin/scheduled-reports', label: 'Scheduled Reports', description: 'Rapports planifiés', category: 'Alertes', icon: Calendar, requiresAuth: true },
  { path: '/admin/ai-template-suggestions', label: 'AI Templates', description: 'Suggestions IA', category: 'Alertes', icon: Sparkles, requiresAuth: true },
  { path: '/admin/alerts/ai-suggestions', label: 'AI Suggestions Alertes', description: 'IA pour alertes', category: 'Alertes', icon: Brain, requiresAuth: true },
  { path: '/admin/tickets/integrations', label: 'Ticket Integrations', description: 'Intégrations tickets', category: 'Alertes', icon: RefreshCw, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // GAMIFICATION ADMIN
  // ═══════════════════════════════════════════════════════════
  { path: '/admin/challenges', label: 'Admin Challenges', description: 'Gestion défis', category: 'Admin Gamification', icon: Trophy, requiresAuth: true },
  { path: '/admin/challenges/create', label: 'Créer Challenge', description: 'Nouveau challenge', category: 'Admin Gamification', icon: Zap, requiresAuth: true },
  { path: '/admin/module-sync', label: 'Sync Modules', description: 'Synchronisation front/back', category: 'Admin Système', icon: RefreshCw, requiresAuth: true },
  
  // ═══════════════════════════════════════════════════════════
  // PAGES SYSTÈME
  // ═══════════════════════════════════════════════════════════
  { path: '/401', label: '401 Unauthorized', description: 'Non autorisé', category: 'Système', icon: Lock },
  { path: '/403', label: '403 Forbidden', description: 'Accès interdit', category: 'Système', icon: Shield },
  { path: '/404', label: '404 Not Found', description: 'Page introuvable', category: 'Système', icon: HelpCircle },
  { path: '/500', label: '500 Server Error', description: 'Erreur serveur', category: 'Système', icon: AlertTriangle },
  { path: '/test-nyvee', label: 'Test Nyvee', description: 'Test compagnon', category: 'Système', icon: Bug },
  { path: '/test', label: 'Test Page', description: 'Page de test', category: 'Système', icon: Bug },
];

const categories = [
  'Accueil', 'Public', 'Auth', 'Analyse', 'Bien-être', 'Musique', 'Journal', 
  'Coaching', 'Immersif', 'Créatif', 'Gamification', 'Analytics', 
  'Social', 'Outils', 'Événements', 'Paramètres', 'Support', 'Légal', 
  'B2B', 'Admin B2B', 'Admin Système', 'Alertes', 'Admin Gamification', 'Système'
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
              <h1 className="text-2xl font-bold">Navigation Complète</h1>
              <p className="text-sm text-muted-foreground">
                {filteredRoutes.length} pages accessibles sur {allRoutes.length} total
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
