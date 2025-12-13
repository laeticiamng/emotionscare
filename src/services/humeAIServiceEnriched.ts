/**
 * Service Hume AI enrichi avec reconnexion automatique et persistance cross-session
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface HumeEmotionResult {
  emotions: Array<{
    name: string;
    score: number;
  }>;
  dominantEmotion: string;
  confidence: number;
  timestamp: Date;
  analysisType: 'face' | 'voice' | 'text' | 'multimodal';
}

export interface HumeSessionState {
  sessionId: string;
  userId: string;
  startedAt: Date;
  lastActivityAt: Date;
  emotionHistory: HumeEmotionResult[];
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  reconnectAttempts: number;
}

type ConnectionStatusCallback = (status: 'connected' | 'disconnected' | 'reconnecting') => void;
type EmotionCallback = (result: HumeEmotionResult) => void;
type ErrorCallback = (error: Error) => void;

class HumeAIServiceEnriched {
  private ws: WebSocket | null = null;
  private sessionState: HumeSessionState | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private onConnectionStatusChange: ConnectionStatusCallback | null = null;
  private onEmotionDetected: EmotionCallback | null = null;
  private onError: ErrorCallback | null = null;
  private apiKey: string | null = null;
  private userId: string | null = null;

  /**
   * Initialiser le service avec l'utilisateur
   */
  async initialize(userId: string): Promise<boolean> {
    this.userId = userId;

    try {
      // Récupérer la clé API depuis les secrets
      const { data: secretData } = await supabase.functions.invoke('get-hume-config');
      if (secretData?.apiKey) {
        this.apiKey = secretData.apiKey;
      }

      // Restaurer la session précédente si elle existe
      await this.restoreSession();

      logger.info('🧠 Hume AI service initialized', { userId }, 'HUME');
      return true;
    } catch (error) {
      logger.error('Failed to initialize Hume AI', error as Error, 'HUME');
      return false;
    }
  }

  /**
   * Restaurer une session précédente
   */
  private async restoreSession(): Promise<void> {
    if (!this.userId) return;

    try {
      const { data } = await supabase
        .from('hume_sessions' as any)
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && this.isSessionValid(data)) {
        this.sessionState = {
          sessionId: data.id,
          userId: this.userId,
          startedAt: new Date(data.created_at),
          lastActivityAt: new Date(data.last_activity_at),
          emotionHistory: data.emotion_history || [],
          connectionStatus: 'disconnected',
          reconnectAttempts: 0,
        };

        logger.info('🧠 Previous session restored', { sessionId: data.id }, 'HUME');
      }
    } catch {
      logger.debug('No previous session to restore', undefined, 'HUME');
    }
  }

  /**
   * Vérifier si une session est encore valide
   */
  private isSessionValid(sessionData: any): boolean {
    const lastActivity = new Date(sessionData.last_activity_at);
    const now = new Date();
    const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
    return hoursSinceActivity < 24; // Session valide pendant 24h
  }

  /**
   * Connecter au WebSocket Hume
   */
  async connect(): Promise<boolean> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return true;
    }

    try {
      this.updateConnectionStatus('reconnecting');

      // Créer une nouvelle session si nécessaire
      if (!this.sessionState) {
        await this.createSession();
      }

      // En mode développement/simulation, simuler une connexion réussie
      if (!this.apiKey) {
        logger.info('🧠 Hume AI running in simulation mode', undefined, 'HUME');
        this.updateConnectionStatus('connected');
        this.startHeartbeat();
        return true;
      }

      // Connexion WebSocket réelle
      const wsUrl = `wss://api.hume.ai/v0/stream/models`;
      this.ws = new WebSocket(wsUrl);

      return new Promise((resolve) => {
        if (!this.ws) {
          resolve(false);
          return;
        }

        this.ws.onopen = () => {
          logger.info('🧠 Hume AI WebSocket connected', undefined, 'HUME');
          this.reconnectAttempts = 0;
          this.updateConnectionStatus('connected');
          this.startHeartbeat();
          resolve(true);
        };

        this.ws.onclose = () => {
          logger.warn('🧠 Hume AI WebSocket closed', undefined, 'HUME');
          this.handleDisconnect();
        };

        this.ws.onerror = (event) => {
          logger.error('Hume AI WebSocket error', new Error('WebSocket error'), 'HUME');
          this.onError?.(new Error('WebSocket connection error'));
          resolve(false);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };
      });
    } catch (error) {
      logger.error('Failed to connect to Hume AI', error as Error, 'HUME');
      this.updateConnectionStatus('disconnected');
      return false;
    }
  }

  /**
   * Créer une nouvelle session
   */
  private async createSession(): Promise<void> {
    if (!this.userId) return;

    try {
      const { data, error } = await supabase
        .from('hume_sessions' as any)
        .insert({
          user_id: this.userId,
          emotion_history: [],
          last_activity_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!error && data) {
        this.sessionState = {
          sessionId: data.id,
          userId: this.userId,
          startedAt: new Date(),
          lastActivityAt: new Date(),
          emotionHistory: [],
          connectionStatus: 'disconnected',
          reconnectAttempts: 0,
        };
      }
    } catch (error) {
      logger.error('Failed to create session', error as Error, 'HUME');
    }
  }

  /**
   * Gérer la déconnexion avec reconnexion automatique
   */
  private async handleDisconnect(): Promise<void> {
    this.stopHeartbeat();
    this.updateConnectionStatus('disconnected');

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      logger.info(`🧠 Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`, undefined, 'HUME');

      await new Promise(resolve => setTimeout(resolve, delay));
      await this.connect();
    } else {
      logger.error('Max reconnection attempts reached', new Error('Connection failed'), 'HUME');
      this.onError?.(new Error('Failed to reconnect after multiple attempts'));
    }
  }

  /**
   * Démarrer le heartbeat
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 30000);
  }

  /**
   * Arrêter le heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Envoyer un heartbeat
   */
  private sendHeartbeat(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping' }));
    }
    this.updateLastActivity();
  }

  /**
   * Mettre à jour la dernière activité
   */
  private async updateLastActivity(): Promise<void> {
    if (!this.sessionState) return;

    this.sessionState.lastActivityAt = new Date();

    try {
      await supabase
        .from('hume_sessions' as any)
        .update({
          last_activity_at: this.sessionState.lastActivityAt.toISOString(),
          emotion_history: this.sessionState.emotionHistory.slice(-100),
        })
        .eq('id', this.sessionState.sessionId);
    } catch {
      // Silently fail
    }
  }

  /**
   * Gérer les messages entrants
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);

      if (message.type === 'emotion') {
        const result = this.parseEmotionResult(message);
        this.addToHistory(result);
        this.onEmotionDetected?.(result);
      }
    } catch (error) {
      logger.error('Failed to parse Hume message', error as Error, 'HUME');
    }
  }

  /**
   * Parser le résultat d'émotion
   */
  private parseEmotionResult(message: any): HumeEmotionResult {
    const emotions = message.emotions || [];
    const sorted = [...emotions].sort((a: any, b: any) => b.score - a.score);
    const dominant = sorted[0];

    return {
      emotions: emotions.map((e: any) => ({
        name: e.name,
        score: e.score,
      })),
      dominantEmotion: dominant?.name || 'neutral',
      confidence: dominant?.score || 0,
      timestamp: new Date(),
      analysisType: message.analysisType || 'face',
    };
  }

  /**
   * Ajouter à l'historique
   */
  private addToHistory(result: HumeEmotionResult): void {
    if (!this.sessionState) return;

    this.sessionState.emotionHistory.push(result);

    // Garder seulement les 100 dernières entrées
    if (this.sessionState.emotionHistory.length > 100) {
      this.sessionState.emotionHistory = this.sessionState.emotionHistory.slice(-100);
    }
  }

  /**
   * Mettre à jour le statut de connexion
   */
  private updateConnectionStatus(status: 'connected' | 'disconnected' | 'reconnecting'): void {
    if (this.sessionState) {
      this.sessionState.connectionStatus = status;
    }
    this.onConnectionStatusChange?.(status);
  }

  /**
   * Analyser une image (visage)
   */
  async analyzeFace(imageData: Blob): Promise<HumeEmotionResult> {
    // En mode simulation
    if (!this.apiKey || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return this.simulateAnalysis('face');
    }

    try {
      const base64 = await this.blobToBase64(imageData);

      this.ws.send(JSON.stringify({
        type: 'face',
        data: base64,
      }));

      // Attendre la réponse (avec timeout)
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Analysis timeout'));
        }, 10000);

        const originalHandler = this.onEmotionDetected;
        this.onEmotionDetected = (result) => {
          clearTimeout(timeout);
          this.onEmotionDetected = originalHandler;
          resolve(result);
        };
      });
    } catch (error) {
      logger.error('Face analysis failed', error as Error, 'HUME');
      return this.simulateAnalysis('face');
    }
  }

  /**
   * Analyser l'audio (voix)
   */
  async analyzeVoice(audioData: Blob): Promise<HumeEmotionResult> {
    // En mode simulation
    if (!this.apiKey || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return this.simulateAnalysis('voice');
    }

    try {
      const base64 = await this.blobToBase64(audioData);

      this.ws.send(JSON.stringify({
        type: 'voice',
        data: base64,
      }));

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Analysis timeout'));
        }, 10000);

        const originalHandler = this.onEmotionDetected;
        this.onEmotionDetected = (result) => {
          clearTimeout(timeout);
          this.onEmotionDetected = originalHandler;
          resolve(result);
        };
      });
    } catch (error) {
      logger.error('Voice analysis failed', error as Error, 'HUME');
      return this.simulateAnalysis('voice');
    }
  }

  /**
   * Analyser du texte
   */
  async analyzeText(text: string): Promise<HumeEmotionResult> {
    // En mode simulation
    if (!this.apiKey || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return this.simulateTextAnalysis(text);
    }

    try {
      this.ws.send(JSON.stringify({
        type: 'text',
        data: text,
      }));

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Analysis timeout'));
        }, 10000);

        const originalHandler = this.onEmotionDetected;
        this.onEmotionDetected = (result) => {
          clearTimeout(timeout);
          this.onEmotionDetected = originalHandler;
          resolve(result);
        };
      });
    } catch (error) {
      logger.error('Text analysis failed', error as Error, 'HUME');
      return this.simulateTextAnalysis(text);
    }
  }

  /**
   * Simulation d'analyse (pour mode hors ligne)
   */
  private simulateAnalysis(type: 'face' | 'voice' | 'text' | 'multimodal'): HumeEmotionResult {
    const emotions = [
      { name: 'joy', score: Math.random() * 0.3 + 0.1 },
      { name: 'sadness', score: Math.random() * 0.2 },
      { name: 'anger', score: Math.random() * 0.1 },
      { name: 'fear', score: Math.random() * 0.1 },
      { name: 'surprise', score: Math.random() * 0.15 },
      { name: 'neutral', score: Math.random() * 0.4 + 0.2 },
    ].sort((a, b) => b.score - a.score);

    const result: HumeEmotionResult = {
      emotions,
      dominantEmotion: emotions[0].name,
      confidence: emotions[0].score,
      timestamp: new Date(),
      analysisType: type,
    };

    this.addToHistory(result);
    return result;
  }

  /**
   * Simulation d'analyse de texte
   */
  private simulateTextAnalysis(text: string): HumeEmotionResult {
    const positiveWords = ['heureux', 'content', 'bien', 'super', 'génial', 'love', 'happy', 'great'];
    const negativeWords = ['triste', 'mal', 'terrible', 'anxieux', 'stressed', 'sad', 'angry'];

    const lowerText = text.toLowerCase();
    let joyScore = 0.3;
    let sadnessScore = 0.1;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) joyScore += 0.15;
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) sadnessScore += 0.15;
    });

    const emotions = [
      { name: 'joy', score: Math.min(joyScore, 0.9) },
      { name: 'sadness', score: Math.min(sadnessScore, 0.9) },
      { name: 'neutral', score: 0.4 },
      { name: 'surprise', score: 0.1 },
    ].sort((a, b) => b.score - a.score);

    return {
      emotions,
      dominantEmotion: emotions[0].name,
      confidence: emotions[0].score,
      timestamp: new Date(),
      analysisType: 'text',
    };
  }

  /**
   * Convertir Blob en base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Définir les callbacks
   */
  setCallbacks(callbacks: {
    onConnectionStatusChange?: ConnectionStatusCallback;
    onEmotionDetected?: EmotionCallback;
    onError?: ErrorCallback;
  }): void {
    if (callbacks.onConnectionStatusChange) {
      this.onConnectionStatusChange = callbacks.onConnectionStatusChange;
    }
    if (callbacks.onEmotionDetected) {
      this.onEmotionDetected = callbacks.onEmotionDetected;
    }
    if (callbacks.onError) {
      this.onError = callbacks.onError;
    }
  }

  /**
   * Obtenir l'historique des émotions
   */
  getEmotionHistory(): HumeEmotionResult[] {
    return this.sessionState?.emotionHistory || [];
  }

  /**
   * Obtenir l'état de la session
   */
  getSessionState(): HumeSessionState | null {
    return this.sessionState;
  }

  /**
   * Obtenir le statut de connexion
   */
  getConnectionStatus(): 'connected' | 'disconnected' | 'reconnecting' {
    return this.sessionState?.connectionStatus || 'disconnected';
  }

  /**
   * Déconnecter proprement
   */
  async disconnect(): Promise<void> {
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Sauvegarder la session finale
    if (this.sessionState) {
      await this.updateLastActivity();
    }

    this.updateConnectionStatus('disconnected');
    logger.info('🧠 Hume AI disconnected', undefined, 'HUME');
  }
}

export const humeAIService = new HumeAIServiceEnriched();
export default humeAIService;
