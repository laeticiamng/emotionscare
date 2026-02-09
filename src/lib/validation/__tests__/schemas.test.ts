import { describe, it, expect } from 'vitest';
import {
  emotionalScanSchema,
  musicGenerationSchema,
  coachMessageSchema,
  coachSessionSchema,
  scanAnomalyDetectionSchema,
  challengeSubmissionSchema,
  loginSchema,
  contactFormSchema,
} from '../schemas';

describe('emotionalScanSchema', () => {
  it('validates a text scan', () => {
    const result = emotionalScanSchema.safeParse({
      mode: 'text',
      textInput: 'Je me sens stresse par les examens',
    });
    expect(result.success).toBe(true);
  });

  it('rejects text scan without text input', () => {
    const result = emotionalScanSchema.safeParse({
      mode: 'text',
    });
    expect(result.success).toBe(false);
  });

  it('rejects text scan with empty text', () => {
    const result = emotionalScanSchema.safeParse({
      mode: 'text',
      textInput: 'ab',
    });
    expect(result.success).toBe(false);
  });

  it('validates a voice scan with duration', () => {
    const result = emotionalScanSchema.safeParse({
      mode: 'voice',
      voiceDurationMs: 5000,
    });
    expect(result.success).toBe(true);
  });

  it('rejects voice scan with too short duration', () => {
    const result = emotionalScanSchema.safeParse({
      mode: 'voice',
      voiceDurationMs: 100,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid scan mode', () => {
    const result = emotionalScanSchema.safeParse({
      mode: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('validates questionnaire scan', () => {
    const result = emotionalScanSchema.safeParse({
      mode: 'questionnaire',
      questionnaireAnswers: [
        { questionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', value: 7 },
      ],
    });
    expect(result.success).toBe(true);
  });
});

describe('musicGenerationSchema', () => {
  it('validates a valid music generation request', () => {
    const result = musicGenerationSchema.safeParse({
      prompt: 'Musique apaisante pour la meditation',
      emotion: 'calm',
      genre: 'ambient',
      durationSeconds: 120,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty prompt', () => {
    const result = musicGenerationSchema.safeParse({
      prompt: 'ab',
      emotion: 'calm',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid genre', () => {
    const result = musicGenerationSchema.safeParse({
      prompt: 'Test prompt',
      emotion: 'calm',
      genre: 'heavy_metal',
    });
    expect(result.success).toBe(false);
  });

  it('applies default duration', () => {
    const result = musicGenerationSchema.safeParse({
      prompt: 'Test prompt valid',
      emotion: 'calm',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.durationSeconds).toBe(60);
    }
  });
});

describe('coachMessageSchema', () => {
  it('validates a valid coach message', () => {
    const result = coachMessageSchema.safeParse({
      message: 'Comment gerer mon stress avant un examen ?',
      context: 'exam_prep',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty message', () => {
    const result = coachMessageSchema.safeParse({
      message: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects message exceeding 2000 chars', () => {
    const result = coachMessageSchema.safeParse({
      message: 'x'.repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid context', () => {
    const result = coachMessageSchema.safeParse({
      message: 'Test message',
      context: 'invalid_context',
    });
    expect(result.success).toBe(false);
  });
});

describe('coachSessionSchema', () => {
  it('validates an empty session (all optional)', () => {
    const result = coachSessionSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('validates full session data', () => {
    const result = coachSessionSchema.safeParse({
      title: 'Session gestion du stress',
      goal: 'Apprendre des techniques de respiration',
      moodBefore: 3,
      moodAfter: 7,
    });
    expect(result.success).toBe(true);
  });

  it('rejects mood values out of range', () => {
    const result = coachSessionSchema.safeParse({
      moodBefore: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe('scanAnomalyDetectionSchema', () => {
  it('validates normal scan data', () => {
    const result = scanAnomalyDetectionSchema.safeParse({
      userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      scanId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
      emotionScores: [0.5, 0.3, 0.1, 0.05, 0.05],
      previousAvgScore: 0.45,
      deviationThreshold: 0.3,
      frequencyPerHour: 2,
      maxScansPerHour: 10,
    });
    expect(result.success).toBe(true);
  });

  it('rejects abnormally high scan frequency', () => {
    const result = scanAnomalyDetectionSchema.safeParse({
      userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      scanId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
      emotionScores: [0.5],
      previousAvgScore: 0.45,
      frequencyPerHour: 15,
      maxScansPerHour: 10,
    });
    expect(result.success).toBe(false);
  });
});

describe('challengeSubmissionSchema', () => {
  it('validates a valid challenge submission', () => {
    const result = challengeSubmissionSchema.safeParse({
      challengeId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      note: 'Super defi !',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid UUID', () => {
    const result = challengeSubmissionSchema.safeParse({
      challengeId: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });
});

describe('existing schemas - regression', () => {
  it('loginSchema validates email and password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true);
    expect(loginSchema.safeParse({ email: 'invalid', password: 'x' }).success).toBe(false);
  });

  it('contactFormSchema validates all fields', () => {
    const result = contactFormSchema.safeParse({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      subject: 'Question technique',
      message: 'Bonjour, je rencontre un probleme technique...',
    });
    expect(result.success).toBe(true);
  });
});
