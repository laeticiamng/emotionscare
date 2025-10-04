/**
 * Tests pour les types flash-lite
 */

import { describe, it, expect } from 'vitest';
import { FLASH_LITE_MODES } from '../types';
import type { FlashLiteMode, FlashCard, FlashLiteSession } from '../types';

describe('FlashLite Types', () => {
  it('should have all flash lite modes defined', () => {
    const modes: FlashLiteMode[] = ['quick', 'timed', 'practice', 'exam'];
    
    modes.forEach(mode => {
      expect(FLASH_LITE_MODES[mode]).toBeDefined();
      expect(FLASH_LITE_MODES[mode].name).toBeDefined();
      expect(FLASH_LITE_MODES[mode].description).toBeDefined();
      expect(FLASH_LITE_MODES[mode].icon).toBeDefined();
    });
  });

  it('should validate FlashCard structure', () => {
    const card: FlashCard = {
      id: 'test-id',
      session_id: 'session-id',
      question: 'Test question',
      answer: 'Test answer',
      difficulty: 'medium',
      created_at: new Date().toISOString()
    };

    expect(card.id).toBeDefined();
    expect(card.question).toBeDefined();
    expect(card.answer).toBeDefined();
  });

  it('should validate FlashLiteSession structure', () => {
    const session: FlashLiteSession = {
      id: 'test-id',
      user_id: 'user-id',
      mode: 'quick',
      cards_total: 10,
      cards_completed: 0,
      cards_correct: 0,
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    expect(session.mode).toBe('quick');
    expect(session.cards_total).toBe(10);
  });
});
