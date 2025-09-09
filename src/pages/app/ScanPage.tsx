/**
 * ScanPage - Module Scan Émotionnel (/app/scan)
 * Analyse des émotions en temps réel via IA
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Mic, 
  Type, 
  Brain, 
  Heart, 
  Eye, 
  Zap,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  Smile,
  Frown,
  Meh,
  ArrowLeft,
  Info
} from 'lucide-react';

interface EmotionResult {
  emotion: string;
  confidence: number;
  color: string;
  description: string;
  recommendations: string[];
}

const ScanPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentMode, setCurrentMode] = useState<'camera' | 'voice' | 'text'>('camera');
  const [textInput, setTextInput] = useState('');
  
  // Simulation des résultats d'analyse
  const [emotionResult, setEmotionResult] = useState<EmotionResult>({
    emotion: 'Optimiste',
    confidence: 85,
    color: 'text-green-600',
    description: 'Vous dégagez une énergie positive et confiante',
    recommendations: [
      'Profitez de cette dynamique positive',
      'Partagez votre énergie avec vos proches',
      'C\'est le moment idéal pour de nouveaux projets'
    ]
  });

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanProgress(0);
    
    // Simulation du scan progressif
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const resetScan = () => {
    setScanComplete(false);
    setScanProgress(0);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Scan Émotionnel IA</h1>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Powered by AI
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-2" />
                Guide
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Introduction */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Analysez vos émotions en temps réel
                </h2>
                <p className="text-muted-foreground">
                  Notre IA avancée analyse vos expressions, votre voix ou vos mots pour comprendre votre état émotionnel
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs value={currentMode} onValueChange={(value) => setCurrentMode(value as any)} className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="camera" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Visuel
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Vocal
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Textuel
              </TabsTrigger>
            </TabsList>

            {/* SCAN VISUEL */}
            <TabsContent value="camera" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Analyse Faciale
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                      {!isScanning && !scanComplete && (
                        <div className="text-center space-y-3">
                          <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Cliquez sur "Démarrer" pour activer la caméra
                          </p>
                        </div>
                      )}
                      
                      {isScanning && (
                        <div className="text-center space-y-4 animate-pulse">
                          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <div className="space-y-2">
                            <p className="font-medium">Analyse en cours...</p>
                            <Progress value={scanProgress} className="w-full max-w-xs mx-auto" />
                            <p className="text-sm text-muted-foreground">{scanProgress}%</p>
                          </div>
                        </div>
                      )}
                      
                      {scanComplete && (
                        <div className="text-center space-y-4 animate-fade-in">
                          <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold">Analyse terminée !</h3>
                            <p className="text-sm text-muted-foreground">
                              Consultez vos résultats ci-dessous
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      {!isScanning && !scanComplete && (
                        <Button onClick={startScan} className="gap-2">
                          <Play className="h-4 w-4" />
                          Démarrer le scan
                        </Button>
                      )}
                      
                      {isScanning && (
                        <Button variant="outline" onClick={() => setIsScanning(false)} className="gap-2">
                          <Pause className="h-4 w-4" />
                          Arrêter
                        </Button>
                      )}
                      
                      {scanComplete && (
                        <Button onClick={resetScan} variant="outline" className="gap-2">
                          <RotateCcw className="h-4 w-4" />
                          Nouveau scan
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Résultats */}
                {scanComplete && (
                  <Card className="animate-scale-in">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Résultats de l'analyse
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center space-y-3">
                        <div className={`text-3xl font-bold ${emotionResult.color}`}>
                          {emotionResult.emotion}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Niveau de confiance</span>
                            <span className="font-medium">{emotionResult.confidence}%</span>
                          </div>
                          <Progress value={emotionResult.confidence} className="h-2" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {emotionResult.description}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Recommandations :</h4>
                        <ul className="space-y-2">
                          {emotionResult.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 gap-2">
                          <Download className="h-4 w-4" />
                          Sauvegarder
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 gap-2">
                          <Share2 className="h-4 w-4" />
                          Partager
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* SCAN VOCAL */}
            <TabsContent value="voice" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="h-5 w-5" />
                      Analyse Vocale
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="relative">
                          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                            <Mic className="h-8 w-8 text-primary" />
                          </div>
                          {isScanning && (
                            <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium">
                            {isScanning ? 'Enregistrement en cours...' : 'Prêt à enregistrer'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Parlez naturellement pendant 10-15 secondes
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={startScan} disabled={isScanning} className="gap-2">
                        <Mic className="h-4 w-4" />
                        {isScanning ? 'Enregistrement...' : 'Commencer l\'enregistrement'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Conseils pour un bon scan vocal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        Parlez dans un environnement calme
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        Exprimez-vous naturellement
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        Maintenez une distance normale du micro
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        Parlez pendant 10-15 secondes minimum
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* SCAN TEXTUEL */}
            <TabsContent value="text" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Analyse Textuelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Décrivez votre ressenti actuel :
                      </label>
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Aujourd'hui je me sens... J'ai l'impression que... Mon humeur est..."
                        className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{textInput.length} caractères</span>
                        <span>Minimum recommandé : 50 caractères</span>
                      </div>
                    </div>

                    <Button 
                      onClick={startScan} 
                      disabled={textInput.length < 10 || isScanning}
                      className="w-full gap-2"
                    >
                      <Brain className="h-4 w-4" />
                      Analyser le texte
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Exemples de descriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                        <p className="italic">
                          "Je me sens plein d'énergie aujourd'hui, prêt à relever tous les défis..."
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <p className="italic">
                          "J'ai une sensation de calme et de sérénité, comme si tout était à sa place..."
                        </p>
                      </div>
                      <div className="p-3 bg-orange-50 dark:bg-orange-950/50 rounded-lg">
                        <p className="italic">
                          "Aujourd'hui est difficile, je ressens une certaine fatigue émotionnelle..."
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Historique et Statistiques */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Évolution Émotionnelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cette semaine</span>
                    <span className="font-medium text-green-600">Tendance positive</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Smile className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>Émotions positives</span>
                          <span>70%</span>
                        </div>
                        <Progress value={70} className="h-2 mt-1" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Meh className="h-4 w-4 text-yellow-600" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>Émotions neutres</span>
                          <span>25%</span>
                        </div>
                        <Progress value={25} className="h-2 mt-1" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Frown className="h-4 w-4 text-orange-600" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>Émotions difficiles</span>
                          <span>5%</span>
                        </div>
                        <Progress value={5} className="h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Sessions Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Camera className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium text-sm">Scan visuel</div>
                        <div className="text-xs text-muted-foreground">Il y a 2h</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600">Optimiste</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Type className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium text-sm">Analyse textuelle</div>
                        <div className="text-xs text-muted-foreground">Hier</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-blue-600">Serein</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mic className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium text-sm">Scan vocal</div>
                        <div className="text-xs text-muted-foreground">Il y a 2 jours</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-purple-600">Motivé</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Modules recommandés selon votre état</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link to="/app/music">
                    <Zap className="h-6 w-6" />
                    <span className="text-sm">Musicothérapie adaptée</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link to="/app/flash-glow">
                    <Zap className="h-6 w-6" />
                    <span className="text-sm">Flash Glow énergisant</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link to="/app/journal">
                    <Zap className="h-6 w-6" />
                    <span className="text-sm">Journal réflexif</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ScanPage;