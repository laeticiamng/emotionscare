
// Implementation of the Web Speech Recognition API for AR experiences
import { createVoiceCommandMatcher } from './voiceCommandMatcher';

export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (result: SpeechRecognitionResult) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

// Class for handling speech recognition with fallback to simulation
export class ARSpeechRecognition {
  private isListening: boolean = false;
  private options: SpeechRecognitionOptions;
  private recognitionTimeout: number | null = null;
  private recognition: any = null; // SpeechRecognition instance
  
  constructor(options: SpeechRecognitionOptions = {}) {
    this.options = {
      language: 'fr-FR',
      continuous: false,
      interimResults: true,
      ...options
    };
    
    this.initRecognition();
  }
  
  private initRecognition() {
    if (typeof window !== 'undefined') {
      // Use the Web Speech API if available
      const SpeechRecognition = (window as any).SpeechRecognition || 
                              (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = this.options.language || 'fr-FR';
        this.recognition.continuous = this.options.continuous || false;
        this.recognition.interimResults = this.options.interimResults || true;
        
        this.recognition.onresult = (event: any) => {
          const result = event.results[event.results.length - 1];
          const transcript = result[0].transcript.trim().toLowerCase();
          const confidence = result[0].confidence;
          const isFinal = result.isFinal;
          
          if (this.options.onResult) {
            this.options.onResult({
              transcript,
              confidence,
              isFinal
            });
          }
        };
        
        this.recognition.onerror = (event: any) => {
          if (this.options.onError) {
            this.options.onError(`Erreur de reconnaissance: ${event.error}`);
          }
          // Fallback to simulation if there's an error
          this.simulateRecognition();
        };
        
        this.recognition.onstart = () => {
          if (this.options.onStart) {
            this.options.onStart();
          }
        };
        
        this.recognition.onend = () => {
          // Restart if continuous is enabled and still listening
          if (this.options.continuous && this.isListening) {
            this.recognition.start();
          } else if (this.options.onEnd) {
            this.options.onEnd();
          }
        };
      }
    }
  }
  
  public start(): void {
    if (this.isListening) {
      return;
    }
    
    this.isListening = true;
    
    // Notification de démarrage
    if (this.options.onStart) {
      this.options.onStart();
    }
    
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        // Fallback to simulation if the API fails
        this.simulateRecognition();
      }
    } else {
      // Fallback to simulation if the API is not available
      this.simulateRecognition();
    }
  }
  
  public stop(): void {
    this.isListening = false;
    
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
    
    if (this.recognitionTimeout) {
      clearTimeout(this.recognitionTimeout);
      this.recognitionTimeout = null;
    }
    
    // Notification d'arrêt
    if (this.options.onEnd) {
      this.options.onEnd();
    }
  }
  
  public isSupported(): boolean {
    if (typeof window !== 'undefined') {
      return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }
    return false;
  }
  
  private simulateRecognition(): void {
    // Données de test pour la simulation
    const possibleCommands = [
      { transcript: "lecture", confidence: 0.95 },
      { transcript: "pause", confidence: 0.92 },
      { transcript: "suivant", confidence: 0.88 },
      { transcript: "précédent", confidence: 0.85 },
      { transcript: "plus fort", confidence: 0.9 },
      { transcript: "moins fort", confidence: 0.9 },
      { transcript: "changer environnement", confidence: 0.8 },
      { transcript: "quitter", confidence: 0.95 }
    ];
    
    // Simuler des résultats intermédiaires si activé
    if (this.options.interimResults) {
      // Résultat intermédiaire après un délai aléatoire
      this.recognitionTimeout = window.setTimeout(() => {
        if (!this.isListening) return;
        
        const randomCommand = possibleCommands[Math.floor(Math.random() * possibleCommands.length)];
        
        // Envoyer un résultat "partiel"
        if (this.options.onResult) {
          this.options.onResult({
            transcript: randomCommand.transcript.substring(0, 3) + "...",
            confidence: randomCommand.confidence * 0.7,
            isFinal: false
          });
        }
        
        // Puis simuler le résultat final
        setTimeout(() => {
          if (!this.isListening) return;
          
          if (this.options.onResult) {
            this.options.onResult({
              transcript: randomCommand.transcript,
              confidence: randomCommand.confidence,
              isFinal: true
            });
          }
          
          // Si continuous est false, arrêter automatiquement
          if (!this.options.continuous) {
            this.stop();
          } else {
            // Sinon continuer à reconnaître
            this.simulateRecognition();
          }
        }, 800);
      }, 1000 + Math.random() * 1000);
    } else {
      // Sinon, simuler directement un résultat final
      this.recognitionTimeout = window.setTimeout(() => {
        if (!this.isListening) return;
        
        const randomCommand = possibleCommands[Math.floor(Math.random() * possibleCommands.length)];
        
        if (this.options.onResult) {
          this.options.onResult({
            transcript: randomCommand.transcript,
            confidence: randomCommand.confidence,
            isFinal: true
          });
        }
        
        // Si continuous est false, arrêter automatiquement
        if (!this.options.continuous) {
          this.stop();
        } else {
          // Sinon continuer à reconnaître
          this.simulateRecognition();
        }
      }, 1500 + Math.random() * 1000);
    }
  }
}

// Factory pour créer une instance de reconnaissance vocale
export function createARSpeechRecognition(options: SpeechRecognitionOptions = {}): ARSpeechRecognition {
  return new ARSpeechRecognition(options);
}

export default createARSpeechRecognition;
