// @ts-nocheck
import { NavNode } from '@/types/nav';

/**
 * Navigation Schema - Configuration déclarative complète
 * Chaque nœud doit avoir soit une action, soit des enfants
 */
export const NAV_SCHEMA: NavNode[] = [
  {
    id: "home",
    labelKey: "nav.home",
    icon: "Home",
    action: { type: "route", to: "/", prefetch: true },
  },
  {
    id: "scan",
    labelKey: "nav.scan",
    icon: "Brain",
    action: { type: "route", to: "/scan", prefetch: true },
    meta: {
      description: "Analyse émotionnelle IA",
      premium: true,
    },
  },
  {
    id: "music",
    labelKey: "nav.music",
    icon: "Music",
    action: { type: "route", to: "/music" },
    meta: {
      description: "Thérapie musicale adaptative",
      premium: true,
    },
  },
  {
    id: "coach",
    labelKey: "nav.coach",
    icon: "Users",
    action: { type: "route", to: "/coach" },
    meta: {
      description: "Coach IA personnalisé 24/7",
      premium: true,
    },
  },
  {
    id: "journal",
    labelKey: "nav.journal",
    icon: "MessageSquare",
    action: { type: "route", to: "/journal" },
    guard: { requiresAuth: true },
  },
  {
    id: "learn",
    labelKey: "nav.learn",
    icon: "BookOpen",
    children: [
      {
        id: "ecos",
        labelKey: "nav.learn.ecos",
        icon: "Stethoscope",
        action: { type: "route", to: "/ecos", prefetch: true },
        meta: {
          description: "Examens Cliniques Objectifs Structurés",
        },
      },
      {
        id: "edn",
        labelKey: "nav.learn.edn",
        icon: "GraduationCap",
        action: { type: "route", to: "/edn" },
        meta: {
          description: "Épreuves Dématérialisées Nationales",
        },
      },
    ],
  },
  {
    id: "analytics",
    labelKey: "nav.analytics",
    icon: "TrendingUp",
    children: [
      {
        id: "weekly-bars",
        labelKey: "nav.analytics.weekly",
        icon: "BarChart3",
        action: { type: "route", to: "/weekly-bars" },
      },
      {
        id: "heatmap",
        labelKey: "nav.analytics.heatmap",
        icon: "Activity",
        action: { type: "route", to: "/heatmap-vibes" },
      },
    ],
  },
  {
    id: "wellness",
    labelKey: "nav.wellness",
    icon: "Heart",
    children: [
      {
        id: "breathwork",
        labelKey: "nav.wellness.breathwork",
        icon: "Wind",
        action: { type: "route", to: "/breathwork" },
      },
      {
        id: "vr",
        labelKey: "nav.wellness.vr",
        icon: "Glasses",
        action: { type: "route", to: "/vr" },
        meta: {
          description: "Expériences VR immersives",
          premium: true,
        },
      },
      {
        id: "mood-mixer",
        labelKey: "nav.wellness.mood-mixer",
        icon: "Palette",
        action: { type: "route", to: "/mood-mixer" },
      },
    ],
  },
  {
    id: "games",
    labelKey: "nav.games",
    icon: "Gamepad2",
    children: [
      {
        id: "gamification",
        labelKey: "nav.games.gamification",
        icon: "Trophy",
        action: { type: "route", to: "/gamification" },
        meta: {
          description: "Objectifs gamifiés",
          premium: true,
        },
      },
      {
        id: "ambition-arcade",
        labelKey: "nav.games.ambition",
        icon: "Target",
        action: { type: "route", to: "/ambition-arcade" },
      },
    ],
  },
  {
    id: "account",
    labelKey: "nav.account",
    icon: "User",
    guard: { requiresAuth: true },
    children: [
      {
        id: "profile",
        labelKey: "nav.account.profile",
        icon: "Settings",
        action: { type: "route", to: "/profile-settings" },
      },
      {
        id: "preferences",
        labelKey: "nav.account.preferences",
        icon: "Sliders",
        action: { type: "route", to: "/preferences" },
      },
      {
        id: "activity",
        labelKey: "nav.account.activity",
        icon: "Clock",
        action: { type: "route", to: "/activity-history" },
      },
      {
        id: "notifications",
        labelKey: "nav.account.notifications",
        icon: "Bell",
        action: { type: "route", to: "/notifications" },
      },
    ],
  },
  {
    id: "auth",
    labelKey: "nav.auth",
    icon: "LogIn",
    guard: { requiresAuth: false },
    children: [
      {
        id: "login",
        labelKey: "nav.auth.login",
        action: { type: "modal", id: "auth-modal", payload: { mode: "login" } },
      },
      {
        id: "register",
        labelKey: "nav.auth.register",
        action: { type: "modal", id: "auth-modal", payload: { mode: "register" } },
      },
      {
        id: "choose-mode",
        labelKey: "nav.auth.choose-mode",
        action: { type: "route", to: "/choose-mode" },
      },
    ],
  },
  {
    id: "help",
    labelKey: "nav.help",
    icon: "HelpCircle",
    children: [
      {
        id: "help-center",
        labelKey: "nav.help.center",
        action: { type: "route", to: "/help-center" },
      },
      {
        id: "feedback",
        labelKey: "nav.help.feedback",
        action: { type: "modal", id: "feedback-modal" },
      },
      {
        id: "contact",
        labelKey: "nav.help.contact",
        action: { type: "external", href: "mailto:contact@emotionscare.com" },
      },
    ],
  },
];

/**
 * Utilitaires pour naviguer dans le schéma
 */
export function findNavNode(id: string, nodes: NavNode[] = NAV_SCHEMA): NavNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNavNode(id, node.children);
      if (found) return found;
    }
  }
  return null;
}

export function getNavPath(targetId: string, nodes: NavNode[] = NAV_SCHEMA, path: string[] = []): string[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node.id];
    if (node.id === targetId) return currentPath;
    if (node.children) {
      const found = getNavPath(targetId, node.children, currentPath);
      if (found) return found;
    }
  }
  return null;
}

export function getAllRoutes(nodes: NavNode[] = NAV_SCHEMA): string[] {
  const routes: string[] = [];
  
  function collect(nodes: NavNode[]) {
    for (const node of nodes) {
      if (node.action?.type === 'route') {
        routes.push(node.action.to);
      }
      if (node.children) {
        collect(node.children);
      }
    }
  }
  
  collect(nodes);
  return routes;
}