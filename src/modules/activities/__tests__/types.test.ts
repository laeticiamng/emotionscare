/**
 * Tests pour les types activities
 */

import { describe, it, expect } from 'vitest';
import type { ActivityCategory, ActivityDifficulty, Activity } from '../types';

describe('Activities Types', () => {
  it('should validate ActivityCategory', () => {
    const validCategories: ActivityCategory[] = [
      'relaxation',
      'physical',
      'creative',
      'social',
      'mindfulness',
      'nature'
    ];
    expect(validCategories).toHaveLength(6);
  });

  it('should validate ActivityDifficulty', () => {
    const validDifficulties: ActivityDifficulty[] = ['easy', 'medium', 'hard'];
    expect(validDifficulties).toHaveLength(3);
  });

  it('should create valid Activity', () => {
    const activity: Activity = {
      id: 'test-id',
      title: 'Test Activity',
      description: 'Description',
      category: 'relaxation',
      duration_minutes: 15,
      difficulty: 'easy',
      icon: 'Heart',
      tags: ['test', 'relaxation'],
      benefits: ['Benefit 1', 'Benefit 2'],
      instructions: ['Step 1', 'Step 2'],
      is_premium: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    expect(activity.title).toBe('Test Activity');
    expect(activity.category).toBe('relaxation');
    expect(activity.duration_minutes).toBe(15);
  });
});
