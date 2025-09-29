import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiServices from '@/services';
import openaiService from '@/services/openai';
import musicGenService from '@/services/musicgen';
import humeAIService from '@/services/humeai';

describe('apiServices.checkAllAPIs', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('aggregates API availability status', async () => {
    vi.spyOn(openaiService, 'checkApiConnection').mockResolvedValue(true);
    vi.spyOn(musicGenService, 'checkApiConnection').mockResolvedValue(false);
    vi.spyOn(humeAIService, 'checkApiConnection').mockResolvedValue(true);

    const status = await apiServices.checkAllAPIs();

    expect(openaiService.checkApiConnection).toHaveBeenCalled();
    expect(musicGenService.checkApiConnection).toHaveBeenCalled();
    expect(humeAIService.checkApiConnection).toHaveBeenCalled();

    expect(status.openai.isAvailable).toBe(true);
    expect(status.musicGen.isAvailable).toBe(false);
    expect(status.humeAI.isAvailable).toBe(true);
    expect(status.whisper.isAvailable).toBe(true);
    expect(status.dalle.isAvailable).toBe(true);
  });
});
