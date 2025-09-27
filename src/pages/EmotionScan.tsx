import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  Type, 
  Camera, 
  Play, 
  Square, 
  RotateCcw,
  Heart,
  Smile,
  Frown,
  Angry,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface EmotionResult {
  joie: number;
  tristesse: number;
  colere: number;
  peur: number;
  surprise: number;
  degout: number;
}

export const EmotionScan: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<EmotionResult | null>(null);

  const emotionIcons = {
    joie: Smile,
    tristesse: Frown,
    colere: Angry,
    peur: Heart,
    surprise: AlertTriangle,
    degout: Zap
  };

  const emotionColors = {
    joie: 'bg-yellow-500',
    tristesse: 'bg-blue-500',
    colere: 'bg-red-500',
    peur: 'bg-purple-500',
    surprise: 'bg-green-500',
    degout: 'bg-gray-500'
  };

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) return;

    setIsAnalyzing(true);
    
    // Simulation d'analyse (remplacer par vraie API)
    setTimeout(() => {
      setResults({
        joie: Math.random() * 100,
        tristesse: Math.random() * 100,
        colere: Math.random() * 100,
        peur: Math.random() * 100,
        surprise: Math.random() * 100,
        degout: Math.random() * 100
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Commencer l'enregistrement
      setTimeout(() => {
        setIsRecording(false);
        setIsAnalyzing(true);
        
        setTimeout(() => {
          setResults({
            joie: Math.random() * 100,
            tristesse: Math.random() * 100,
            colere: Math.random() * 100,
            peur: Math.random() * 100,
            surprise: Math.random() * 100,
            degout: Math.random() * 100
          });
          setIsAnalyzing(false);
        }, 3000);
      }, 3000);
    }
  };

  const resetAnalysis = () => {
    setResults(null);
    setTextInput('');
    setIsRecording(false);
    setIsAnalyzing(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Scanner d'émotions
        </h1>
        <p className="text-lg text-muted-foreground">
          Analysez vos émotions via texte, voix ou vidéo grâce à l'IA
        </p>
      </div>

      <Tabs defaultValue="text" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text" className="flex items-center space-x-2">
            <Type className="h-4 w-4" />
            <span>Texte</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center space-x-2">
            <Mic className="h-4 w-4" />
            <span>Voix</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center space-x-2">
            <Camera className="h-4 w-4" />
            <span>Vidéo</span>
          </TabsTrigger>
        </TabsList>

        {/* Analyse par texte */}
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="mr-2 h-5 w-5" />
                Analyse textuelle
              </CardTitle>
              <CardDescription>
                Écrivez quelques phrases sur votre état actuel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Comment vous sentez-vous aujourd'hui ? Décrivez vos émotions, vos pensées..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-32"
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={resetAnalysis}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
                <Button 
                  onClick={handleTextAnalysis}
                  disabled={!textInput.trim() || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>Analyse en cours...</>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Analyser
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyse vocale */}
        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mic className="mr-2 h-5 w-5" />
                Analyse vocale
              </CardTitle>
              <CardDescription>
                Enregistrez un message vocal de 10-30 secondes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                  isRecording ? 'bg-red-500 animate-pulse' : 'bg-primary'
                }`}>
                  {isRecording ? (
                    <Square className="h-12 w-12 text-white" />
                  ) : (
                    <Mic className="h-12 w-12 text-white" />
                  )}
                </div>
                
                <Button
                  size="lg"
                  onClick={handleVoiceRecording}
                  disabled={isAnalyzing}
                  variant={isRecording ? "destructive" : "default"}
                >
                  {isRecording ? (
                    <>
                      <Square className="mr-2 h-4 w-4" />
                      Arrêter l'enregistrement
                    </>
                  ) : isAnalyzing ? (
                    <>Analyse en cours...</>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Commencer l'enregistrement
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyse vidéo */}
        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="mr-2 h-5 w-5" />
                Analyse faciale
              </CardTitle>
              <CardDescription>
                Analysez vos expressions faciales en temps réel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-8 text-center">
                <Camera className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Fonctionnalité vidéo en cours de développement
                </p>
                <Button className="mt-4" disabled>
                  Activer la caméra
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Résultats */}
      {results && (
        <Card className="mt-8 glass-effect">
          <CardHeader>
            <CardTitle className="text-center">Résultats de l'analyse</CardTitle>
            <CardDescription className="text-center">
              Voici la répartition de vos émotions détectées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {Object.entries(results).map(([emotion, score]) => {
                const Icon = emotionIcons[emotion as keyof EmotionResult];
                const color = emotionColors[emotion as keyof EmotionResult];
                
                return (
                  <div key={emotion} className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="capitalize font-medium">{emotion}</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(score)}%
                        </span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-center space-x-4">
                <Button onClick={resetAnalysis} variant="outline">
                  Nouvelle analyse
                </Button>
                <Button>
                  Sauvegarder les résultats
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};