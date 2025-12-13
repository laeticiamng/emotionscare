// @ts-nocheck

/** Format de date prédéfini */
export type DateFormatPreset =
  | 'short'      // 12/01/2024
  | 'medium'     // 12 jan. 2024
  | 'long'       // 12 janvier 2024
  | 'full'       // vendredi 12 janvier 2024
  | 'time'       // 14:30
  | 'datetime'   // 12 jan. 2024 à 14:30
  | 'relative'   // il y a 2 heures
  | 'iso'        // 2024-01-12T14:30:00
  | 'timestamp'; // 1705067400000

/** Options de formatage personnalisées */
export interface DateFormatOptions {
  locale?: string;
  preset?: DateFormatPreset;
  includeTime?: boolean;
  includeSeconds?: boolean;
  use24Hour?: boolean;
  showTimezone?: boolean;
  relativeCutoff?: number;
  fallback?: string;
}

/** Entrée de date acceptée */
export type DateInput = string | Date | number | null | undefined;

/** Intervalle de temps */
export interface TimeInterval {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const DEFAULT_OPTIONS: DateFormatOptions = {
  locale: 'fr-FR',
  preset: 'datetime',
  includeTime: true,
  includeSeconds: false,
  use24Hour: true,
  showTimezone: false,
  relativeCutoff: 7 * 24 * 60 * 60 * 1000, // 7 jours
  fallback: 'Date inconnue'
};

/** Convertir une entrée en objet Date */
export function toDate(input: DateInput): Date | null {
  if (!input) return null;

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  if (typeof input === 'number') {
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof input === 'string') {
    // Essayer ISO 8601
    let date = new Date(input);
    if (!isNaN(date.getTime())) return date;

    // Essayer format français dd/mm/yyyy
    const frMatch = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if (frMatch) {
      const [, day, month, year, hour = '0', minute = '0', second = '0'] = frMatch;
      date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );
      if (!isNaN(date.getTime())) return date;
    }

    return null;
  }

  return null;
}

/** Vérifier si une date est valide */
export function isValidDate(input: DateInput): boolean {
  return toDate(input) !== null;
}

/** Obtenir les options Intl.DateTimeFormat selon le preset */
function getIntlOptions(options: DateFormatOptions): Intl.DateTimeFormatOptions {
  const { preset, includeTime, includeSeconds, use24Hour, showTimezone } = options;

  const timeOptions: Intl.DateTimeFormatOptions = includeTime
    ? {
        hour: '2-digit',
        minute: '2-digit',
        ...(includeSeconds && { second: '2-digit' }),
        hour12: !use24Hour,
        ...(showTimezone && { timeZoneName: 'short' })
      }
    : {};

  switch (preset) {
    case 'short':
      return { day: '2-digit', month: '2-digit', year: 'numeric', ...timeOptions };

    case 'medium':
      return { day: 'numeric', month: 'short', year: 'numeric', ...timeOptions };

    case 'long':
      return { day: 'numeric', month: 'long', year: 'numeric', ...timeOptions };

    case 'full':
      return { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', ...timeOptions };

    case 'time':
      return { hour: '2-digit', minute: '2-digit', ...(includeSeconds && { second: '2-digit' }), hour12: !use24Hour };

    case 'datetime':
    default:
      return { day: 'numeric', month: 'short', year: 'numeric', ...timeOptions };
  }
}

/** Calculer la différence relative en texte */
export function formatRelative(date: Date, locale: string = 'fr-FR'): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffAbs = Math.abs(diffMs);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const seconds = Math.floor(diffAbs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const sign = diffMs > 0 ? -1 : 1;

  if (seconds < 60) return rtf.format(sign * seconds, 'second');
  if (minutes < 60) return rtf.format(sign * minutes, 'minute');
  if (hours < 24) return rtf.format(sign * hours, 'hour');
  if (days < 7) return rtf.format(sign * days, 'day');
  if (weeks < 4) return rtf.format(sign * weeks, 'week');
  if (months < 12) return rtf.format(sign * months, 'month');
  return rtf.format(sign * years, 'year');
}

/** Fonction principale de formatage */
export function formatDate(date: DateInput, options?: DateFormatOptions | DateFormatPreset): string {
  const opts: DateFormatOptions = typeof options === 'string'
    ? { ...DEFAULT_OPTIONS, preset: options }
    : { ...DEFAULT_OPTIONS, ...options };

  const d = toDate(date);

  if (!d) {
    return opts.fallback!;
  }

  // Format ISO
  if (opts.preset === 'iso') {
    return d.toISOString();
  }

  // Format timestamp
  if (opts.preset === 'timestamp') {
    return String(d.getTime());
  }

  // Format relatif
  if (opts.preset === 'relative') {
    return formatRelative(d, opts.locale);
  }

  // Format relatif automatique si dans la fenêtre de coupure
  const diffMs = Math.abs(Date.now() - d.getTime());
  if (opts.relativeCutoff && diffMs < opts.relativeCutoff && opts.preset !== 'short') {
    return formatRelative(d, opts.locale);
  }

  // Format standard avec Intl
  const intlOptions = getIntlOptions(opts);
  return new Intl.DateTimeFormat(opts.locale, intlOptions).format(d);
}

/** Formater une plage de dates */
export function formatDateRange(
  start: DateInput,
  end: DateInput,
  options?: DateFormatOptions
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const startDate = toDate(start);
  const endDate = toDate(end);

  if (!startDate || !endDate) {
    return opts.fallback!;
  }

  const intlOptions = getIntlOptions({ ...opts, includeTime: false });

  try {
    const formatter = new Intl.DateTimeFormat(opts.locale, intlOptions);
    return formatter.formatRange(startDate, endDate);
  } catch {
    // Fallback pour les navigateurs sans formatRange
    return `${formatDate(startDate, opts)} - ${formatDate(endDate, opts)}`;
  }
}

/** Calculer l'intervalle entre deux dates */
export function getDateInterval(start: DateInput, end: DateInput): TimeInterval | null {
  const startDate = toDate(start);
  const endDate = toDate(end);

  if (!startDate || !endDate) return null;

  let diffMs = Math.abs(endDate.getTime() - startDate.getTime());

  const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
  diffMs -= years * 365.25 * 24 * 60 * 60 * 1000;

  const months = Math.floor(diffMs / (30.44 * 24 * 60 * 60 * 1000));
  diffMs -= months * 30.44 * 24 * 60 * 60 * 1000;

  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  diffMs -= days * 24 * 60 * 60 * 1000;

  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  diffMs -= hours * 60 * 60 * 1000;

  const minutes = Math.floor(diffMs / (60 * 1000));
  diffMs -= minutes * 60 * 1000;

  const seconds = Math.floor(diffMs / 1000);

  return { years, months, days, hours, minutes, seconds };
}

/** Formater un intervalle en texte lisible */
export function formatInterval(interval: TimeInterval, locale: string = 'fr-FR'): string {
  const parts: string[] = [];

  if (interval.years > 0) {
    parts.push(`${interval.years} ${interval.years === 1 ? 'an' : 'ans'}`);
  }
  if (interval.months > 0) {
    parts.push(`${interval.months} mois`);
  }
  if (interval.days > 0) {
    parts.push(`${interval.days} ${interval.days === 1 ? 'jour' : 'jours'}`);
  }
  if (interval.hours > 0 && parts.length < 2) {
    parts.push(`${interval.hours} ${interval.hours === 1 ? 'heure' : 'heures'}`);
  }
  if (interval.minutes > 0 && parts.length < 2) {
    parts.push(`${interval.minutes} ${interval.minutes === 1 ? 'minute' : 'minutes'}`);
  }
  if (parts.length === 0) {
    return locale.startsWith('fr') ? 'quelques secondes' : 'a few seconds';
  }

  return parts.slice(0, 2).join(' et ');
}

/** Obtenir le début/fin de période */
export function getStartOfDay(date: DateInput): Date | null {
  const d = toDate(date);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getEndOfDay(date: DateInput): Date | null {
  const d = toDate(date);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function getStartOfWeek(date: DateInput, weekStartsOn: number = 1): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff);
}

export function getStartOfMonth(date: DateInput): Date | null {
  const d = toDate(date);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function getStartOfYear(date: DateInput): Date | null {
  const d = toDate(date);
  if (!d) return null;
  return new Date(d.getFullYear(), 0, 1);
}

/** Vérifier si deux dates sont le même jour */
export function isSameDay(date1: DateInput, date2: DateInput): boolean {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return false;

  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

/** Vérifier si une date est aujourd'hui */
export function isToday(date: DateInput): boolean {
  return isSameDay(date, new Date());
}

/** Vérifier si une date est hier */
export function isYesterday(date: DateInput): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

/** Vérifier si une date est demain */
export function isTomorrow(date: DateInput): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(date, tomorrow);
}

/** Ajouter du temps à une date */
export function addTime(
  date: DateInput,
  amount: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'
): Date | null {
  const d = toDate(date);
  if (!d) return null;

  const result = new Date(d);

  switch (unit) {
    case 'seconds':
      result.setSeconds(result.getSeconds() + amount);
      break;
    case 'minutes':
      result.setMinutes(result.getMinutes() + amount);
      break;
    case 'hours':
      result.setHours(result.getHours() + amount);
      break;
    case 'days':
      result.setDate(result.getDate() + amount);
      break;
    case 'weeks':
      result.setDate(result.getDate() + amount * 7);
      break;
    case 'months':
      result.setMonth(result.getMonth() + amount);
      break;
    case 'years':
      result.setFullYear(result.getFullYear() + amount);
      break;
  }

  return result;
}

export default formatDate;
