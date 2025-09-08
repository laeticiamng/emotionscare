/**
 * 🎵 PAGE THÉRAPIE MUSICALE - Version Premium
 * Interface complète pour la génération et gestion de musique thérapeutique
 */

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UnifiedMusicTherapy } from '@/core/UnifiedMusicTherapy';
import { UnifiedEmotionAnalyzer } from '@/core/UnifiedEmotionAnalyzer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Brain, 
  Wand2, 
  Settings, 
  Play, 
  Pause, 
  SkipForward, 
  Volume2,
  Heart,
  Zap,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { useToast } from '@/hooks/use-toast';

const EMOTION_PRESETS = [
  { emotion: 'calm', label: 'Calme', icon: Heart, color: 'bg-blue-500' },
  { emotion: 'energetic', label: 'Énergique', icon: Zap, color: 'bg-orange-500' },
  { emotion: 'happy', label: 'Joyeux', icon: Smile, color: 'bg-yellow-500' },
  { emotion: 'sad', label: 'Triste', icon: Frown, color: 'bg-indigo-500' },
  { emotion: 'focused', label: 'Concentré', icon: Brain, color: 'bg-purple-500' },
  { emotion: 'neutral', label: 'Neutre', icon: Meh, color: 'bg-gray-500' },
];

export const B2CMusicTherapyPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('calm');
  const [intensity, setIntensity] = useState([0.7]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const music = useMusic();
  const { toast } = useToast();

  const handleEmotionDetected = (emotion: string) => {
    setSelectedEmotion(emotion);
    toast({
      title: "Émotion détectée",
      description: `Basculement vers l'émotion : ${emotion}`,
    });
  };

  const generateCustomMusic = async () => {
    setIsGenerating(true);
    try {
      await music.generateMusicForEmotion(selectedEmotion, intensity[0]);
    } catch (error) {
      console.error('Erreur génération:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Thérapie Musicale Premium
            </h1>
            <p className="text-muted-foreground text-lg">
              Génération de musique adaptative avec IA pour votre bien-être émotionnel
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Contrôles principaux */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="presets" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="presets">Émotions</TabsTrigger>
                  <TabsTrigger value="analysis">Analyse</TabsTrigger>
                  <TabsTrigger value="custom">Personnalisé</TabsTrigger>
                  <TabsTrigger value="settings">Réglages</TabsTrigger>
                </TabsList>

                <TabsContent value="presets" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        Sélection d'Émotion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {EMOTION_PRESETS.map(({ emotion, label, icon: Icon, color }) => (
                          <Button
                            key={emotion}
                            variant={selectedEmotion === emotion ? "default" : "outline"}
                            className="h-auto p-4 flex flex-col gap-2"
                            onClick={() => setSelectedEmotion(emotion)}
                          >
                            <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            {label}
                          </Button>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="intensity">Intensité: {Math.round(intensity[0] * 100)}%</Label>
                          <Slider
                            id="intensity"
                            min={0}
                            max={1}
                            step={0.1}
                            value={intensity}
                            onValueChange={setIntensity}
                            className="mt-2"
                          />
                        </div>

                        <Button 
                          onClick={generateCustomMusic}
                          disabled={isGenerating}
                          className="w-full"
                          size="lg"
                        >
                          {isGenerating ? (
                            <>
                              <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                              Génération en cours...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4 mr-2" />
                              Générer Musique IA
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Analyse Émotionnelle
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <UnifiedEmotionAnalyzer
                        text={analysisText}
                        onEmotionDetected={handleEmotionDetected}
                        showResults={true}
                        autoAnalyze={false}
                        onTextChange={setAnalysisText}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="custom" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Génération Personnalisée
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="genre">Genre Musical</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un genre" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ambient">Ambient</SelectItem>
                              <SelectItem value="classical">Classique</SelectItem>
                              <SelectItem value="electronic">Électronique</SelectItem>
                              <SelectItem value="nature">Sons de la nature</SelectItem>
                              <SelectItem value="lo-fi">Lo-Fi Hip Hop</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="tempo">Tempo</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Vitesse du rythme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="slow">Lent (60-80 BPM)</SelectItem>
                              <SelectItem value="medium">Modéré (80-120 BPM)</SelectItem>
                              <SelectItem value="fast">Rapide (120+ BPM)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button className="w-full" variant="secondary">
                          Générer avec Paramètres Personnalisés
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuration Adaptative</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Transition Automatique</Label>
                          <Badge variant="outline">Activé</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Adaptation de Volume</Label>
                          <Badge variant="outline">Activé</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Sensibilité Émotionnelle</Label>
                          <Badge variant="outline">80%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Lecteur musical */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lecteur Musical</CardTitle>
                </CardHeader>
                <CardContent>
                  {music.currentTrack ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="font-semibold">{music.currentTrack.title}</h3>
                        <p className="text-sm text-muted-foreground">{music.currentTrack.artist}</p>
                        <Badge className="mt-2">{selectedEmotion}</Badge>
                      </div>

                      <div className="flex justify-center gap-2">
                        <Button size="icon" variant="outline">
                          <SkipForward className="w-4 h-4 rotate-180" />
                        </Button>
                        <Button 
                          size="icon" 
                          onClick={() => music.isPlaying ? music.pause() : music.play()}
                        >
                          {music.isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button size="icon" variant="outline">
                          <SkipForward className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        <Slider
                          value={[music.volume]}
                          onValueChange={([value]) => music.setVolume(value)}
                          max={1}
                          step={0.1}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Générez de la musique pour commencer
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Composant unifié */}
              <UnifiedMusicTherapy
                emotion={selectedEmotion}
                autoGenerate={false}
                showPlayer={false}
                intensity={intensity[0]}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default B2CMusicTherapyPage;