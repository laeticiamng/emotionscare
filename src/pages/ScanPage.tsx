import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Scan, 
  Mic, 
  Camera, 
  FileText, 
  Brain, 
  Heart,
  Smile,
  Frown,
  Meh,
  Angry,
  Surprised,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const ScanPage: React.FC = () => {
  const [scanType, setScanType] = useState<'text' | 'voice' | 'video' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [results, setResults] = useState<any>(null);

  const emotions = [
    { name: 'Joie', icon: <Smile className="h-6 w-6" />, color: 'text-yellow-500', percentage: 0 },
    { name: 'Tristesse', icon: <Frown className="h-6 w-6" />, color: 'text-blue-500', percentage: 0 },
    { name: 'Colère', icon: <Angry className="h-6 w-6" />, color: 'text-red-500', percentage: 0 },
    { name: 'Surprise', icon: <Surprised className="h-6 w-6" />, color: 'text-purple-500', percentage: 0 },
    { name: 'Neutre', icon: <Meh className="h-6 w-6" />, color: 'text-gray-500', percentage: 0 },
  ];

  const handleStartScan = async (type: 'text' | 'voice' | 'video') => {
    setScanType(type);
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulation d'un scan progressif
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          // Simulation de résultats
          setResults({
            dominantEmotion: 'Joie',
            confidence: 87,
            emotions: [
              { name: 'Joie', percentage: 65 },
              { name: 'Surprise', percentage: 20 },
              { name: 'Neutre', percentage: 15 },
              { name: 'Tristesse', percentage: 0 },
              { name: 'Colère', percentage: 0 },
            ]
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const resetScan = () => {
    setScanType(null);
    setIsScanning(false);
    setScanProgress(0);
    setResults(null);
    setTextInput('');
  };

  if (results) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Résultats de votre Scan Émotionnel</h1>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Analyse terminée avec {results.confidence}% de confiance
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span>Émotion Dominante</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">{results.dominantEmotion}</div>
              <p className="text-muted-foreground">
                Cette émotion représente l'état principal détecté lors de votre scan.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition Émotionnelle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.emotions.map((emotion: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {emotions.find(e => e.name === emotion.name)?.icon}
                    <span className="font-medium">{emotion.name}</span>
                  </div>
                  <span className="text-sm font-medium">{emotion.percentage}%</span>
                </div>
                <Progress value={emotion.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button onClick={resetScan} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Nouveau Scan
          </Button>
          <Button>
            Sauvegarder dans le Journal
          </Button>
        </div>
      </div>
    );
  }

  if (scanType && isScanning) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                  <Scan className="h-12 w-12 text-primary animate-spin" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Analyse en cours...</h2>
                <p className="text-muted-foreground">
                  {scanType === 'text' && 'Analyse de votre texte en cours'}
                  {scanType === 'voice' && 'Analyse de votre voix en cours'}
                  {scanType === 'video' && 'Analyse de votre expression faciale en cours'}
                </p>
              </div>

              <div className="space-y-2">
                <Progress value={scanProgress} className="h-3" />
                <p className="text-sm text-muted-foreground">{scanProgress}% complété</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (scanType === 'text') {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Scan Émotionnel par Texte</h1>
          <p className="text-muted-foreground">
            Écrivez vos pensées et sentiments pour analyser votre état émotionnel
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span>Votre Expression</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Décrivez comment vous vous sentez aujourd'hui, vos pensées, vos émotions..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-32"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {textInput.length} caractères
              </span>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setScanType(null)}>
                  Retour
                </Button>
                <Button 
                  onClick={() => handleStartScan('text')}
                  disabled={textInput.length < 10}
                >
                  Analyser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Scanner Émotionnel
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Analysez votre état émotionnel grâce à nos technologies d'intelligence artificielle avancées.
          Choisissez votre méthode d'analyse préférée.
        </p>
      </div>

      {/* Options de scan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setScanType('text')}>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-white mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <CardTitle>Analyse Textuelle</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Exprimez vos sentiments par écrit et obtenez une analyse détaillée de votre état émotionnel.
            </p>
            <Badge variant="secondary">Recommandé pour commencer</Badge>
            <Button className="w-full">
              Commencer l'analyse
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow opacity-75">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white mb-4">
              <Mic className="h-8 w-8" />
            </div>
            <CardTitle>Analyse Vocale</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Parlez librement et laissez notre IA analyser le ton et les nuances de votre voix.
            </p>
            <Badge variant="outline">Bientôt disponible</Badge>
            <Button disabled className="w-full">
              Fonctionnalité à venir
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow opacity-75">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center text-white mb-4">
              <Camera className="h-8 w-8" />
            </div>
            <CardTitle>Analyse Faciale</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Utilisez votre caméra pour une analyse en temps réel de vos expressions faciales.
            </p>
            <Badge variant="outline">Bientôt disponible</Badge>
            <Button disabled className="w-full">
              Fonctionnalité à venir
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informations sur la confidentialité */}
      <Card className="max-w-2xl mx-auto bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Heart className="h-8 w-8 mx-auto text-red-500" />
            <h3 className="font-semibold">Confidentialité et Sécurité</h3>
            <p className="text-sm text-muted-foreground">
              Toutes vos données sont traitées de manière sécurisée et confidentielle. 
              Aucune information personnelle n'est stockée sans votre consentement explicite.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ScanPage };
export default ScanPage;