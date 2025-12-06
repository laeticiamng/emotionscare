// @ts-nocheck
import { auth as frAuth } from '@/lib/i18n/locales/fr/auth';
import { coach as frCoach } from '@/lib/i18n/locales/fr/coach';
import { common as frCommon } from '@/lib/i18n/locales/fr/common';
import { consent as frConsent } from '@/lib/i18n/locales/fr/consent';
import { dashboard as frDashboard } from '@/lib/i18n/locales/fr/dashboard';
import { errors as frErrors } from '@/lib/i18n/locales/fr/errors';
import { journal as frJournal } from '@/lib/i18n/locales/fr/journal';
import { legal as frLegal } from '@/lib/i18n/locales/fr/legal';
import { modules as frModules } from '@/lib/i18n/locales/fr/modules';
import { navigation as frNavigation } from '@/lib/i18n/locales/fr/navigation';
import { settings as frSettings } from '@/lib/i18n/locales/fr/settings';

import { auth as enAuth } from '@/lib/i18n/locales/en/auth';
import { coach as enCoach } from '@/lib/i18n/locales/en/coach';
import { common as enCommon } from '@/lib/i18n/locales/en/common';
import { consent as enConsent } from '@/lib/i18n/locales/en/consent';
import { dashboard as enDashboard } from '@/lib/i18n/locales/en/dashboard';
import { errors as enErrors } from '@/lib/i18n/locales/en/errors';
import { journal as enJournal } from '@/lib/i18n/locales/en/journal';
import { legal as enLegal } from '@/lib/i18n/locales/en/legal';
import { modules as enModules } from '@/lib/i18n/locales/en/modules';
import { navigation as enNavigation } from '@/lib/i18n/locales/en/navigation';
import { settings as enSettings } from '@/lib/i18n/locales/en/settings';

export const namespaces = [
  'common',
  'navigation',
  'dashboard',
  'settings',
  'modules',
  'auth',
  'consent',
  'errors',
  'legal',
  'journal',
  'coach',
] as const;

export const resources = {
  fr: {
    common: frCommon,
    navigation: frNavigation,
    dashboard: frDashboard,
    settings: frSettings,
    modules: frModules,
    auth: frAuth,
    consent: frConsent,
    errors: frErrors,
    legal: frLegal,
    journal: frJournal,
    coach: frCoach,
  },
  en: {
    common: enCommon,
    navigation: enNavigation,
    dashboard: enDashboard,
    settings: enSettings,
    modules: enModules,
    auth: enAuth,
    consent: enConsent,
    errors: enErrors,
    legal: enLegal,
    journal: enJournal,
    coach: enCoach,
  },
} as const;

export type AppLocale = keyof typeof resources;
export type AppNamespace = (typeof namespaces)[number];
