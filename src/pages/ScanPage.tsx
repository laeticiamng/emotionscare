
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Mic, Camera, FileText, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ScanPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanText, setScanText] = useState('');
  const [scanResults, setScanResults] = useState<any>(null);
  const [scanMode, setScanMode] = useState<'text' | 'voice' | 'image'>('text');

  const handleScan = async () => {
    if (!scanText.trim() && scanMode === 'text') {
      toast.error('Veuillez saisir du texte à analyser');
      return;
    }

    setIsScanning(true);
    
    // Simulation d'analyse IA
    setTimeout(() => {
      setScanResults({
        emotions: [
          { name: 'Joie', confidence: 0.7, color: 'bg-yellow-500' },
          { name: 'Confiance', confidence: 0.6, color: 'bg-blue-500' },
          { name: 'Stress', confidence: 0.3, color: 'bg-red-500' },
          { name: 'Calme', confidence: 0.8, color: 'bg-green-500' }
        ],
        moodScore: 7.5,
        insights: [
          'Votre état émotionnel général est positif',
          'Un léger niveau de stress est détecté, pensez à prendre des pauses',
          'Vous exprimez de la confiance dans vos propos'
        ],
        recommendations: [
          'Continuez à cultiver cette attitude positive',
          'Essayez une session de respiration pour réduire le stress',
          'Partagez vos succès avec votre équipe'
        ]
      });
      setIsScanning(false);
      toast.success('Analyse émotionnelle terminée !');
    }, 3000);
  };

  const getScanModeIcon = () => {
    switch (scanMode) {
      case 'voice': return <Mic className="h-5 w-5" />;
      case 'image': return <Camera className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div data-testid="page-root" className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Scanner Émotionnel</h1>
        <p className="text-lg text-gray-600">
          Analysez vos émotions en temps réel grâce à l'intelligence artificielle
        </p>
      </div>

      {/* Scan Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Mode d'analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={scanMode === 'text' ? 'default' : 'outline'}
              onClick={() => setScanMode('text')}
              className="h-16 flex flex-col space-y-2"
            >
              <FileText className="h-6 w-6" />
              <span>Analyse textuelle</span>
            </Button>
            <Button
              variant={scanMode === 'voice' ? 'default' : 'outline'}
              onClick={() => setScanMode('voice')}
              className="h-16 flex flex-col space-y-2"
            >
              <Mic className="h-6 w-6" />
              <span>Analyse vocale</span>
            </Button>
            <Button
              variant={scanMode === 'image' ? 'default' : 'outline'}
              onClick={() => setScanMode('image')}
              className="h-16 flex flex-col space-y-2"
            >
              <Camera className="h-6 w-6" />
              <span>Analyse faciale</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scan Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getScanModeIcon()}
            {scanMode === 'text' && 'Décrivez votre état actuel'}
            {scanMode === 'voice' && 'Enregistrement vocal'}
            {scanMode === 'image' && 'Capture d\'expression'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scanMode === 'text' && (
            <Textarea
              placeholder="Décrivez comment vous vous sentez aujourd'hui, vos préoccupations, vos joies..."
              value={scanText}
              onChange={(e) => setScanText(e.target.value)}
              rows={6}
              className="w-full"
            />
          )}
          
          {scanMode === 'voice' && (
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="h-12 w-12 text-red-600" />
              </div>
              <p className="text-gray-600">Cliquez pour commencer l'enregistrement</p>
            </div>
          )}
          
          {scanMode === 'image' && (
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-12 w-12 text-blue-600" />
              </div>
              <p className="text-gray-600">Positionnez-vous face à la caméra</p>
            </div>
          )}

          <Button 
            onClick={handleScan} 
            className="w-full" 
            disabled={isScanning}
            size="lg"
          >
            {isScanning ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Lancer l'analyse
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Scanning Progress */}
      {isScanning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="py-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold">Analyse en cours...</h3>
                <p className="text-gray-600">Notre IA traite vos données émotionnelles</p>
              </div>
              <Progress value={66} className="w-full" />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Scan Results */}
      {scanResults && !isScanning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Emotion Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Analyse émotionnelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {scanResults.emotions.map((emotion: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 ${emotion.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-white font-bold">
                        {Math.round(emotion.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-sm font-medium">{emotion.name}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {scanResults.moodScore}/10
                </div>
                <p className="text-gray-600">Score de bien-être général</p>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Insights personnalisés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scanResults.insights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scanResults.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  Sauvegarder dans le journal
                </Button>
                <Button className="w-full">
                  Commencer une session coach
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ScanPage;
