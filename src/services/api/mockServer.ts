import { ApiResponse, EmotionAnalysisResult, UserProfile, JournalEntry } from '@/types/api';

/**
 * Mock Server pour le développement
 * Point 5: Services API Foundation - Mock server développement
 */
class MockServer {
  private delay: number = 500; // Délai simulé pour les réponses
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  /**
   * Configuration du mock server
   */
  configure(options: { delay?: number; enabled?: boolean }) {
    if (options.delay !== undefined) this.delay = options.delay;
    if (options.enabled !== undefined) this.isEnabled = options.enabled;
  }

  /**
   * Simuler un délai de réseau
   */
  private async simulateDelay(): Promise<void> {
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
  }

  /**
   * Vérifier si le mock est activé
   */
  isActive(): boolean {
    return this.isEnabled;
  }

  /**
   * Mock pour l'analyse d'émotion
   */
  async analyzeEmotion(text: string): Promise<ApiResponse<EmotionAnalysisResult>> {
    await this.simulateDelay();
    
    // Analyse simple basée sur des mots-clés
    const emotions = {
      joy: Math.random() * 0.3 + (text.includes('heureux') || text.includes('content') ? 0.4 : 0),
      sadness: Math.random() * 0.3 + (text.includes('triste') || text.includes('mal') ? 0.4 : 0),
      anger: Math.random() * 0.3 + (text.includes('colère') || text.includes('énervé') ? 0.4 : 0),
      fear: Math.random() * 0.3 + (text.includes('peur') || text.includes('anxieux') ? 0.4 : 0),
      surprise: Math.random() * 0.2,
      disgust: Math.random() * 0.2,
    };

    const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
      emotions[a[0] as keyof typeof emotions] > emotions[b[0] as keyof typeof emotions] ? a : b
    )[0];

    return {
      data: {
        text,
        emotions,
        dominantEmotion,
        confidence: Math.random() * 0.3 + 0.7,
        timestamp: new Date().toISOString(),
        recommendations: [
          `Basé sur votre émotion "${dominantEmotion}", nous recommandons de prendre quelques minutes pour respirer.`,
          'Considérez pratiquer la méditation ou écouter de la musique relaxante.',
        ],
      },
      status: 200,
      message: 'Analyse d\'émotion réussie',
      success: true,
    };
  }

  /**
   * Mock pour les données utilisateur
   */
  async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    await this.simulateDelay();
    
    return {
      data: {
        id: userId,
        name: 'Utilisateur Demo',
        email: 'demo@emotionscare.app',
        role: 'b2c',
        avatar_url: null,
        created_at: '2024-01-01T00:00:00Z',
        preferences: {
          theme: 'system',
          language: 'fr',
          notifications_enabled: true,
          email_notifications: true,
        },
      },
      status: 200,
      message: 'Profil récupéré avec succès',
      success: true,
    };
  }

  /**
   * Mock pour les entrées de journal
   */
  async getJournalEntries(userId: string): Promise<ApiResponse<JournalEntry[]>> {
    await this.simulateDelay();
    
    const mockEntries: JournalEntry[] = [
      {
        id: '1',
        user_id: userId,
        content: 'Journée positive aujourd\'hui. J\'ai réussi à terminer mes tâches importantes.',
        date: new Date(Date.now() - 86400000).toISOString(),
        ai_feedback: 'Votre entrée reflète un sentiment de satisfaction et d\'accomplissement.',
      },
      {
        id: '2',
        user_id: userId,
        content: 'Sentiment de stress avec les échéances qui approchent.',
        date: new Date(Date.now() - 172800000).toISOString(),
        ai_feedback: 'Il semble que vous ressentez de la pression. Avez-vous pensé à prendre des pauses?',
      },
    ];

    return {
      data: mockEntries,
      status: 200,
      message: 'Entrées de journal récupérées',
      success: true,
    };
  }

  /**
   * Mock pour la création d'entrée de journal
   */
  async createJournalEntry(content: string, userId: string): Promise<ApiResponse<JournalEntry>> {
    await this.simulateDelay();
    
    const newEntry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      content,
      date: new Date().toISOString(),
      ai_feedback: 'Merci pour cette entrée. Votre réflexion est importante pour votre bien-être.',
    };

    return {
      data: newEntry,
      status: 201,
      message: 'Entrée de journal créée',
      success: true,
    };
  }

  /**
   * Mock pour l'invite VR
   */
  async generateVRPrompt(mood: string): Promise<ApiResponse<{ prompt: string; description: string }>> {
    await this.simulateDelay();
    
    const prompts = {
      calm: {
        prompt: 'Une plage tranquille au coucher du soleil avec des vagues douces',
        description: 'Expérience de relaxation sur une plage paradisiaque',
      },
      energetic: {
        prompt: 'Une forêt verdoyante avec une cascade énergisante',
        description: 'Aventure dynamique dans un environnement naturel',
      },
      stressed: {
        prompt: 'Un jardin zen japonais avec des sons apaisants',
        description: 'Méditation dans un environnement paisible et structuré',
      },
      default: {
        prompt: 'Un espace cosmique avec des étoiles scintillantes',
        description: 'Voyage relaxant dans l\'espace infini',
      },
    };

    const selectedPrompt = prompts[mood as keyof typeof prompts] || prompts.default;

    return {
      data: selectedPrompt,
      status: 200,
      message: 'Prompt VR généré',
      success: true,
    };
  }

  /**
   * Mock pour l'analyse de voix
   */
  async analyzeVoice(audioBlob: Blob): Promise<ApiResponse<EmotionAnalysisResult>> {
    await this.simulateDelay();
    
    // Simulation d'analyse vocale
    const emotions = {
      joy: Math.random() * 0.4,
      sadness: Math.random() * 0.3,
      anger: Math.random() * 0.2,
      fear: Math.random() * 0.3,
      surprise: Math.random() * 0.2,
      disgust: Math.random() * 0.1,
    };

    const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
      emotions[a[0] as keyof typeof emotions] > emotions[b[0] as keyof typeof emotions] ? a : b
    )[0];

    return {
      data: {
        text: 'Transcription simulée de l\'audio',
        emotions,
        dominantEmotion,
        confidence: Math.random() * 0.2 + 0.8,
        timestamp: new Date().toISOString(),
        recommendations: [
          `Votre ton vocal suggère "${dominantEmotion}". Considérez des exercices de respiration.`,
          'La musique douce pourrait vous aider à vous détendre.',
        ],
      },
      status: 200,
      message: 'Analyse vocale réussie',
      success: true,
    };
  }
}

// Instance singleton du mock server
export const mockServer = new MockServer();
export default mockServer;