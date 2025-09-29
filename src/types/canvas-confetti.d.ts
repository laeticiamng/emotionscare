declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    [key: string]: any;
  }
  
  function confetti(options?: ConfettiOptions): Promise<void>;
  export = confetti;
}