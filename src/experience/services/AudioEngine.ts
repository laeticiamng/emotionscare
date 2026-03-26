/**
 * Experience Layer — AudioEngine
 * Web Audio API-based ambient audio and feedback sound manager.
 * Lazy-loads audio files. Crossfades between tracks. Opt-in only.
 */

type AmbientTrack = 'morning-calm' | 'afternoon-focus' | 'evening-wind-down' | 'night-rest' | 'breathing-sync';
type FeedbackSound = 'unlock' | 'level-up' | 'badge-reveal' | 'transition' | 'pulse' | 'insight' | 'streak' | 'error';

interface AudioEngineState {
  enabled: boolean;
  masterVolume: number;
  currentTrack: AmbientTrack | null;
}

/**
 * Singleton audio engine.
 * Uses Web Audio API for precise control, crossfading, and low latency.
 */
class AudioEngineService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private feedbackGain: GainNode | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private bufferCache = new Map<string, AudioBuffer>();
  private state: AudioEngineState = {
    enabled: false,
    masterVolume: 0.5,
    currentTrack: null,
  };

  private getContext(): AudioContext | null {
    if (this.ctx) return this.ctx;
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.state.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0.3;
      this.ambientGain.connect(this.masterGain);

      this.feedbackGain = this.ctx.createGain();
      this.feedbackGain.gain.value = 0.6;
      this.feedbackGain.connect(this.masterGain);

      return this.ctx;
    } catch {
      return null;
    }
  }

  enable() {
    this.state.enabled = true;
    const ctx = this.getContext();
    if (ctx?.state === 'suspended') {
      ctx.resume();
    }
  }

  disable() {
    this.state.enabled = false;
    this.stopAmbient();
  }

  setMasterVolume(volume: number) {
    this.state.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.state.masterVolume, this.ctx!.currentTime, 0.1);
    }
  }

  /**
   * Generate a simple tone as a feedback sound.
   * In production, these would be replaced by actual audio file fetches.
   */
  playFeedback(sound: FeedbackSound) {
    if (!this.state.enabled) return;
    const ctx = this.getContext();
    if (!ctx || !this.feedbackGain) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    const configs: Record<FeedbackSound, { freq: number; type: OscillatorType; duration: number; attack: number }> = {
      'unlock': { freq: 523.25, type: 'sine', duration: 0.4, attack: 0.02 },
      'level-up': { freq: 659.25, type: 'sine', duration: 0.6, attack: 0.02 },
      'badge-reveal': { freq: 440, type: 'sine', duration: 0.5, attack: 0.05 },
      'transition': { freq: 330, type: 'sine', duration: 0.2, attack: 0.01 },
      'pulse': { freq: 392, type: 'sine', duration: 0.15, attack: 0.01 },
      'insight': { freq: 587.33, type: 'sine', duration: 0.5, attack: 0.05 },
      'streak': { freq: 493.88, type: 'sine', duration: 0.3, attack: 0.02 },
      'error': { freq: 220, type: 'triangle', duration: 0.3, attack: 0.01 },
    };

    const config = configs[sound];
    const now = ctx.currentTime;

    oscillator.type = config.type;
    oscillator.frequency.value = config.freq;

    // For level-up and unlock: add a second tone for richness
    if (sound === 'level-up' || sound === 'unlock') {
      oscillator.frequency.setValueAtTime(config.freq * 0.75, now);
      oscillator.frequency.linearRampToValueAtTime(config.freq, now + config.duration * 0.3);
    }

    // Envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + config.attack);
    gain.gain.exponentialRampToValueAtTime(0.001, now + config.duration);

    oscillator.connect(gain);
    gain.connect(this.feedbackGain);
    oscillator.start(now);
    oscillator.stop(now + config.duration);
  }

  /**
   * Crossfade to a new ambient track.
   * Currently generates simple ambient tones. Replace with audio file loading in production.
   */
  async setAmbientTrack(track: AmbientTrack, crossfadeDuration = 1.2) {
    if (!this.state.enabled) {
      this.state.currentTrack = track;
      return;
    }

    const ctx = this.getContext();
    if (!ctx || !this.ambientGain) return;

    // Fade out current
    if (this.currentSource) {
      try {
        this.ambientGain.gain.setTargetAtTime(0, ctx.currentTime, crossfadeDuration / 3);
        setTimeout(() => {
          try {
            this.currentSource?.stop();
          } catch {
            // Already stopped
          }
        }, crossfadeDuration * 1000);
      } catch {
        // Ignore
      }
    }

    this.state.currentTrack = track;

    // Generate ambient tone (placeholder for real audio files)
    const freqMap: Record<AmbientTrack, number> = {
      'morning-calm': 174.61,
      'afternoon-focus': 261.63,
      'evening-wind-down': 196,
      'night-rest': 130.81,
      'breathing-sync': 220,
    };

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freqMap[track];

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    filter.Q.value = 0.5;

    osc.connect(filter);
    filter.connect(this.ambientGain);

    // Fade in
    this.ambientGain.gain.setTargetAtTime(0.15, ctx.currentTime + crossfadeDuration / 2, crossfadeDuration / 3);

    osc.start();
    this.currentSource = osc as any;
  }

  stopAmbient() {
    if (this.currentSource) {
      try {
        if (this.ambientGain && this.ctx) {
          this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
        }
        setTimeout(() => {
          try {
            this.currentSource?.stop();
            this.currentSource = null;
          } catch {
            // Already stopped
          }
        }, 500);
      } catch {
        this.currentSource = null;
      }
    }
    this.state.currentTrack = null;
  }

  /**
   * Suspend audio when tab is hidden, resume when visible.
   */
  handleVisibilityChange(visible: boolean) {
    if (!this.ctx) return;
    if (visible && this.state.enabled) {
      this.ctx.resume();
    } else {
      this.ctx.suspend();
    }
  }

  getState(): AudioEngineState {
    return { ...this.state };
  }

  dispose() {
    this.stopAmbient();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.masterGain = null;
    this.ambientGain = null;
    this.feedbackGain = null;
    this.bufferCache.clear();
  }
}

// Singleton
export const audioEngine = new AudioEngineService();
