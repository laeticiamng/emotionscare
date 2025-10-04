/**
 * Tests pour audioStudioService
 */

import { describe, it, expect } from 'vitest';
import { AudioStudioService } from '../audioStudioService';

describe('AudioStudioService', () => {
  describe('getAudioMetadata', () => {
    it('should return correct metadata', () => {
      const blob = new Blob(['test'], { type: 'audio/webm' });
      const metadata = AudioStudioService.getAudioMetadata(blob);

      expect(metadata.format).toBe('audio/webm');
      expect(metadata.bitrate).toBe(128000);
      expect(metadata.size).toBeGreaterThan(0);
    });
  });

  describe('blobToBase64', () => {
    it('should convert blob to base64', async () => {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const base64 = await AudioStudioService.blobToBase64(blob);

      expect(base64).toContain('data:text/plain;base64,');
    });
  });

  describe('calculateDuration', () => {
    it('should return 0 for invalid audio', async () => {
      const blob = new Blob(['invalid'], { type: 'audio/webm' });
      const duration = await AudioStudioService.calculateDuration(blob);

      expect(duration).toBe(0);
    });
  });
});
