import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardAnimation } from '@/components/rewards/RewardAnimation';
import { useCollectionStore } from '@/store/collection.store';
import { UNIVERSE_CONFIGS } from '@/data/universes/config';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Music, Volume2, Save } from 'lucide-react';

type MusicLayer = {
  id: string;
  name: string;
  type: 'bass' | 'melody' | 'ambient' | 'percussion';
  active: boolean;
  volume: number;
  color: string;
};

const AdaptiveMusicPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [calmness, setCalmness] = useState([50]);
  const [energy, setEnergy] = useState([50]);
  const [layers, setLayers] = useState<MusicLayer[]>([
    { id: 'bass', name: 'Basse', type: 'bass', active: true, volume: 70, color: '#ff6b35' },
    { id: 'melody', name: 'Mélodie', type: 'melody', active: true, volume: 80, color: '#4ecdc4' },
    { id: 'ambient', name: 'Ambiance', type: 'ambient', active: false, volume: 60, color: '#45b7d1' },
    { id: 'percussion', name: 'Percussion', type: 'percussion', active: false, volume: 50, color: '#f9ca24' }
  ]);
  const [trackTitle, setTrackTitle] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [isUniverseReady, setIsUniverseReady] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);

  const { addReward } = useCollectionStore();
  const universe = UNIVERSE_CONFIGS.music;

  // Update layers based on mood sliders
  useEffect(() => {
    setLayers(prev => prev.map(layer => {
      let shouldBeActive = layer.active;
      let newVolume = layer.volume;

      // Adjust layers based on mood
      switch (layer.type) {
        case 'bass':
          shouldBeActive = energy[0] > 40;
          newVolume = Math.max(20, energy[0]);
          break;
        case 'melody':
          shouldBeActive = true; // Always present
          newVolume = 50 + (calmness[0] * 0.5);
          break;
        case 'ambient':
          shouldBeActive = calmness[0] > 60;
          newVolume = calmness[0];
          break;
        case 'percussion':
          shouldBeActive = energy[0] > 70;
          newVolume = Math.min(80, energy[0]);
          break;
      }

      return {
        ...layer,
        active: shouldBeActive,
        volume: Math.round(newVolume)
      };
    }));
  }, [calmness, energy]);

  // Session timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && sessionDuration === 0) {
      // Starting fresh session
      generateTrackTitle();
    }
  };

  const generateTrackTitle = useCallback(() => {
    const calmWords = ['Zen', 'Paix', 'Douceur', 'Sérénité', 'Harmonie'];
    const energyWords = ['Élan', 'Vibe', 'Rythme', 'Pulse', 'Flow'];
    
    const moodBase = calmness[0] > energy[0] ? 
      calmWords[Math.floor(Math.random() * calmWords.length)] :
      energyWords[Math.floor(Math.random() * energyWords.length)];
    
    const timeStamp = new Date().toLocaleTimeString('fr', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    setTrackTitle(`${moodBase} ${timeStamp}`);
  }, [calmness, energy]);

  const saveTrack = useCallback(() => {
    const trackData = {
      id: `track-${Date.now()}`,
      title: trackTitle,
      moodTags: {
        calmness: calmness[0],
        energy: energy[0]
      },
      layers: layers.filter(l => l.active).map(l => ({
        type: l.type,
        volume: l.volume
      })),
      duration: sessionDuration,
      timestamp: new Date()
    };

    addReward({
      type: 'sample',
      name: trackTitle,
      description: `Composition personnelle - ${Math.floor(sessionDuration / 60)}:${(sessionDuration % 60).toString().padStart(2, '0')}`,
      moduleId: 'adaptive-music',
      rarity: sessionDuration > 120 ? 'rare' : 'common',
      visualData: {
        color: '#f9ca24',
        icon: 'sample',
        animation: 'wave'
      },
      metadata: trackData
    });

    setShowReward(true);
  }, [trackTitle, calmness, energy, layers, sessionDuration, addReward]);

  const resetSession = () => {
    setIsPlaying(false);
    setSessionDuration(0);
    setTrackTitle('');
    setShowReward(false);
    setCalmness([50]);
    setEnergy([50]);
  };

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, active: !layer.active } : layer
    ));
  };

  const updateLayerVolume = (layerId: string, volume: number) => {
    setLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, volume } : layer
    ));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!universe) {
    return <div>Univers Adaptive Music non trouvé</div>;
  }

  return (
    <>
      <UniverseEngine
        universe={universe}
        isEntering={true}
        onEnterComplete={() => setIsUniverseReady(true)}
        className="min-h-screen"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            
            <motion.div
              className="text-center text-white space-y-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-light">Musique Adaptative</h2>
              <p className="text-lg opacity-80">
                Créez votre composition personnelle en temps réel
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Control Panel */}
              <div className="space-y-6">
                
                {/* Mood Controls */}
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-white font-medium mb-4">Modulateurs d'humeur</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-white/80 text-sm mb-2 block">
                        Calme ← → Énergie: {energy[0]}%
                      </label>
                      <Slider
                        value={energy}
                        onValueChange={setEnergy}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-white/80 text-sm mb-2 block">
                        Tension ← → Sérénité: {calmness[0]}%
                      </label>
                      <Slider
                        value={calmness}
                        onValueChange={setCalmness}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Layer Controls */}
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-white font-medium mb-4">Couches sonores</h3>
                  
                  <div className="space-y-4">
                    {layers.map(layer => (
                      <motion.div
                        key={layer.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          layer.active 
                            ? 'border-white/50 bg-white/5' 
                            : 'border-white/20 bg-transparent'
                        }`}
                        style={{ 
                          borderColor: layer.active ? layer.color : 'rgba(255,255,255,0.2)',
                          backgroundColor: layer.active ? `${layer.color}20` : 'transparent'
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <button
                            onClick={() => toggleLayer(layer.id)}
                            className="flex items-center gap-2 text-white"
                          >
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: layer.active ? layer.color : '#666' }}
                            />
                            {layer.name}
                          </button>
                          
                          <span className="text-white/60 text-sm">
                            {layer.volume}%
                          </span>
                        </div>
                        
                        {layer.active && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2"
                          >
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={layer.volume}
                              onChange={(e) => updateLayerVolume(layer.id, Number(e.target.value))}
                              className="w-full"
                              style={{ accentColor: layer.color }}
                            />
                            
                            {/* Visual volume indicator */}
                            <div className="flex gap-1">
                              {Array.from({ length: 10 }, (_, i) => (
                                <div
                                  key={i}
                                  className="h-2 w-full rounded"
                                  style={{
                                    backgroundColor: i < (layer.volume / 10) ? layer.color : '#333',
                                    opacity: isPlaying ? (0.5 + Math.random() * 0.5) : 0.3
                                  }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Transport Controls */}
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white">
                      <div className="font-medium">{trackTitle || 'Composition sans titre'}</div>
                      <div className="text-sm opacity-60">{formatTime(sessionDuration)}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={togglePlay}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      
                      {sessionDuration > 10 && (
                        <Button
                          onClick={saveTrack}
                          size="sm"
                          variant="outline"
                          className="text-white border-white/30"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visualization */}
              <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-white font-medium mb-4">Visualisation</h3>
                
                <div className="relative h-80 bg-black/20 rounded-lg overflow-hidden">
                  
                  {/* Waveform visualization */}
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-end justify-center gap-1 p-4">
                      {Array.from({ length: 40 }, (_, i) => (
                        <motion.div
                          key={i}
                          className="bg-gradient-to-t from-purple-500 to-pink-500"
                          style={{ width: '6px' }}
                          animate={{
                            height: layers.some(l => l.active) ? 
                              `${20 + Math.random() * 60}%` : '10%'
                          }}
                          transition={{
                            duration: 0.1 + Math.random() * 0.2,
                            repeat: Infinity,
                            repeatType: "mirror"
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Layer particles */}
                  {layers.filter(l => l.active).map((layer, index) => (
                    <div key={layer.id} className="absolute inset-0">
                      {Array.from({ length: 5 }, (_, i) => (
                        <motion.div
                          key={`${layer.id}-${i}`}
                          className="absolute w-2 h-2 rounded-full"
                          style={{ backgroundColor: layer.color }}
                          animate={isPlaying ? {
                            x: [0, Math.random() * 400],
                            y: [0, Math.random() * 300],
                            opacity: [0, layer.volume / 100, 0]
                          } : {}}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.5
                          }}
                        />
                      ))}
                    </div>
                  ))}

                  {/* Center music icon */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Music className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                </div>

                {/* Mood indicator */}
                <div className="mt-4 p-4 bg-white/10 rounded-lg">
                  <div className="text-white/80 text-sm mb-2">Ambiance détectée:</div>
                  <div className="text-white font-medium">
                    {calmness[0] > 70 ? '🧘 Méditative' :
                     energy[0] > 70 ? '⚡ Énergique' :
                     calmness[0] > energy[0] ? '🌙 Relaxante' :
                     '🎵 Équilibrée'}
                  </div>
                </div>
              </div>
            </div>

            {/* Reset button */}
            <div className="text-center mt-8">
              <Button 
                onClick={resetSession} 
                variant="outline" 
                className="text-white border-white/30"
              >
                Nouvelle composition
              </Button>
            </div>
          </div>
        </div>
      </UniverseEngine>

      {/* Reward animation */}
      {showReward && (
        <RewardAnimation
          reward={{
            id: `track-${Date.now()}`,
            type: 'sample',
            name: trackTitle,
            description: `Composition personnelle - ${formatTime(sessionDuration)}`,
            moduleId: 'adaptive-music',
            rarity: sessionDuration > 120 ? 'rare' : 'common',
            visualData: {
              color: '#f9ca24',
              icon: 'sample',
              animation: 'wave'
            },
            earnedAt: new Date()
          }}
          isVisible={showReward}
          onComplete={() => setShowReward(false)}
        />
      )}
    </>
  );
};

export default AdaptiveMusicPage;