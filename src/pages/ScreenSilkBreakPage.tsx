
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Monitor, Eye, Moon, Sun, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const ScreenSilkBreakPage = () => {
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakDuration, setBreakDuration] = useState(20);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [screenTime, setScreenTime] = useState(0);
  const [eyeStrainLevel, setEyeStrainLevel] = useState(45);
  const [breakType, setBreakType] = useState('eyes');

  const breakTypes = [
    {
      id: 'eyes',
      name: 'Repos Oculaire',
      icon: <Eye className="h-5 w-5" />,
      description: 'Exercices pour soulager la fatigue oculaire',
      color: 'bg-blue-500'
    },
    {
      id: 'mind',
      name: 'Pause Mentale', 
      icon: <Moon className="h-5 w-5" />,
      description: 'Méditation courte et relaxation',
      color: 'bg-purple-500'
    },
    {
      id: 'body',
      name: 'Mouvement',
      icon: <Sun className="h-5 w-5" />,
      description: 'Étirements et mobilité',
      color: 'bg-green-500'
    }
  ];

  const exercises = {
    eyes: [
      'Regardez un point distant pendant 20 secondes',
      'Clignez des yeux lentement 10 fois',
      'Faites des cercles avec vos yeux',
      'Massez délicatement vos tempes'
    ],
    mind: [
      'Respirez profondément 5 fois',
      'Écoutez les sons autour de vous',
      'Visualisez un lieu paisible',
      'Libérez les tensions de votre corps'
    ],
    body: [
      'Étirez vos bras vers le ciel',
      'Roulez vos épaules en arrière',
      'Tournez votre cou doucement',
      'Levez-vous et marchez un peu'
    ]
  };

  const stats = [
    { label: 'Temps d\'écran aujourd\'hui', value: '4h 32min', trend: '+12%' },
    { label: 'Pauses prises', value: '8/12', trend: '67%' },
    { label: 'Fatigue oculaire', value: 'Modérée', trend: '-15%' },
    { label: 'Productivité', value: '85%', trend: '+8%' }
  ];

  useEffect(() => {
    let interval;
    if (isBreakActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBreakActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreakActive, timeRemaining]);

  useEffect(() => {
    // Simuler le temps d'écran qui augmente
    const screenInterval = setInterval(() => {
      setScreenTime(prev => prev + 1);
    }, 60000); // +1 minute chaque minute

    return () => clearInterval(screenInterval);
  }, []);

  const startBreak = () => {
    setTimeRemaining(breakDuration * 60);
    setIsBreakActive(true);
  };

  const pauseBreak = () => {
    setIsBreakActive(!isBreakActive);
  };

  const resetBreak = () => {
    setIsBreakActive(false);
    setTimeRemaining(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatScreenTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-teal-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="secondary" className="mb-4 bg-teal-600">
            <Monitor className="h-4 w-4 mr-2" />
            Screen Silk Break
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            Protégez Vos Yeux et Votre Bien-être
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Prenez des pauses intelligentes pour réduire la fatigue oculaire et améliorer votre productivité.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 flex items-center justify-center">
                <Monitor className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-white">Pause Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-400 mb-2" data-testid="timer">
                  {isBreakActive ? formatTime(timeRemaining) : formatTime(breakDuration * 60)}
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  {isBreakActive ? 'Temps restant' : 'Durée configurée'}
                </p>
                <Button 
                  onClick={isBreakActive ? pauseBreak : startBreak}
                  className="w-full bg-teal-600 hover:bg-teal-700 mb-2"
                >
                  {isBreakActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isBreakActive ? 'Pause' : 'Démarrer'}
                </Button>
                {isBreakActive && (
                  <Button variant="outline" onClick={resetBreak} className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-400 mb-1">{stat.value}</div>
                <div className={`text-sm ${
                  stat.trend.startsWith('+') ? 'text-red-400' : 
                  stat.trend.startsWith('-') ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {stat.trend} vs hier
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="break" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="break" className="data-[state=active]:bg-teal-600">
              Pause Now
            </TabsTrigger>
            <TabsTrigger value="exercises" className="data-[state=active]:bg-teal-600">
              Exercices
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-teal-600">
              Paramètres
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-teal-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="break" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Types de Pause</CardTitle>
                  <CardDescription className="text-gray-400">
                    Choisissez le type de pause adapté à vos besoins
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {breakTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        breakType === type.id 
                          ? 'border-teal-500 bg-teal-500/10' 
                          : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                      }`}
                      onClick={() => setBreakType(type.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${type.color} text-white`}>
                          {type.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{type.name}</h4>
                          <p className="text-sm text-gray-400">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Configuration</CardTitle>
                  <CardDescription className="text-gray-400">
                    Personnalisez votre expérience de pause
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Durée de la pause: {breakDuration} minutes
                    </label>
                    <Slider
                      value={[breakDuration]}
                      onValueChange={(value) => setBreakDuration(value[0])}
                      max={60}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>5 min</span>
                      <span>60 min</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Niveau de fatigue oculaire: {eyeStrainLevel}%
                    </label>
                    <Slider
                      value={[eyeStrainLevel]}
                      onValueChange={(value) => setEyeStrainLevel(value[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Aucune</span>
                      <span>Élevée</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="text-sm text-gray-300 mb-2">
                      Recommandation: Pause {breakTypes.find(t => t.id === breakType)?.name.toLowerCase()}
                    </div>
                    <Progress value={(100 - eyeStrainLevel)} className="mb-2" />
                    <p className="text-xs text-gray-400">
                      Basé sur votre niveau de fatigue actuel
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {breakTypes.map((type) => (
                <Card key={type.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${type.color} text-white`}>
                        {type.icon}
                      </div>
                      <CardTitle className="text-white">{type.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {exercises[type.id].map((exercise, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-semibold mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-300">{exercise}</p>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700">
                      Faire cet exercice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres Avancés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Notifications</h4>
                    <div className="space-y-3">
                      {[
                        'Rappels de pause automatiques',
                        'Alertes de fatigue oculaire',
                        'Statistiques quotidiennes',
                        'Conseils personnalisés'
                      ].map((setting, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">{setting}</span>
                          <div className="w-10 h-6 bg-teal-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Horaires</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-300">Heures de travail</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <input type="time" defaultValue="09:00" className="bg-slate-700 border-slate-600 rounded px-2 py-1 text-white text-sm" />
                          <input type="time" defaultValue="17:00" className="bg-slate-700 border-slate-600 rounded px-2 py-1 text-white text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-300">Fréquence des rappels</label>
                        <select className="w-full bg-slate-700 border-slate-600 rounded px-2 py-1 text-white text-sm mt-1">
                          <option>Toutes les 20 minutes</option>
                          <option>Toutes les 30 minutes</option>
                          <option>Toutes les 45 minutes</option>
                          <option>Toutes les heures</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Statistiques de la Semaine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { day: 'Lundi', screenTime: '5h 20min', breaks: 12, strain: 35 },
                      { day: 'Mardi', screenTime: '4h 45min', breaks: 10, strain: 42 },
                      { day: 'Mercredi', screenTime: '6h 10min', breaks: 8, strain: 55 },
                      { day: 'Jeudi', screenTime: '4h 32min', breaks: 11, strain: 38 },
                      { day: 'Vendredi', screenTime: '3h 50min', breaks: 9, strain: 30 }
                    ].map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="font-medium text-white">{day.day}</div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-blue-400">{day.screenTime}</span>
                          <span className="text-green-400">{day.breaks} pauses</span>
                          <span className={`${day.strain > 50 ? 'text-red-400' : 'text-yellow-400'}`}>
                            {day.strain}% fatigue
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recommandations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-teal-600/20 border border-teal-600 rounded-lg">
                      <h4 className="font-semibold text-teal-400 mb-2">🎯 Excellent progrès !</h4>
                      <p className="text-sm text-gray-300">
                        Vous avez réduit votre fatigue oculaire de 15% cette semaine
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-600/20 border border-yellow-600 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Attention</h4>
                      <p className="text-sm text-gray-300">
                        Votre temps d'écran a augmenté de 12% par rapport à la semaine dernière
                      </p>
                    </div>
                    <div className="p-4 bg-blue-600/20 border border-blue-600 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-2">💡 Conseil</h4>
                      <p className="text-sm text-gray-300">
                        Essayez la règle 20-20-20: regardez quelque chose à 20 pieds pendant 20 secondes toutes les 20 minutes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScreenSilkBreakPage;
