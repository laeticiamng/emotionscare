
import { toast } from '@/hooks/use-toast';

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface RecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onResult?: (result: SpeechRecognitionResult) => void;
}

// Define a constructor interface for SpeechRecognition
interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

// Define the SpeechRecognition interface
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onerror: (event: ErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

// Define the SpeechRecognitionEvent interface
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

// Define the SpeechRecognitionResultList interface
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
  item(index: number): SpeechRecognitionResult;
}

// Add the missing definitions to the Window interface
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;
  
  constructor() {
    this.isSupported = this.checkBrowserSupport();
    
    if (!this.isSupported) {
      console.warn('Speech recognition is not supported in this browser');
    }
  }
  
  private checkBrowserSupport(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
  
  public initialize(options: RecognitionOptions = {}): boolean {
    if (!this.isSupported) return false;
    
    try {
      // Create recognition instance
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionConstructor) {
        return false;
      }
      
      this.recognition = new SpeechRecognitionConstructor();
      
      // Configure recognition
      this.recognition.lang = options.lang || 'fr-FR';
      this.recognition.continuous = options.continuous !== undefined ? options.continuous : true;
      this.recognition.interimResults = options.interimResults !== undefined ? options.interimResults : true;
      
      // Set up event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        if (options.onStart) options.onStart();
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        if (options.onEnd) options.onEnd();
      };
      
      this.recognition.onerror = (event: ErrorEvent) => {
        if (options.onError) options.onError(event.error);
      };
      
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (options.onResult && event.results) {
          const lastResultIndex = event.resultIndex || 0;
          
          // Safely check if event.results has the expected structure
          if (event.results[lastResultIndex]) {
            const currentResult = event.results[lastResultIndex];
            const firstAlternative = currentResult[0];
            
            if (firstAlternative) {
              const transcript = firstAlternative.transcript;
              const confidence = firstAlternative.confidence;
              const isFinal = !!currentResult.isFinal;
              
              options.onResult({
                transcript,
                confidence,
                isFinal
              });
            }
          }
        }
      };
      
      return true;
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      return false;
    }
  }
  
  public start(): boolean {
    if (!this.recognition || !this.isSupported) {
      return false;
    }
    
    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de démarrer la reconnaissance vocale',
        variant: 'destructive',
      });
      return false;
    }
  }
  
  public stop(): boolean {
    if (!this.recognition || !this.isSupported || !this.isListening) {
      return false;
    }
    
    try {
      this.recognition.stop();
      return true;
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      return false;
    }
  }
  
  public abort(): boolean {
    if (!this.recognition || !this.isSupported) {
      return false;
    }
    
    try {
      this.recognition.abort();
      return true;
    } catch (error) {
      console.error('Error aborting speech recognition:', error);
      return false;
    }
  }
  
  public isRecognitionSupported(): boolean {
    return this.isSupported;
  }
  
  public isCurrentlyListening(): boolean {
    return this.isListening;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
