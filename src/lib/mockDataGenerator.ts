// @ts-nocheck
/**
 * Mock Data Generator - Générateur de données de test
 * Génération de données réalistes pour le développement et les tests
 */

import { MoodData } from '@/types/emotion';

/** Types d'émotions disponibles */
export const EMOTIONS = ['happy', 'sad', 'neutral', 'angry', 'surprised', 'fearful', 'disgusted', 'calm', 'anxious', 'excited'] as const;
export type Emotion = typeof EMOTIONS[number];

/** Sources de données */
export const SOURCES = ['daily-check-in', 'auto-detection', 'meditation', 'activity', 'sleep', 'manual'] as const;
export type DataSource = typeof SOURCES[number];

/** Configuration du générateur */
export interface GeneratorConfig {
  seed?: number;
  locale?: string;
  timezone?: string;
  realistic?: boolean;
}

/** Options pour la génération de mood */
export interface MoodGeneratorOptions {
  days?: number;
  entriesPerDay?: number;
  userId?: string;
  includeNotes?: boolean;
  emotionBias?: Partial<Record<Emotion, number>>;
  intensityRange?: [number, number];
  startDate?: Date;
}

/** Options pour la génération d'utilisateurs */
export interface UserGeneratorOptions {
  count?: number;
  includeEmail?: boolean;
  includeAvatar?: boolean;
  includePreferences?: boolean;
}

/** Utilisateur généré */
export interface MockUser {
  id: string;
  username: string;
  email?: string;
  displayName: string;
  avatar?: string;
  createdAt: string;
  lastActive: string;
  preferences?: MockUserPreferences;
  stats?: MockUserStats;
}

/** Préférences utilisateur */
export interface MockUserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  dailyReminder: boolean;
  reminderTime?: string;
}

/** Stats utilisateur */
export interface MockUserStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  averageMood: number;
  mostFrequentEmotion: Emotion;
}

/** Activité générée */
export interface MockActivity {
  id: string;
  userId: string;
  type: string;
  name: string;
  duration: number;
  calories?: number;
  heartRate?: number;
  timestamp: string;
  mood?: Emotion;
}

/** Session de méditation */
export interface MockMeditationSession {
  id: string;
  userId: string;
  type: 'guided' | 'unguided' | 'breathing' | 'body-scan';
  duration: number;
  completed: boolean;
  moodBefore?: Emotion;
  moodAfter?: Emotion;
  timestamp: string;
  notes?: string;
}

/** Générateur pseudo-aléatoire seedé */
class SeededRandom {
  private seed: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  float(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }

  shuffle<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  bool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  gaussian(mean: number = 0, stdDev: number = 1): number {
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
}

// Instance globale du générateur
let rng = new SeededRandom();

/** Configurer le générateur */
export function configure(config: GeneratorConfig): void {
  if (config.seed !== undefined) {
    rng = new SeededRandom(config.seed);
  }
}

/** Réinitialiser le générateur avec un nouveau seed */
export function resetSeed(seed?: number): void {
  rng = new SeededRandom(seed);
}

/** Générer un ID unique */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/** Générer des données de mood */
export const generateMockMoodData = (days: number = 30, options?: Partial<MoodGeneratorOptions>): MoodData[] => {
  const data: MoodData[] = [];
  const {
    entriesPerDay = 1,
    userId = 'user-1',
    includeNotes = false,
    emotionBias = {},
    intensityRange = [0.2, 0.8],
    startDate
  } = options || {};

  const now = startDate || new Date();

  // Créer un tableau d'émotions avec biais
  const weightedEmotions: Emotion[] = [];
  for (const emotion of EMOTIONS) {
    const weight = emotionBias[emotion] || 1;
    for (let i = 0; i < weight * 10; i++) {
      weightedEmotions.push(emotion);
    }
  }

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - i));

    for (let j = 0; j < entriesPerDay; j++) {
      // Varier l'heure de l'entrée
      const hours = rng.int(7, 22);
      const minutes = rng.int(0, 59);
      date.setHours(hours, minutes, 0, 0);

      const emotion = rng.pick(weightedEmotions);
      const intensity = rng.float(intensityRange[0], intensityRange[1]);

      const entry: MoodData = {
        id: `mood-${i}-${j}`,
        emotion,
        intensity,
        timestamp: date.toISOString(),
        userId,
        source: rng.pick(SOURCES)
      };

      if (includeNotes && rng.bool(0.3)) {
        entry.notes = generateMoodNote(emotion);
      }

      data.push(entry);
    }
  }

  return data;
};

/** Générer une note de mood */
function generateMoodNote(emotion: Emotion): string {
  const notes: Record<Emotion, string[]> = {
    happy: [
      'Grande journée au travail !',
      'Passé du temps avec mes amis',
      'Objectif atteint',
      'Belle promenade au soleil'
    ],
    sad: [
      'Journée difficile',
      'Un peu nostalgique aujourd\'hui',
      'Fatigue accumulée',
      'Besoin de repos'
    ],
    neutral: [
      'Journée ordinaire',
      'Routine habituelle',
      'Rien de particulier',
      'Calme plat'
    ],
    angry: [
      'Frustration au travail',
      'Embouteillages interminables',
      'Discussion tendue',
      'Problème technique'
    ],
    surprised: [
      'Nouvelle inattendue !',
      'Visite surprise',
      'Découverte intéressante',
      'Changement de plans'
    ],
    fearful: [
      'Présentation stressante',
      'Échéance proche',
      'Incertitude',
      'Situation nouvelle'
    ],
    disgusted: [
      'Déçu par la situation',
      'Comportement inapproprié',
      'Mauvaise expérience',
      'À éviter'
    ],
    calm: [
      'Méditation apaisante',
      'Moment de détente',
      'Lecture relaxante',
      'Soirée tranquille'
    ],
    anxious: [
      'Beaucoup de choses à gérer',
      'Deadline approche',
      'Pensées en boucle',
      'Besoin de décompresser'
    ],
    excited: [
      'Nouveau projet !',
      'Événement à venir',
      'Opportunité intéressante',
      'Plein d\'énergie'
    ]
  };

  return rng.pick(notes[emotion] || notes.neutral);
}

/** Générer des utilisateurs */
export function generateMockUsers(options?: UserGeneratorOptions): MockUser[] {
  const {
    count = 10,
    includeEmail = true,
    includeAvatar = true,
    includePreferences = true
  } = options || {};

  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Emma', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];

  return Array.from({ length: count }, (_, i) => {
    const firstName = rng.pick(firstNames);
    const lastName = rng.pick(lastNames);
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${rng.int(1, 999)}`;

    const user: MockUser = {
      id: generateId('user'),
      username,
      displayName: `${firstName} ${lastName}`,
      createdAt: new Date(Date.now() - rng.int(1, 365) * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - rng.int(0, 7) * 24 * 60 * 60 * 1000).toISOString()
    };

    if (includeEmail) {
      user.email = `${username}@example.com`;
    }

    if (includeAvatar) {
      user.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    }

    if (includePreferences) {
      user.preferences = {
        theme: rng.pick(['light', 'dark', 'auto']),
        language: rng.pick(['fr', 'en', 'es', 'de']),
        notifications: rng.bool(0.7),
        dailyReminder: rng.bool(0.5),
        reminderTime: rng.bool(0.5) ? `${rng.int(7, 21).toString().padStart(2, '0')}:00` : undefined
      };

      user.stats = {
        totalEntries: rng.int(10, 500),
        currentStreak: rng.int(0, 30),
        longestStreak: rng.int(5, 100),
        averageMood: rng.float(0.3, 0.8),
        mostFrequentEmotion: rng.pick(EMOTIONS)
      };
    }

    return user;
  });
}

/** Générer des activités */
export function generateMockActivities(userId: string, days: number = 30): MockActivity[] {
  const activities: MockActivity[] = [];
  const activityTypes = [
    { type: 'walk', name: 'Marche', durationRange: [15, 60], caloriesPerMin: 4 },
    { type: 'run', name: 'Course', durationRange: [20, 60], caloriesPerMin: 10 },
    { type: 'cycle', name: 'Vélo', durationRange: [30, 90], caloriesPerMin: 8 },
    { type: 'swim', name: 'Natation', durationRange: [30, 60], caloriesPerMin: 9 },
    { type: 'yoga', name: 'Yoga', durationRange: [20, 60], caloriesPerMin: 3 },
    { type: 'strength', name: 'Musculation', durationRange: [30, 90], caloriesPerMin: 5 }
  ];

  const now = new Date();

  for (let i = 0; i < days; i++) {
    // 0-2 activités par jour
    const activitiesCount = rng.int(0, 2);

    for (let j = 0; j < activitiesCount; j++) {
      const activityType = rng.pick(activityTypes);
      const duration = rng.int(activityType.durationRange[0], activityType.durationRange[1]);

      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(rng.int(6, 20), rng.int(0, 59));

      activities.push({
        id: generateId('activity'),
        userId,
        type: activityType.type,
        name: activityType.name,
        duration,
        calories: Math.round(duration * activityType.caloriesPerMin * rng.float(0.9, 1.1)),
        heartRate: rng.int(80, 160),
        timestamp: date.toISOString(),
        mood: rng.bool(0.3) ? rng.pick(EMOTIONS) : undefined
      });
    }
  }

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/** Générer des sessions de méditation */
export function generateMockMeditationSessions(userId: string, count: number = 20): MockMeditationSession[] {
  const sessions: MockMeditationSession[] = [];
  const types: Array<MockMeditationSession['type']> = ['guided', 'unguided', 'breathing', 'body-scan'];

  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - rng.int(0, 60));
    date.setHours(rng.int(6, 22), rng.int(0, 59));

    const type = rng.pick(types);
    const completed = rng.bool(0.85);

    sessions.push({
      id: generateId('meditation'),
      userId,
      type,
      duration: rng.pick([5, 10, 15, 20, 30]) * 60, // en secondes
      completed,
      moodBefore: rng.pick(EMOTIONS),
      moodAfter: completed ? rng.pick(['calm', 'happy', 'neutral'] as Emotion[]) : undefined,
      timestamp: date.toISOString(),
      notes: rng.bool(0.2) ? 'Session agréable' : undefined
    });
  }

  return sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/** Générer des données de sommeil */
export function generateMockSleepData(userId: string, days: number = 30): Array<{
  id: string;
  userId: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  deepSleep: number;
  remSleep: number;
  lightSleep: number;
  awakeTime: number;
}> {
  const sleepData = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    const bedHour = rng.int(21, 24);
    const bedMinute = rng.int(0, 59);
    const sleepDuration = rng.float(5, 9); // heures

    const bedtime = new Date(date);
    bedtime.setHours(bedHour, bedMinute);

    const wakeTime = new Date(bedtime);
    wakeTime.setHours(wakeTime.getHours() + Math.floor(sleepDuration));
    wakeTime.setMinutes(wakeTime.getMinutes() + (sleepDuration % 1) * 60);

    const durationMinutes = Math.round(sleepDuration * 60);
    const deepSleep = rng.int(15, 25);
    const remSleep = rng.int(20, 30);
    const awakeTime = rng.int(5, 15);
    const lightSleep = 100 - deepSleep - remSleep - awakeTime;

    sleepData.push({
      id: generateId('sleep'),
      userId,
      date: date.toISOString().split('T')[0],
      bedtime: bedtime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      duration: durationMinutes,
      quality: rng.float(0.5, 1),
      deepSleep,
      remSleep,
      lightSleep,
      awakeTime
    });
  }

  return sleepData;
}

/** Générer un graphique de tendance */
export function generateTrendData(days: number = 30, label: string = 'Valeur'): Array<{
  date: string;
  value: number;
  label: string;
}> {
  const data = [];
  const now = new Date();
  let baseValue = rng.float(40, 60);

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - i - 1));

    // Variation progressive avec tendance
    baseValue += rng.gaussian(0.1, 2);
    baseValue = Math.max(0, Math.min(100, baseValue));

    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(baseValue * 10) / 10,
      label
    });
  }

  return data;
}

/** Générer un dataset complet pour les tests */
export function generateFullMockDataset(options?: {
  userCount?: number;
  daysOfData?: number;
}): {
  users: MockUser[];
  moodData: Record<string, MoodData[]>;
  activities: Record<string, MockActivity[]>;
  meditations: Record<string, MockMeditationSession[]>;
} {
  const { userCount = 5, daysOfData = 30 } = options || {};

  const users = generateMockUsers({ count: userCount });
  const moodData: Record<string, MoodData[]> = {};
  const activities: Record<string, MockActivity[]> = {};
  const meditations: Record<string, MockMeditationSession[]> = {};

  for (const user of users) {
    moodData[user.id] = generateMockMoodData(daysOfData, { userId: user.id });
    activities[user.id] = generateMockActivities(user.id, daysOfData);
    meditations[user.id] = generateMockMeditationSessions(user.id, Math.floor(daysOfData / 2));
  }

  return { users, moodData, activities, meditations };
}

export default {
  generateMockMoodData,
  generateMockUsers,
  generateMockActivities,
  generateMockMeditationSessions,
  generateMockSleepData,
  generateTrendData,
  generateFullMockDataset,
  generateId,
  configure,
  resetSeed,
  EMOTIONS,
  SOURCES
};
