
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, FileText, Heart, Smile, Frown, Meh } from 'lucide-react';
import { Link } from 'react-router-dom';

const ScanPage: React.FC = () => {
  const [scanType, setScanType] = useState<'text' | 'voice' | 'face'>('text');
  const [textInput, setTextInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = () => {
    setIsScanning(true);
    // Simulation d'un scan
    setTimeout(() => {
      setResult({
        emotion: 'positive',
        confidence: 85,
        suggestions: [
          'Continuez sur cette lancée !',
          'Prenez un moment pour savourer ce bien-être',
          'Partagez votre bonne humeur avec vos collègues'
        ]
      });
      setIsScanning(false);
    }, 2000);
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'positive': return <Smile className="h-8 w-8 text-green-500" />;
      case 'negative': return <Frown className="h-8 w-8 text-red-500" />;
      default: return <Meh className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Heart className="h-10 w-10 text-pink-500" />
            Scanner Émotionnel
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Analysez votre état émotionnel pour un meilleur bien-être
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Scanner */}
            <Card>
              <CardHeader>
                <CardTitle>Choisissez votre méthode de scan</CardTitle>
                <CardDescription>
                  Sélectionnez la méthode qui vous convient le mieux
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Button
                    variant={scanType === 'text' ? 'default' : 'outline'}
                    onClick={() => setScanType('text')}
                    className="h-16 flex-col"
                  >
                    <FileText className="h-6 w-6 mb-1" />
                    Texte
                  </Button>
                  <Button
                    variant={scanType === 'voice' ? 'default' : 'outline'}
                    onClick={() => setScanType('voice')}
                    className="h-16 flex-col"
                  >
                    <Mic className="h-6 w-6 mb-1" />
                    Voix
                  </Button>
                  <Button
                    variant={scanType === 'face' ? 'default' : 'outline'}
                    onClick={() => setScanType('face')}
                    className="h-16 flex-col"
                  >
                    <Camera className="h-6 w-6 mb-1" />
                    Visage
                  </Button>
                </div>

                {scanType === 'text' && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Décrivez comment vous vous sentez..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}

                {scanType === 'voice' && (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mic className="h-12 w-12 text-red-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Cliquez sur "Scanner" pour commencer l'enregistrement vocal
                    </p>
                  </div>
                )}

                {scanType === 'face' && (
                  <div className="text-center py-8">
                    <div className="w-48 h-36 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Camera className="h-16 w-16 text-blue-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Positionnez votre visage devant la caméra
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleScan}
                  className="w-full mt-6"
                  disabled={isScanning || (scanType === 'text' && !textInput.trim())}
                >
                  {isScanning ? 'Analyse en cours...' : 'Scanner'}
                </Button>
              </CardContent>
            </Card>

            {/* Résultats */}
            <Card>
              <CardHeader>
                <CardTitle>Résultats de l'analyse</CardTitle>
                <CardDescription>
                  Votre état émotionnel analysé
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <div className="text-center py-12 text-gray-500">
                    Effectuez un scan pour voir vos résultats
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      {getEmotionIcon(result.emotion)}
                      <h3 className="text-2xl font-semibold mt-2 capitalize">
                        État {result.emotion}
                      </h3>
                      <Badge variant="secondary" className="mt-2">
                        Confiance: {result.confidence}%
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Suggestions personnalisées:</h4>
                      <ul className="space-y-2">
                        {result.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Link to="/music" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Musique adaptée
                        </Button>
                      </Link>
                      <Link to="/coach" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Parler au coach
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Historique récent */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Historique récent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Smile className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="text-xs text-gray-500">
                      J-{7-i}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="ghost">← Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
