
import { toast } from '@/hooks/use-toast';

/**
 * Service vocal sécurisé avec gestion robuste des erreurs
 */
export class SecureVoiceService {
  private static baseUrl = 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1';
  private static disabledButtons = new Set<string>();
  
  /**
   * Timeout pour les requêtes vocales (15 secondes max)
   */
  private static createTimeout(timeoutMs: number = 15000): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Voice request timeout'));
      }, timeoutMs);
    });
  }

  /**
   * Désactive temporairement un bouton (30 secondes)
   */
  private static disableButton(buttonId: string): void {
    this.disabledButtons.add(buttonId);
    setTimeout(() => {
      this.disabledButtons.delete(buttonId);
    }, 30000);
  }

  /**
   * Vérifie si un bouton est désactivé
   */
  static isButtonDisabled(buttonId: string): boolean {
    return this.disabledButtons.has(buttonId);
  }

  /**
   * Transcription vocale sécurisée
   */
  static async transcribeAudio(audioData: string, buttonId?: string): Promise<string | null> {
    if (buttonId && this.isButtonDisabled(buttonId)) {
      toast({
        title: "Service temporairement indisponible",
        description: "Veuillez patienter avant de réessayer.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const response = await Promise.race([
        fetch(`${this.baseUrl}/voice-to-text`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audio: audioData }),
        }),
        this.createTimeout()
      ]);

      if (!response.ok) {
        throw new Error(`Voice API returned ${response.status}`);
      }

      const result = await response.json();
      return result.text || null;
    } catch (error: any) {
      console.error('[Voice] Transcription error:', error);
      
      if (buttonId) {
        this.disableButton(buttonId);
      }

      if (error.message.includes('timeout')) {
        toast({
          title: "Délai d'attente dépassé",
          description: "La transcription prend trop de temps. Réessayez dans 30 secondes.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fonction vocale temporairement indisponible",
          description: "Nos services vocaux sont en maintenance. Réessayez dans quelques minutes.",
          variant: "destructive",
        });
      }

      return null;
    }
  }

  /**
   * Synthèse vocale sécurisée
   */
  static async synthesizeText(text: string, voice?: string, buttonId?: string): Promise<string | null> {
    if (buttonId && this.isButtonDisabled(buttonId)) {
      toast({
        title: "Service temporairement indisponible",
        description: "Veuillez patienter avant de réessayer.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const response = await Promise.race([
        fetch(`${this.baseUrl}/text-to-voice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, voice }),
        }),
        this.createTimeout()
      ]);

      if (!response.ok) {
        throw new Error(`Voice API returned ${response.status}`);
      }

      const result = await response.json();
      return result.audioContent || null;
    } catch (error: any) {
      console.error('[Voice] Synthesis error:', error);
      
      if (buttonId) {
        this.disableButton(buttonId);
      }

      if (error.message.includes('timeout')) {
        toast({
          title: "Délai d'attente dépassé",
          description: "La synthèse vocale prend trop de temps. Réessayez dans 30 secondes.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fonction vocale temporairement indisponible",
          description: "Nos services vocaux sont en maintenance. Réessayez dans quelques minutes.",
          variant: "destructive",
        });
      }

      return null;
    }
  }

  /**
   * Assistant vocal sécurisé
   */
  static async getVoiceAssistantResponse(message: string, buttonId?: string): Promise<string | null> {
    if (buttonId && this.isButtonDisabled(buttonId)) {
      toast({
        title: "Service temporairement indisponible",
        description: "Veuillez patienter avant de réessayer.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const response = await Promise.race([
        fetch(`${this.baseUrl}/voice-assistant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        }),
        this.createTimeout()
      ]);

      if (!response.ok) {
        throw new Error(`Voice Assistant API returned ${response.status}`);
      }

      const result = await response.json();
      return result.response || null;
    } catch (error: any) {
      console.error('[Voice] Assistant error:', error);
      
      if (buttonId) {
        this.disableButton(buttonId);
      }

      if (error.message.includes('timeout')) {
        toast({
          title: "Délai d'attente dépassé",
          description: "L'assistant vocal met trop de temps à répondre. Réessayez dans 30 secondes.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Assistant vocal temporairement indisponible",
          description: "Notre assistant vocal est en maintenance. Réessayez dans quelques minutes.",
          variant: "destructive",
        });
      }

      return null;
    }
  }
}
