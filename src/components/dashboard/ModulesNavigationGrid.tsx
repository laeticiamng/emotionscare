/**
 * ModulesNavigationGrid - Grille de navigation vers TOUS les modules
 * Catégorisé et complet pour garantir l'accessibilité
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      { path: '/app/scan/emoji', label: 'Scan Emoji', icon: '😊', description: 'Sélection par emoji' },
      { path: '/app/hume-ai', label: 'Hume AI', icon: '🤖', description: 'IA émotionnelle avancée', isNew: true },
      { path: '/app/voice-analysis', label: 'Voice Analysis', icon: '🔊', description: 'Analyse vocale détaillée' },
      { path: '/app/context-lens', label: 'Context Lens', icon: '🔬', description: 'Analyse contextuelle IA', isNew: true },
      { path: '/app/brain-viewer', label: 'Brain Viewer', icon: '🧠', description: 'Visualisation cérébrale', isPremium: true },
      { path: '/app/emotion-atlas', label: 'Atlas Émotions', icon: '🗺️', description: 'Cartographie émotionnelle' },
    ],
  },
  {
    id: 'assess',
    label: 'Évaluations',
    emoji: '📋',
    modules: [
      { path: '/app/assess', label: 'Centre Évaluations', icon: '📊', description: 'Tests psychométriques', isNew: true },
      { path: '/app/assess?instrument=WHO5', label: 'WHO-5', icon: '😊', description: 'Bien-être OMS' },
      { path: '/app/assess?instrument=PHQ9', label: 'PHQ-9', icon: '💭', description: 'Dépression' },
      { path: '/app/assess?instrument=GAD7', label: 'GAD-7', icon: '😰', description: 'Anxiété généralisée' },
      { path: '/app/assess?instrument=PSS10', label: 'PSS-10', icon: '😤', description: 'Stress perçu' },
      { path: '/app/assess?instrument=STAI6', label: 'STAI-6', icon: '😟', description: 'Anxiété état/trait' },
      { path: '/app/assess?instrument=ISI', label: 'ISI', icon: '😴', description: 'Insomnie' },
      { path: '/app/assess?instrument=BRS', label: 'BRS', icon: '💪', description: 'Résilience' },
    ],
  },
  {
    id: 'wellbeing',
    label: 'Bien-être',
    emoji: '🌿',
    modules: [
      { path: '/app/flash-glow', label: 'Flash Glow', icon: '✨', description: 'Boost instantané', isNew: true },
      { path: '/app/breath', label: 'Respiration', icon: '🌬️', description: 'Exercices de souffle' },
      { path: '/app/meditation', label: 'Méditation', icon: '🧘', description: 'Séances guidées' },
      { path: '/app/bubble-beat', label: 'Bubble Beat', icon: '🫧', description: 'Bulles apaisantes', isNew: true },
      { path: '/app/screen-silk', label: 'Screen Silk', icon: '🖥️', description: 'Pauses écran' },
      { path: '/app/seuil', label: 'Seuil', icon: '🚪', description: 'Exercices de seuil' },
      { path: '/point20', label: 'Point 20', icon: '⏰', description: 'Récupération 20min' },
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
      { path: '/app/parcours-xl', label: 'Parcours XL', icon: '🎬', description: 'Immersion longue' },
      { path: '/app/voice-journal', label: 'Voice Journal', icon: '🎤', description: 'Journal vocal' },
    ],
  },
  {
    id: 'journal',
    label: 'Journal',
    emoji: '📔',
    modules: [
      { path: '/app/journal', label: 'Journal', icon: '📖', description: 'Écriture émotionnelle' },
      { path: '/app/journal-new', label: 'Nouvelle Entrée', icon: '✏️', description: 'Créer une entrée' },
      { path: '/app/emotion-sessions', label: 'Sessions', icon: '📊', description: 'Historique sessions' },
      { path: '/app/journal/analytics', label: 'Analytics', icon: '📈', description: 'Analyse journal' },
      { path: '/app/journal/favorites', label: 'Favoris', icon: '⭐', description: 'Entrées favorites' },
      { path: '/app/journal/archive', label: 'Archives', icon: '📁', description: 'Entrées archivées' },
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
      { path: '/app/coach/sessions', label: 'Historique', icon: '📜', description: 'Sessions passées' },
      { path: '/app/support/chatbot', label: 'Support IA', icon: '💬', description: 'Assistance chatbot' },
    ],
  },
  {
    id: 'immersive',
    label: 'Immersif',
    emoji: '🌌',
    modules: [
      { path: '/app/vr', label: 'Espace VR', icon: '🕶️', description: 'Hub réalité virtuelle', isPremium: true },
      { path: '/app/vr-galaxy', label: 'VR Galaxy', icon: '🌠', description: 'Voyage spatial' },
      { path: '/app/vr-breath-guide', label: 'VR Breath', icon: '🫁', description: 'Respiration VR' },
      { path: '/app/face-ar', label: 'AR Filters', icon: '🎭', description: 'Filtres émotionnels' },
      { path: '/app/emotional-park', label: 'Parc Émotionnel', icon: '🏞️', description: 'Voyage immersif' },
      { path: '/app/immersive', label: 'Hub Immersif', icon: '🎬', description: 'Toutes les expériences' },
    ],
  },
  {
    id: 'gamification',
    label: 'Progression',
    emoji: '🎯',
    modules: [
      { path: '/app/ambition-arcade', label: 'Arcade Ambition', icon: '🕹️', description: 'Quêtes de bien-être' },
      { path: '/app/boss-grit', label: 'Défis Résilience', icon: '💪', description: 'Renforcer sa résilience' },
      { path: '/app/bounce-back', label: 'Rebond Émotionnel', icon: '🔄', description: 'Récupération post-stress' },
      { path: '/app/tournaments', label: 'Défis Collaboratifs', icon: '🤝', description: 'Objectifs d\'équipe' },
      { path: '/app/guilds', label: 'Cercles de Soutien', icon: '🛡️', description: 'Groupes d\'entraide' },
      { path: '/app/daily-challenges', label: 'Défis du jour', icon: '🎯', description: 'Objectifs quotidiens' },
      { path: '/app/challenges', label: 'Tous les défis', icon: '🏅', description: 'Liste complète' },
      { path: '/app/leaderboard', label: 'Classement', icon: '📊', description: 'Progression collective' },
      { path: '/app/competitive-seasons', label: 'Saisons', icon: '🌸', description: 'Cycles de progression' },
      { path: '/gamification', label: 'Centre Progression', icon: '⭐', description: 'Niveaux et XP' },
    ],
  },
  {
    id: 'social',
    label: 'Entraide',
    emoji: '🤝',
    modules: [
      { path: '/app/community', label: 'Communauté', icon: '🌍', description: 'Forum entre pairs' },
      { path: '/app/buddies', label: 'Parrainage', icon: '👥', description: 'Système d\'entraide' },
      { path: '/app/group-sessions', label: 'Sessions Groupe', icon: '👨‍👩‍👧‍👦', description: 'Pratique collective' },
      { path: '/app/exchange', label: 'Espace Partage', icon: '💬', description: 'Échanges entre soignants' },
      { path: '/app/friends', label: 'Collègues', icon: '👫', description: 'Contacts de confiance' },
      { path: '/app/groups', label: 'Mes Groupes', icon: '👪', description: 'Cercles thématiques' },
      { path: '/app/story-synth', label: 'Récits Partagés', icon: '📖', description: 'Histoires inspirantes' },
      { path: '/messages', label: 'Messages', icon: '💬', description: 'Messagerie privée' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    emoji: '📊',
    modules: [
      { path: '/app/analytics', label: 'Dashboard', icon: '📈', description: 'Vue globale' },
      { path: '/app/analytics/advanced', label: 'Avancé', icon: '📉', description: 'Analyses détaillées' },
      { path: '/app/weekly-bars', label: 'Weekly Bars', icon: '📊', description: 'Progression semaine' },
      { path: '/app/insights', label: 'Insights', icon: '💡', description: 'Analyses IA' },
      { path: '/app/trends', label: 'Tendances', icon: '📈', description: 'Évolutions' },
      { path: '/app/scores', label: 'Scores', icon: '🎯', description: 'Heatmap émotionnelle' },
      { path: '/app/auras', label: 'Auras', icon: '✨', description: 'Classement aura', isNew: true },
      { path: '/app/reports/weekly', label: 'Rapport Hebdo', icon: '📅', description: 'Résumé semaine' },
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
      { path: '/app/sessions', label: 'Sessions', icon: '📜', description: 'Historique complet' },
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
      { path: '/app/notifications', label: 'Notifications', icon: '🔔', description: 'Centre alertes' },
      { path: '/app/api-docs', label: 'API Docs', icon: '📚', description: 'Documentation API' },
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
      { path: '/settings/accessibility', label: 'Accessibilité', icon: '♿', description: 'Options a11y' },
      { path: '/settings/security', label: 'Sécurité', icon: '🛡️', description: 'Mot de passe et 2FA' },
      { path: '/app/themes', label: 'Thèmes', icon: '🎨', description: 'Apparence' },
      { path: '/app/consent', label: 'Consentements', icon: '📋', description: 'Gérer consentements', isNew: true },
      { path: '/app/delete-account', label: 'Supprimer compte', icon: '🗑️', description: 'RGPD' },
      { path: '/app/activity-logs', label: 'Logs Activité', icon: '📜', description: 'Historique actions' },
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
