/**
 * Tests pour les types audio-studio
 */

import { describe, it, expect } from 'vitest';
import type { RecordingStatus, PlaybackStatus, AudioTrack, RecordingConfig } from '../types';

describe('AudioStudio Types', () => {
  it('should validate RecordingStatus', () => {
    const validStatuses: RecordingStatus[] = ['idle', 'recording', 'paused', 'stopped'];
    expect(validStatuses).toHaveLength(4);
  });

  it('should validate PlaybackStatus', () => {
    const validStatuses: PlaybackStatus[] = ['idle', 'playing', 'paused'];
    expect(validStatuses).toHaveLength(3);
  });

  it('should create valid AudioTrack', () => {
    const track: AudioTrack = {
      id: 'test-id',
      name: 'Test Recording',
      blob: new Blob(),
      duration: 120,
      volume: 0.8,
      createdAt: new Date()
    };

    expect(track.id).toBe('test-id');
    expect(track.name).toBe('Test Recording');
    expect(track.duration).toBe(120);
    expect(track.volume).toBe(0.8);
  });

  it('should create valid RecordingConfig', () => {
    const config: RecordingConfig = {
      sampleRate: 44100,
      channelCount: 2,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: false
    };

    expect(config.sampleRate).toBe(44100);
    expect(config.channelCount).toBe(2);
    expect(config.autoGainControl).toBe(false);
  });
});
