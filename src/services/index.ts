
/**
 * Services d'API centralisés
 * 
 * Ce fichier exporte tous les services API dans une interface unifiée.
 * Il assure que les appels API sont cohérents, traçables et maintenables.
 */

// Import de tous les services API
import openaiService from './openai';
import musicGenService from './musicgen';
import whisperService from './whisper';
import humeAIService from './humeai';
import dalleService from './dalle';
import innovationService from './innovationService';
import { env } from '@/env.mjs';

// Type pour le statut des API
export interface APIStatus {
  name: string;
  isAvailable: boolean;
  lastChecked: Date | null;
}

// Classe centralisant l'accès aux API
class APIServices {
  private apiStatus: Record<string, APIStatus> = {};
  
  // Accesseurs pour chaque service
  public openai = openaiService;
  public musicGen = musicGenService;
  public whisper = whisperService;
  public humeAI = humeAIService;
  public dalle = dalleService;
  public innovation = innovationService;
  
  constructor() {
    // Initialisation des statuts d'API
    this.apiStatus = {
      openai: { name: 'OpenAI', isAvailable: false, lastChecked: null },
      musicGen: { name: 'MusicGen', isAvailable: false, lastChecked: null },
      whisper: { name: 'Whisper', isAvailable: false, lastChecked: null },
      humeAI: { name: 'Hume AI', isAvailable: false, lastChecked: null }
    };
  }
  
  /**
   * Vérifie si les clés API nécessaires sont configurées
   * @returns Objet avec l'état de configuration de chaque API
   */
  public getAPIConfiguration(): Record<string, boolean> {
    return {
      openai: !!env.NEXT_PUBLIC_OPENAI_API_KEY,
      musicGen: true, // Supposé comme toujours disponible via backend
      whisper: !!env.NEXT_PUBLIC_OPENAI_API_KEY, // Utilise la même clé qu'OpenAI
      humeAI: !!env.NEXT_PUBLIC_HUME_API_KEY,
      dalle: !!env.NEXT_PUBLIC_OPENAI_API_KEY // Utilise la même clé qu'OpenAI
    };
  }
  
  /**
   * Vérifie la disponibilité de toutes les APIs
   * @returns Promise avec les statuts mis à jour
   */
  public async checkAllAPIs(): Promise<Record<string, APIStatus>> {
    try {
      // Vérification parallèle de toutes les APIs
      const [openaiStatus, musicGenStatus, humeAIStatus] = await Promise.all([
        this.checkAPI('openai'),
        this.checkAPI('musicGen'),
        this.checkAPI('humeAI')
      ]);
      
      // Whisper partage le même statut qu'OpenAI
      this.apiStatus.whisper = {
        ...this.apiStatus.openai,
        name: 'Whisper'
      };
      
      // DALL-E partage le même statut qu'OpenAI
      this.apiStatus.dalle = {
        ...this.apiStatus.openai,
        name: 'DALL-E'
      };
      
      return this.apiStatus;
    } catch (error) {
      console.error('Error checking API status:', error);
      return this.apiStatus;
    }
  }
  
  /**
   * Vérifie la disponibilité d'une API spécifique
   * @param apiName Nom de l'API à vérifier
   * @returns Promise avec le statut mis à jour
   */
  public async checkAPI(apiName: 'openai' | 'musicGen' | 'humeAI'): Promise<APIStatus> {
    try {
      let isAvailable = false;
      
      switch (apiName) {
        case 'openai':
          isAvailable = await openaiService.checkApiConnection();
          break;
        case 'musicGen':
          isAvailable = await musicGenService.checkApiConnection();
          break;
        case 'humeAI':
          isAvailable = await humeAIService.checkApiConnection();
          break;
      }
      
      this.apiStatus[apiName] = {
        ...this.apiStatus[apiName],
        isAvailable,
        lastChecked: new Date()
      };
      
      return this.apiStatus[apiName];
    } catch (error) {
      console.error(`Error checking ${apiName} API:`, error);
      
      this.apiStatus[apiName] = {
        ...this.apiStatus[apiName],
        isAvailable: false,
        lastChecked: new Date()
      };
      
      return this.apiStatus[apiName];
    }
  }
  
  /**
   * Récupère le statut actuel de toutes les API
   * @returns Objet avec le statut de chaque API
   */
  public getAPIStatus(): Record<string, APIStatus> {
    return this.apiStatus;
  }
}

// Instance unique exportée
const apiServices = new APIServices();

export default apiServices;

// Export individuel des services pour un accès direct
export const openai = openaiService;
export const musicGen = musicGenService;
export const whisper = whisperService;
export const humeAI = humeAIService;
export const dalle = dalleService;
export const innovation = innovationService;
