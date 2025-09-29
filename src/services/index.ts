// Services API centralisés pour EmotionsCare
export interface APIStatus {
  status: 'online' | 'offline' | 'maintenance';
  lastCheck: Date;
  services: Record<string, boolean>;
}

// Mock services for now
export const openaiService = {
  generateText: async (prompt: string) => ({ text: `Réponse générée pour: ${prompt}` }),
  status: 'online' as const
};

export const humeService = {
  analyzeEmotion: async (data: any) => ({ emotion: 'joie', confidence: 0.85 }),
  status: 'online' as const
};

export const sunoService = {
  generateMusic: async (prompt: string) => ({ url: '/mock-music.mp3', title: 'Musique générée' }),
  status: 'online' as const
};

export const emotionAnalysisService = {
  analyze: async (input: string) => ({ emotion: 'calme', intensity: 0.7 }),
  status: 'online' as const
};

export const musicTherapyService = {
  getRecommendations: async (emotion: string) => ([{ title: 'Musique relaxante', url: '/relax.mp3' }]),
  activateMusicForEmotion: async (params: any) => ({ tracks: [], mood: params.emotion }),
  searchExistingTracks: async (emotion: string) => ([]),
  generatePlaylist: async (emotion: string) => ({ tracks: [] }),
  getEmotionMusicDescription: (emotion: string) => `Musique thérapeutique pour ${emotion}`,
  therapeuticMode: true
};

// Default export
const services = {
  openaiService,
  humeService, 
  sunoService,
  emotionAnalysisService,
  musicTherapyService
};

export default services;