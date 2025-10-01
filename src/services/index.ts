// @ts-nocheck
// Services API centralisés pour EmotionsCare
export { default as openaiService } from './openai.service';
export { default as humeService } from './hume.service';
export { default as sunoService } from './suno.service';
export { default as emotionAnalysisService } from './emotionAnalysis.service';
export { default as musicTherapyService } from './musicTherapy.service';

// Types et interfaces
export type * from './types';

// APIStatus pour composants legacy
export interface APIStatus {
  status: 'online' | 'offline' | 'checking';
  lastCheck: Date | null;
}

export const ApiService = {
  testConnection: async (): Promise<boolean> => true
};

export default ApiService;