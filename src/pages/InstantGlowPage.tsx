
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Sun, Heart, Zap, Play, Pause, RotateCcw } from 'lucide-react';

const InstantGlowPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentGlow, setCurrentGlow] = useState('energy');
  const [timer, setTimer] = useState(60);

  const glowTypes = {
    energy: {
      name: 'Énergie Vitale',
      color: 'from-orange-400 to-red-500',
      icon: Zap,
      description: 'Boostez votre énergie instantanément'
    },
    calm: {
      name: 'Sérénité Profonde',
      color: 'from-blue-400 to-purple-500',
      icon: Heart,
      description: 'Trouvez la paix intérieure en quelques secondes'
    },
    joy: {
      name: 'Joie Rayonnante',
      color: 'from-yellow-400 to-pink-500',
      icon: Sun,
      description: 'Illuminez votre humeur instantanément'
    },
    focus: {
      name: 'Concentration Laser',
      color: 'from-green-400 to-teal-500',
      icon: Sparkles,
      description: 'Aiguisez votre focus en un instant'
    }
  };

  const toggleGlow = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setTimer(60);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge className="bg-yellow-100 text-yellow-800 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Bien-être Instantané
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Instant Glow
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transformez votre état émotionnel en quelques secondes avec nos techniques de bien-être express
          </p>
        </div>

        {/* Main Glow Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Glow Selector */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Choisissez Votre Glow</CardTitle>
                <CardDescription>
                  Sélectionnez l'état que vous souhaitez atteindre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(glowTypes).map(([key, glow]) => (
                  <Card 
                    key={key}
                    className={`cursor-pointer transition-all duration-300 ${
                      currentGlow === key 
                        ? 'ring-2 ring-orange-500 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setCurrentGlow(key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${glow.color}`}>
                          <glow.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{glow.name}</h3>
                          <p className="text-sm text-muted-foreground">{glow.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Glow Activator */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-orange-500" />
                {glowTypes[currentGlow].name}
              </CardTitle>
              <CardDescription>
                {glowTypes[currentGlow].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visual Indicator */}
              <div className={`relative h-48 rounded-xl bg-gradient-to-r ${glowTypes[currentGlow].color} ${
                isActive ? 'animate-pulse' : ''
              } flex items-center justify-center`}>
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">
                    {currentGlow === 'energy' ? '⚡' : 
                     currentGlow === 'calm' ? '🧘' : 
                     currentGlow === 'joy' ? '☀️' : '🎯'}
                  </div>
                  {isActive && (
                    <div className="text-xl font-bold">
                      {timer}s
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex space-x-4">
                <Button 
                  onClick={toggleGlow}
                  className={`flex-1 ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Arrêter
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Activer le Glow
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setTimer(60)}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Instructions :</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Installez-vous confortablement</li>
                  <li>• Fermez les yeux si possible</li>
                  <li>• Respirez profondément</li>
                  <li>• Visualisez l'énergie {glowTypes[currentGlow].name.toLowerCase()}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-500 mb-2">47</div>
              <div className="text-sm text-muted-foreground">Sessions aujourd'hui</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-500 mb-2">12min</div>
              <div className="text-sm text-muted-foreground">Temps total</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-pink-500 mb-2">85%</div>
              <div className="text-sm text-muted-foreground">Taux de satisfaction</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-500 mb-2">Niveau 3</div>
              <div className="text-sm text-muted-foreground">Maître du Glow</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <Card className="bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-orange-600" />
              Accès Rapide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col">
                <Zap className="w-6 h-6 mb-1" />
                <span className="text-xs">Énergie 30s</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <Heart className="w-6 h-6 mb-1" />
                <span className="text-xs">Calme 60s</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <Sun className="w-6 h-6 mb-1" />
                <span className="text-xs">Joie 45s</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <Sparkles className="w-6 h-6 mb-1" />
                <span className="text-xs">Focus 90s</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstantGlowPage;
