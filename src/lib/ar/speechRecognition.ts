
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

export class SpeechRecognitionService {
  private recognition: any = null;
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
      
      this.recognition.onerror = (event: any) => {
        if (options.onError) options.onError(event.error);
      };
      
      this.recognition.onresult = (event: any) => {
        if (options.onResult && event.results && event.results.length > 0) {
          const lastResultIndex = event.resultIndex || 0;
          const lastResult = event.results[lastResultIndex];
          
          if (lastResult && lastResult[0]) {
            const transcript = lastResult[0].transcript;
            const confidence = lastResult[0].confidence;
            const isFinal = lastResult.isFinal !== undefined ? lastResult.isFinal : true;
            
            options.onResult({
              transcript,
              confidence,
              isFinal
            });
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
