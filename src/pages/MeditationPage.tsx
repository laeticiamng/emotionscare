
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, 
  Play, 
  Pause, 
  RotateCcw,
  Timer,
  Volume2,
  Heart,
  Waves
} from 'lucide-react';

const MeditationPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedType, setSelectedType] = useState('mindfulness');

  const meditationTypes = [
    { id: 'mindfulness', name: 'Pleine Conscience', icon: Brain, color: 'blue' },
    { id: 'breathing', name: 'Respiration', icon: Waves, color: 'green' },
    { id: 'body-scan', name: 'Scan Corporel', icon: Heart, color: 'purple' },
    { id: 'loving-kindness', name: 'Bienveillance', icon: Heart, color: 'pink' }
  ];

  const durations = [5, 10, 15, 20, 30];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < selectedDuration * 60) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    } else if (currentTime >= selectedDuration * 60) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, selectedDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / (selectedDuration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Méditation Guidée
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Trouvez votre calme intérieur avec nos séances de méditation
          </p>
        </div>

        {/* Types de méditation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Choisissez votre pratique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {meditationTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className={`h-8 w-8 mx-auto mb-2 text-${type.color}-600`} />
                    <p className="text-sm font-medium">{type.name}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Durée */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Durée de la séance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              {durations.map((duration) => (
                <Button
                  key={duration}
                  variant={selectedDuration === duration ? "default" : "outline"}
                  onClick={() => setSelectedDuration(duration)}
                  className="min-w-[60px]"
                >
                  {duration}min
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lecteur de méditation */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  {isPlaying ? (
                    <Pause className="h-12 w-12 text-blue-600" />
                  ) : (
                    <Play className="h-12 w-12 text-blue-600 ml-1" />
                  )}
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold mb-2">
                {meditationTypes.find(t => t.id === selectedType)?.name}
              </h3>
              <p className="text-gray-600">Séance de {selectedDuration} minutes</p>
            </div>

            {/* Barre de progression */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(selectedDuration * 60)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Contrôles */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setCurrentTime(0);
                  setIsPlaying(false);
                }}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              
              <Button
                size="lg"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-8"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 mr-2" />
                ) : (
                  <Play className="h-6 w-6 mr-2" />
                )}
                {isPlaying ? 'Pause' : 'Commencer'}
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-4">
              <Volume2 className="h-5 w-5 text-gray-500" />
              <Slider
                defaultValue={[75]}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">7</div>
              <p className="text-gray-600">Jours consécutifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">45</div>
              <p className="text-gray-600">Minutes cette semaine</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">12</div>
              <p className="text-gray-600">Séances terminées</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeditationPage;
