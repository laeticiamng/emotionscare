
// Service client Hume AI pour EmotionsCare avec cache LRU
export interface HumeEmotionScore {
  name: string;
  score: number;
}

/** Simple in‑memory LRU cache (200 entries) */
class LRU<T> {
  private data = new Map<string, T>();
  constructor(private readonly max = 200) {}
  
  get(key: string) { 
    return this.data.get(key); 
  }
  
  set(key: string, val: T) {
    if (this.data.size >= this.max) {
      this.data.delete(this.data.keys().next().value);
    }
    this.data.set(key, val);
  }
}

export class HumeClient {
  private apiKey: string;
  private cache = new LRU<HumeEmotionScore[]>();
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
    if (!this.apiKey) {
      throw new Error("Missing HUME_API_KEY");
    }
  }

  /** Détecte la distribution émotionnelle d'un snippet de texte (≤ 5 000 chars). */
  async detectEmotion(text: string): Promise<HumeEmotionScore[]> {
    const key = text.slice(0, 128);
    const cached = this.cache.get(key);
    if (cached) return cached;

    const payload = {
      models: { emotion: {} },
      raw_text: text,
    };

    try {
      const json = await this.request<{
        entities: Array<{ predictions: { emotion: { emotions: HumeEmotionScore[] } } }>;
      }>("core/synchronous", payload);

      const emotions = json.entities[0]?.predictions.emotion.emotions ?? [];
      this.cache.set(key, emotions);
      return emotions;
    } catch (error) {
      console.error('❌ EmotionsCare Hume Error:', error);
      throw error;
    }
  }

  private async request<T>(endpoint: string, body: unknown, retries = 3): Promise<T> {
    const response = await fetch(`https://api.hume.ai/v0/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hume-Api-Key": this.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (retries && response.status >= 500) {
        await new Promise(r => setTimeout(r, 500 * Math.pow(2, 3 - retries)));
        return this.request(endpoint, body, retries - 1);
      }
      const errorText = await response.text();
      throw new Error(`[Hume ${response.status}] ${errorText}`);
    }
    
    return response.json() as Promise<T>;
  }
}
