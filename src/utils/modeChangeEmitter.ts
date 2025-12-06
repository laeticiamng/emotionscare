
/**
 * Utility to emit mode change events
 * This helps components react to mode changes without direct coupling
 */

type ModeChangeListener = (mode: string) => void;

class ModeChangeEmitter {
  private listeners: ModeChangeListener[] = [];
  
  subscribe(listener: ModeChangeListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  emit(mode: string) {
    this.listeners.forEach(listener => listener(mode));
  }
}

export const modeChangeEmitter = new ModeChangeEmitter();
