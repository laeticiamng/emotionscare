import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Camera, Mic, Heart, Brain, Activity, 
         Smile, Frown, Meh, Zap, Calendar, TrendingUp } from 'lucide-react';

const B2CScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanType, setScanType] = useState<'facial' | 'voice' | 'text'>('facial');
  
  const emotionData = {
    happiness: 75,
    stress: 25,
    energy: 80,
    focus: 60
  };

  const recommendations = [
    {
      title: "Séance de méditation",
      description: "10 minutes pour réduire le stress",
      action: () => navigate('/b2c/vr'),
      icon: Brain,
      color: "bg-blue-500"
    },
    {
      title: "Musique énergisante",
      description: "Playlist adaptée à votre état",
      action: () => navigate('/b2c/music'),
      icon: Heart,
      color: "bg-purple-500"
    },
    {
      title: "Journal réflexif",
      description: "Notez vos émotions actuelles",
      action: () => navigate('/b2c/journal'),
      icon: Activity,
      color: "bg-green-500"
    }
  ];

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulation du scan
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanResult({
            mood: 'positive',
            confidence: 0.85,
            dominantEmotion: 'happiness',
            recommendations: recommendations
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getScanModeIcon = () => {
    switch (scanType) {
      case 'facial': return Camera;
      case 'voice': return Mic;
      case 'text': return Activity;
      default: return Camera;
    }
  };

  const getEmotionIcon = (level: number) => {
    if (level >= 70) return Smile;
    if (level >= 40) return Meh;
    return Frown;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/b2c/dashboard')}
            className="hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scan Émotionnel</h1>
            <p className="text-gray-600">Analysez votre état émotionnel en temps réel</p>
          </div>
        </div>

        {/* Mode de scan */}
        <Card>
          <CardHeader>
            <CardTitle>Choisissez votre mode de scan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { type: 'facial' as const, title: 'Analyse Faciale', icon: Camera, desc: 'Via votre caméra' },
                { type: 'voice' as const, title: 'Analyse Vocale', icon: Mic, desc: 'Via votre microphone' },
                { type: 'text' as const, title: 'Analyse Textuelle', icon: Activity, desc: 'Via questionnaire' }
              ].map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <Card 
                    key={mode.type}
                    className={`cursor-pointer transition-all ${
                      scanType === mode.type ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setScanType(mode.type)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold">{mode.title}</h3>
                      <p className="text-sm text-gray-600">{mode.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Zone de scan */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Scanner {scanType === 'facial' ? 'Facial' : scanType === 'voice' ? 'Vocal' : 'Textuel'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isScanning && !scanResult && (
              <div className="text-center py-12">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  {React.createElement(getScanModeIcon(), { className: "w-16 h-16 text-white" })}
                </div>
                <h3 className="text-xl font-semibold mb-2">Prêt à scanner</h3>
                <p className="text-gray-600 mb-6">
                  {scanType === 'facial' && "Regardez votre caméra et cliquez sur commencer"}
                  {scanType === 'voice' && "Préparez-vous à parler pendant 10 secondes"}
                  {scanType === 'text' && "Répondez aux questions sur votre état émotionnel"}
                </p>
                <Button onClick={startScan} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500">
                  Commencer le Scan
                </Button>
              </div>
            )}

            {isScanning && (
              <div className="text-center py-12">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <Heart className="w-16 h-16 text-white animate-bounce" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Analyse en cours...</h3>
                <Progress value={scanProgress} className="w-64 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{scanProgress}% complété</p>
              </div>
            )}

            {scanResult && (
              <div className="space-y-6">
                {/* Résultats émotionnels */}
                <div className="text-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2 mb-4">
                    État: {scanResult.mood === 'positive' ? 'Positif' : 'Neutre'}
                  </Badge>
                  <p className="text-gray-600">
                    Confiance: {Math.round(scanResult.confidence * 100)}%
                  </p>
                </div>

                {/* Métriques détaillées */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(emotionData).map(([emotion, value]) => {
                    const EmotionIcon = getEmotionIcon(value);
                    return (
                      <div key={emotion} className="text-center p-4 bg-gray-50 rounded-lg">
                        <EmotionIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <h4 className="font-semibold capitalize">
                          {emotion === 'happiness' ? 'Bonheur' : 
                           emotion === 'stress' ? 'Stress' :
                           emotion === 'energy' ? 'Énergie' : 'Focus'}
                        </h4>
                        <div className="text-2xl font-bold text-blue-600">{value}%</div>
                        <Progress value={value} className="mt-2" />
                      </div>
                    );
                  })}
                </div>

                {/* Actions recommandées */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recommandations personnalisées</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.map((rec, index) => {
                      const IconComponent = rec.icon;
                      return (
                        <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className={`w-12 h-12 ${rec.color} rounded-lg flex items-center justify-center mb-3`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-semibold mb-2">{rec.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                            <Button onClick={rec.action} variant="outline" size="sm" className="w-full">
                              Commencer
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center pt-6">
                  <Button 
                    onClick={() => {
                      setScanResult(null);
                      setScanProgress(0);
                    }}
                    variant="outline"
                  >
                    Nouveau Scan
                  </Button>
                  <Button onClick={() => navigate('/b2c/journal')}>
                    Enregistrer dans le Journal
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historique */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Historique des Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: 'Aujourd\'hui 14:30', mood: 'Positif', score: 78 },
                { date: 'Hier 09:15', mood: 'Neutre', score: 65 },
                { date: '2 jours - 16:45', mood: 'Positif', score: 82 },
              ].map((entry, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">{entry.date}</div>
                      <div className="text-sm text-gray-600">État: {entry.mood}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">{entry.score}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CScanPage;