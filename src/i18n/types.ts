// @ts-nocheck
/**
 * i18n Types - Système d'internationalisation
 * Types pour les traductions, locales, pluralisation et formatage
 */

/** Type de dictionnaire de traduction */
export type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};

/** Ressources par locale */
export type LocaleResources = Record<string, TranslationDictionary>;

/** Locales supportées */
export type SupportedLocale =
  | 'fr'
  | 'en'
  | 'es'
  | 'de'
  | 'it'
  | 'pt'
  | 'nl'
  | 'pl'
  | 'ru'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'ar';

/** Direction du texte */
export type TextDirection = 'ltr' | 'rtl';

/** Format de nombre */
export type NumberFormat = 'decimal' | 'currency' | 'percent' | 'unit';

/** Format de date */
export type DateFormat = 'short' | 'medium' | 'long' | 'full' | 'relative';

/** Configuration de locale */
export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  direction: TextDirection;
  dateFormat: string;
  timeFormat: string;
  numberFormat: NumberFormatConfig;
  currency: CurrencyConfig;
  firstDayOfWeek: 0 | 1 | 6;
  weekendDays: number[];
  fallback?: SupportedLocale;
}

/** Configuration de format de nombre */
export interface NumberFormatConfig {
  decimalSeparator: string;
  thousandsSeparator: string;
  decimalDigits: number;
  currencyPosition: 'before' | 'after';
  currencySpace: boolean;
}

/** Configuration de devise */
export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  decimalDigits: number;
}

/** Options de traduction */
export interface TranslationOptions {
  count?: number;
  context?: string;
  defaultValue?: string;
  replace?: Record<string, string | number>;
  lng?: SupportedLocale;
  ns?: string;
  keySeparator?: string;
  nsSeparator?: string;
  returnObjects?: boolean;
  returnEmptyString?: boolean;
  skipInterpolation?: boolean;
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

/** Clé de traduction avec pluriel */
export interface PluralTranslation {
  key: string;
  rules: PluralRules;
}

/** Namespace de traduction */
export interface TranslationNamespace {
  id: string;
  name: string;
  translations: TranslationDictionary;
  loaded?: boolean;
  loadedAt?: number;
}

/** État de l'i18n */
export interface I18nState {
  currentLocale: SupportedLocale;
  fallbackLocale: SupportedLocale;
  loadedNamespaces: string[];
  isLoading: boolean;
  error?: I18nError;
  lastUpdate: number;
}

/** Erreur i18n */
export interface I18nError {
  code: I18nErrorCode;
  message: string;
  key?: string;
  locale?: string;
  namespace?: string;
}

/** Codes d'erreur i18n */
export type I18nErrorCode =
  | 'MISSING_KEY'
  | 'MISSING_NAMESPACE'
  | 'INVALID_LOCALE'
  | 'LOAD_FAILED'
  | 'INTERPOLATION_ERROR'
  | 'PLURAL_ERROR';

/** Événement de changement de locale */
export interface LocaleChangeEvent {
  previousLocale: SupportedLocale;
  newLocale: SupportedLocale;
  timestamp: number;
  source: 'user' | 'system' | 'auto';
}

/** Détection de locale */
export interface LocaleDetectionResult {
  detected: SupportedLocale;
  source: LocaleDetectionSource;
  confidence: number;
  alternatives: SupportedLocale[];
}

/** Source de détection */
export type LocaleDetectionSource =
  | 'browser'
  | 'navigator'
  | 'cookie'
  | 'localStorage'
  | 'url'
  | 'header'
  | 'default';

/** Options de détection de locale */
export interface LocaleDetectionOptions {
  order: LocaleDetectionSource[];
  caches: LocaleDetectionSource[];
  cookieName?: string;
  localStorageKey?: string;
  urlParam?: string;
  headerName?: string;
}

/** Interpolation */
export interface InterpolationConfig {
  prefix: string;
  suffix: string;
  escapeValue: boolean;
  useRawValueToEscape: boolean;
  nestingPrefix: string;
  nestingSuffix: string;
  maxReplaces: number;
}

/** Format de date/heure */
export interface DateTimeFormatOptions {
  format?: DateFormat;
  locale?: SupportedLocale;
  timezone?: string;
  calendar?: 'gregory' | 'iso8601' | 'buddhist' | 'chinese' | 'hebrew' | 'islamic';
  weekday?: 'narrow' | 'short' | 'long';
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  hour12?: boolean;
}

/** Format de nombre */
export interface NumberFormatOptions {
  format?: NumberFormat;
  locale?: SupportedLocale;
  minimumIntegerDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
  useGrouping?: boolean;
  currency?: string;
  currencyDisplay?: 'symbol' | 'code' | 'name';
  unit?: string;
  unitDisplay?: 'short' | 'long' | 'narrow';
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  compactDisplay?: 'short' | 'long';
  signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
}

/** Options de temps relatif */
export interface RelativeTimeOptions {
  locale?: SupportedLocale;
  numeric?: 'always' | 'auto';
  style?: 'long' | 'short' | 'narrow';
  addSuffix?: boolean;
}

/** Unités de temps relatif */
export type RelativeTimeUnit =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

/** Format de liste */
export interface ListFormatOptions {
  locale?: SupportedLocale;
  type?: 'conjunction' | 'disjunction' | 'unit';
  style?: 'long' | 'short' | 'narrow';
}

/** Statistiques de traduction */
export interface TranslationStats {
  totalKeys: number;
  translatedKeys: number;
  missingKeys: number;
  completionRate: number;
  lastUpdated?: number;
  byNamespace: Record<string, NamespaceStats>;
}

/** Statistiques par namespace */
export interface NamespaceStats {
  totalKeys: number;
  translatedKeys: number;
  missingKeys: string[];
  completionRate: number;
}

/** Configuration de l'i18n */
export interface I18nConfig {
  defaultLocale: SupportedLocale;
  supportedLocales: SupportedLocale[];
  fallbackLocale: SupportedLocale;
  namespaces: string[];
  defaultNamespace: string;
  loadPath: string;
  savePath?: string;
  detection: LocaleDetectionOptions;
  interpolation: InterpolationConfig;
  react?: ReactI18nConfig;
  backend?: I18nBackendConfig;
  cache?: I18nCacheConfig;
  debug?: boolean;
}

/** Configuration React */
export interface ReactI18nConfig {
  useSuspense: boolean;
  bindI18n: string;
  bindI18nStore: string;
  transEmptyNodeValue: string;
  transSupportBasicHtmlNodes: boolean;
  transKeepBasicHtmlNodesFor: string[];
}

/** Configuration backend */
export interface I18nBackendConfig {
  loadPath: string;
  addPath?: string;
  allowMultiLoading: boolean;
  reloadInterval?: number | false;
  customHeaders?: Record<string, string>;
}

/** Configuration cache */
export interface I18nCacheConfig {
  enabled: boolean;
  expirationTime: number;
  versions: Record<string, string>;
  prefix: string;
}

/** Configurations par défaut des locales */
export const LOCALE_CONFIGS: Record<SupportedLocale, LocaleConfig> = {
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: ' ',
      decimalDigits: 2,
      currencyPosition: 'after',
      currencySpace: true
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      decimalDigits: 2
    },
    firstDayOfWeek: 1,
    weekendDays: [0, 6]
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      decimalDigits: 2,
      currencyPosition: 'before',
      currencySpace: false
    },
    currency: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
      decimalDigits: 2
    },
    firstDayOfWeek: 0,
    weekendDays: [0, 6]
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
      decimalDigits: 2,
      currencyPosition: 'after',
      currencySpace: true
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      decimalDigits: 2
    },
    firstDayOfWeek: 1,
    weekendDays: [0, 6]
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
      decimalDigits: 2,
      currencyPosition: 'after',
      currencySpace: true
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      decimalDigits: 2
    },
    firstDayOfWeek: 1,
    weekendDays: [0, 6]
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
      decimalDigits: 2,
      currencyPosition: 'after',
      currencySpace: true
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      decimalDigits: 2
    },
    firstDayOfWeek: 1,
    weekendDays: [0, 6]
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
      decimalDigits: 2,
      currencyPosition: 'after',
      currencySpace: true
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      decimalDigits: 2
    },
    firstDayOfWeek: 1,
    weekendDays: [0, 6]
  },
  nl: {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    direction: 'ltr',
    dateFormat: 'DD-MM-YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
      decimalDigits: 2,
      currencyPosition: 'after',
      currencySpace: true
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      decimalDigits: 2
    },
    firstDayOfWeek: 1,
    weekendDays: [0, 6]
  },
  pl: {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: ' ',
      decimalDigits: 2,
      currencyPosition: 'after',
      currencySpace: true
    },
    currency: {
      code: 'PLN',
      symbol: 'zł',
      name: 'Polish Złoty',
      decimalDigits: 2
    },
    firstDayOfWeek: 1,
    weekendDays: [0, 6]
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: ' ',
      decimalDigits: 2,
      currencyPosition: 'after',
      currencySpace: true
    },
    currency: {
      code: 'RUB',
      symbol: '₽',
      name: 'Russian Ruble',
      decimalDigits: 2
    },
    firstDayOfWeek: 1,
    weekendDays: [0, 6]
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      decimalDigits: 2,
      currencyPosition: 'before',
      currencySpace: false
    },
    currency: {
      code: 'CNY',
      symbol: '¥',
      name: 'Chinese Yuan',
      decimalDigits: 2
    },
    firstDayOfWeek: 1,
    weekendDays: [0, 6]
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      decimalDigits: 0,
      currencyPosition: 'before',
      currencySpace: false
    },
    currency: {
      code: 'JPY',
      symbol: '¥',
      name: 'Japanese Yen',
      decimalDigits: 0
    },
    firstDayOfWeek: 0,
    weekendDays: [0, 6]
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    dateFormat: 'YYYY.MM.DD',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      decimalDigits: 0,
      currencyPosition: 'before',
      currencySpace: false
    },
    currency: {
      code: 'KRW',
      symbol: '₩',
      name: 'South Korean Won',
      decimalDigits: 0
    },
    firstDayOfWeek: 0,
    weekendDays: [0, 6]
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: '٫',
      thousandsSeparator: '٬',
      decimalDigits: 2,
      currencyPosition: 'after',
      currencySpace: true
    },
    currency: {
      code: 'SAR',
      symbol: 'ر.س',
      name: 'Saudi Riyal',
      decimalDigits: 2
    },
    firstDayOfWeek: 6,
    weekendDays: [5, 6]
  }
};

/** Configuration d'interpolation par défaut */
export const DEFAULT_INTERPOLATION_CONFIG: InterpolationConfig = {
  prefix: '{{',
  suffix: '}}',
  escapeValue: true,
  useRawValueToEscape: false,
  nestingPrefix: '$t(',
  nestingSuffix: ')',
  maxReplaces: 1000
};

/** Configuration i18n par défaut */
export const DEFAULT_I18N_CONFIG: Partial<I18nConfig> = {
  defaultLocale: 'fr',
  supportedLocales: ['fr', 'en', 'es', 'de'],
  fallbackLocale: 'en',
  namespaces: ['common', 'app', 'errors'],
  defaultNamespace: 'common',
  interpolation: DEFAULT_INTERPOLATION_CONFIG,
  debug: false
};

/** Type guard pour SupportedLocale */
export function isSupportedLocale(value: unknown): value is SupportedLocale {
  const locales: SupportedLocale[] = ['fr', 'en', 'es', 'de', 'it', 'pt', 'nl', 'pl', 'ru', 'zh', 'ja', 'ko', 'ar'];
  return typeof value === 'string' && locales.includes(value as SupportedLocale);
}

/** Obtenir la configuration d'une locale */
export function getLocaleConfig(locale: SupportedLocale): LocaleConfig | undefined {
  return LOCALE_CONFIGS[locale];
}

/** Obtenir la direction du texte pour une locale */
export function getTextDirection(locale: SupportedLocale): TextDirection {
  return LOCALE_CONFIGS[locale]?.direction || 'ltr';
}

/** Vérifier si une locale est RTL */
export function isRTL(locale: SupportedLocale): boolean {
  return getTextDirection(locale) === 'rtl';
}

/** Interpoler une chaîne de traduction */
export function interpolate(
  str: string,
  params: Record<string, string | number>,
  config: InterpolationConfig = DEFAULT_INTERPOLATION_CONFIG
): string {
  let result = str;
  let count = 0;

  for (const [key, value] of Object.entries(params)) {
    if (count >= config.maxReplaces) break;

    const pattern = new RegExp(
      `${escapeRegex(config.prefix)}\\s*${key}\\s*${escapeRegex(config.suffix)}`,
      'g'
    );

    const replacement = config.escapeValue
      ? escapeHtml(String(value))
      : String(value);

    result = result.replace(pattern, replacement);
    count++;
  }

  return result;
}

/** Échapper les caractères regex */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Échapper HTML */
function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => htmlEscapes[char]);
}

/** Obtenir la forme plurielle */
export function getPluralForm(
  count: number,
  rules: PluralRules,
  locale: SupportedLocale = 'fr'
): string {
  // Règles simplifiées pour les principales langues
  if (count === 0 && rules.zero) return rules.zero;
  if (count === 1) return rules.one;
  if (count === 2 && rules.two) return rules.two;

  // Règles spécifiques par langue
  if (['ru', 'pl'].includes(locale)) {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return rules.one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      return rules.few || rules.other;
    }
    return rules.many || rules.other;
  }

  if (locale === 'ar') {
    if (count === 0) return rules.zero || rules.other;
    if (count === 1) return rules.one;
    if (count === 2) return rules.two || rules.other;
    const mod100 = count % 100;
    if (mod100 >= 3 && mod100 <= 10) return rules.few || rules.other;
    if (mod100 >= 11 && mod100 <= 99) return rules.many || rules.other;
    return rules.other;
  }

  return rules.other;
}

/** Formater un nombre selon la locale */
export function formatNumber(
  value: number,
  locale: SupportedLocale = 'fr',
  options?: NumberFormatOptions
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: options?.format || 'decimal',
      currency: options?.currency,
      currencyDisplay: options?.currencyDisplay,
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
      useGrouping: options?.useGrouping ?? true,
      notation: options?.notation,
      compactDisplay: options?.compactDisplay,
      signDisplay: options?.signDisplay
    } as Intl.NumberFormatOptions).format(value);
  } catch {
    return String(value);
  }
}

/** Formater une date selon la locale */
export function formatDate(
  date: Date | string | number,
  locale: SupportedLocale = 'fr',
  options?: DateTimeFormatOptions
): string {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) return '';

  try {
    const formatOptions: Intl.DateTimeFormatOptions = {
      weekday: options?.weekday,
      year: options?.year,
      month: options?.month,
      day: options?.day,
      hour: options?.hour,
      minute: options?.minute,
      second: options?.second,
      hour12: options?.hour12,
      timeZone: options?.timezone
    };

    // Appliquer les formats prédéfinis
    if (options?.format === 'short') {
      formatOptions.year = 'numeric';
      formatOptions.month = 'numeric';
      formatOptions.day = 'numeric';
    } else if (options?.format === 'medium') {
      formatOptions.year = 'numeric';
      formatOptions.month = 'short';
      formatOptions.day = 'numeric';
    } else if (options?.format === 'long') {
      formatOptions.year = 'numeric';
      formatOptions.month = 'long';
      formatOptions.day = 'numeric';
      formatOptions.weekday = 'long';
    } else if (options?.format === 'full') {
      formatOptions.year = 'numeric';
      formatOptions.month = 'long';
      formatOptions.day = 'numeric';
      formatOptions.weekday = 'long';
      formatOptions.hour = 'numeric';
      formatOptions.minute = 'numeric';
    }

    return new Intl.DateTimeFormat(locale, formatOptions).format(d);
  } catch {
    return d.toLocaleDateString(locale);
  }
}

/** Formater le temps relatif */
export function formatRelativeTime(
  date: Date | string | number,
  locale: SupportedLocale = 'fr',
  options?: RelativeTimeOptions
): string {
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  try {
    const rtf = new Intl.RelativeTimeFormat(locale, {
      numeric: options?.numeric || 'auto',
      style: options?.style || 'long'
    });

    if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
    if (Math.abs(diffDay) < 7) return rtf.format(diffDay, 'day');
    if (Math.abs(diffWeek) < 4) return rtf.format(diffWeek, 'week');
    if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, 'month');
    return rtf.format(diffYear, 'year');
  } catch {
    return formatDate(d, locale, { format: 'medium' });
  }
}

/** Formater une liste */
export function formatList(
  items: string[],
  locale: SupportedLocale = 'fr',
  options?: ListFormatOptions
): string {
  try {
    return new Intl.ListFormat(locale, {
      type: options?.type || 'conjunction',
      style: options?.style || 'long'
    }).format(items);
  } catch {
    return items.join(', ');
  }
}

export default {
  LOCALE_CONFIGS,
  DEFAULT_INTERPOLATION_CONFIG,
  DEFAULT_I18N_CONFIG,
  isSupportedLocale,
  getLocaleConfig,
  getTextDirection,
  isRTL,
  interpolate,
  getPluralForm,
  formatNumber,
  formatDate,
  formatRelativeTime,
  formatList
};
