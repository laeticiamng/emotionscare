// Centralized global type definitions

// Extend the Window interface
interface Window {
  __APP_DEBUG__: boolean;
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

// SpeechRecognition interface declarations
interface SpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: () => void;
  onend: () => void;
  onerror: (event: { error: string }) => void;
  onresult: (event: {
    results: {
      [key: number]: {
        [key: number]: {
          transcript: string;
          confidence: number;
        };
        isFinal: boolean;
        length: number;
      };
      length: number;
    };
  }) => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

// Extend Array prototype with findLast
interface Array<T> {
  findLast(predicate: (value: T, index: number, obj: T[]) => unknown): T | undefined;
}

export {};
