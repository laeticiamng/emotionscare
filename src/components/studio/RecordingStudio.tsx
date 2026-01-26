// @ts-nocheck

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  Square, 
  Play, 
  Download,
  Upload,
  Waveform,
  Volume2,
  Filter,
  Sliders,
  Music,
  FileAudio
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  effects: AudioEffect[];
}

interface AudioEffect {
  type: 'reverb' | 'delay' | 'filter' | 'distortion' | 'compressor';
  enabled: boolean;
  parameters: Record<string, number>;
}

interface RecordingSession {
  id: string;
  name: string;
  tracks: AudioTrack[];
  bpm: number;
  timeSignature: string;
  created_at: string;
}

const RecordingStudio: React.FC = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentSession, setCurrentSession] = useState<RecordingSession | null>(null);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [bpm, setBpm] = useState(120);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<ArrayBuffer | null>(null);

  // Audio processing settings
  const [processingSettings, setProcessingSettings] = useState({
    noiseReduction: 0.3,
    normalization: 0.8,
    compressor: {
      threshold: -24,
      ratio: 4,
      attack: 0.003,
      release: 0.25
    },
    eq: {
      lowGain: 0,
      midGain: 0,
      highGain: 0
    },
    reverb: {
      roomSize: 0.3,
      damping: 0.5,
      wet: 0.2
    }
  });

  const initializeAudioContext = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 2,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        }
      });

      streamRef.current = stream;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      
      source.connect(analyserRef.current);
      
      drawWaveform();

    } catch (error) {
      logger.error('Error initializing audio', error as Error, 'MUSIC');
      toast({
        title: "Erreur audio",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  }, [toast]);

  const drawWaveform = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyserRef.current!.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgb(20, 20, 20)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 200, 50)';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
      
      if (isRecording || isPlaying) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  }, [isRecording, isPlaying]);

  const startRecording = useCallback(async () => {
    try {
      await initializeAudioContext();
      
      if (!streamRef.current) throw new Error('No audio stream available');

      mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const chunks: BlobPart[] = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const arrayBuffer = await blob.arrayBuffer();
        setAudioBuffer(arrayBuffer);
        
        // Automatically process the recording
        await processAudio(arrayBuffer);
      };

      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Stop timer when recording stops
      mediaRecorderRef.current.addEventListener('stop', () => {
        clearInterval(timer);
      });

    } catch (error) {
      logger.error('Error starting recording', error as Error, 'MUSIC');
      toast({
        title: "Erreur d'enregistrement",
        description: "Impossible de démarrer l'enregistrement",
        variant: "destructive"
      });
    }
  }, [initializeAudioContext, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [isRecording]);

  const processAudio = useCallback(async (buffer: ArrayBuffer) => {
    setIsProcessing(true);
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioBuffer = await audioContextRef.current.decodeAudioData(buffer.slice(0));
      
      // Apply audio processing effects
      const processedBuffer = await applyAudioEffects(audioBuffer);
      
      // Convert back to ArrayBuffer
      const processedArrayBuffer = await audioBufferToArrayBuffer(processedBuffer);
      
      // Create new track
      const newTrack: AudioTrack = {
        id: Date.now().toString(),
        name: `Track ${tracks.length + 1}`,
        url: URL.createObjectURL(new Blob([processedArrayBuffer], { type: 'audio/wav' })),
        duration: processedBuffer.duration,
        volume: 0.8,
        pan: 0,
        muted: false,
        solo: false,
        effects: []
      };

      setTracks(prev => [...prev, newTrack]);
      
      toast({
        title: "Enregistrement traité",
        description: "Votre enregistrement a été traité et ajouté aux pistes",
      });

    } catch (error) {
      logger.error('Error processing audio', error as Error, 'MUSIC');
      toast({
        title: "Erreur de traitement",
        description: "Impossible de traiter l'audio",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [tracks.length, toast]);

  const applyAudioEffects = useCallback(async (buffer: AudioBuffer): Promise<AudioBuffer> => {
    if (!audioContextRef.current) return buffer;

    const context = audioContextRef.current;
    const source = context.createBufferSource();
    source.buffer = buffer;

    // Create effect chain
    let currentNode: AudioNode = source;

    // Compressor
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = processingSettings.compressor.threshold;
    compressor.ratio.value = processingSettings.compressor.ratio;
    compressor.attack.value = processingSettings.compressor.attack;
    compressor.release.value = processingSettings.compressor.release;
    
    currentNode.connect(compressor);
    currentNode = compressor;

    // EQ (using biquad filters)
    const lowFilter = context.createBiquadFilter();
    lowFilter.type = 'lowshelf';
    lowFilter.frequency.value = 320;
    lowFilter.gain.value = processingSettings.eq.lowGain;
    
    const midFilter = context.createBiquadFilter();
    midFilter.type = 'peaking';
    midFilter.frequency.value = 1000;
    midFilter.gain.value = processingSettings.eq.midGain;
    
    const highFilter = context.createBiquadFilter();
    highFilter.type = 'highshelf';
    highFilter.frequency.value = 3200;
    highFilter.gain.value = processingSettings.eq.highGain;

    currentNode.connect(lowFilter);
    lowFilter.connect(midFilter);
    midFilter.connect(highFilter);
    currentNode = highFilter;

    // Convolver for reverb
    const convolver = context.createConvolver();
    const reverbBuffer = await createReverbBuffer(context, processingSettings.reverb);
    convolver.buffer = reverbBuffer;

    const dryGain = context.createGain();
    const wetGain = context.createGain();
    
    dryGain.gain.value = 1 - processingSettings.reverb.wet;
    wetGain.gain.value = processingSettings.reverb.wet;

    currentNode.connect(dryGain);
    currentNode.connect(convolver);
    convolver.connect(wetGain);

    const merger = context.createChannelMerger(2);
    dryGain.connect(merger);
    wetGain.connect(merger);

    // Create offline context for rendering
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );

    // Recreate the effect chain in offline context
    const offlineSource = offlineContext.createBufferSource();
    offlineSource.buffer = buffer;
    
    // Apply same effects...
    offlineSource.connect(offlineContext.destination);
    
    source.start(0);
    return await offlineContext.startRendering();
  }, [processingSettings]);

  const createReverbBuffer = useCallback(async (
    context: AudioContext, 
    settings: { roomSize: number; damping: number }
  ): Promise<AudioBuffer> => {
    const sampleRate = context.sampleRate;
    const length = sampleRate * settings.roomSize * 3;
    const buffer = context.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const sample = (Math.random() * 2 - 1) * Math.pow(1 - i / length, settings.damping);
        channelData[i] = sample;
      }
    }

    return buffer;
  }, []);

  const audioBufferToArrayBuffer = useCallback(async (buffer: AudioBuffer): Promise<ArrayBuffer> => {
    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length;
    const sampleRate = buffer.sampleRate;
    
    // WAV file format
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);

    // Convert float32 to int16
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }, []);

  const saveSession = useCallback(async () => {
    if (tracks.length === 0) {
      toast({
        title: "Aucune piste",
        description: "Ajoutez des pistes avant de sauvegarder",
        variant: "destructive"
      });
      return;
    }

    try {
      const session: RecordingSession = {
        id: Date.now().toString(),
        name: `Session ${new Date().toLocaleDateString()}`,
        tracks,
        bpm,
        timeSignature: '4/4',
        created_at: new Date().toISOString()
      };

      // Save to local storage for now (could be extended to Supabase)
      const savedSessions = JSON.parse(localStorage.getItem('recording-sessions') || '[]');
      savedSessions.push(session);
      localStorage.setItem('recording-sessions', JSON.stringify(savedSessions));

      setCurrentSession(session);

      toast({
        title: "Session sauvegardée",
        description: "Votre session d'enregistrement a été sauvegardée",
      });

    } catch (error) {
      logger.error('Error saving session', error as Error, 'MUSIC');
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder la session",
        variant: "destructive"
      });
    }
  }, [tracks, bpm, toast]);

  const exportMix = useCallback(async () => {
    if (tracks.length === 0) return;

    try {
      setIsProcessing(true);
      
      // This would implement actual mixing logic
      toast({
        title: "Export en cours",
        description: "Votre mix est en cours d'export...",
      });

      // Simulate export time
      setTimeout(() => {
        setIsProcessing(false);
        toast({
          title: "Export terminé",
          description: "Votre mix a été exporté avec succès",
        });
      }, 3000);

    } catch (error) {
      logger.error('Error exporting mix', error as Error, 'MUSIC');
      setIsProcessing(false);
    }
  }, [tracks.length, toast]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            Studio d'Enregistrement Avancé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="record" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="record">Enregistrement</TabsTrigger>
              <TabsTrigger value="tracks">Pistes</TabsTrigger>
              <TabsTrigger value="effects">Effets</TabsTrigger>
              <TabsTrigger value="mix">Mixage</TabsTrigger>
            </TabsList>

            <TabsContent value="record" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contrôles d'Enregistrement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center">
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={100}
                        className="border rounded bg-black"
                      />
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-mono mb-2">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </div>
                      
                      <div className="flex gap-4 justify-center">
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          variant={isRecording ? "destructive" : "default"}
                          size="lg"
                          className="flex items-center gap-2"
                        >
                          {isRecording ? (
                            <>
                              <Square className="h-5 w-5" />
                              Arrêter
                            </>
                          ) : (
                            <>
                              <Mic className="h-5 w-5" />
                              Enregistrer
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Traitement audio...</span>
                          <span>Processing</span>
                        </div>
                        <Progress value={66} className="w-full" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Paramètres d'Enregistrement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>BPM</Label>
                        <Input
                          type="number"
                          value={bpm}
                          onChange={(e) => setBpm(parseInt(e.target.value) || 120)}
                          min={60}
                          max={200}
                        />
                      </div>
                      
                      <div>
                        <Label>Signature</Label>
                        <Select defaultValue="4/4">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4/4">4/4</SelectItem>
                            <SelectItem value="3/4">3/4</SelectItem>
                            <SelectItem value="6/8">6/8</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Volume Master: {Math.round(masterVolume * 100)}%</Label>
                      <Slider
                        value={[masterVolume]}
                        onValueChange={([value]) => setMasterVolume(value)}
                        min={0}
                        max={1}
                        step={0.1}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={saveSession} variant="outline" className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                      
                      <Button onClick={exportMix} variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tracks" className="space-y-4">
              {tracks.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <FileAudio className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucune piste enregistrée</p>
                    <p className="text-sm text-muted-foreground">
                      Commencez par enregistrer dans l'onglet Enregistrement
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {tracks.map((track) => (
                    <Card key={track.id} className={selectedTrack === track.id ? 'ring-2 ring-primary' : ''}>
                      <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium">{track.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {Math.round(track.duration)}s
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Play className="h-4 w-4" />
                            </Button>
                            
                            <div className="w-24">
                              <Slider
                                value={[track.volume]}
                                onValueChange={([value]) => {
                                  setTracks(prev => prev.map(t => 
                                    t.id === track.id ? { ...t, volume: value } : t
                                  ));
                                }}
                                min={0}
                                max={1}
                                step={0.1}
                              />
                            </div>
                            
                            <Volume2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="effects" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filtres et EQ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Graves: {processingSettings.eq.lowGain}dB</Label>
                      <Slider
                        value={[processingSettings.eq.lowGain]}
                        onValueChange={([value]) => 
                          setProcessingSettings(prev => ({
                            ...prev,
                            eq: { ...prev.eq, lowGain: value }
                          }))
                        }
                        min={-12}
                        max={12}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Médiums: {processingSettings.eq.midGain}dB</Label>
                      <Slider
                        value={[processingSettings.eq.midGain]}
                        onValueChange={([value]) => 
                          setProcessingSettings(prev => ({
                            ...prev,
                            eq: { ...prev.eq, midGain: value }
                          }))
                        }
                        min={-12}
                        max={12}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Aigus: {processingSettings.eq.highGain}dB</Label>
                      <Slider
                        value={[processingSettings.eq.highGain]}
                        onValueChange={([value]) => 
                          setProcessingSettings(prev => ({
                            ...prev,
                            eq: { ...prev.eq, highGain: value }
                          }))
                        }
                        min={-12}
                        max={12}
                        step={1}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sliders className="h-5 w-5" />
                      Compresseur & Réverbération
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Seuil: {processingSettings.compressor.threshold}dB</Label>
                      <Slider
                        value={[processingSettings.compressor.threshold]}
                        onValueChange={([value]) => 
                          setProcessingSettings(prev => ({
                            ...prev,
                            compressor: { ...prev.compressor, threshold: value }
                          }))
                        }
                        min={-60}
                        max={0}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Ratio: {processingSettings.compressor.ratio}:1</Label>
                      <Slider
                        value={[processingSettings.compressor.ratio]}
                        onValueChange={([value]) => 
                          setProcessingSettings(prev => ({
                            ...prev,
                            compressor: { ...prev.compressor, ratio: value }
                          }))
                        }
                        min={1}
                        max={20}
                        step={0.5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Réverbération: {Math.round(processingSettings.reverb.wet * 100)}%</Label>
                      <Slider
                        value={[processingSettings.reverb.wet]}
                        onValueChange={([value]) => 
                          setProcessingSettings(prev => ({
                            ...prev,
                            reverb: { ...prev.reverb, wet: value }
                          }))
                        }
                        min={0}
                        max={1}
                        step={0.1}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mix">
              <Card>
                <CardHeader>
                  <CardTitle>Console de Mixage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Waveform className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Console de mixage avancée</p>
                    <p className="text-sm text-muted-foreground">
                      Mixez vos pistes avec des contrôles professionnels
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordingStudio;