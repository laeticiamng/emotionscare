
// Import from the main index file
import { Emotion, User } from './index';

export interface ScanInput {
  emojis?: string;
  text?: string;
  audio_url?: string;
  user_id: string;
}

export interface ScanResponse {
  emotion: Emotion;
  feedback: string;
  score: number;
}
