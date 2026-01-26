// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Palette, 
  Shuffle, 
  Save, 
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Heart,
  Zap,
  Sun,
  Cloud,
  Moon,
  Wind,
  Sparkles,
  Settings
} from 'lucide-react';

interface EmotionComponent {
  id: string;
  name: string;
  color: string;
  intensity: number;
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0 to 1 (calm to energetic)
  dominance: number; // 0 to 1 (submissive to dominant)
  description: string;
  icon: LucideIconType;
  soundFreq?: number;
  visualEffect: 'particles' | 'waves' | 'pulse' | 'flow';
}

interface MoodMix {
  id: string;
  name: string;
  description: string;
  components: {
    emotionId: string;
    weight: number;
  }[];
  resultingMood: {
    valence: number;
    arousal: number;
    dominance: number;
    energy: number;
    stability: number;
  };
  color: string;
  recommendations: string[];
}

const baseEmotions: EmotionComponent[] = [
  {
    id: 'joy',
    name: 'Joie',
    color: '#FFD700',
    intensity: 0.8,
    valence: 0.9,
    arousal: 0.7,
    dominance: 0.6,
    description: 'Émotion positive énergisante',
    icon: Sun,
    soundFreq: 523.25, // C5
    visualEffect: 'particles'
  },
  {
    id: 'calm',
    name: 'Calme',
    color: '#87CEEB',
    intensity: 0.5,
    valence: 0.3,
    arousal: 0.1,
    dominance: 0.7,
    description: 'État de paix et sérénité',
    icon: Cloud,
    soundFreq: 261.63, // C4
    visualEffect: 'waves'
  },
  {
    id: 'energy',
    name: 'Énergie',
    color: '#FF6B35',
    intensity: 0.9,
    valence: 0.6,
    arousal: 0.95,
    dominance: 0.8,
    description: 'Force vitale dynamique',
    icon: Zap,
    soundFreq: 659.25, // E5
    visualEffect: 'pulse'
  },
  {
    id: 'focus',
    name: 'Focus',
    color: '#4A90E2',
    intensity: 0.7,
    valence: 0.2,
    arousal: 0.6,
    dominance: 0.9,
    description: 'Concentration intense',
    icon: Lightbulb,
    soundFreq: 392.00, // G4
    visualEffect: 'flow'
  },
  {
    id: 'love',
    name: 'Amour',
    color: '#FF69B4',
    intensity: 0.8,
    valence: 0.95,
    arousal: 0.4,
    dominance: 0.3,
    description: 'Connexion profonde et bienveillante',
    icon: Heart,
    soundFreq: 440.00, // A4
    visualEffect: 'pulse'
  },
  {
    id: 'peace',
    name: 'Paix',
    color: '#98FB98',
    intensity: 0.4,
    valence: 0.5,
    arousal: 0.05,
    dominance: 0.5,
    description: 'Harmonie et équilibre',
    icon: Moon,
    soundFreq: 220.00, // A3
    visualEffect: 'waves'
  },
  {
    id: 'excitement',
    name: 'Excitation',
    color: '#FF4500',
    intensity: 0.95,
    valence: 0.8,
    arousal: 0.98,
    dominance: 0.6,
    description: 'Anticipation joyeuse',
    icon: Sparkles,
    soundFreq: 783.99, // G5
    visualEffect: 'particles'
  },
  {
    id: 'flow',
    name: 'Flow',
    color: '#20B2AA',
    intensity: 0.7,
    valence: 0.7,
    arousal: 0.5,
    dominance: 0.8,
    description: 'État de performance optimale',
    icon: Wind,
    soundFreq: 329.63, // E4
    visualEffect: 'flow'
  }
];

const predefinedMixes: Partial<MoodMix>[] = [
  {
    name: 'Matin Parfait',
    description: 'Énergisant et positif pour bien commencer',
    components: [
      { emotionId: 'joy', weight: 0.4 },
      { emotionId: 'energy', weight: 0.4 },
      { emotionId: 'focus', weight: 0.2 }
    ]
  },
  {
    name: 'Zen Profond',
    description: 'Relaxation et méditation',
    components: [
      { emotionId: 'calm', weight: 0.5 },
      { emotionId: 'peace', weight: 0.4 },
      { emotionId: 'love', weight: 0.1 }
    ]
  },
  {
    name: 'Créativité Explosive',
    description: 'Stimule l\'innovation et l\'inspiration',
    components: [
      { emotionId: 'excitement', weight: 0.3 },
      { emotionId: 'joy', weight: 0.3 },
      { emotionId: 'flow', weight: 0.4 }
    ]
  },
  {
    name: 'Performance Peak',
    description: 'Concentration maximale pour les défis',
    components: [
      { emotionId: 'focus', weight: 0.5 },
      { emotionId: 'energy', weight: 0.3 },
      { emotionId: 'flow', weight: 0.2 }
    ]
  }
];

export const MoodMixer: React.FC = () => {
  const [selectedEmotions, setSelectedEmotions] = useState<Map<string, number>>(new Map());
  const [currentMix, setCurrentMix] = useState<MoodMix | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mixName, setMixName] = useState('');
  const [savedMixes, setSavedMixes] = useState<MoodMix[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
  const animationRef = useRef<number>();

  useEffect(() => {
    // Initialiser le contexte audio
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedEmotions.size > 0) {
      const mix = calculateMoodMix();
      setCurrentMix(mix);
      if (isPlaying) {
        startVisualAnimation();
      }
    } else {
      setCurrentMix(null);
      stopVisualAnimation();
    }
  }, [selectedEmotions, isPlaying]);

  const calculateMoodMix = (): MoodMix => {
    const totalWeight = Array.from(selectedEmotions.values()).reduce((sum, weight) => sum + weight, 0);
    
    if (totalWeight === 0) {
      return {
        id: 'empty',
        name: 'Mix Vide',
        description: 'Aucune émotion sélectionnée',
        components: [],
        resultingMood: { valence: 0, arousal: 0, dominance: 0, energy: 0, stability: 0 },
        color: '#808080',
        recommendations: []
      };
    }

    // Calcul des dimensions émotionnelles pondérées
    let weightedValence = 0;
    let weightedArousal = 0;
    let weightedDominance = 0;
    let mixedColor = [0, 0, 0]; // RGB

    const components: { emotionId: string; weight: number }[] = [];

    selectedEmotions.forEach((intensity, emotionId) => {
      const emotion = baseEmotions.find(e => e.id === emotionId);
      if (!emotion) return;

      const weight = intensity / totalWeight;
      components.push({ emotionId, weight });

      weightedValence += emotion.valence * weight;
      weightedArousal += emotion.arousal * weight;
      weightedDominance += emotion.dominance * weight;

      // Mélange des couleurs
      const rgb = hexToRgb(emotion.color);
      mixedColor[0] += rgb.r * weight;
      mixedColor[1] += rgb.g * weight;
      mixedColor[2] += rgb.b * weight;
    });

    // Calculs avancés
    const energy = Math.sqrt(weightedArousal * weightedDominance);
    const stability = 1 - calculateEmotionalVariance(components);
    
    // Couleur résultante
    const resultColor = rgbToHex(
      Math.round(mixedColor[0]),
      Math.round(mixedColor[1]),
      Math.round(mixedColor[2])
    );

    // Génération des recommandations basées sur l'IA
    const recommendations = generateRecommendations({
      valence: weightedValence,
      arousal: weightedArousal,
      dominance: weightedDominance,
      energy,
      stability
    });

    return {
      id: `mix-${Date.now()}`,
      name: mixName || generateMixName(weightedValence, weightedArousal, energy),
      description: generateMixDescription(weightedValence, weightedArousal, weightedDominance),
      components,
      resultingMood: {
        valence: weightedValence,
        arousal: weightedArousal,
        dominance: weightedDominance,
        energy,
        stability
      },
      color: resultColor,
      recommendations
    };
  };

  const calculateEmotionalVariance = (components: { emotionId: string; weight: number }[]): number => {
    if (components.length <= 1) return 0;

    const emotions = components.map(c => baseEmotions.find(e => e.id === c.emotionId)!);
    const valences = emotions.map(e => e.valence);
    const arousals = emotions.map(e => e.arousal);

    const meanValence = valences.reduce((sum, v) => sum + v, 0) / valences.length;
    const meanArousal = arousals.reduce((sum, a) => sum + a, 0) / arousals.length;

    const variance = emotions.reduce((sum, emotion, i) => {
      const vDiff = emotion.valence - meanValence;
      const aDiff = emotion.arousal - meanArousal;
      return sum + (vDiff * vDiff + aDiff * aDiff) * components[i].weight;
    }, 0);

    return Math.sqrt(variance);
  };

  const generateRecommendations = (mood: any): string[] => {
    const recommendations = [];

    // Basé sur la valence
    if (mood.valence > 0.7) {
      recommendations.push('🎉 Partagez cette énergie positive avec vos proches');
      recommendations.push('🎯 Profitez de cet état pour prendre des décisions importantes');
    } else if (mood.valence < 0.3) {
      recommendations.push('🧘 Pratiquez la méditation ou la respiration profonde');
      recommendations.push('🌿 Prenez du temps dans la nature');
    }

    // Basé sur l\'arousal
    if (mood.arousal > 0.8) {
      recommendations.push('🏃 Canalisez cette énergie dans l\'exercice physique');
      recommendations.push('💡 Lancez-vous dans un projet créatif');
    } else if (mood.arousal < 0.2) {
      recommendations.push('📚 Moment idéal pour la lecture ou l\'apprentissage');
      recommendations.push('☕ Savourez un moment de détente');
    }

    // Basé sur l\'énergie
    if (mood.energy > 0.7) {
      recommendations.push('🚀 Tacklez vos tâches les plus difficiles');
    } else if (mood.energy < 0.3) {
      recommendations.push('🛁 Accordez-vous une pause récupératrice');
    }

    // Basé sur la stabilité
    if (mood.stability < 0.5) {
      recommendations.push('⚖️ Cherchez l\'équilibre avec des activités apaisantes');
    }

    return recommendations.slice(0, 4); // Limiter à 4 recommandations
  };

  const generateMixName = (valence: number, arousal: number, energy: number): string => {
    if (valence > 0.7 && arousal > 0.7) return 'Euphorie Dynamique';
    if (valence > 0.7 && arousal < 0.3) return 'Bonheur Serein';
    if (valence < 0.3 && arousal > 0.7) return 'Tension Énergique';
    if (valence < 0.3 && arousal < 0.3) return 'Calme Profond';
    if (energy > 0.8) return 'Force Vitale';
    if (energy < 0.2) return 'Repos Paisible';
    return 'Équilibre Harmonieux';
  };

  const generateMixDescription = (valence: number, arousal: number, dominance: number): string => {
    const valenceDesc = valence > 0.5 ? 'positif' : 'neutre';
    const arousalDesc = arousal > 0.7 ? 'très énergique' : arousal > 0.3 ? 'modérément actif' : 'calme';
    const dominanceDesc = dominance > 0.7 ? 'confiant' : dominance > 0.3 ? 'équilibré' : 'réceptif';
    
    return `Un état ${valenceDesc}, ${arousalDesc} et ${dominanceDesc}`;
  };

  const toggleEmotion = (emotionId: string) => {
    setSelectedEmotions(prev => {
      const newMap = new Map(prev);
      if (newMap.has(emotionId)) {
        newMap.delete(emotionId);
      } else {
        newMap.set(emotionId, 0.5);
      }
      return newMap;
    });
  };

  const updateEmotionIntensity = (emotionId: string, intensity: number) => {
    setSelectedEmotions(prev => {
      const newMap = new Map(prev);
      newMap.set(emotionId, intensity);
      return newMap;
    });
  };

  const playMix = async () => {
    if (!audioContextRef.current) return;

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    // Arrêter les oscillateurs existants
    stopMix();

    selectedEmotions.forEach((intensity, emotionId) => {
      const emotion = baseEmotions.find(e => e.id === emotionId);
      if (!emotion || !emotion.soundFreq) return;

      const oscillator = audioContextRef.current!.createOscillator();
      const gainNode = audioContextRef.current!.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = emotion.soundFreq;
      gainNode.gain.value = intensity * 0.1; // Volume faible

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current!.destination);

      oscillator.start();
      oscillatorsRef.current.set(emotionId, oscillator);
    });

    setIsPlaying(true);
    startVisualAnimation();
  };

  const stopMix = () => {
    oscillatorsRef.current.forEach(oscillator => {
      oscillator.stop();
      oscillator.disconnect();
    });
    oscillatorsRef.current.clear();
    setIsPlaying(false);
    stopVisualAnimation();
  };

  const startVisualAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentMix) return;

    const ctx = canvas.getContext('2d')!;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner les effets visuels pour chaque émotion
      selectedEmotions.forEach((intensity, emotionId) => {
        const emotion = baseEmotions.find(e => e.id === emotionId);
        if (!emotion) return;

        const radius = intensity * 100;
        const alpha = intensity * 0.6;

        ctx.save();
        ctx.globalAlpha = alpha;

        switch (emotion.visualEffect) {
          case 'particles':
            drawParticles(ctx, centerX, centerY, radius, emotion.color, timestamp);
            break;
          case 'waves':
            drawWaves(ctx, centerX, centerY, radius, emotion.color, timestamp);
            break;
          case 'pulse':
            drawPulse(ctx, centerX, centerY, radius, emotion.color, timestamp);
            break;
          case 'flow':
            drawFlow(ctx, centerX, centerY, radius, emotion.color, timestamp);
            break;
        }

        ctx.restore();
      });

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const stopVisualAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, time: number) => {
    const particleCount = Math.floor(radius / 10);
    ctx.fillStyle = color;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + time * 0.001;
      const distance = radius * (0.5 + 0.5 * Math.sin(time * 0.002 + i));
      const px = x + Math.cos(angle) * distance;
      const py = y + Math.sin(angle) * distance;
      const size = 3 + 2 * Math.sin(time * 0.005 + i);

      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawWaves = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, time: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    for (let wave = 0; wave < 3; wave++) {
      ctx.beginPath();
      const waveRadius = radius * (0.3 + wave * 0.3) + 10 * Math.sin(time * 0.001 + wave);
      ctx.arc(x, y, waveRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawPulse = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, time: number) => {
    const pulseRadius = radius * (0.8 + 0.2 * Math.sin(time * 0.003));
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseRadius);
    gradient.addColorStop(0, color + '80');
    gradient.addColorStop(1, color + '00');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawFlow = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, time: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    const segments = 8;
    for (let i = 0; i < segments; i++) {
      const angle1 = (i / segments) * Math.PI * 2 + time * 0.001;
      const angle2 = ((i + 1) / segments) * Math.PI * 2 + time * 0.001;
      
      const r1 = radius * (0.7 + 0.3 * Math.sin(time * 0.002 + i));
      const r2 = radius * (0.7 + 0.3 * Math.sin(time * 0.002 + i + 1));

      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle1) * r1, y + Math.sin(angle1) * r1);
      ctx.lineTo(x + Math.cos(angle2) * r2, y + Math.sin(angle2) * r2);
      ctx.stroke();
    }
  };

  const saveMix = () => {
    if (!currentMix || !mixName.trim()) return;

    const savedMix = { ...currentMix, name: mixName.trim() };
    setSavedMixes(prev => [...prev, savedMix]);
    setMixName('');
  };

  const loadPredefinedMix = (mix: Partial<MoodMix>) => {
    const newSelections = new Map<string, number>();
    mix.components?.forEach(comp => {
      newSelections.set(comp.emotionId, comp.weight);
    });
    setSelectedEmotions(newSelections);
    setMixName(mix.name || '');
  };

  const resetMix = () => {
    setSelectedEmotions(new Map());
    setCurrentMix(null);
    setMixName('');
    stopMix();
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mood Mixer</h2>
          <p className="text-muted-foreground">Créez votre cocktail émotionnel parfait</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Settings className="mr-2 h-4 w-4" />
          Mode {showAdvanced ? 'Simple' : 'Avancé'}
        </Button>
      </div>

      {/* Visualisation en temps réel */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-center mb-6">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="border rounded-lg"
              style={{ background: currentMix?.color ? `${currentMix.color}10` : '#f8f9fa' }}
            />
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={isPlaying ? stopMix : playMix}
              disabled={selectedEmotions.size === 0}
              size="lg"
            >
              {isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isPlaying ? 'Pause' : 'Lecture'}
            </Button>
            
            <Button onClick={resetMix} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            
            <Button onClick={() => loadPredefinedMix(predefinedMixes[Math.floor(Math.random() * predefinedMixes.length)])} variant="outline">
              <Shuffle className="mr-2 h-4 w-4" />
              Aléatoire
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sélection des émotions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Palette Émotionnelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {baseEmotions.map(emotion => {
              const EmotionIcon = emotion.icon;
              const isSelected = selectedEmotions.has(emotion.id);
              const intensity = selectedEmotions.get(emotion.id) || 0;
              
              return (
                <Card
                  key={emotion.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-primary scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => toggleEmotion(emotion.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: emotion.color + '20' }}
                    >
                      <EmotionIcon
                        className="h-6 w-6"
                        style={{ color: emotion.color }}
                      />
                    </div>
                    
                    <h3 className="font-semibold mb-1">{emotion.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{emotion.description}</p>
                    
                    {isSelected && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Intensité</span>
                          <span>{Math.round(intensity * 100)}%</span>
                        </div>
                        <Slider
                          value={[intensity]}
                          onValueChange={([value]) => updateEmotionIntensity(emotion.id, value)}
                          max={1}
                          min={0}
                          step={0.01}
                          className="w-full"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Intensité de ${emotion.name}`}
                        />
                      </div>
                    )}
                    
                    {showAdvanced && (
                      <div className="mt-3 text-xs text-muted-foreground">
                        <div>V: {emotion.valence.toFixed(1)} A: {emotion.arousal.toFixed(1)} D: {emotion.dominance.toFixed(1)}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Analyse du Mix */}
      {currentMix && (
        <Card>
          <CardHeader>
            <CardTitle>Analyse du Mix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Valence (Positivité)</span>
                    <span className="text-sm">{Math.round(currentMix.resultingMood.valence * 100)}%</span>
                  </div>
                  <Progress value={currentMix.resultingMood.valence * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Arousal (Énergie)</span>
                    <span className="text-sm">{Math.round(currentMix.resultingMood.arousal * 100)}%</span>
                  </div>
                  <Progress value={currentMix.resultingMood.arousal * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Dominance (Contrôle)</span>
                    <span className="text-sm">{Math.round(currentMix.resultingMood.dominance * 100)}%</span>
                  </div>
                  <Progress value={currentMix.resultingMood.dominance * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Stabilité</span>
                    <span className="text-sm">{Math.round(currentMix.resultingMood.stability * 100)}%</span>
                  </div>
                  <Progress value={currentMix.resultingMood.stability * 100} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{currentMix.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Recommandations</h4>
                  <ul className="space-y-1">
                    {currentMix.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Sauvegarde */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <input
                type="text"
                placeholder="Nom du mix..."
                value={mixName}
                onChange={(e) => setMixName(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <Button onClick={saveMix} disabled={!mixName.trim()}>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mix prédéfinis */}
      <Card>
        <CardHeader>
          <CardTitle>Mix Prédéfinis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {predefinedMixes.map((mix, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => loadPredefinedMix(mix)}
              >
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold mb-2">{mix.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{mix.description}</p>
                  <div className="flex justify-center gap-2">
                    {mix.components?.map((comp, i) => {
                      const emotion = baseEmotions.find(e => e.id === comp.emotionId);
                      if (!emotion) return null;
                      const EmotionIcon = emotion.icon;
                      return (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: emotion.color + '40' }}
                        >
                          <EmotionIcon
                            className="h-3 w-3"
                            style={{ color: emotion.color }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mix sauvegardés */}
      {savedMixes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mes Mix Sauvegardés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedMixes.map((mix, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => loadPredefinedMix(mix)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: mix.color }}
                      />
                      <h3 className="font-semibold">{mix.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{mix.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodMixer;