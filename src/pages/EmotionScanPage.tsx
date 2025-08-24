import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Mic, Camera, FileText, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmotionScanPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [textInput, setTextInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const emotions = [
    { name: 'Joie', value: 85, color: 'bg-yellow-500' },
    { name: 'Sérénité', value: 72, color: 'bg-blue-500' },
    { name: 'Confiance', value: 68, color: 'bg-green-500' },
    { name: 'Stress', value: 23, color: 'bg-red-500' },
    { name: 'Anxiété', value: 15, color: 'bg-orange-500' }
  ];

  const handleVoiceAnalysis = async () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulation d'enregistrement et d'analyse
      setTimeout(() => {
        setIsRecording(false);
        runAnalysis('vocal');
      }, 3000);
    }
  };

  const handleFaceAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        runAnalysis('facial');
      }, 3000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive"
      });
    }
  };

  const handleTextAnalysis = () => {
    if (!textInput.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir du texte à analyser",
        variant: "destructive"
      });
      return;
    }
    runAnalysis('textuel');
  };

  const runAnalysis = (type: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setResults({
            type,
            timestamp: new Date().toLocaleString(),
            emotions,
            dominant: 'Joie',
            confidence: 92
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetAnalysis = () => {
    setResults(null);
    setTextInput('');
    setAnalysisProgress(0);
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Scanner Émotionnel</h1>
          <p className="text-muted-foreground">
            Analysez votre état émotionnel en temps réel grâce à l'IA
          </p>
        </div>

        {isAnalyzing && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Sparkles className="h-8 w-8 mx-auto text-primary animate-pulse" />
                <div>
                  <p className="font-medium">Analyse en cours...</p>
                  <p className="text-sm text-muted-foreground">
                    Traitement des données émotionnelles
                  </p>
                </div>
                <Progress value={analysisProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  {analysisProgress}% terminé
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {results && (
          <Card className="mb-6 border-green-200 bg-green-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Résultats de l'analyse {results.type}
              </CardTitle>
              <CardDescription>
                Analysé le {results.timestamp} - Confiance: {results.confidence}%
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Émotion dominante</span>
                  <span className="text-lg font-bold text-green-600">{results.dominant}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Détail des émotions :</h4>
                {results.emotions.map((emotion: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{emotion.name}</span>
                      <span className="font-medium">{emotion.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${emotion.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${emotion.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <Button onClick={resetAnalysis} variant="outline" className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Nouvelle analyse
              </Button>
            </CardContent>
          </Card>
        )}

        {!results && !isAnalyzing && (
          <Tabs defaultValue="voice" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="voice">Scanner Vocal</TabsTrigger>
              <TabsTrigger value="face">Scanner Facial</TabsTrigger>
              <TabsTrigger value="text">Scanner Textuel</TabsTrigger>
            </TabsList>

            <TabsContent value="voice">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Analyse Vocale
                  </CardTitle>
                  <CardDescription>
                    Enregistrez votre voix pour analyser vos émotions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <Mic className={`h-12 w-12 ${isRecording ? 'text-red-500 animate-pulse' : 'text-blue-600'}`} />
                    </div>
                    <p className="text-muted-foreground">
                      {isRecording ? 'Enregistrement en cours... Parlez naturellement' : 'Cliquez pour commencer l\'enregistrement'}
                    </p>
                    <Button
                      onClick={handleVoiceAnalysis}
                      disabled={isAnalyzing}
                      size="lg"
                      variant={isRecording ? "destructive" : "default"}
                    >
                      {isRecording ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Arrêter l'enregistrement
                        </>
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

            <TabsContent value="face">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Analyse Faciale
                  </CardTitle>
                  <CardDescription>
                    Utilisez votre caméra pour analyser vos expressions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="h-48 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-cover rounded-lg hidden"
                      />
                      <Camera className="h-12 w-12 text-green-600" />
                    </div>
                    <p className="text-muted-foreground">
                      Positionnez votre visage face à la caméra
                    </p>
                    <Button
                      onClick={handleFaceAnalysis}
                      disabled={isAnalyzing}
                      size="lg"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Lancer l'analyse faciale
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="text">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Analyse Textuelle
                  </CardTitle>
                  <CardDescription>
                    Saisissez du texte pour analyser le sentiment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Décrivez comment vous vous sentez aujourd'hui, vos pensées, votre humeur..."
                      className="w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={500}
                    />
                    <div className="text-right text-sm text-muted-foreground">
                      {textInput.length}/500 caractères
                    </div>
                    <Button
                      onClick={handleTextAnalysis}
                      disabled={isAnalyzing || !textInput.trim()}
                      size="lg"
                      className="w-full"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Analyser le texte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
};

export default EmotionScanPage;