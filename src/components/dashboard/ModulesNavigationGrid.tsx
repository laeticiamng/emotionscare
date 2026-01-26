/**
 * ModulesNavigationGrid - Grille de navigation vers TOUS les modules
 * Catégorisé et complet pour garantir l'accessibilité
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Search, ChevronRight } from 'lucide-react';

interface ModuleItem {
  path: string;
  label: string;
  icon: string;
  description?: string;
  isNew?: boolean;
  isPremium?: boolean;
}

interface ModuleCategory {
  id: string;
  label: string;
  emoji: string;
  modules: ModuleItem[];
}

const MODULE_CATEGORIES: ModuleCategory[] = [
  {
    id: 'analysis',
    label: 'Analyse',
    emoji: '🧠',
    modules: [
      { path: '/app/scan', label: 'Scanner Émotions', icon: '🎭', description: 'Analyse faciale IA' },
      { path: '/app/scan/voice', label: 'Scan Vocal', icon: '🎙️', description: 'Analyse de la voix' },
      { path: '/app/scan/text', label: 'Scan Texte', icon: '📝', description: 'Analyse textuelle' },
      { path: '/app/hume-ai', label: 'Hume AI', icon: '🤖', description: 'IA émotionnelle avancée', isNew: true },
      { path: '/app/voice-analysis', label: 'Voice Analysis', icon: '🔊', description: 'Analyse vocale détaillée' },
    ],
  },
  {
    id: 'wellbeing',
    label: 'Bien-être',
    emoji: '🌿',
    modules: [
      { path: '/app/flash-glow', label: 'Flash Glow', icon: '✨', description: 'Boost instantané' },
      { path: '/app/breath', label: 'Respiration', icon: '🌬️', description: 'Exercices de souffle' },
      { path: '/app/meditation', label: 'Méditation', icon: '🧘', description: 'Séances guidées' },
      { path: '/app/bubble-beat', label: 'Bubble Beat', icon: '🫧', description: 'Bulles apaisantes' },
      { path: '/app/screen-silk', label: 'Screen Silk', icon: '🖥️', description: 'Pauses écran' },
      { path: '/app/seuil', label: 'Seuil', icon: '🚪', description: 'Exercices de seuil' },
    ],
  },
  {
    id: 'music',
    label: 'Musique',
    emoji: '🎵',
    modules: [
      { path: '/app/music', label: 'Musicothérapie', icon: '🎼', description: 'Musique adaptative' },
      { path: '/app/music-premium', label: 'Music Premium', icon: '💎', description: 'Génération IA', isPremium: true },
      { path: '/app/mood-mixer', label: 'Mood Mixer', icon: '🎚️', description: 'Mixage émotionnel' },
      { path: '/app/suno', label: 'Suno AI', icon: '🎹', description: 'Génération musicale IA', isNew: true },
    ],
  },
  {
    id: 'journal',
    label: 'Journal',
    emoji: '📔',
    modules: [
      { path: '/app/journal', label: 'Journal', icon: '📖', description: 'Écriture émotionnelle' },
      { path: '/app/voice-journal', label: 'Voice Journal', icon: '🎤', description: 'Journal vocal' },
      { path: '/app/emotion-sessions', label: 'Sessions', icon: '📊', description: 'Historique sessions' },
      { path: '/app/journal/analytics', label: 'Analytics', icon: '📈', description: 'Analyse journal' },
    ],
  },
  {
    id: 'coaching',
    label: 'Coaching',
    emoji: '🎯',
    modules: [
      { path: '/app/coach', label: 'Coach IA', icon: '🤖', description: 'Accompagnement IA' },
      { path: '/app/coach-micro', label: 'Micro-Décisions', icon: '⚡', description: 'Aide rapide' },
      { path: '/app/nyvee', label: 'Nyvée Cocon', icon: '🦋', description: 'Compagnon bienveillant' },
      { path: '/app/coach/programs', label: 'Programmes', icon: '📋', description: 'Plans structurés' },
    ],
  },
  {
    id: 'immersive',
    label: 'Immersif',
    emoji: '🌌',
    modules: [
      { path: '/app/vr-galaxy', label: 'VR Galaxy', icon: '🌠', description: 'Voyage spatial' },
      { path: '/app/vr-breath-guide', label: 'VR Breath', icon: '🫁', description: 'Respiration VR' },
      { path: '/app/face-ar', label: 'AR Filters', icon: '🎭', description: 'Filtres émotionnels' },
      { path: '/app/emotional-park', label: 'Parc Émotionnel', icon: '🏞️', description: 'Voyage immersif' },
      { path: '/app/immersive', label: 'Hub Immersif', icon: '🕶️', description: 'Toutes les expériences' },
    ],
  },
  {
    id: 'gamification',
    label: 'Gamification',
    emoji: '🎮',
    modules: [
      { path: '/app/ambition-arcade', label: 'Ambition Arcade', icon: '🕹️', description: 'Quêtes ludiques' },
      { path: '/app/boss-grit', label: 'Boss Grit', icon: '💪', description: 'Défis de résilience' },
      { path: '/app/bounce-back', label: 'Bounce Back', icon: '🏀', description: 'Batailles émotionnelles' },
      { path: '/app/tournaments', label: 'Tournois', icon: '🏆', description: 'Compétitions' },
      { path: '/app/guilds', label: 'Guildes', icon: '⚔️', description: 'Équipes et clans' },
      { path: '/app/daily-challenges', label: 'Défis du jour', icon: '🎯', description: 'Challenges quotidiens' },
      { path: '/app/challenges', label: 'Tous les défis', icon: '🏅', description: 'Liste complète' },
      { path: '/app/leaderboard', label: 'Classement', icon: '📊', description: 'Top joueurs' },
      { path: '/app/competitive-seasons', label: 'Saisons', icon: '🌸', description: 'Compétitions saisonnières' },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    emoji: '👥',
    modules: [
      { path: '/app/community', label: 'Communauté', icon: '🌍', description: 'Forum et groupes' },
      { path: '/app/buddies', label: 'Buddies', icon: '🤝', description: 'Système de parrainage' },
      { path: '/app/group-sessions', label: 'Sessions Groupe', icon: '👨‍👩‍👧‍👦', description: 'Méditation collective' },
      { path: '/app/exchange', label: 'Exchange Hub', icon: '💱', description: 'Marchés émotions' },
      { path: '/app/friends', label: 'Amis', icon: '👫', description: 'Gestion contacts' },
      { path: '/app/groups', label: 'Groupes', icon: '👪', description: 'Mes groupes' },
      { path: '/app/story-synth', label: 'Story Synth', icon: '📖', description: 'Histoires générées' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    emoji: '📊',
    modules: [
      { path: '/app/analytics', label: 'Dashboard', icon: '📈', description: 'Vue globale' },
      { path: '/app/weekly-bars', label: 'Weekly Bars', icon: '📊', description: 'Progression semaine' },
      { path: '/app/insights', label: 'Insights', icon: '💡', description: 'Analyses IA' },
      { path: '/app/trends', label: 'Tendances', icon: '📉', description: 'Évolutions' },
      { path: '/app/scores', label: 'Scores', icon: '🎯', description: 'Heatmap émotionnelle' },
      { path: '/app/auras', label: 'Auras', icon: '✨', description: 'Classement aura', isNew: true },
    ],
  },
  {
    id: 'progress',
    label: 'Progression',
    emoji: '🏆',
    modules: [
      { path: '/app/goals', label: 'Objectifs', icon: '🎯', description: 'Mes buts' },
      { path: '/app/achievements', label: 'Succès', icon: '🏅', description: 'Récompenses' },
      { path: '/app/badges', label: 'Badges', icon: '🎖️', description: 'Collection' },
      { path: '/app/rewards', label: 'Récompenses', icon: '🎁', description: 'Boutique' },
      { path: '/app/rewards/premium', label: 'Premium', icon: '💎', description: 'Récompenses VIP', isPremium: true },
    ],
  },
  {
    id: 'tools',
    label: 'Outils',
    emoji: '🛠️',
    modules: [
      { path: '/app/wearables', label: 'Wearables', icon: '⌚', description: 'Sync montres' },
      { path: '/app/data-export', label: 'Export', icon: '📤', description: 'Télécharger données' },
      { path: '/app/integrations', label: 'Intégrations', icon: '🔗', description: 'Apps tierces' },
      { path: '/app/timecraft', label: 'TimeCraft', icon: '⏰', description: 'Gestion du temps' },
      { path: '/calendar', label: 'Calendrier', icon: '📅', description: 'Agenda bien-être' },
    ],
  },
  {
    id: 'events',
    label: 'Événements',
    emoji: '📅',
    modules: [
      { path: '/app/workshops', label: 'Ateliers', icon: '🎓', description: 'Formations' },
      { path: '/app/webinars', label: 'Webinaires', icon: '📺', description: 'Conférences' },
      { path: '/app/events/calendar', label: 'Agenda', icon: '🗓️', description: 'Tous les événements' },
    ],
  },
  {
    id: 'settings',
    label: 'Paramètres',
    emoji: '⚙️',
    modules: [
      { path: '/settings/general', label: 'Général', icon: '⚙️', description: 'Préférences' },
      { path: '/settings/profile', label: 'Profil', icon: '👤', description: 'Mon compte' },
      { path: '/settings/privacy', label: 'Confidentialité', icon: '🔒', description: 'Vie privée' },
      { path: '/settings/notifications', label: 'Notifications', icon: '🔔', description: 'Alertes' },
      { path: '/app/themes', label: 'Thèmes', icon: '🎨', description: 'Apparence' },
      { path: '/app/accessibility-settings', label: 'Accessibilité', icon: '♿', description: 'Options a11y' },
    ],
  },
];

export const ModulesNavigationGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const allModules = MODULE_CATEGORIES.flatMap((cat) =>
    cat.modules.map((mod) => ({ ...mod, category: cat.id, categoryLabel: cat.label }))
  );

  const filteredModules =
    searchQuery.trim() === ''
      ? activeCategory === 'all'
        ? allModules
        : allModules.filter((m) => m.category === activeCategory)
      : allModules.filter(
          (m) =>
            m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tous les modules ({allModules.length})</span>
          <Link to="/navigation" className="text-sm font-normal text-primary hover:underline">
            Vue complète →
          </Link>
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un module..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Tabs */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            <Badge
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setActiveCategory('all')}
            >
              Tous
            </Badge>
            {MODULE_CATEGORIES.map((cat) => (
              <Badge
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.emoji} {cat.label}
              </Badge>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Modules Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredModules.slice(0, 20).map((module) => (
            <Link
              key={module.path}
              to={module.path}
              className="group flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center relative"
            >
              {module.isNew && (
                <Badge className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0" variant="default">
                  NEW
                </Badge>
              )}
              {module.isPremium && (
                <Badge className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0 bg-gradient-to-r from-amber-500 to-yellow-500">
                  PRO
                </Badge>
              )}
              <span className="text-2xl" aria-hidden="true">
                {module.icon}
              </span>
              <span className="text-xs font-medium line-clamp-1">{module.label}</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1/2 -translate-y-1/2" />
            </Link>
          ))}
        </div>

        {filteredModules.length > 20 && (
          <p className="text-center text-xs text-muted-foreground">
            +{filteredModules.length - 20} autres modules.{' '}
            <Link to="/navigation" className="text-primary hover:underline">
              Voir tous
            </Link>
          </p>
        )}

        {filteredModules.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            Aucun module trouvé pour "{searchQuery}"
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ModulesNavigationGrid;
