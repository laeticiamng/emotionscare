import { useState, useEffect, useRef, useCallback } from 'react';

export interface RealtimeChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface RealtimeChatState {
  messages: RealtimeChatMessage[];
  isConnected: boolean;
  isRecording: boolean;
  isSpeaking: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

// Audio Recorder Class
export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      console.log('🎤 Starting audio recording...');
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      console.log('✅ Audio recording started successfully');
    } catch (error) {
      console.error('❌ Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    console.log('🛑 Stopping audio recording...');
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
  }
}

// Audio encoding function
export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

// Audio Queue for sequential playback
class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;

    try {
      const wavData = this.createWavFromPCM(audioData);
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => this.playNext();
      source.start(0);
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      this.playNext(); // Continue with next segment even if current fails
    }
  }

  private createWavFromPCM(pcmData: Uint8Array): Uint8Array {
    // Convert bytes to 16-bit samples
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
    }
    
    // Create WAV header
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    // WAV header parameters
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + int16Data.byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, int16Data.byteLength, true);

    // Combine header and data
    const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wavArray.set(new Uint8Array(wavHeader), 0);
    wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
    
    return wavArray;
  }
}

export const useRealtimeChat = () => {
  const [state, setState] = useState<RealtimeChatState>({
    messages: [],
    isConnected: false,
    isRecording: false,
    isSpeaking: false,
    connectionStatus: 'disconnected'
  });

  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const currentTranscriptRef = useRef<string>('');

  // Initialize audio context and queue
  const initializeAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      audioQueueRef.current = new AudioQueue(audioContextRef.current);
      console.log('🔊 Audio context initialized');
    }
  }, []);

  // Connect to realtime chat
  const connect = useCallback(async () => {
    if (state.connectionStatus === 'connected') return;

    try {
      setState(prev => ({ ...prev, connectionStatus: 'connecting' }));
      await initializeAudio();

      console.log('🔗 Connecting to realtime chat...');
      const wsUrl = 'wss://yaincoxihiqdksxgrsrk.functions.supabase.co/functions/v1/openai-realtime';
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setState(prev => ({ 
          ...prev, 
          isConnected: true, 
          connectionStatus: 'connected' 
        }));
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('📥 Received:', data.type, data);

        switch (data.type) {
          case 'response.audio.delta':
            // Play audio chunk
            if (audioQueueRef.current && data.delta) {
              const binaryString = atob(data.delta);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              await audioQueueRef.current.addToQueue(bytes);
              setState(prev => ({ ...prev, isSpeaking: true }));
            }
            break;

          case 'response.audio.done':
            setState(prev => ({ ...prev, isSpeaking: false }));
            break;

          case 'response.audio_transcript.delta':
            if (data.delta) {
              currentTranscriptRef.current += data.delta;
            }
            break;

          case 'response.audio_transcript.done':
            if (currentTranscriptRef.current) {
              const newMessage: RealtimeChatMessage = {
                id: Date.now().toString(),
                type: 'assistant',
                content: currentTranscriptRef.current,
                timestamp: new Date()
              };
              setState(prev => ({ 
                ...prev, 
                messages: [...prev.messages, newMessage] 
              }));
              currentTranscriptRef.current = '';
            }
            break;

          case 'input_audio_buffer.speech_started':
            setState(prev => ({ ...prev, isRecording: true }));
            break;

          case 'input_audio_buffer.speech_stopped':
            setState(prev => ({ ...prev, isRecording: false }));
            break;

          case 'response.function_call_arguments.done':
            console.log('🛠️ Function call:', data.arguments);
            // Handle function calls here
            break;
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setState(prev => ({ 
          ...prev, 
          connectionStatus: 'error',
          isConnected: false 
        }));
      };

      wsRef.current.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setState(prev => ({ 
          ...prev, 
          isConnected: false,
          connectionStatus: 'disconnected',
          isRecording: false,
          isSpeaking: false
        }));
      };

    } catch (error) {
      console.error('❌ Connection error:', error);
      setState(prev => ({ ...prev, connectionStatus: 'error' }));
    }
  }, [state.connectionStatus, initializeAudio]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (!wsRef.current || !state.isConnected) return;

    try {
      recorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });

      await recorderRef.current.start();
      setState(prev => ({ ...prev, isRecording: true }));
    } catch (error) {
      console.error('❌ Error starting recording:', error);
    }
  }, [state.isConnected]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
      setState(prev => ({ ...prev, isRecording: false }));
    }
  }, []);

  // Send text message
  const sendTextMessage = useCallback((text: string) => {
    if (!wsRef.current || !state.isConnected) return;

    const userMessage: RealtimeChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setState(prev => ({ 
      ...prev, 
      messages: [...prev.messages, userMessage] 
    }));

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }]
      }
    };

    wsRef.current.send(JSON.stringify(event));
    wsRef.current.send(JSON.stringify({ type: 'response.create' }));
  }, [state.isConnected]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setState({
      messages: [],
      isConnected: false,
      isRecording: false,
      isSpeaking: false,
      connectionStatus: 'disconnected'
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    sendTextMessage
  };
};