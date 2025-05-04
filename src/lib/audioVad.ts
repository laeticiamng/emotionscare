
// Voice Activity Detection utility for real-time audio processing

// Interface for VAD callbacks
export interface VADCallbacks {
  onSpeechStart: () => void;
  onSpeechEnd: (audioChunks: Array<Uint8Array>) => Promise<void> | void;
  onAudioProcess?: (audioChunk: Uint8Array) => void;
}

// Simple energy-based VAD implementation
export class SimpleVAD {
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  
  private audioChunks: Uint8Array[] = [];
  private isSpeaking: boolean = false;
  private silenceCounter: number = 0;
  private readonly SILENCE_THRESHOLD = 0.01;
  private readonly SILENCE_DURATION = 15; // frames of silence before considered done
  
  constructor(private callbacks: VADCallbacks) {}
  
  async initialize() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      this.audioContext = new AudioContext();
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      
      // Using ScriptProcessor (deprecated but widely supported)
      // In production, consider using AudioWorklet for better performance
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = this.handleAudioProcess.bind(this);
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      console.log('Voice Activity Detection initialized');
      return {
        audioContext: this.audioContext,
        stream: this.stream,
        processor: this.processor
      };
    } catch (error) {
      console.error('Error initializing VAD:', error);
      throw error;
    }
  }
  
  private handleAudioProcess(event: AudioProcessingEvent) {
    const input = event.inputBuffer.getChannelData(0);
    const audioChunk = new Uint8Array(input.length * 2);
    
    // Convert Float32Array to Int16Array (PCM format)
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      const value = s < 0 ? s * 0x8000 : s * 0x7FFF;
      const index = i * 2;
      audioChunk[index] = value & 0xFF;
      audioChunk[index + 1] = (value >> 8) & 0xFF;
    }
    
    // Store the audio chunk
    this.audioChunks.push(audioChunk);
    
    // Call optional audio processing callback
    if (this.callbacks.onAudioProcess) {
      this.callbacks.onAudioProcess(audioChunk);
    }
    
    // Simple energy detection
    let energy = 0;
    for (let i = 0; i < input.length; i++) {
      energy += Math.abs(input[i]);
    }
    energy /= input.length;
    
    // Speech detection logic
    if (energy > this.SILENCE_THRESHOLD) {
      this.silenceCounter = 0;
      
      if (!this.isSpeaking) {
        this.isSpeaking = true;
        this.audioChunks = [audioChunk]; // Start with fresh buffer
        this.callbacks.onSpeechStart();
        console.log('Speech started, energy:', energy);
      }
    } else if (this.isSpeaking) {
      this.silenceCounter++;
      
      if (this.silenceCounter > this.SILENCE_DURATION) {
        this.isSpeaking = false;
        console.log('Speech ended, processing audio chunks:', this.audioChunks.length);
        this.callbacks.onSpeechEnd([...this.audioChunks]);
        this.audioChunks = [];
      }
    }
  }
  
  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    console.log('VAD stopped');
  }
}

// Helper function to initialize the VAD system
export async function initVad(
  onSpeechStart: () => void,
  onSpeechEnd: (audioChunks: Array<Uint8Array>) => Promise<void> | void,
  onAudioProcess?: (audioChunk: Uint8Array) => void
) {
  const vad = new SimpleVAD({
    onSpeechStart,
    onSpeechEnd,
    onAudioProcess
  });
  
  return await vad.initialize();
}
