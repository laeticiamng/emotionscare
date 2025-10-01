// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Palette, Sparkles, RefreshCw, Target, 
  Zap, Heart, Smile, Frown, Meh, Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface MoodComponent {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  description: string;
}

interface MoodMix {
  id: string;
  name: string;
  components: MoodComponent[];
  result: string;
  recommendations: string[];
  createdAt: Date;
}

const baseMoodComponents: Omit<MoodComponent, 'value'>[] = [
  {
    id: 'joy',
    name: 'Joie',
    color: 'bg-yellow-400',
    icon: Smile,
    description: 'Bonheur, optimisme, enthousiasme'
  },
  {
    id: 'calm',
    name: 'Calme',
    color: 'bg-blue-400',
    icon: Sun,
    description: 'Sérénité, paix intérieure, relaxation'
  },
  {
    id: 'energy',
    name: 'Énergie',
    color: 'bg-orange-400',
    icon: Zap,
    description: 'Vitalité, motivation, dynamisme'
  },
  {
    id: 'confidence',
    name: 'Confiance',
    color: 'bg-green-400',
    icon: Target,
    description: 'Assurance, détermination, force'
  },
  {
    id: 'creativity',
    name: 'Créativité',
    color: 'bg-purple-400',
    icon: Sparkles,
    description: 'Inspiration, imagination, innovation'
  },
  {
    id: 'love',
    name: 'Amour',
    color: 'bg-pink-400',
    icon: Heart,
    description: 'Compassion, connexion, bienveillance'
  }
];

export const MoodMixerModule: React.FC = () => {
  const [currentComponents, setCurrentComponents] = useState<MoodComponent[]>([]);
  const [mixResult, setMixResult] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [savedMixes, setSavedMixes] = useState<MoodMix[]>([]);
  const [isMixing, setIsMixing] = useState(false);
  const [targetMood, setTargetMood] = useState<string>('');

  // Initialiser les composants d'humeur
  useEffect(() => {
    setCurrentComponents(
      baseMoodComponents.map(comp => ({ ...comp, value: 50 }))
    );
  }, []);

  // Calculer le mix automatiquement quand les valeurs changent
  useEffect(() => {
    if (currentComponents.length > 0) {
      calculateMix();
    }
  }, [currentComponents]);

  const calculateMix = () => {
    const totalValue = currentComponents.reduce((sum, comp) => sum + comp.value, 0);
    const normalizedComponents = currentComponents.map(comp => ({
      ...comp,
      percentage: (comp.value / totalValue) * 100
    }));

    // Trouver le composant dominant
    const dominant = normalizedComponents.reduce((prev, current) => 
      current.value > prev.value ? current : prev
    );

    // Générer une description du mix
    const highComponents = normalizedComponents.filter(comp => comp.value > 70);
    const mediumComponents = normalizedComponents.filter(comp => comp.value >= 40 && comp.value <= 70);
    
    let result = '';
    if (highComponents.length === 1) {
      result = `État ${dominant.name.toLowerCase()} intense`;
    } else if (highComponents.length > 1) {
      result = `Mélange équilibré de ${highComponents.map(c => c.name.toLowerCase()).join(' et ')}`;
    } else if (mediumComponents.length > 2) {
      result = `Équilibre harmonieux multi-facettes`;
    } else {
      result = `État ${dominant.name.toLowerCase()} modéré`;
    }

    setMixResult(result);
    generateRecommendations(normalizedComponents);
  };

  const generateRecommendations = (components: (MoodComponent & { percentage: number })[]) => {
    const recs: string[] = [];
    
    components.forEach(comp => {
      if (comp.value > 70) {
        switch (comp.id) {
          case 'joy':
            recs.push('🎵 Musique uplifting', '🎨 Activité créative', '👥 Temps social');
            break;
          case 'calm':
            recs.push('🧘 Méditation', '📚 Lecture paisible', '🌿 Temps dans la nature');
            break;
          case 'energy':
            recs.push('🏃 Exercice physique', '💼 Projet stimulant', '🎯 Défi personnel');
            break;
          case 'confidence':
            recs.push('🎯 Prise de décisions', '💼 Networking', '🏆 Nouvelles opportunités');
            break;
          case 'creativity':
            recs.push('🎨 Art & design', '✍️ Écriture libre', '🔧 Bricolage créatif');
            break;
          case 'love':
            recs.push('💕 Temps avec proches', '🎁 Acte de bonté', '💌 Expression d\'affection');
            break;
        }
      } else if (comp.value < 30) {
        switch (comp.id) {
          case 'joy':
            recs.push('😊 Activité qui fait sourire', '🎬 Contenu inspirant');
            break;
          case 'calm':
            recs.push('🛀 Moment de détente', '🍵 Pause mindful');
            break;
          case 'energy':
            recs.push('☕ Boost naturel', '💪 Mouvement doux');
            break;
          case 'confidence':
            recs.push('📝 Affirmations positives', '🏅 Petite victoire');
            break;
          case 'creativity':
            recs.push('🎭 Inspiration externe', '🔍 Nouvelle perspective');
            break;
          case 'love':
            recs.push('🙏 Gratitude', '🤗 Auto-compassion');
            break;
        }
      }
    });

    setRecommendations([...new Set(recs)].slice(0, 6));
  };

  const handleComponentChange = (componentId: string, newValue: number[]) => {
    setCurrentComponents(prev =>
      prev.map(comp =>
        comp.id === componentId ? { ...comp, value: newValue[0] } : comp
      )
    );
  };

  const randomizeMix = () => {
    setIsMixing(true);
    setTimeout(() => {
      setCurrentComponents(prev =>
        prev.map(comp => ({ ...comp, value: Math.floor(Math.random() * 101) }))
      );
      setIsMixing(false);
      toast.success('Nouveau mix généré !');
    }, 1000);
  };

  const resetMix = () => {
    setCurrentComponents(prev =>
      prev.map(comp => ({ ...comp, value: 50 }))
    );
  };

  const saveMix = () => {
    if (!mixResult) return;

    const newMix: MoodMix = {
      id: Date.now().toString(),
      name: mixResult,
      components: [...currentComponents],
      result: mixResult,
      recommendations: [...recommendations],
      createdAt: new Date()
    };

    setSavedMixes(prev => [newMix, ...prev.slice(0, 9)]);
    toast.success('Mix sauvegardé !');
  };

  const loadMix = (mix: MoodMix) => {
    setCurrentComponents(mix.components);
    toast.info(`Mix "${mix.name}" chargé`);
  };

  const getDominantColor = () => {
    const dominant = currentComponents.reduce((prev, current) => 
      current.value > prev.value ? current : prev
    );
    return dominant?.color || 'bg-gray-400';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Palette className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Mood Mixer</h1>
          <p className="text-muted-foreground">
            Mélangez et ajustez vos émotions pour créer l'état d'esprit parfait
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interface de mix */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Console de Mixage</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={randomizeMix}
                    disabled={isMixing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isMixing ? 'animate-spin' : ''}`} />
                    Aléatoire
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetMix}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentComponents.map((component) => (
                <div key={component.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${component.color} flex items-center justify-center`}>
                        <component.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{component.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {component.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="min-w-[60px] justify-center">
                      {component.value}%
                    </Badge>
                  </div>
                  <Slider
                    value={[component.value]}
                    onValueChange={(value) => handleComponentChange(component.id, value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Résultat du mix */}
          <Card>
            <CardHeader>
              <CardTitle>Résultat du Mix</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {mixResult ? (
                  <motion.div
                    key={mixResult}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-full ${getDominantColor()} mx-auto mb-3 flex items-center justify-center`}>
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{mixResult}</h3>
                      <p className="text-sm text-muted-foreground">
                        Votre état émotionnel personnalisé
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button onClick={saveMix}>
                        <Heart className="h-4 w-4 mr-2" />
                        Sauvegarder ce mix
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Palette className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Ajustez les composants pour créer votre mix</p>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Panneau de droite */}
        <div className="space-y-4">
          {/* Recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={`${rec}-${index}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-2 bg-muted rounded text-sm"
                    >
                      {rec}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Créez un mix pour recevoir des recommandations
                </p>
              )}
            </CardContent>
          </Card>

          {/* Mix sauvegardés */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mix Sauvegardés</CardTitle>
            </CardHeader>
            <CardContent>
              {savedMixes.length > 0 ? (
                <div className="space-y-2">
                  {savedMixes.slice(0, 5).map((mix) => (
                    <motion.div
                      key={mix.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => loadMix(mix)}
                    >
                      <h4 className="font-medium text-sm">{mix.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {mix.createdAt.toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun mix sauvegardé
                </p>
              )}
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aperçu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentComponents.slice(0, 3).map((comp) => (
                <div key={comp.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{comp.name}</span>
                    <span>{comp.value}%</span>
                  </div>
                  <Progress value={comp.value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};