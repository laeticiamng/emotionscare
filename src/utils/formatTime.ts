// @ts-nocheck

/** Format de durée */
export type DurationFormat =
  | 'colon'      // 1:23:45
  | 'letters'    // 1h 23m 45s
  | 'words'      // 1 heure, 23 minutes
  | 'compact'    // 1h23
  | 'verbose';   // 1 heure, 23 minutes et 45 secondes

/** Options de formatage de durée */
export interface DurationFormatOptions {
  format?: DurationFormat;
  locale?: string;
  showHours?: boolean | 'auto';
  showSeconds?: boolean;
  showMilliseconds?: boolean;
  padZeros?: boolean;
  separator?: string;
  fallback?: string;
}

/** Durée parsée */
export interface ParsedDuration {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
}

const DEFAULT_OPTIONS: DurationFormatOptions = {
  format: 'colon',
  locale: 'fr-FR',
  showHours: 'auto',
  showSeconds: true,
  showMilliseconds: false,
  padZeros: true,
  separator: ':',
  fallback: '00:00'
};

/** Parser une durée depuis différents formats */
export function parseDuration(input: string | number): ParsedDuration | null {
  if (typeof input === 'number') {
    if (isNaN(input) || !isFinite(input) || input < 0) return null;

    const totalMs = Math.round(input * 1000);
    const hours = Math.floor(input / 3600);
    const minutes = Math.floor((input % 3600) / 60);
    const seconds = Math.floor(input % 60);
    const milliseconds = totalMs % 1000;

    return {
      hours,
      minutes,
      seconds,
      milliseconds,
      totalSeconds: Math.floor(input),
      totalMinutes: Math.floor(input / 60),
      totalHours: input / 3600
    };
  }

  if (typeof input === 'string') {
    // Format mm:ss ou hh:mm:ss
    const colonMatch = input.match(/^(\d+):(\d{1,2})(?::(\d{1,2})(?:\.(\d{1,3}))?)?$/);
    if (colonMatch) {
      const parts = colonMatch.slice(1).filter(Boolean).map(Number);
      let hours = 0, minutes = 0, seconds = 0, milliseconds = 0;

      if (parts.length === 2) {
        [minutes, seconds] = parts;
      } else if (parts.length >= 3) {
        [hours, minutes, seconds] = parts;
        if (parts[3]) milliseconds = parts[3];
      }

      const totalSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
      return parseDuration(totalSeconds);
    }

    // Format avec lettres: 1h 23m 45s
    const letterMatch = input.match(/(?:(\d+)h)?\s*(?:(\d+)m(?:in)?)?\s*(?:(\d+)s(?:ec)?)?/i);
    if (letterMatch && (letterMatch[1] || letterMatch[2] || letterMatch[3])) {
      const hours = parseInt(letterMatch[1]) || 0;
      const minutes = parseInt(letterMatch[2]) || 0;
      const seconds = parseInt(letterMatch[3]) || 0;
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      return parseDuration(totalSeconds);
    }

    // Essayer comme nombre de secondes
    const num = parseFloat(input);
    if (!isNaN(num)) {
      return parseDuration(num);
    }
  }

  return null;
}

/** Vérifier si une durée est valide */
export function isValidDuration(input: string | number): boolean {
  return parseDuration(input) !== null;
}

/** Pad avec des zéros */
function pad(n: number, width: number = 2): string {
  return String(n).padStart(width, '0');
}

/** Formater en format colon (1:23:45) */
function formatColon(duration: ParsedDuration, options: DurationFormatOptions): string {
  const { showHours, showSeconds, showMilliseconds, padZeros } = options;

  const parts: string[] = [];

  const displayHours = showHours === true ||
    (showHours === 'auto' && duration.hours > 0);

  if (displayHours) {
    parts.push(padZeros ? pad(duration.hours) : String(duration.hours));
  }

  parts.push(padZeros ? pad(duration.minutes) : String(duration.minutes));

  if (showSeconds !== false) {
    parts.push(padZeros ? pad(duration.seconds) : String(duration.seconds));
  }

  let result = parts.join(options.separator || ':');

  if (showMilliseconds && duration.milliseconds > 0) {
    result += `.${pad(duration.milliseconds, 3)}`;
  }

  return result;
}

/** Formater en format lettres (1h 23m 45s) */
function formatLetters(duration: ParsedDuration, options: DurationFormatOptions): string {
  const { showHours, showSeconds } = options;
  const parts: string[] = [];

  const displayHours = showHours === true ||
    (showHours === 'auto' && duration.hours > 0);

  if (displayHours && duration.hours > 0) {
    parts.push(`${duration.hours}h`);
  }

  if (duration.minutes > 0 || parts.length > 0) {
    parts.push(`${duration.minutes}m`);
  }

  if (showSeconds !== false && (duration.seconds > 0 || parts.length === 0)) {
    parts.push(`${duration.seconds}s`);
  }

  return parts.join(' ');
}

/** Formater en format compact (1h23) */
function formatCompact(duration: ParsedDuration, options: DurationFormatOptions): string {
  const { showHours, showSeconds, padZeros } = options;

  const displayHours = showHours === true ||
    (showHours === 'auto' && duration.hours > 0);

  if (displayHours && duration.hours > 0) {
    return `${duration.hours}h${padZeros ? pad(duration.minutes) : duration.minutes}`;
  }

  if (showSeconds !== false) {
    return `${duration.minutes}:${padZeros ? pad(duration.seconds) : duration.seconds}`;
  }

  return `${duration.minutes}min`;
}

/** Formater en format mots (1 heure, 23 minutes) */
function formatWords(duration: ParsedDuration, options: DurationFormatOptions): string {
  const locale = options.locale || 'fr-FR';
  const isFr = locale.startsWith('fr');
  const parts: string[] = [];

  if (duration.hours > 0) {
    const unit = isFr
      ? (duration.hours === 1 ? 'heure' : 'heures')
      : (duration.hours === 1 ? 'hour' : 'hours');
    parts.push(`${duration.hours} ${unit}`);
  }

  if (duration.minutes > 0) {
    const unit = isFr
      ? (duration.minutes === 1 ? 'minute' : 'minutes')
      : (duration.minutes === 1 ? 'minute' : 'minutes');
    parts.push(`${duration.minutes} ${unit}`);
  }

  if (options.showSeconds !== false && duration.seconds > 0) {
    const unit = isFr
      ? (duration.seconds === 1 ? 'seconde' : 'secondes')
      : (duration.seconds === 1 ? 'second' : 'seconds');
    parts.push(`${duration.seconds} ${unit}`);
  }

  if (parts.length === 0) {
    return isFr ? '0 seconde' : '0 seconds';
  }

  const lastPart = parts.pop();
  if (parts.length === 0) return lastPart!;

  const connector = isFr ? ' et ' : ' and ';
  return parts.join(', ') + connector + lastPart;
}

/** Formater en format verbeux complet */
function formatVerbose(duration: ParsedDuration, options: DurationFormatOptions): string {
  return formatWords({ ...duration, seconds: duration.seconds || 0 }, { ...options, showSeconds: true });
}

/** Fonction principale de formatage */
export const formatTime = (
  seconds: number | string,
  options?: DurationFormatOptions | DurationFormat
): string => {
  const opts: DurationFormatOptions = typeof options === 'string'
    ? { ...DEFAULT_OPTIONS, format: options }
    : { ...DEFAULT_OPTIONS, ...options };

  const duration = parseDuration(seconds);

  if (!duration) {
    return opts.fallback!;
  }

  switch (opts.format) {
    case 'letters':
      return formatLetters(duration, opts);
    case 'compact':
      return formatCompact(duration, opts);
    case 'words':
      return formatWords(duration, opts);
    case 'verbose':
      return formatVerbose(duration, opts);
    case 'colon':
    default:
      return formatColon(duration, opts);
  }
};

/** Formater une durée en millisecondes */
export function formatMilliseconds(ms: number, options?: DurationFormatOptions): string {
  return formatTime(ms / 1000, { ...options, showMilliseconds: true });
}

/** Formater une durée pour l'audio/vidéo */
export function formatMediaTime(seconds: number): string {
  return formatTime(seconds, {
    format: 'colon',
    showHours: 'auto',
    showSeconds: true,
    padZeros: true
  });
}

/** Formater une durée estimée */
export function formatEstimatedTime(seconds: number, locale: string = 'fr-FR'): string {
  const duration = parseDuration(seconds);
  if (!duration) return '';

  const isFr = locale.startsWith('fr');

  if (duration.totalMinutes < 1) {
    return isFr ? 'moins d\'une minute' : 'less than a minute';
  }

  if (duration.totalMinutes < 60) {
    return isFr
      ? `environ ${Math.round(duration.totalMinutes)} minutes`
      : `about ${Math.round(duration.totalMinutes)} minutes`;
  }

  const hours = Math.round(duration.totalHours * 2) / 2; // Arrondir à la demi-heure
  if (hours === 1) {
    return isFr ? 'environ 1 heure' : 'about 1 hour';
  }

  return isFr ? `environ ${hours} heures` : `about ${hours} hours`;
}

/** Convertir entre unités */
export function convertDuration(
  value: number,
  from: 'ms' | 's' | 'm' | 'h',
  to: 'ms' | 's' | 'm' | 'h'
): number {
  const msMultipliers = { ms: 1, s: 1000, m: 60000, h: 3600000 };
  const ms = value * msMultipliers[from];
  return ms / msMultipliers[to];
}

/** Additionner des durées */
export function addDurations(...durations: (number | string)[]): number {
  return durations.reduce((total, d) => {
    const parsed = parseDuration(d);
    return total + (parsed?.totalSeconds || 0);
  }, 0);
}

/** Soustraire des durées */
export function subtractDuration(a: number | string, b: number | string): number {
  const parsedA = parseDuration(a);
  const parsedB = parseDuration(b);
  return Math.max(0, (parsedA?.totalSeconds || 0) - (parsedB?.totalSeconds || 0));
}

/** Obtenir le pourcentage de progression */
export function getDurationProgress(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}

/** Formater le temps restant */
export function formatRemainingTime(
  current: number,
  total: number,
  locale: string = 'fr-FR'
): string {
  const remaining = Math.max(0, total - current);
  const isFr = locale.startsWith('fr');

  if (remaining === 0) {
    return isFr ? 'Terminé' : 'Complete';
  }

  const formatted = formatTime(remaining, 'compact');
  return isFr ? `${formatted} restant` : `${formatted} remaining`;
}

export default formatTime;
