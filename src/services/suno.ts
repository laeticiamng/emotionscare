// @ts-nocheck
import type { SunoGenerateRequest, SunoExtendRequest } from '@/types/music/parcours';

const SUNO_API_BASE = import.meta.env.VITE_SUPABASE_URL 
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1';

// Rate limiting: max 20 requests per 10 seconds
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestTimestamps: number[] = [];
  private readonly maxRequests = 20;
  private readonly windowMs = 10000;

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      await this.waitIfNeeded();
      const fn = this.queue.shift();
      if (fn) {
        this.requestTimestamps.push(Date.now());
        await fn();
      }
    }
    
    this.processing = false;
  }

  private async waitIfNeeded() {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(
      ts => now - ts < this.windowMs
    );

    if (this.requestTimestamps.length >= this.maxRequests) {
      const oldestRequest = this.requestTimestamps[0];
      const waitTime = this.windowMs - (now - oldestRequest) + 100;
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
}

const rateLimiter = new RateLimiter();

export async function generateMusicSegment(
  payload: SunoGenerateRequest
): Promise<{ taskId: string }> {
  return rateLimiter.add(async () => {
    const response = await fetch(`${SUNO_API_BASE}/parcours-xl-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Suno generate failed: ${error}`);
    }

    return response.json();
  });
}

export async function extendMusicSegment(
  payload: SunoExtendRequest
): Promise<{ taskId: string }> {
  return rateLimiter.add(async () => {
    const response = await fetch(`${SUNO_API_BASE}/parcours-xl-extend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Suno extend failed: ${error}`);
    }

    return response.json();
  });
}

export function buildSunoPrompt(preset: any, segmentIndex: number): string {
  const segment = preset.segments[segmentIndex];
  const music = preset.music;
  
  return `${music.prompt} | Segment ${segmentIndex + 1}: ${segment.title} | ${segment.type} | Duration: ${segment.end - segment.start}s`;
}

export function buildSunoLyrics(voiceover: string): string {
  // Convert voiceover to timestamped lyrics format
  const lines = voiceover.split('\n').filter(l => l.trim());
  return lines.map((line, i) => {
    const timestamp = i * 4; // Rough 4s per line
    return `[${Math.floor(timestamp / 60)}:${(timestamp % 60).toString().padStart(2, '0')}] ${line}`;
  }).join('\n');
}
