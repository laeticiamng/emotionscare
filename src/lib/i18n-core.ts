import React, { useEffect, useState } from 'react';

/**
 * Système d'internationalisation centralisé
 * Textes, formats, pluriels et contextes
 */

// ============= Types et interfaces =============

export type Locale = 'fr' | 'en';

export interface TranslationContext {
  count?: number;
  gender?: 'masculine' | 'feminine' | 'neutral';
  [key: string]: any;
}

export interface FormatOptions {
  locale?: Locale;
  context?: TranslationContext;
}

// ============= Dictionnaires de traduction =============

const translations = {
  fr: {
    // Navigation et layout
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'nav.help': 'Aide',
    'nav.logout': 'Déconnexion',
    
    // Authentification
    'auth.login': 'Connexion',
    'auth.signup': 'Inscription',
    'auth.email': 'Adresse email',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.name': 'Nom complet',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.resetPassword': 'Réinitialiser le mot de passe',
    'auth.signInButton': 'Se connecter',
    'auth.signUpButton': 'S\'inscrire',
    'auth.alreadyAccount': 'Déjà un compte ?',
    'auth.noAccount': 'Pas encore de compte ?',
    
    // Messages d'erreur
    'error.required': 'Ce champ est requis',
    'error.email': 'Adresse email invalide',
    'error.password.min': 'Le mot de passe doit contenir au moins 8 caractères',
    'error.password.match': 'Les mots de passe ne correspondent pas',
    'error.network': 'Problème de connexion',
    'error.server': 'Erreur serveur',
    'error.unauthorized': 'Accès non autorisé',
    'error.notFound': 'Ressource non trouvée',
    'error.unknown': 'Une erreur inattendue s\'est produite',
    
    // Actions génériques
    'action.save': 'Enregistrer',
    'action.cancel': 'Annuler',
    'action.delete': 'Supprimer',
    'action.edit': 'Modifier',
    'action.view': 'Voir',
    'action.create': 'Créer',
    'action.back': 'Retour',
    'action.next': 'Suivant',
    'action.previous': 'Précédent',
    'action.confirm': 'Confirmer',
    'action.retry': 'Réessayer',
    
    // États et statuts
    'status.loading': 'Chargement...',
    'status.saving': 'Enregistrement...',
    'status.saved': 'Enregistré',
    'status.error': 'Erreur',
    'status.success': 'Succès',
    'status.empty': 'Aucune donnée',
    'status.offline': 'Hors ligne',
    'status.online': 'En ligne',
    
    // Modules EmotionsCare
    'module.scan': 'Scan émotionnel',
    'module.journal': 'Journal',
    'module.music': 'Musicothérapie',
    'module.breathwork': 'Exercices respiratoires',
    'module.vr': 'Réalité virtuelle',
    'module.coach': 'Coach IA',
    'module.analytics': 'Analyses',
    'module.community': 'Communauté',
    
    // Temps relatifs (avec pluriels)
    'time.now': 'maintenant',
    'time.minute.one': 'il y a une minute',
    'time.minute.other': 'il y a {{count}} minutes',
    'time.hour.one': 'il y a une heure',
    'time.hour.other': 'il y a {{count}} heures',
    'time.day.one': 'il y a un jour',
    'time.day.other': 'il y a {{count}} jours',
    'time.week.one': 'il y a une semaine',
    'time.week.other': 'il y a {{count}} semaines',
    
    // Confirmations
    'confirm.delete': 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    'confirm.leave': 'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?',
    'confirm.reset': 'Cette action réinitialisera toutes vos données. Continuer ?',
    'b2b.report.title': 'Rapport {{team}} — {{period}}',
    'b2b.report.summary.title': 'En bref',
    'b2b.report.action.title': 'Action faisable',
    'b2b.report.export.csv': 'Exporter (CSV)',
    'b2b.print.hint': 'Version prête à imprimer — chiffres masqués par design.',
  },

  en: {
    // Navigation et layout
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.help': 'Help',
    'nav.logout': 'Logout',
    
    // Authentification
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm password',
    'auth.name': 'Full name',
    'auth.forgotPassword': 'Forgot password?',
    'auth.resetPassword': 'Reset password',
    'auth.signInButton': 'Sign in',
    'auth.signUpButton': 'Sign up',
    'auth.alreadyAccount': 'Already have an account?',
    'auth.noAccount': 'Don\'t have an account?',
    
    // Messages d'erreur
    'error.required': 'This field is required',
    'error.email': 'Invalid email address',
    'error.password.min': 'Password must be at least 8 characters',
    'error.password.match': 'Passwords don\'t match',
    'error.network': 'Connection problem',
    'error.server': 'Server error',
    'error.unauthorized': 'Unauthorized access',
    'error.notFound': 'Resource not found',
    'error.unknown': 'An unexpected error occurred',
    
    // Actions génériques
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    'action.view': 'View',
    'action.create': 'Create',
    'action.back': 'Back',
    'action.next': 'Next',
    'action.previous': 'Previous',
    'action.confirm': 'Confirm',
    'action.retry': 'Retry',
    
    // États et statuts
    'status.loading': 'Loading...',
    'status.saving': 'Saving...',
    'status.saved': 'Saved',
    'status.error': 'Error',
    'status.success': 'Success',
    'status.empty': 'No data',
    'status.offline': 'Offline',
    'status.online': 'Online',
    
    // Modules EmotionsCare
    'module.scan': 'Emotion Scan',
    'module.journal': 'Journal',
    'module.music': 'Music Therapy',
    'module.breathwork': 'Breathing Exercises',
    'module.vr': 'Virtual Reality',
    'module.coach': 'AI Coach',
    'module.analytics': 'Analytics',
    'module.community': 'Community',
    
    // Temps relatifs (avec pluriels)
    'time.now': 'now',
    'time.minute.one': 'a minute ago',
    'time.minute.other': '{{count}} minutes ago',
    'time.hour.one': 'an hour ago',
    'time.hour.other': '{{count}} hours ago',
    'time.day.one': 'a day ago',
    'time.day.other': '{{count}} days ago',
    'time.week.one': 'a week ago',
    'time.week.other': '{{count}} weeks ago',
    
    // Confirmations
    'confirm.delete': 'Are you sure you want to delete this item?',
    'confirm.leave': 'You have unsaved changes. Do you really want to leave?',
    'confirm.reset': 'This action will reset all your data. Continue?',
    'b2b.report.title': 'Report {{team}} — {{period}}',
    'b2b.report.summary.title': 'At a glance',
    'b2b.report.action.title': 'Suggested action',
    'b2b.report.export.csv': 'Export (CSV)',
    'b2b.print.hint': 'Print-ready version — numbers intentionally hidden.',
  },
} as const;

// ============= Formatage des nombres et dates =============

export const formatNumber = (value: number, locale: Locale = 'fr'): string => {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US').format(value);
};

export const formatCurrency = (value: number, currency = 'EUR', locale: Locale = 'fr'): string => {
  return new Intl.NumberFormat(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    { style: 'currency', currency }
  ).format(value);
};

export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {},
  locale: Locale = 'fr'
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', options).format(dateObj);
};

export const formatRelativeTime = (date: Date | string | number, locale: Locale = 'fr'): string => {
  const now = new Date();
  const target = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const diffMs = now.getTime() - target.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  
  if (diffMinutes < 1) return t('time.now', { locale });
  if (diffMinutes < 60) return t('time.minute', { count: diffMinutes, locale });
  if (diffHours < 24) return t('time.hour', { count: diffHours, locale });
  if (diffDays < 7) return t('time.day', { count: diffDays, locale });
  return t('time.week', { count: diffWeeks, locale });
};

// ============= Gestion des pluriels =============

const getPluralKey = (key: string, count: number, locale: Locale): string => {
  if (locale === 'fr') {
    return count <= 1 ? `${key}.one` : `${key}.other`;
  }
  
  // Règles anglaises simplifiées
  return count === 1 ? `${key}.one` : `${key}.other`;
};

// ============= Fonction de traduction principale =============

let currentLocale: Locale = 'fr';

export const setLocale = (locale: Locale) => {
  currentLocale = locale;
};

export const getLocale = (): Locale => currentLocale;

export const t = (
  key: string, 
  options: FormatOptions & { count?: number } = {}
): string => {
  const locale = options.locale || currentLocale;
  const { count, context } = options;
  
  // Gestion des pluriels
  const finalKey = count !== undefined ? getPluralKey(key, count, locale) : key;
  
  // Récupérer la traduction
  let translation = translations[locale]?.[finalKey as keyof typeof translations[typeof locale]];
  
  // Fallback sur la version singulier si pluriel absent
  if (!translation && count !== undefined) {
    translation = translations[locale]?.[key as keyof typeof translations[typeof locale]];
  }
  
  // Fallback sur le français si traduction absente
  if (!translation && locale !== 'fr') {
    translation = translations.fr[finalKey as keyof typeof translations.fr] ||
                  translations.fr[key as keyof typeof translations.fr];
  }
  
  // Fallback sur la clé elle-même
  if (!translation) {
    console.warn(`Translation missing for key: ${finalKey} (locale: ${locale})`);
    return finalKey;
  }
  
  // Interpolation des variables
  let result = translation;
  if (count !== undefined) {
    result = result.replace(/\{\{count\}\}/g, formatNumber(count, locale));
  }
  
  if (context) {
    Object.entries(context).forEach(([variable, value]) => {
      const placeholder = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
      result = result.replace(placeholder, String(value));
    });
  }
  
  return result;
};

// ============= Hook React =============

  export const useTranslation = (initialLocale?: Locale) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || currentLocale);
  
  useEffect(() => {
    setLocale(locale);
  }, [locale]);
  
  return {
    t: (key: string, options?: FormatOptions & { count?: number }) => 
      t(key, { ...options, locale }),
    
    locale,
    
    setLocale: (newLocale: Locale) => {
      setLocaleState(newLocale);
      setLocale(newLocale);
    },
    
    formatNumber: (value: number) => formatNumber(value, locale),
    formatCurrency: (value: number, currency?: string) => formatCurrency(value, currency, locale),
    formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => 
      formatDate(date, options, locale),
    formatRelativeTime: (date: Date | string | number) => formatRelativeTime(date, locale),
  };
};

// ============= Composant de traduction =============

interface TransProps {
  i18nKey: string;
  count?: number;
  context?: TranslationContext;
  components?: Record<string, React.ReactElement>;
}

export const Trans: React.FC<TransProps> = ({ i18nKey, count, context, components }) => {
  let translation = t(i18nKey, { count, context });
  
  // Support basique de composants dans les traductions
  if (components) {
    Object.entries(components).forEach(([tag, component]) => {
      const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'g');
      translation = translation.replace(regex, (_, content) => {
        return React.cloneElement(component, { key: tag }, content).toString();
      });
    });
  }
  
  return React.createElement(React.Fragment, null, translation);
};