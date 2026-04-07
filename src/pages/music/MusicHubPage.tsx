// @ts-nocheck
/**
 * MusicHubPage - Hub unifié de musique
 * Consolide : music-therapy, adaptive-music, mood-mixer, audio-studio
 * 3 onglets : Bibliothèque, Mixer, Journal Vocal
 */
import React, { useState, lazy, Suspense } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  ArrowLeft, Music, Palette, Mic, Play, Pause, SkipForward,
  Volume2, Heart, Clock, Disc3, Sparkles, Waves, ListMusic,
} from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';

type MusicTab = 'bibliotheque' | 'mixer' | 'vocal';

// ── Bibliothèque Tab ────────────────────────────────────────────
const PLAYLISTS = [
  { id: '1', name: 'Apaisement', emoji: '🌿', tracks: 8, duration: '32 min', mood: 'calme' },
  { id: '2', name: 'Énergie positive', emoji: '☀️', tracks: 10, duration: '41 min', mood: 'energique' },
  { id: '3', name: 'Focus profond', emoji: '🎯', tracks: 6, duration: '28 min', mood: 'concentration' },
  { id: '4', name: 'Guérison sonore', emoji: '💜', tracks: 5, duration: '25 min', mood: 'therapeutique' },
  { id: '5', name: 'Sommeil', emoji: '🌙', tracks: 7, duration: '45 min', mood: 'nuit' },
  { id: '6', name: 'Méditation', emoji: '🧘', tracks: 6, duration: '30 min', mood: 'meditation' },
];

const TRACKS = [
  { id: '1', title: 'Fréquence 432 Hz', artist: 'EmotionsCare', duration: '4:12', isPlaying: false, audioSrc: 'https://cdn.pixabay.com/audio/2024/11/28/audio_3a2f2b2c3d.mp3' },
  { id: '2', title: 'Pluie sur les feuilles', artist: 'Nature Sounds', duration: '5:30', isPlaying: false, audioSrc: 'https://cdn.pixabay.com/audio/2022/05/16/audio_460b6c2cf6.mp3' },
  { id: '3', title: 'Ondes theta', artist: 'Brainwave Lab', duration: '6:00', isPlaying: false, audioSrc: 'https://cdn.pixabay.com/audio/2024/09/10/audio_6e8453e98c.mp3' },
  { id: '4', title: 'Guitare apaisante', artist: 'Acoustic Therapy', duration: '3:45', isPlaying: false, audioSrc: 'https://cdn.pixabay.com/audio/2023/10/07/audio_b6485ef048.mp3' },
  { id: '5', title: 'Bol tibétain', artist: 'EmotionsCare', duration: '8:20', isPlaying: false, audioSrc: 'https://cdn.pixabay.com/audio/2024/04/17/audio_2b6e2469c0.mp3' },
];

// ── Mixer Tab ───────────────────────────────────────────────────
const MIXER_LAYERS = [
  { id: 'nature', name: 'Nature', emoji: '🌿', color: 'bg-emerald-500' },
  { id: 'water', name: 'Eau', emoji: '💧', color: 'bg-sky-500' },
  { id: 'melody', name: 'Mélodie', emoji: '🎵', color: 'bg-violet-500' },
  { id: 'bass', name: 'Basses', emoji: '🎸', color: 'bg-amber-500' },
  { id: 'binaural', name: 'Binaural', emoji: '🧠', color: 'bg-rose-500' },
  { id: 'voice', name: 'Voix', emoji: '🗣️', color: 'bg-indigo-500' },
];

export default function MusicHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as MusicTab) || 'bibliotheque';
  const [activeTab, setActiveTab] = useState<MusicTab>(initialTab);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [mixerValues, setMixerValues] = useState<Record<string, number>>({
    nature: 50, water: 30, melody: 70, bass: 20, binaural: 40, voice: 0,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const [recordings, setRecordings] = useState<Array<{ date: string; duration: string; mood: string; url: string }>>([]);

  // Audio player
  const playTrack = (trackId: string) => {
    const track = TRACKS.find(t => t.id === trackId);
    if (!track) return;
    if (currentTrack === trackId && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(track.audioSrc);
    audio.play().catch(() => {});
    audio.onended = () => { setIsPlaying(false); setCurrentTrack(null); };
    audioRef.current = audio;
    setCurrentTrack(trackId);
    setIsPlaying(true);
  };

  // Voice recording with MediaRecorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true } });
      const recorder = new MediaRecorder(stream, { audioBitsPerSecond: 128000 });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordings(prev => [{ date: new Date().toLocaleString('fr-FR'), duration: formatTime(recordingTime), mood: '😊', url }, ...prev]);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);
    } catch {
      // Microphone access denied
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.requestData();
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
  };

  usePageSEO({
    title: 'Musicothérapie - EmotionsCare',
    description: 'Hub musical thérapeutique : bibliothèque de playlists, mixer d\'ambiances et journal vocal.',
    keywords: 'musicothérapie, relaxation, fréquences, méditation, soignants',
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as MusicTab);
    setSearchParams({ tab });
  };

  // Recording timer
  React.useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/app/home">
            <Button variant="ghost" size="icon" aria-label="Retour">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Musicothérapie</h1>
            <p className="text-sm text-muted-foreground">
              Playlists · Mixer · Journal Vocal
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bibliotheque" className="gap-2">
              <ListMusic className="h-4 w-4" /> Bibliothèque
            </TabsTrigger>
            <TabsTrigger value="mixer" className="gap-2">
              <Palette className="h-4 w-4" /> Mixer
            </TabsTrigger>
            <TabsTrigger value="vocal" className="gap-2">
              <Mic className="h-4 w-4" /> Journal Vocal
            </TabsTrigger>
          </TabsList>

          {/* ── Bibliothèque ──────────────────────────────────── */}
          <TabsContent value="bibliotheque" className="mt-6 space-y-6">
            <h2 className="text-lg font-semibold">Playlists thérapeutiques</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PLAYLISTS.map(pl => (
                <Card key={pl.id} className="cursor-pointer hover:border-primary/50 transition-colors group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{pl.emoji}</span>
                      <div>
                        <CardTitle className="text-base">{pl.name}</CardTitle>
                        <CardDescription>{pl.tracks} titres · {pl.duration}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-4 w-4" /> Écouter
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-lg font-semibold">Titres populaires</h2>
            <div className="space-y-2">
              {TRACKS.map(track => (
                <Card key={track.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="py-3 flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => playTrack(track.id)}
                      aria-label={currentTrack === track.id && isPlaying ? `Pause ${track.title}` : `Écouter ${track.title}`}
                    >
                      {currentTrack === track.id && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground">{track.artist}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{track.duration}</span>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Mixer ─────────────────────────────────────────── */}
          <TabsContent value="mixer" className="mt-6 space-y-6">
            <div className="text-center space-y-2">
              <Palette className="h-10 w-10 text-violet-500 mx-auto" />
              <h2 className="text-lg font-semibold">Mood Mixer</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Créez votre ambiance sonore personnalisée en ajustant les couches audio.
              </p>
            </div>

            <div className="space-y-4 max-w-lg mx-auto">
              {MIXER_LAYERS.map(layer => (
                <div key={layer.id} className="flex items-center gap-4">
                  <span className="text-xl w-8 text-center">{layer.emoji}</span>
                  <span className="text-sm font-medium w-20">{layer.name}</span>
                  <Slider
                    value={[mixerValues[layer.id]]}
                    onValueChange={([val]) => setMixerValues(prev => ({ ...prev, [layer.id]: val }))}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8 text-right">{mixerValues[layer.id]}%</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setMixerValues({
                nature: 50, water: 30, melody: 70, bass: 20, binaural: 40, voice: 0,
              })}>
                Réinitialiser
              </Button>
              <Button className="gap-2">
                <Play className="h-4 w-4" /> Écouter le mix
              </Button>
            </div>

            {/* Presets */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Préréglages rapides</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Zen', values: { nature: 80, water: 60, melody: 30, bass: 0, binaural: 50, voice: 0 } },
                  { name: 'Focus', values: { nature: 20, water: 10, melody: 40, bass: 10, binaural: 80, voice: 0 } },
                  { name: 'Énergie', values: { nature: 30, water: 20, melody: 90, bass: 70, binaural: 20, voice: 0 } },
                  { name: 'Sommeil', values: { nature: 60, water: 70, melody: 20, bass: 0, binaural: 60, voice: 0 } },
                ].map(preset => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => setMixerValues(preset.values)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ── Journal Vocal ─────────────────────────────────── */}
          <TabsContent value="vocal" className="mt-6 space-y-6">
            <div className="text-center space-y-2">
              <Mic className="h-10 w-10 text-rose-500 mx-auto" />
              <h2 className="text-lg font-semibold">Journal Vocal</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Enregistrez vos pensées et émotions à la voix. Transcription automatique disponible.
              </p>
            </div>

            {/* Record button */}
            <div className="flex flex-col items-center gap-4">
              <button
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/30'
                    : 'bg-primary hover:bg-primary/90 shadow-lg'
                }`}
                onClick={() => isRecording ? stopRecording() : startRecording()}
                aria-label={isRecording ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement'}
              >
                {isRecording ? (
                  <Pause className="h-10 w-10 text-white" />
                ) : (
                  <Mic className="h-10 w-10 text-primary-foreground" />
                )}
              </button>
              {isRecording && (
                <div className="text-center">
                  <p className="text-2xl font-mono text-red-500">{formatTime(recordingTime)}</p>
                  <p className="text-xs text-muted-foreground">Enregistrement en cours...</p>
                </div>
              )}
              {!isRecording && (
                <p className="text-sm text-muted-foreground">Appuyez pour enregistrer</p>
              )}
            </div>

            {/* Previous recordings */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Enregistrements récents</h3>
              {recordings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Aucun enregistrement. Appuyez sur le micro pour commencer.</p>
              ) : (
                recordings.map((rec, i) => (
                  <Card key={i}>
                    <CardContent className="py-3 flex items-center gap-4">
                      <Button variant="ghost" size="icon" className="shrink-0" onClick={() => { const a = new Audio(rec.url); a.play(); }} aria-label={`Écouter enregistrement du ${rec.date}`}>
                        <Play className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{rec.date}</p>
                        <p className="text-xs text-muted-foreground">{rec.duration}</p>
                      </div>
                      <span className="text-xl">{rec.mood}</span>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
