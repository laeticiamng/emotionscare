
// Modèle simplifié pour simuler la reconnaissance vocale en AR
// Dans une implémentation réelle, nous utiliserions l'API Web Speech

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

// Classe simulant l'API SpeechRecognition
export class ARSpeechRecognition {
  private isListening: boolean = false;
  private options: SpeechRecognitionOptions;
  private recognitionTimeout: NodeJS.Timeout | null = null;
  
  constructor(options: SpeechRecognitionOptions = {}) {
    this.options = {
      language: 'fr-FR',
      continuous: false,
      interimResults: true,
      ...options
    };
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
    
    // Simulation de résultats de reconnaissance
    this.simulateRecognition();
  }
  
  public stop(): void {
    this.isListening = false;
    
    if (this.recognitionTimeout) {
      clearTimeout(this.recognitionTimeout);
    }
    
    // Notification d'arrêt
    if (this.options.onEnd) {
      this.options.onEnd();
    }
  }
  
  public isSupported(): boolean {
    // Vérification réelle de support dans un navigateur
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
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
      this.recognitionTimeout = setTimeout(() => {
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
      this.recognitionTimeout = setTimeout(() => {
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
