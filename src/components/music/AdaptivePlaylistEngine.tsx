import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music, 
  Brain, 
  TrendingUp, 
  Clock, 
  Heart,
  Activity,
  Play,
  Pause,
  SkipForward,
  Shuffle,
  Settings,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  emotion: string;
  mood: string;
  energy: number;
  valence: number;
  arousal: number;
  bpm: number;
  key: string;
  genre: string;
  therapeutic_score: number;
}

interface UserEmotionalProfile {
  current_mood: string;
  stress_level: number;
  energy_level: number;
  valence: number;
  arousal: number;
  preferences: {
    genres: string[];
    artists: string[];
    avoid_genres: string[];
    session_length: number;
    intensity_preference: number;
  };
  listening_history: {
    track_id: string;
    listened_at: string;
    completion_rate: number;
    user_rating: number;
  }[];
}

interface AdaptivePlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  current_index: number;
  adaptation_score: number;
  emotional_journey: {
    start_emotion: string;
    target_emotion: string;
    current_emotion: string;
    progression: number;
  };
  session_data: {
    started_at: string;
    planned_duration: number;
    actual_duration: number;
    effectiveness_score: number;
  };
}

interface AdaptationSettings {
  auto_adapt: boolean;
  adaptation_sensitivity: number;
  emotional_target: string;
  session_length: number;
  transition_smoothness: number;
  biometric_integration: boolean;
  learning_rate: number;
}

const AdaptivePlaylistEngine: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [currentPlaylist, setCurrentPlaylist] = useState<AdaptivePlaylist | null>(null);
  const [userProfile, setUserProfile] = useState<UserEmotionalProfile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [adaptationSettings, setAdaptationSettings] = useState<AdaptationSettings>({
    auto_adapt: true,
    adaptation_sensitivity: 0.7,
    emotional_target: 'balanced',
    session_length: 30,
    transition_smoothness: 0.8,
    biometric_integration: false,
    learning_rate: 0.6
  });

  // Real-time emotional state monitoring
  const [currentEmotionalState, setCurrentEmotionalState] = useState({
    valence: 0.5,
    arousal: 0.5,
    stress: 0.4,
    focus: 0.6,
    energy: 0.5
  });

  const emotionalTargets = [
    { value: 'calm', label: 'Calme & Relaxation', color: 'bg-blue-100 text-blue-800' },
    { value: 'energetic', label: 'Énergie & Motivation', color: 'bg-orange-100 text-orange-800' },
    { value: 'focused', label: 'Concentration & Focus', color: 'bg-green-100 text-green-800' },
    { value: 'balanced', label: 'Équilibre Émotionnel', color: 'bg-purple-100 text-purple-800' },
    { value: 'uplifting', label: 'Positivité & Joie', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'contemplative', label: 'Réflexion & Introspection', color: 'bg-indigo-100 text-indigo-800' }
  ];

  // Advanced music selection algorithm
  const selectNextTrack = useCallback((
    availableTracks: MusicTrack[],
    currentEmotion: any,
    targetEmotion: string,
    progressInSession: number
  ): MusicTrack | null => {
    if (!availableTracks.length) return null;

    // Calculate optimal emotional trajectory
    const targetValence = getTargetValence(targetEmotion);
    const targetArousal = getTargetArousal(targetEmotion);
    
    // Progressive transition calculation
    const transitionProgress = Math.min(progressInSession, 1);
    const currentTargetValence = currentEmotion.valence + 
      (targetValence - currentEmotion.valence) * transitionProgress * adaptationSettings.transition_smoothness;
    const currentTargetArousal = currentEmotion.arousal + 
      (targetArousal - currentEmotion.arousal) * transitionProgress * adaptationSettings.transition_smoothness;

    // Score each track based on multiple factors
    const scoredTracks = availableTracks.map(track => {
      let score = 0;

      // Emotional alignment (40% weight)
      const valenceDiff = Math.abs(track.valence - currentTargetValence);
      const arousalDiff = Math.abs(track.arousal - currentTargetArousal);
      const emotionalScore = 1 - (valenceDiff + arousalDiff) / 2;
      score += emotionalScore * 0.4;

      // Therapeutic effectiveness (30% weight)
      score += track.therapeutic_score * 0.3;

      // User preference alignment (20% weight)
      if (userProfile) {
        const genrePreference = userProfile.preferences.genres.includes(track.genre) ? 1 : 0;
        const avoidGenre = userProfile.preferences.avoid_genres.includes(track.genre) ? -0.5 : 0;
        score += (genrePreference + avoidGenre) * 0.2;

        // Historical preference based on listening history
        const historyScore = calculateHistoryScore(track, userProfile.listening_history);
        score += historyScore * 0.1;
      }

      // Novelty factor (10% weight) - avoid repetition
      const recentlyPlayed = currentPlaylist?.tracks.slice(-3).some(t => t.id === track.id);
      if (recentlyPlayed) score -= 0.3;

      return { track, score };
    });

    // Select track with highest score, with some randomness for variety
    scoredTracks.sort((a, b) => b.score - a.score);
    
    // Weighted random selection from top candidates
    const topCandidates = scoredTracks.slice(0, Math.min(5, scoredTracks.length));
    const weights = topCandidates.map((_, index) => Math.exp(-index / 2)); // Exponential decay
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    let random = Math.random() * totalWeight;
    for (let i = 0; i < topCandidates.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return topCandidates[i].track;
      }
    }

    return topCandidates[0].track;
  }, [adaptationSettings, userProfile, currentPlaylist]);

  const getTargetValence = (emotion: string): number => {
    const map: Record<string, number> = {
      'calm': 0.3,
      'energetic': 0.8,
      'focused': 0.6,
      'balanced': 0.5,
      'uplifting': 0.9,
      'contemplative': 0.4
    };
    return map[emotion] || 0.5;
  };

  const getTargetArousal = (emotion: string): number => {
    const map: Record<string, number> = {
      'calm': 0.2,
      'energetic': 0.9,
      'focused': 0.6,
      'balanced': 0.5,
      'uplifting': 0.7,
      'contemplative': 0.3
    };
    return map[emotion] || 0.5;
  };

  const calculateHistoryScore = (track: MusicTrack, history: any[]): number => {
    const trackHistory = history.filter(h => h.track_id === track.id);
    if (trackHistory.length === 0) return 0;

    const avgRating = trackHistory.reduce((sum, h) => sum + h.user_rating, 0) / trackHistory.length;
    const avgCompletion = trackHistory.reduce((sum, h) => sum + h.completion_rate, 0) / trackHistory.length;
    
    return (avgRating / 5 + avgCompletion) / 2;
  };

  const generateAdaptivePlaylist = useCallback(async () => {
    if (!user) return;

    setIsGenerating(true);
    
    try {
      // Get current user emotional profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_emotional_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Get available tracks from database
      const { data: tracksData, error: tracksError } = await supabase
        .from('music_tracks')
        .select('*')
        .limit(100);

      if (tracksError) throw tracksError;

      const availableTracks = tracksData as MusicTrack[];
      const profile = profileData as UserEmotionalProfile;
      
      setUserProfile(profile);

      // Generate initial playlist
      const playlistTracks: MusicTrack[] = [];
      const sessionDuration = adaptationSettings.session_length * 60; // Convert to seconds
      let currentDuration = 0;
      let emotionalProgress = 0;

      while (currentDuration < sessionDuration && playlistTracks.length < 20) {
        const progressRatio = currentDuration / sessionDuration;
        const nextTrack = selectNextTrack(
          availableTracks.filter(t => !playlistTracks.some(pt => pt.id === t.id)),
          currentEmotionalState,
          adaptationSettings.emotional_target,
          progressRatio
        );

        if (!nextTrack) break;

        playlistTracks.push(nextTrack);
        currentDuration += nextTrack.duration;
        emotionalProgress = progressRatio;
      }

      const newPlaylist: AdaptivePlaylist = {
        id: Date.now().toString(),
        name: `Playlist Adaptative - ${new Date().toLocaleTimeString()}`,
        tracks: playlistTracks,
        current_index: 0,
        adaptation_score: 0.8,
        emotional_journey: {
          start_emotion: profile?.current_mood || 'neutral',
          target_emotion: adaptationSettings.emotional_target,
          current_emotion: profile?.current_mood || 'neutral',
          progression: 0
        },
        session_data: {
          started_at: new Date().toISOString(),
          planned_duration: sessionDuration,
          actual_duration: 0,
          effectiveness_score: 0
        }
      };

      setCurrentPlaylist(newPlaylist);
      if (newPlaylist.tracks.length > 0) {
        setCurrentTrack(newPlaylist.tracks[0]);
      }

      toast({
        title: "Playlist Adaptative Générée",
        description: `${playlistTracks.length} morceaux sélectionnés pour votre session`,
      });

    } catch (error) {
      console.error('Error generating playlist:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer la playlist adaptative",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [user, adaptationSettings, currentEmotionalState, selectNextTrack, toast]);

  const handleTrackEnd = useCallback(async () => {
    if (!currentPlaylist || !user) return;

    // Log listening data
    await supabase
      .from('listening_history')
      .insert({
        user_id: user.id,
        track_id: currentTrack?.id,
        completion_rate: 1.0,
        session_id: currentPlaylist.id
      });

    // Adaptive re-evaluation
    if (adaptationSettings.auto_adapt) {
      // Get updated emotional state (this would integrate with emotion detection)
      // For now, simulate slight changes
      setCurrentEmotionalState(prev => ({
        ...prev,
        valence: Math.max(0, Math.min(1, prev.valence + (Math.random() - 0.5) * 0.1)),
        arousal: Math.max(0, Math.min(1, prev.arousal + (Math.random() - 0.5) * 0.1))
      }));

      // Potentially modify remaining playlist based on new emotional state
      const remainingTracks = currentPlaylist.tracks.slice(currentPlaylist.current_index + 1);
      if (remainingTracks.length > 2) {
        // Re-evaluate and potentially replace some tracks
        const sessionProgress = (currentPlaylist.current_index + 1) / currentPlaylist.tracks.length;
        
        // This would implement real-time playlist adaptation logic
        console.log('Adapting playlist based on current state:', currentEmotionalState);
      }
    }

    // Move to next track
    const nextIndex = currentPlaylist.current_index + 1;
    if (nextIndex < currentPlaylist.tracks.length) {
      setCurrentPlaylist(prev => prev ? { ...prev, current_index: nextIndex } : null);
      setCurrentTrack(currentPlaylist.tracks[nextIndex]);
    } else {
      // Session completed
      setIsPlaying(false);
      toast({
        title: "Session Terminée",
        description: "Votre session de musicothérapie adaptative est terminée",
      });
    }
  }, [currentPlaylist, currentTrack, user, adaptationSettings, currentEmotionalState, toast]);

  const playlistProgress = useMemo(() => {
    if (!currentPlaylist) return 0;
    return (currentPlaylist.current_index / currentPlaylist.tracks.length) * 100;
  }, [currentPlaylist]);

  const emotionalProgress = useMemo(() => {
    if (!currentPlaylist) return 0;
    return currentPlaylist.emotional_journey.progression * 100;
  }, [currentPlaylist]);

  useEffect(() => {
    // Simulate real-time emotional monitoring
    const interval = setInterval(() => {
      if (isPlaying && adaptationSettings.biometric_integration) {
        // This would integrate with actual biometric sensors
        setCurrentEmotionalState(prev => ({
          ...prev,
          stress: Math.max(0, Math.min(1, prev.stress + (Math.random() - 0.5) * 0.05)),
          focus: Math.max(0, Math.min(1, prev.focus + (Math.random() - 0.5) * 0.03))
        }));
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isPlaying, adaptationSettings.biometric_integration]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Moteur de Playlist Adaptative
            <Badge variant="outline" className="ml-2">
              <Zap className="h-3 w-3 mr-1" />
              IA Avancée
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="player" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="player">Lecteur</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
              <TabsTrigger value="analytics">Analyse</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="player" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lecteur Adaptatif</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentTrack ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{currentTrack.title}</h3>
                          <p className="text-muted-foreground">{currentTrack.artist}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <Badge variant="secondary">{currentTrack.emotion}</Badge>
                            <Badge variant="secondary">{currentTrack.mood}</Badge>
                            <Badge variant="outline">{currentTrack.genre}</Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progression</span>
                            <span>{Math.round(playlistProgress)}%</span>
                          </div>
                          <Progress value={playlistProgress} className="w-full" />
                        </div>

                        <div className="flex justify-center gap-4">
                          <Button
                            onClick={() => setIsPlaying(!isPlaying)}
                            size="lg"
                            className="flex items-center gap-2"
                          >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            {isPlaying ? 'Pause' : 'Lecture'}
                          </Button>

                          <Button
                            onClick={handleTrackEnd}
                            variant="outline"
                            size="lg"
                            disabled={!currentPlaylist}
                          >
                            <SkipForward className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Aucune playlist active</p>
                        <Button
                          onClick={generateAdaptivePlaylist}
                          disabled={isGenerating}
                          className="mt-4"
                        >
                          <Shuffle className="h-4 w-4 mr-2" />
                          {isGenerating ? 'Génération...' : 'Générer Playlist'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      État Émotionnel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Valence</Label>
                        <Progress value={currentEmotionalState.valence * 100} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm">Éveil</Label>
                        <Progress value={currentEmotionalState.arousal * 100} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm">Stress</Label>
                        <Progress 
                          value={currentEmotionalState.stress * 100} 
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Focus</Label>
                        <Progress value={currentEmotionalState.focus * 100} className="mt-1" />
                      </div>
                    </div>

                    {currentPlaylist && (
                      <div className="space-y-2">
                        <Label className="text-sm">Progression Émotionnelle</Label>
                        <Progress value={emotionalProgress} className="mt-1" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{currentPlaylist.emotional_journey.start_emotion}</span>
                          <span>{currentPlaylist.emotional_journey.target_emotion}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {currentPlaylist && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Playlist Actuelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {currentPlaylist.tracks.map((track, index) => (
                        <div
                          key={track.id}
                          className={`flex items-center gap-3 p-2 rounded ${
                            index === currentPlaylist.current_index ? 'bg-primary/10' : ''
                          }`}
                        >
                          <div className="w-6 text-center text-sm text-muted-foreground">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{track.title}</p>
                            <p className="text-xs text-muted-foreground">{track.artist}</p>
                          </div>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {track.emotion}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(track.duration)}s
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Paramètres d'Adaptation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-adapt"
                        checked={adaptationSettings.auto_adapt}
                        onCheckedChange={(checked) => 
                          setAdaptationSettings(prev => ({ ...prev, auto_adapt: checked }))
                        }
                      />
                      <Label htmlFor="auto-adapt">Adaptation automatique</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Sensibilité: {Math.round(adaptationSettings.adaptation_sensitivity * 100)}%</Label>
                      <Slider
                        value={[adaptationSettings.adaptation_sensitivity]}
                        onValueChange={([value]) => 
                          setAdaptationSettings(prev => ({ ...prev, adaptation_sensitivity: value }))
                        }
                        min={0.1}
                        max={1}
                        step={0.1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Durée de session: {adaptationSettings.session_length} min</Label>
                      <Slider
                        value={[adaptationSettings.session_length]}
                        onValueChange={([value]) => 
                          setAdaptationSettings(prev => ({ ...prev, session_length: value }))
                        }
                        min={10}
                        max={120}
                        step={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Fluidité des transitions: {Math.round(adaptationSettings.transition_smoothness * 100)}%</Label>
                      <Slider
                        value={[adaptationSettings.transition_smoothness]}
                        onValueChange={([value]) => 
                          setAdaptationSettings(prev => ({ ...prev, transition_smoothness: value }))
                        }
                        min={0.1}
                        max={1}
                        step={0.1}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Objectifs Émotionnels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-2">
                      {emotionalTargets.map((target) => (
                        <button
                          key={target.value}
                          onClick={() => 
                            setAdaptationSettings(prev => ({ ...prev, emotional_target: target.value }))
                          }
                          className={`p-3 rounded border text-left transition-colors ${
                            adaptationSettings.emotional_target === target.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${target.color.split(' ')[0]}`} />
                            <span className="font-medium">{target.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="biometric"
                        checked={adaptationSettings.biometric_integration}
                        onCheckedChange={(checked) => 
                          setAdaptationSettings(prev => ({ ...prev, biometric_integration: checked }))
                        }
                      />
                      <Label htmlFor="biometric">Intégration biométrique</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Analyse des Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Analyses détaillées des sessions</p>
                    <p className="text-sm text-muted-foreground">
                      Visualisez l'efficacité de vos sessions de musicothérapie
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Historique des Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Historique des sessions</p>
                    <p className="text-sm text-muted-foreground">
                      Consultez vos précédentes sessions adaptatives
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

export default AdaptivePlaylistEngine;