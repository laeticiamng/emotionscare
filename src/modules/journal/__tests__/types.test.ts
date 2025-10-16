import { describe, it, expect } from 'vitest';
import { z } from 'zod';

/**
 * Tests pour les schémas du module Journal
 * Day 38 - Module 21: Journal (Voice & Text)
 */

// ===== ENUMS =====

const JournalEntryTypeSchema = z.enum(['text', 'voice', 'mixed']);
const JournalMoodSchema = z.enum(['very_bad', 'bad', 'neutral', 'good', 'very_good']);
const JournalEmotionSchema = z.enum([
  'joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust',
  'anxiety', 'calm', 'excited', 'grateful', 'frustrated', 'hopeful'
]);
const VoiceProcessingStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed']);

// ===== SCHEMAS PRINCIPAUX =====

const JournalEntrySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  entryType: JournalEntryTypeSchema,
  title: z.string().min(1).max(200),
  textContent: z.string().optional(),
  voiceUrl: z.string().url().optional(),
  voiceDuration: z.number().min(0).optional(),
  voiceTranscription: z.string().optional(),
  mood: JournalMoodSchema.optional(),
  emotions: z.array(JournalEmotionSchema).optional(),
  tags: z.array(z.string()).optional(),
  isPrivate: z.boolean().default(true),
  isFavorite: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const CreateJournalEntrySchema = z.object({
  entryType: JournalEntryTypeSchema,
  title: z.string().min(1).max(200),
  textContent: z.string().max(10000).optional(),
  voiceUrl: z.string().url().optional(),
  voiceDuration: z.number().min(0).optional(),
  mood: JournalMoodSchema.optional(),
  emotions: z.array(JournalEmotionSchema).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  isPrivate: z.boolean().default(true),
});

const UpdateJournalEntrySchema = z.object({
  entryId: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  textContent: z.string().max(10000).optional(),
  mood: JournalMoodSchema.optional(),
  emotions: z.array(JournalEmotionSchema).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  isPrivate: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
});

const VoiceProcessingJobSchema = z.object({
  id: z.string().uuid(),
  entryId: z.string().uuid(),
  userId: z.string().uuid(),
  audioUrl: z.string().url(),
  status: VoiceProcessingStatusSchema,
  transcription: z.string().optional(),
  emotionAnalysis: z.record(z.number()).optional(),
  processingError: z.string().optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

const JournalStatsSchema = z.object({
  totalEntries: z.number().min(0),
  textEntries: z.number().min(0),
  voiceEntries: z.number().min(0),
  mixedEntries: z.number().min(0),
  currentStreak: z.number().min(0),
  longestStreak: z.number().min(0),
  favoriteCount: z.number().min(0),
  totalWords: z.number().min(0),
  totalVoiceMinutes: z.number().min(0),
  mostUsedTags: z.array(z.object({
    tag: z.string(),
    count: z.number()
  })),
  moodDistribution: z.record(JournalMoodSchema, z.number()),
  emotionDistribution: z.record(JournalEmotionSchema, z.number()),
  entriesPerMonth: z.record(z.string(), z.number()),
});

const JournalPromptSchema = z.object({
  id: z.string().uuid(),
  promptText: z.string().min(10).max(500),
  category: z.enum(['reflection', 'gratitude', 'goals', 'emotions', 'creativity', 'mindfulness']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()),
  isActive: z.boolean(),
});

const JournalReminderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  reminderTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  daysOfWeek: z.array(z.number().min(0).max(6)), // 0=Sunday, 6=Saturday
  isActive: z.boolean(),
  message: z.string().max(200).optional(),
  createdAt: z.string().datetime(),
});

// ===== TESTS =====

describe('Journal Enums', () => {
  it('valide JournalEntryType', () => {
    expect(JournalEntryTypeSchema.parse('text')).toBe('text');
    expect(JournalEntryTypeSchema.parse('voice')).toBe('voice');
    expect(JournalEntryTypeSchema.parse('mixed')).toBe('mixed');
    expect(() => JournalEntryTypeSchema.parse('invalid')).toThrow();
  });

  it('valide JournalMood', () => {
    expect(JournalMoodSchema.parse('very_good')).toBe('very_good');
    expect(JournalMoodSchema.parse('neutral')).toBe('neutral');
    expect(() => JournalMoodSchema.parse('happy')).toThrow();
  });

  it('valide JournalEmotion', () => {
    expect(JournalEmotionSchema.parse('joy')).toBe('joy');
    expect(JournalEmotionSchema.parse('anxiety')).toBe('anxiety');
    expect(() => JournalEmotionSchema.parse('bored')).toThrow();
  });

  it('valide VoiceProcessingStatus', () => {
    expect(VoiceProcessingStatusSchema.parse('pending')).toBe('pending');
    expect(VoiceProcessingStatusSchema.parse('completed')).toBe('completed');
    expect(() => VoiceProcessingStatusSchema.parse('running')).toThrow();
  });
});

describe('JournalEntrySchema', () => {
  const validEntry = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    userId: '660e8400-e29b-41d4-a716-446655440000',
    entryType: 'text',
    title: 'Ma journée',
    textContent: 'Aujourd\'hui était une belle journée...',
    mood: 'good',
    emotions: ['joy', 'grateful'],
    tags: ['travail', 'famille'],
    isPrivate: true,
    isFavorite: false,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  };

  it('valide une entrée complète', () => {
    const result = JournalEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it('valide une entrée vocale', () => {
    const result = JournalEntrySchema.safeParse({
      ...validEntry,
      entryType: 'voice',
      voiceUrl: 'https://storage.example.com/voice/123.mp3',
      voiceDuration: 120,
      voiceTranscription: 'Transcription du message vocal...',
    });
    expect(result.success).toBe(true);
  });

  it('rejette un UUID invalide', () => {
    const result = JournalEntrySchema.safeParse({
      ...validEntry,
      id: 'invalid-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un titre vide', () => {
    const result = JournalEntrySchema.safeParse({
      ...validEntry,
      title: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un titre trop long', () => {
    const result = JournalEntrySchema.safeParse({
      ...validEntry,
      title: 'a'.repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it('accepte une entrée sans mood', () => {
    const { mood, ...entryWithoutMood } = validEntry;
    const result = JournalEntrySchema.safeParse(entryWithoutMood);
    expect(result.success).toBe(true);
  });

  it('accepte une entrée sans tags', () => {
    const { tags, ...entryWithoutTags } = validEntry;
    const result = JournalEntrySchema.safeParse(entryWithoutTags);
    expect(result.success).toBe(true);
  });
});

describe('CreateJournalEntrySchema', () => {
  it('valide une création d\'entrée texte', () => {
    const result = CreateJournalEntrySchema.safeParse({
      entryType: 'text',
      title: 'Nouvelle entrée',
      textContent: 'Contenu de l\'entrée...',
      mood: 'good',
      emotions: ['joy'],
      tags: ['test'],
      isPrivate: true,
    });
    expect(result.success).toBe(true);
  });

  it('valide une création d\'entrée vocale', () => {
    const result = CreateJournalEntrySchema.safeParse({
      entryType: 'voice',
      title: 'Message vocal',
      voiceUrl: 'https://storage.example.com/voice/123.mp3',
      voiceDuration: 60,
      mood: 'neutral',
    });
    expect(result.success).toBe(true);
  });

  it('applique les valeurs par défaut', () => {
    const result = CreateJournalEntrySchema.safeParse({
      entryType: 'text',
      title: 'Test',
      textContent: 'Test content',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isPrivate).toBe(true);
    }
  });

  it('rejette un contenu texte trop long', () => {
    const result = CreateJournalEntrySchema.safeParse({
      entryType: 'text',
      title: 'Test',
      textContent: 'a'.repeat(10001),
    });
    expect(result.success).toBe(false);
  });

  it('limite le nombre de tags à 10', () => {
    const result = CreateJournalEntrySchema.safeParse({
      entryType: 'text',
      title: 'Test',
      tags: Array(11).fill('tag'),
    });
    expect(result.success).toBe(false);
  });

  it('limite la longueur des tags à 50 caractères', () => {
    const result = CreateJournalEntrySchema.safeParse({
      entryType: 'text',
      title: 'Test',
      tags: ['a'.repeat(51)],
    });
    expect(result.success).toBe(false);
  });
});

describe('UpdateJournalEntrySchema', () => {
  it('valide une mise à jour complète', () => {
    const result = UpdateJournalEntrySchema.safeParse({
      entryId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Titre modifié',
      textContent: 'Contenu modifié',
      mood: 'very_good',
      emotions: ['joy', 'excited'],
      tags: ['nouveau_tag'],
      isFavorite: true,
    });
    expect(result.success).toBe(true);
  });

  it('valide une mise à jour partielle', () => {
    const result = UpdateJournalEntrySchema.safeParse({
      entryId: '550e8400-e29b-41d4-a716-446655440000',
      isFavorite: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejette un entryId invalide', () => {
    const result = UpdateJournalEntrySchema.safeParse({
      entryId: 'invalid-uuid',
      title: 'Test',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un titre vide', () => {
    const result = UpdateJournalEntrySchema.safeParse({
      entryId: '550e8400-e29b-41d4-a716-446655440000',
      title: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('VoiceProcessingJobSchema', () => {
  const validJob = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    entryId: '660e8400-e29b-41d4-a716-446655440000',
    userId: '770e8400-e29b-41d4-a716-446655440000',
    audioUrl: 'https://storage.example.com/audio/123.mp3',
    status: 'pending',
    startedAt: '2025-01-15T10:00:00Z',
  };

  it('valide un job en attente', () => {
    const result = VoiceProcessingJobSchema.safeParse(validJob);
    expect(result.success).toBe(true);
  });

  it('valide un job complété', () => {
    const result = VoiceProcessingJobSchema.safeParse({
      ...validJob,
      status: 'completed',
      transcription: 'Transcription complète...',
      emotionAnalysis: {
        joy: 0.8,
        calm: 0.6,
      },
      completedAt: '2025-01-15T10:05:00Z',
    });
    expect(result.success).toBe(true);
  });

  it('valide un job échoué', () => {
    const result = VoiceProcessingJobSchema.safeParse({
      ...validJob,
      status: 'failed',
      processingError: 'Audio file corrupted',
      completedAt: '2025-01-15T10:02:00Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejette une URL audio invalide', () => {
    const result = VoiceProcessingJobSchema.safeParse({
      ...validJob,
      audioUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });
});

describe('JournalStatsSchema', () => {
  it('valide des statistiques complètes', () => {
    const result = JournalStatsSchema.safeParse({
      totalEntries: 50,
      textEntries: 30,
      voiceEntries: 15,
      mixedEntries: 5,
      currentStreak: 7,
      longestStreak: 21,
      favoriteCount: 8,
      totalWords: 15000,
      totalVoiceMinutes: 120,
      mostUsedTags: [
        { tag: 'travail', count: 20 },
        { tag: 'famille', count: 15 },
      ],
      moodDistribution: {
        very_bad: 2,
        bad: 5,
        neutral: 15,
        good: 20,
        very_good: 8,
      },
      emotionDistribution: {
        joy: 25,
        calm: 20,
        anxiety: 10,
        grateful: 18,
        sadness: 5,
        anger: 3,
        fear: 2,
        surprise: 4,
        disgust: 1,
        excited: 12,
        frustrated: 6,
        hopeful: 15,
      },
      entriesPerMonth: {
        '2025-01': 15,
        '2024-12': 20,
        '2024-11': 15,
      },
    });
    expect(result.success).toBe(true);
  });

  it('accepte des valeurs à zéro', () => {
    const result = JournalStatsSchema.safeParse({
      totalEntries: 0,
      textEntries: 0,
      voiceEntries: 0,
      mixedEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
      favoriteCount: 0,
      totalWords: 0,
      totalVoiceMinutes: 0,
      mostUsedTags: [],
      moodDistribution: {},
      emotionDistribution: {},
      entriesPerMonth: {},
    });
    expect(result.success).toBe(true);
  });

  it('rejette des valeurs négatives', () => {
    const result = JournalStatsSchema.safeParse({
      totalEntries: -1,
      textEntries: 0,
      voiceEntries: 0,
      mixedEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
      favoriteCount: 0,
      totalWords: 0,
      totalVoiceMinutes: 0,
      mostUsedTags: [],
      moodDistribution: {},
      emotionDistribution: {},
      entriesPerMonth: {},
    });
    expect(result.success).toBe(false);
  });
});

describe('JournalPromptSchema', () => {
  const validPrompt = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    promptText: 'Qu\'est-ce qui vous a rendu reconnaissant aujourd\'hui ?',
    category: 'gratitude',
    difficulty: 'easy',
    tags: ['gratitude', 'positive'],
    isActive: true,
  };

  it('valide un prompt complet', () => {
    const result = JournalPromptSchema.safeParse(validPrompt);
    expect(result.success).toBe(true);
  });

  it('rejette un prompt trop court', () => {
    const result = JournalPromptSchema.safeParse({
      ...validPrompt,
      promptText: 'Court',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un prompt trop long', () => {
    const result = JournalPromptSchema.safeParse({
      ...validPrompt,
      promptText: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('valide toutes les catégories', () => {
    const categories = ['reflection', 'gratitude', 'goals', 'emotions', 'creativity', 'mindfulness'];
    categories.forEach(category => {
      const result = JournalPromptSchema.safeParse({
        ...validPrompt,
        category,
      });
      expect(result.success).toBe(true);
    });
  });

  it('valide tous les niveaux de difficulté', () => {
    ['easy', 'medium', 'hard'].forEach(difficulty => {
      const result = JournalPromptSchema.safeParse({
        ...validPrompt,
        difficulty,
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('JournalReminderSchema', () => {
  const validReminder = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    userId: '660e8400-e29b-41d4-a716-446655440000',
    reminderTime: '09:00',
    daysOfWeek: [1, 2, 3, 4, 5], // Lundi à vendredi
    isActive: true,
    message: 'N\'oubliez pas d\'écrire dans votre journal !',
    createdAt: '2025-01-15T10:00:00Z',
  };

  it('valide un rappel complet', () => {
    const result = JournalReminderSchema.safeParse(validReminder);
    expect(result.success).toBe(true);
  });

  it('valide différents formats d\'heure', () => {
    ['00:00', '09:30', '12:00', '18:45', '23:59'].forEach(time => {
      const result = JournalReminderSchema.safeParse({
        ...validReminder,
        reminderTime: time,
      });
      expect(result.success).toBe(true);
    });
  });

  it('rejette un format d\'heure invalide', () => {
    ['25:00', '12:60', '9:00', 'invalid'].forEach(time => {
      const result = JournalReminderSchema.safeParse({
        ...validReminder,
        reminderTime: time,
      });
      expect(result.success).toBe(false);
    });
  });

  it('valide tous les jours de la semaine', () => {
    const result = JournalReminderSchema.safeParse({
      ...validReminder,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    });
    expect(result.success).toBe(true);
  });

  it('rejette un jour de semaine invalide', () => {
    const result = JournalReminderSchema.safeParse({
      ...validReminder,
      daysOfWeek: [0, 7], // 7 est invalide
    });
    expect(result.success).toBe(false);
  });

  it('accepte un rappel sans message personnalisé', () => {
    const { message, ...reminderWithoutMessage } = validReminder;
    const result = JournalReminderSchema.safeParse(reminderWithoutMessage);
    expect(result.success).toBe(true);
  });

  it('rejette un message trop long', () => {
    const result = JournalReminderSchema.safeParse({
      ...validReminder,
      message: 'a'.repeat(201),
    });
    expect(result.success).toBe(false);
  });
});
