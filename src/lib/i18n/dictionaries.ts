// @ts-nocheck
/**
 * Dictionaries - Système de dictionnaires i18n complet
 * Gestion des traductions avec pluralisation, interpolation et formatage
 */

/** Langues supportées */
export type Lang = 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt';

/** Espace de noms */
export type Namespace =
  | 'common'
  | 'auth'
  | 'dashboard'
  | 'settings'
  | 'coach'
  | 'music'
  | 'vr'
  | 'breathing'
  | 'journal'
  | 'social'
  | 'notifications'
  | 'errors';

/** Options de traduction */
export interface TranslationOptions {
  count?: number;
  context?: string;
  defaultValue?: string;
  interpolation?: Record<string, string | number>;
  lng?: Lang;
  ns?: Namespace;
}

/** Règles de pluralisation */
export interface PluralRules {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

/** Entrée de traduction */
export type TranslationEntry = string | PluralRules | Record<string, TranslationEntry>;

/** Dictionnaire complet */
export type Dictionary = Record<Namespace, Record<string, TranslationEntry>>;

/** Stats de traduction */
export interface TranslationStats {
  totalKeys: number;
  translatedKeys: number;
  missingKeys: string[];
  coverage: number;
}

/** Dictionnaires */
export const dict: Record<Lang, Partial<Dictionary>> = {
  fr: {
    common: {
      start: "Commencer",
      loading: "Chargement…",
      error: "Une erreur est survenue",
      home: "Accueil",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      close: "Fermer",
      confirm: "Confirmer",
      search: "Rechercher",
      filter: "Filtrer",
      sort: "Trier",
      reset: "Réinitialiser",
      refresh: "Actualiser",
      download: "Télécharger",
      upload: "Importer",
      share: "Partager",
      copy: "Copier",
      paste: "Coller",
      select: "Sélectionner",
      selectAll: "Tout sélectionner",
      clear: "Effacer",
      yes: "Oui",
      no: "Non",
      ok: "OK",
      submit: "Soumettre",
      send: "Envoyer",
      retry: "Réessayer",
      continue: "Continuer",
      skip: "Passer",
      finish: "Terminer",
      done: "Terminé",
      or: "ou",
      and: "et",
      more: "Plus",
      less: "Moins",
      showMore: "Voir plus",
      showLess: "Voir moins",
      seeAll: "Voir tout",
      today: "Aujourd'hui",
      yesterday: "Hier",
      tomorrow: "Demain",
      now: "Maintenant",
      never: "Jamais",
      always: "Toujours",
      items: {
        zero: "aucun élément",
        one: "{{count}} élément",
        other: "{{count}} éléments"
      },
      minutes: {
        one: "{{count}} minute",
        other: "{{count}} minutes"
      },
      hours: {
        one: "{{count}} heure",
        other: "{{count}} heures"
      },
      days: {
        one: "{{count}} jour",
        other: "{{count}} jours"
      }
    },
    auth: {
      login: "Connexion",
      logout: "Déconnexion",
      signup: "Inscription",
      email: "Email",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      resetPassword: "Réinitialiser le mot de passe",
      rememberMe: "Se souvenir de moi",
      welcomeBack: "Bon retour !",
      createAccount: "Créer un compte",
      alreadyHaveAccount: "Vous avez déjà un compte ?",
      dontHaveAccount: "Vous n'avez pas de compte ?",
      loginWithGoogle: "Se connecter avec Google",
      loginWithApple: "Se connecter avec Apple",
      verifyEmail: "Vérifiez votre email",
      invalidCredentials: "Email ou mot de passe incorrect",
      accountLocked: "Compte temporairement bloqué",
      sessionExpired: "Session expirée, veuillez vous reconnecter"
    },
    dashboard: {
      title: "Tableau de bord",
      welcome: "Bienvenue, {{name}} !",
      overview: "Vue d'ensemble",
      stats: "Statistiques",
      recentActivity: "Activité récente",
      quickActions: "Actions rapides",
      streak: "Série en cours",
      progress: "Progression",
      goals: "Objectifs",
      achievements: "Accomplissements",
      todaysMood: "Humeur du jour",
      weeklyReport: "Rapport hebdomadaire",
      monthlyProgress: "Progression mensuelle"
    },
    settings: {
      title: "Paramètres",
      profile: "Profil",
      account: "Compte",
      notifications: "Notifications",
      privacy: "Confidentialité",
      appearance: "Apparence",
      language: "Langue",
      theme: "Thème",
      darkMode: "Mode sombre",
      lightMode: "Mode clair",
      systemDefault: "Système",
      sound: "Son",
      vibration: "Vibration",
      accessibility: "Accessibilité",
      dataExport: "Exporter mes données",
      deleteAccount: "Supprimer mon compte",
      changePassword: "Changer le mot de passe",
      twoFactor: "Authentification à deux facteurs"
    },
    coach: {
      title: "Coach",
      hello: "Bonjour ! Comment puis-je vous aider ?",
      suggestions: "Suggestions",
      newSession: "Nouvelle session",
      history: "Historique",
      tips: "Conseils",
      dailyChallenge: "Défi du jour",
      breathingExercise: "Exercice de respiration",
      guidedMeditation: "Méditation guidée",
      moodCheck: "Comment vous sentez-vous ?"
    },
    music: {
      title: "Musique",
      nowPlaying: "En cours de lecture",
      playlist: "Playlist",
      playlists: "Playlists",
      favorites: "Favoris",
      recent: "Récents",
      recommended: "Recommandés",
      genres: "Genres",
      artists: "Artistes",
      albums: "Albums",
      tracks: "Titres",
      shuffle: "Aléatoire",
      repeat: "Répéter",
      queue: "File d'attente",
      addToPlaylist: "Ajouter à une playlist",
      createPlaylist: "Créer une playlist",
      relaxation: "Relaxation",
      focus: "Concentration",
      sleep: "Sommeil",
      energy: "Énergie"
    },
    vr: {
      title: "Réalité Virtuelle",
      startSession: "Démarrer une session",
      environments: "Environnements",
      beach: "Plage",
      forest: "Forêt",
      mountain: "Montagne",
      space: "Espace",
      underwater: "Sous-marin",
      duration: "Durée",
      intensity: "Intensité",
      calibrate: "Calibrer",
      exitVR: "Quitter VR",
      noHeadset: "Casque VR non détecté",
      connecting: "Connexion au casque..."
    },
    breathing: {
      title: "Respiration",
      inhale: "Inspirez",
      exhale: "Expirez",
      hold: "Retenez",
      relax: "Détendez-vous",
      cycles: {
        one: "{{count}} cycle",
        other: "{{count}} cycles"
      },
      technique478: "Technique 4-7-8",
      boxBreathing: "Respiration carrée",
      coherentBreathing: "Cohérence cardiaque",
      calmingBreath: "Respiration apaisante"
    },
    journal: {
      title: "Journal",
      newEntry: "Nouvelle entrée",
      entries: "Entrées",
      mood: "Humeur",
      tags: "Tags",
      attachments: "Pièces jointes",
      private: "Privé",
      howAreYou: "Comment allez-vous aujourd'hui ?",
      writeThoughts: "Écrivez vos pensées...",
      gratitude: "Gratitude",
      reflection: "Réflexion",
      goals: "Objectifs"
    },
    social: {
      title: "Social",
      friends: "Amis",
      groups: "Groupes",
      community: "Communauté",
      messages: "Messages",
      notifications: "Notifications",
      invite: "Inviter",
      share: "Partager",
      like: "J'aime",
      comment: "Commenter",
      follow: "Suivre",
      unfollow: "Ne plus suivre",
      block: "Bloquer",
      report: "Signaler"
    },
    notifications: {
      title: "Notifications",
      all: "Toutes",
      unread: "Non lues",
      markAllRead: "Tout marquer comme lu",
      noNotifications: "Aucune notification",
      settings: "Paramètres de notifications",
      reminder: "Rappel",
      achievement: "Accomplissement",
      message: "Message",
      update: "Mise à jour"
    },
    errors: {
      generic: "Une erreur est survenue",
      network: "Erreur de connexion",
      notFound: "Page non trouvée",
      unauthorized: "Accès non autorisé",
      forbidden: "Accès refusé",
      serverError: "Erreur serveur",
      timeout: "La requête a expiré",
      validation: "Erreur de validation",
      required: "Ce champ est requis",
      invalidEmail: "Email invalide",
      passwordTooShort: "Mot de passe trop court",
      passwordMismatch: "Les mots de passe ne correspondent pas",
      tryAgain: "Veuillez réessayer"
    }
  },
  en: {
    common: {
      start: "Start",
      loading: "Loading…",
      error: "An error occurred",
      home: "Home",
      back: "Back",
      next: "Next",
      previous: "Previous",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      confirm: "Confirm",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      reset: "Reset",
      refresh: "Refresh",
      download: "Download",
      upload: "Upload",
      share: "Share",
      copy: "Copy",
      paste: "Paste",
      select: "Select",
      selectAll: "Select all",
      clear: "Clear",
      yes: "Yes",
      no: "No",
      ok: "OK",
      submit: "Submit",
      send: "Send",
      retry: "Retry",
      continue: "Continue",
      skip: "Skip",
      finish: "Finish",
      done: "Done",
      or: "or",
      and: "and",
      more: "More",
      less: "Less",
      showMore: "Show more",
      showLess: "Show less",
      seeAll: "See all",
      today: "Today",
      yesterday: "Yesterday",
      tomorrow: "Tomorrow",
      now: "Now",
      never: "Never",
      always: "Always",
      items: {
        zero: "no items",
        one: "{{count}} item",
        other: "{{count}} items"
      },
      minutes: {
        one: "{{count}} minute",
        other: "{{count}} minutes"
      },
      hours: {
        one: "{{count}} hour",
        other: "{{count}} hours"
      },
      days: {
        one: "{{count}} day",
        other: "{{count}} days"
      }
    },
    auth: {
      login: "Login",
      logout: "Logout",
      signup: "Sign up",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      forgotPassword: "Forgot password?",
      resetPassword: "Reset password",
      rememberMe: "Remember me",
      welcomeBack: "Welcome back!",
      createAccount: "Create account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      loginWithGoogle: "Login with Google",
      loginWithApple: "Login with Apple",
      verifyEmail: "Verify your email",
      invalidCredentials: "Invalid email or password",
      accountLocked: "Account temporarily locked",
      sessionExpired: "Session expired, please log in again"
    },
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome, {{name}}!",
      overview: "Overview",
      stats: "Statistics",
      recentActivity: "Recent activity",
      quickActions: "Quick actions",
      streak: "Current streak",
      progress: "Progress",
      goals: "Goals",
      achievements: "Achievements",
      todaysMood: "Today's mood",
      weeklyReport: "Weekly report",
      monthlyProgress: "Monthly progress"
    },
    settings: {
      title: "Settings",
      profile: "Profile",
      account: "Account",
      notifications: "Notifications",
      privacy: "Privacy",
      appearance: "Appearance",
      language: "Language",
      theme: "Theme",
      darkMode: "Dark mode",
      lightMode: "Light mode",
      systemDefault: "System",
      sound: "Sound",
      vibration: "Vibration",
      accessibility: "Accessibility",
      dataExport: "Export my data",
      deleteAccount: "Delete my account",
      changePassword: "Change password",
      twoFactor: "Two-factor authentication"
    },
    coach: {
      title: "Coach",
      hello: "Hello! How can I help you?",
      suggestions: "Suggestions",
      newSession: "New session",
      history: "History",
      tips: "Tips",
      dailyChallenge: "Daily challenge",
      breathingExercise: "Breathing exercise",
      guidedMeditation: "Guided meditation",
      moodCheck: "How are you feeling?"
    },
    music: {
      title: "Music",
      nowPlaying: "Now playing",
      playlist: "Playlist",
      playlists: "Playlists",
      favorites: "Favorites",
      recent: "Recent",
      recommended: "Recommended",
      genres: "Genres",
      artists: "Artists",
      albums: "Albums",
      tracks: "Tracks",
      shuffle: "Shuffle",
      repeat: "Repeat",
      queue: "Queue",
      addToPlaylist: "Add to playlist",
      createPlaylist: "Create playlist",
      relaxation: "Relaxation",
      focus: "Focus",
      sleep: "Sleep",
      energy: "Energy"
    },
    vr: {
      title: "Virtual Reality",
      startSession: "Start session",
      environments: "Environments",
      beach: "Beach",
      forest: "Forest",
      mountain: "Mountain",
      space: "Space",
      underwater: "Underwater",
      duration: "Duration",
      intensity: "Intensity",
      calibrate: "Calibrate",
      exitVR: "Exit VR",
      noHeadset: "VR headset not detected",
      connecting: "Connecting to headset..."
    },
    breathing: {
      title: "Breathing",
      inhale: "Inhale",
      exhale: "Exhale",
      hold: "Hold",
      relax: "Relax",
      cycles: {
        one: "{{count}} cycle",
        other: "{{count}} cycles"
      },
      technique478: "4-7-8 Technique",
      boxBreathing: "Box breathing",
      coherentBreathing: "Coherent breathing",
      calmingBreath: "Calming breath"
    },
    journal: {
      title: "Journal",
      newEntry: "New entry",
      entries: "Entries",
      mood: "Mood",
      tags: "Tags",
      attachments: "Attachments",
      private: "Private",
      howAreYou: "How are you today?",
      writeThoughts: "Write your thoughts...",
      gratitude: "Gratitude",
      reflection: "Reflection",
      goals: "Goals"
    },
    social: {
      title: "Social",
      friends: "Friends",
      groups: "Groups",
      community: "Community",
      messages: "Messages",
      notifications: "Notifications",
      invite: "Invite",
      share: "Share",
      like: "Like",
      comment: "Comment",
      follow: "Follow",
      unfollow: "Unfollow",
      block: "Block",
      report: "Report"
    },
    notifications: {
      title: "Notifications",
      all: "All",
      unread: "Unread",
      markAllRead: "Mark all as read",
      noNotifications: "No notifications",
      settings: "Notification settings",
      reminder: "Reminder",
      achievement: "Achievement",
      message: "Message",
      update: "Update"
    },
    errors: {
      generic: "An error occurred",
      network: "Connection error",
      notFound: "Page not found",
      unauthorized: "Unauthorized access",
      forbidden: "Access denied",
      serverError: "Server error",
      timeout: "Request timed out",
      validation: "Validation error",
      required: "This field is required",
      invalidEmail: "Invalid email",
      passwordTooShort: "Password too short",
      passwordMismatch: "Passwords don't match",
      tryAgain: "Please try again"
    }
  },
  es: {
    common: {
      start: "Comenzar",
      loading: "Cargando…",
      error: "Se produjo un error",
      home: "Inicio"
    }
  },
  de: {
    common: {
      start: "Starten",
      loading: "Laden…",
      error: "Ein Fehler ist aufgetreten",
      home: "Startseite"
    }
  },
  it: {
    common: {
      start: "Inizia",
      loading: "Caricamento…",
      error: "Si è verificato un errore",
      home: "Home"
    }
  },
  pt: {
    common: {
      start: "Começar",
      loading: "Carregando…",
      error: "Ocorreu um erro",
      home: "Início"
    }
  }
};

// État
let currentLang: Lang = 'fr';
let defaultLang: Lang = 'fr';
let fallbackLang: Lang = 'en';
const missingKeys: Set<string> = new Set();
const listeners: Array<(lang: Lang) => void> = [];

/** Configurer la langue actuelle */
export function setLanguage(lang: Lang): void {
  if (dict[lang]) {
    currentLang = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ec_lang', lang);
      document.documentElement.lang = lang;
    }
    listeners.forEach(l => l(lang));
  }
}

/** Obtenir la langue actuelle */
export function getLanguage(): Lang {
  return currentLang;
}

/** Configurer la langue par défaut */
export function setDefaultLanguage(lang: Lang): void {
  defaultLang = lang;
}

/** Configurer la langue de fallback */
export function setFallbackLanguage(lang: Lang): void {
  fallbackLang = lang;
}

/** Obtenir les langues disponibles */
export function getAvailableLanguages(): Lang[] {
  return Object.keys(dict) as Lang[];
}

/** Obtenir une valeur imbriquée */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined;
  }, obj as unknown);
}

/** Interpoler une chaîne */
function interpolate(str: string, values: Record<string, string | number>): string {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return values[key] !== undefined ? String(values[key]) : `{{${key}}}`;
  });
}

/** Obtenir la forme plurielle */
function getPluralForm(rules: PluralRules, count: number, lang: Lang): string {
  // Règles simplifiées de pluralisation
  if (count === 0 && rules.zero) return rules.zero;
  if (count === 1) return rules.one;
  if (count === 2 && rules.two) return rules.two;
  return rules.other;
}

/** Traduire une clé */
export function t(
  key: string,
  options: TranslationOptions = {}
): string {
  const lang = options.lng || currentLang;
  const ns = options.ns || 'common';

  // Chercher la traduction
  const fullKey = `${ns}.${key}`;
  let value = getNestedValue(dict[lang] as Record<string, unknown>, fullKey);

  // Fallback vers la langue par défaut
  if (value === undefined && lang !== fallbackLang) {
    value = getNestedValue(dict[fallbackLang] as Record<string, unknown>, fullKey);
  }

  // Fallback vers la clé elle-même ou la valeur par défaut
  if (value === undefined) {
    missingKeys.add(fullKey);
    return options.defaultValue || key;
  }

  // Gestion de la pluralisation
  if (typeof value === 'object' && value !== null && 'one' in value) {
    const count = options.count ?? 1;
    value = getPluralForm(value as PluralRules, count, lang);
  }

  // S'assurer que c'est une string
  if (typeof value !== 'string') {
    return options.defaultValue || key;
  }

  // Interpolation
  let result = value;
  if (options.count !== undefined) {
    result = interpolate(result, { count: options.count });
  }
  if (options.interpolation) {
    result = interpolate(result, options.interpolation);
  }

  return result;
}

/** Vérifier si une clé existe */
export function hasKey(key: string, lang?: Lang, ns?: Namespace): boolean {
  const targetLang = lang || currentLang;
  const targetNs = ns || 'common';
  const fullKey = `${targetNs}.${key}`;
  return getNestedValue(dict[targetLang] as Record<string, unknown>, fullKey) !== undefined;
}

/** Obtenir toutes les clés d'un namespace */
export function getKeys(ns: Namespace, lang?: Lang): string[] {
  const targetLang = lang || currentLang;
  const nsDict = dict[targetLang]?.[ns];
  if (!nsDict || typeof nsDict !== 'object') return [];

  const keys: string[] = [];
  const extractKeys = (obj: Record<string, unknown>, prefix: string = '') => {
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      if (typeof value === 'object' && value !== null && !('one' in value)) {
        extractKeys(value as Record<string, unknown>, fullKey);
      } else {
        keys.push(fullKey);
      }
    }
  };
  extractKeys(nsDict as Record<string, unknown>);
  return keys;
}

/** Obtenir les stats de traduction */
export function getTranslationStats(lang: Lang): TranslationStats {
  const refLang = defaultLang;
  const refKeys = new Set<string>();
  const langKeys = new Set<string>();

  // Collecter toutes les clés de référence
  for (const ns in dict[refLang]) {
    getKeys(ns as Namespace, refLang).forEach(k => refKeys.add(`${ns}.${k}`));
  }

  // Collecter les clés traduites
  for (const ns in dict[lang]) {
    getKeys(ns as Namespace, lang).forEach(k => langKeys.add(`${ns}.${k}`));
  }

  const missing: string[] = [];
  refKeys.forEach(k => {
    if (!langKeys.has(k)) missing.push(k);
  });

  return {
    totalKeys: refKeys.size,
    translatedKeys: langKeys.size,
    missingKeys: missing,
    coverage: refKeys.size > 0 ? (langKeys.size / refKeys.size) * 100 : 0
  };
}

/** Obtenir les clés manquantes détectées */
export function getMissingKeys(): string[] {
  return Array.from(missingKeys);
}

/** S'abonner aux changements de langue */
export function onLanguageChange(listener: (lang: Lang) => void): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

/** Formater une date selon la locale */
export function formatDate(date: Date | number, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleDateString(currentLang, options);
}

/** Formater un nombre selon la locale */
export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  return num.toLocaleString(currentLang, options);
}

/** Formater une devise */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return formatNumber(amount, { style: 'currency', currency });
}

/** Formater un pourcentage */
export function formatPercent(value: number, decimals: number = 0): string {
  return formatNumber(value / 100, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/** Obtenir le nom de la langue */
export function getLanguageName(lang: Lang, displayLang?: Lang): string {
  const names: Record<Lang, Record<Lang, string>> = {
    fr: { fr: 'Français', en: 'French', es: 'Francés', de: 'Französisch', it: 'Francese', pt: 'Francês' },
    en: { fr: 'Anglais', en: 'English', es: 'Inglés', de: 'Englisch', it: 'Inglese', pt: 'Inglês' },
    es: { fr: 'Espagnol', en: 'Spanish', es: 'Español', de: 'Spanisch', it: 'Spagnolo', pt: 'Espanhol' },
    de: { fr: 'Allemand', en: 'German', es: 'Alemán', de: 'Deutsch', it: 'Tedesco', pt: 'Alemão' },
    it: { fr: 'Italien', en: 'Italian', es: 'Italiano', de: 'Italienisch', it: 'Italiano', pt: 'Italiano' },
    pt: { fr: 'Portugais', en: 'Portuguese', es: 'Portugués', de: 'Portugiesisch', it: 'Portoghese', pt: 'Português' }
  };
  return names[lang]?.[displayLang || currentLang] || lang;
}

// Initialisation
if (typeof window !== 'undefined') {
  const savedLang = localStorage.getItem('ec_lang') as Lang;
  if (savedLang && dict[savedLang]) {
    currentLang = savedLang;
  } else {
    // Détecter la langue du navigateur
    const browserLang = navigator.language.split('-')[0] as Lang;
    if (dict[browserLang]) {
      currentLang = browserLang;
    }
  }
  document.documentElement.lang = currentLang;
}

export default {
  dict,
  t,
  setLanguage,
  getLanguage,
  setDefaultLanguage,
  setFallbackLanguage,
  getAvailableLanguages,
  hasKey,
  getKeys,
  getTranslationStats,
  getMissingKeys,
  onLanguageChange,
  formatDate,
  formatNumber,
  formatCurrency,
  formatPercent,
  getLanguageName
};
