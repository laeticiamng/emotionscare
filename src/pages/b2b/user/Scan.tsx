
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Heart, Activity, Brain, TrendingUp } from 'lucide-react';

const Scan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [lastScan, setLastScan] = useState({
    date: '2024-01-10',
    heartRate: 72,
    stress: 25,
    energy: 78,
    focus: 85
  });

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setLastScan({
            ...lastScan,
            date: new Date().toISOString().split('T')[0],
            heartRate: Math.floor(Math.random() * 20) + 65,
            stress: Math.floor(Math.random() * 40) + 10,
            energy: Math.floor(Math.random() * 30) + 60,
            focus: Math.floor(Math.random() * 25) + 70
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getStatusColor = (value: number, type: 'stress' | 'good') => {
    if (type === 'stress') {
      if (value < 30) return 'text-green-600';
      if (value < 60) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value > 70) return 'text-green-600';
      if (value > 50) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Scan Biométrique</h1>
        <div className="text-sm text-gray-600">
          Dernier scan: {lastScan.date}
        </div>
      </div>

      {/* Interface de scan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Nouveau Scan
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {isScanning ? (
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <p className="text-gray-700">Analyse en cours...</p>
              <Progress value={scanProgress} className="w-full" />
              <p className="text-sm text-gray-600">{scanProgress}% terminé</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-700">
                Placez votre doigt sur l'objectif de la caméra pour démarrer l'analyse
              </p>
              <Button onClick={handleStartScan} size="lg">
                <Activity className="h-4 w-4 mr-2" />
                Démarrer le Scan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats du dernier scan */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Derniers Résultats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 mx-auto text-red-500 mb-2" />
              <p className="text-sm text-gray-600">Rythme Cardiaque</p>
              <p className="text-2xl font-bold">{lastScan.heartRate}</p>
              <p className="text-xs text-gray-500">bpm</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <p className="text-sm text-gray-600">Niveau de Stress</p>
              <p className={`text-2xl font-bold ${getStatusColor(lastScan.stress, 'stress')}`}>
                {lastScan.stress}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-sm text-gray-600">Niveau d'Énergie</p>
              <p className={`text-2xl font-bold ${getStatusColor(lastScan.energy, 'good')}`}>
                {lastScan.energy}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="text-sm text-gray-600">Concentration</p>
              <p className={`text-2xl font-bold ${getStatusColor(lastScan.focus, 'good')}`}>
                {lastScan.focus}%
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conseils personnalisés */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations Personnalisées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lastScan.stress > 50 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 text-sm">
                  <strong>Niveau de stress élevé:</strong> Prenez quelques minutes pour pratiquer la respiration profonde ou écoutez de la musique relaxante.
                </p>
              </div>
            )}
            {lastScan.energy < 60 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Énergie faible:</strong> Pensez à faire une courte pause et à vous hydrater.
                </p>
              </div>
            )}
            {lastScan.focus > 80 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>Excellente concentration:</strong> C'est le moment idéal pour les tâches importantes !
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scan;
