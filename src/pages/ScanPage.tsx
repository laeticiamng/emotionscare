
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Mic, Type, Camera, ArrowLeft, Play, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'voice' | 'text' | 'face'>('voice');
  const [emotionResults, setEmotionResults] = useState<any>(null);

  const handleStartScan = () => {
    setIsScanning(true);
    // Simuler un scan
    setTimeout(() => {
      setEmotionResults({
        dominant: 'Joie',
        confidence: 85,
        emotions: {
          'Joie': 85,
          'Sérénité': 65,
          'Excitation': 45,
          'Tristesse': 15,
          'Colère': 10
        }
      });
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-6 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Analyse Émotionnelle
            </h1>
            <p className="text-xl text-gray-600">
              Découvrez votre état émotionnel en temps réel
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Panel de contrôle */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-500" />
                  Mode de Scan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => setScanMode('voice')}
                    variant={scanMode === 'voice' ? 'default' : 'outline'}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                  >
                    <Mic className="h-6 w-6" />
                    <span className="text-sm">Voix</span>
                  </Button>
                  <Button
                    onClick={() => setScanMode('text')}
                    variant={scanMode === 'text' ? 'default' : 'outline'}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                  >
                    <Type className="h-6 w-6" />
                    <span className="text-sm">Texte</span>
                  </Button>
                  <Button
                    onClick={() => setScanMode('face')}
                    variant={scanMode === 'face' ? 'default' : 'outline'}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                  >
                    <Camera className="h-6 w-6" />
                    <span className="text-sm">Visage</span>
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleStartScan}
                    disabled={isScanning}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg rounded-xl"
                  >
                    {isScanning ? (
                      <>
                        <Square className="mr-2 h-5 w-5" />
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Commencer l'analyse
                      </>
                    )}
                  </Button>
                </div>

                {scanMode === 'voice' && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-700">
                      🎤 Parlez naturellement pendant 10-15 secondes pour une analyse optimale
                    </p>
                  </div>
                )}

                {scanMode === 'text' && (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-700">
                      ✍️ Écrivez quelques phrases sur votre ressenti actuel
                    </p>
                  </div>
                )}

                {scanMode === 'face' && (
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="text-sm text-purple-700">
                      📷 Regardez la caméra avec une expression naturelle
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Résultats */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-500" />
                  Résultats d'Analyse
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isScanning ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Analyse en cours...</p>
                  </div>
                ) : emotionResults ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {emotionResults.dominant} ({emotionResults.confidence}%)
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(emotionResults.emotions).map(([emotion, score]) => (
                        <div key={emotion} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{emotion}</span>
                            <span>{score}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-green-50 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-2">Recommandations</h4>
                      <p className="text-sm text-green-700">
                        Votre état émotionnel indique une humeur positive ! 
                        Continuez avec une musique énergisante ou une session de méditation.
                      </p>
                    </div>

                    <Button 
                      onClick={() => navigate('/music')}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    >
                      Écouter la musique recommandée
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Commencez une analyse pour voir vos résultats</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScanPage;
