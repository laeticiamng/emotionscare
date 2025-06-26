
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  Brain, 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Smile,
  Frown,
  Meh,
  Zap,
  Cloud,
  Sun,
  CloudRain,
  Timer,
  Target,
  BookOpen,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface EmotionEntry {
  id: string;
  emotion: string;
  intensity: number;
  triggers: string[];
  notes: string;
  timestamp: Date;
  context: string;
}

interface EmotionStat {
  name: string;
  value: number;
  color: string;
}

const EmotionsPage: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [emotionIntensity, setEmotionIntensity] = useState([5]);
  const [emotionNotes, setEmotionNotes] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('current');
  const { toast } = useToast();

  const emotions = [
    { name: 'Joie', value: 'joy', icon: '😊', color: '#22c55e' },
    { name: 'Tristesse', value: 'sadness', icon: '😢', color: '#3b82f6' },
    { name: 'Colère', value: 'anger', icon: '😡', color: '#ef4444' },
    { name: 'Peur', value: 'fear', icon: '😰', color: '#f59e0b' },
    { name: 'Surprise', value: 'surprise', icon: '😮', color: '#8b5cf6' },
    { name: 'Dégoût', value: 'disgust', icon: '🤢', color: '#10b981' },
    { name: 'Neutral', value: 'neutral', icon: '😐', color: '#6b7280' },
    { name: 'Excitation', value: 'excitement', icon: '🤩', color: '#f97316' }
  ];

  const triggers = [
    'Travail', 'Famille', 'Relations', 'Santé', 'Finances', 'Social', 
    'Projet personnel', 'Transport', 'Météo', 'Actualités', 'Sport', 'Loisirs'
  ];

  const [emotionHistory] = useState<EmotionEntry[]>([
    {
      id: '1',
      emotion: 'joy',
      intensity: 8,
      triggers: ['Travail', 'Projet personnel'],
      notes: 'Présentation réussie au travail',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      context: 'Bureau'
    },
    {
      id: '2',
      emotion: 'stress',
      intensity: 6,
      triggers: ['Transport', 'Travail'],
      notes: 'Embouteillages matinaux',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      context: 'Transport'
    }
  ]);

  const weeklyData = [
    { day: 'Lun', score: 6.5, sessions: 2 },
    { day: 'Mar', score: 7.2, sessions: 3 },
    { day: 'Mer', score: 5.8, sessions: 1 },
    { day: 'Jeu', score: 8.1, sessions: 4 },
    { day: 'Ven', score: 7.5, sessions: 2 },
    { day: 'Sam', score: 8.8, sessions: 3 },
    { day: 'Dim', score: 7.9, sessions: 2 }
  ];

  const emotionDistribution: EmotionStat[] = [
    { name: 'Joie', value: 35, color: '#22c55e' },
    { name: 'Neutre', value: 25, color: '#6b7280' },
    { name: 'Stress', value: 20, color: '#f59e0b' },
    { name: 'Tristesse', value: 12, color: '#3b82f6' },
    { name: 'Colère', value: 8, color: '#ef4444' }
  ];

  const handleEmotionSave = () => {
    const newEntry: EmotionEntry = {
      id: Date.now().toString(),
      emotion: currentEmotion,
      intensity: emotionIntensity[0],
      triggers: selectedTriggers,
      notes: emotionNotes,
      timestamp: new Date(),
      context: 'Manuel'
    };

    toast({
      title: "Émotion Enregistrée",
      description: "Votre état émotionnel a été sauvegardé avec succès.",
    });

    // Reset form
    setCurrentEmotion('neutral');
    setEmotionIntensity([5]);
    setEmotionNotes('');
    setSelectedTriggers([]);
  };

  const getEmotionIcon = (emotion: string) => {
    const emotionObj = emotions.find(e => e.value === emotion);
    return emotionObj?.icon || '😐';
  };

  const getEmotionColor = (emotion: string) => {
    const emotionObj = emotions.find(e => e.value === emotion);
    return emotionObj?.color || '#6b7280';
  };

  const getMoodWeather = (score: number) => {
    if (score >= 8) return { icon: Sun, text: 'Ensoleillé', color: 'text-yellow-500' };
    if (score >= 6) return { icon: Cloud, text: 'Nuageux', color: 'text-blue-400' };
    return { icon: CloudRain, text: 'Pluvieux', color: 'text-gray-500' };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" data-testid="page-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
            Analyse Émotionnelle
          </h1>
          <p className="text-xl text-muted-foreground">
            Comprenez et suivez votre état émotionnel en temps réel
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Actuel
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Analyse
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tendances
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Journal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Comment vous sentez-vous maintenant ?
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez votre émotion dominante actuelle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-4 gap-3">
                    {emotions.map((emotion) => (
                      <motion.button
                        key={emotion.value}
                        onClick={() => setCurrentEmotion(emotion.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          currentEmotion === emotion.value
                            ? 'border-primary bg-primary/10'
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{emotion.icon}</div>
                        <div className="text-xs font-medium">{emotion.name}</div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Intensité: {emotionIntensity[0]}/10
                    </label>
                    <Slider
                      value={emotionIntensity}
                      onValueChange={setEmotionIntensity}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Faible</span>
                      <span>Intense</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Déclencheurs</label>
                    <div className="flex flex-wrap gap-2">
                      {triggers.map((trigger) => (
                        <Badge
                          key={trigger}
                          variant={selectedTriggers.includes(trigger) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedTriggers(prev =>
                              prev.includes(trigger)
                                ? prev.filter(t => t !== trigger)
                                : [...prev, trigger]
                            );
                          }}
                        >
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Notes personnelles</label>
                    <Textarea
                      placeholder="Qu'est-ce qui vous fait ressentir cela ?"
                      value={emotionNotes}
                      onChange={(e) => setEmotionNotes(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>

                  <Button onClick={handleEmotionSave} className="w-full">
                    Enregistrer mon état émotionnel
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      État Actuel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-6xl">
                        {getEmotionIcon(currentEmotion)}
                      </div>
                      <div>
                        <div className="text-2xl font-bold capitalize">
                          {emotions.find(e => e.value === currentEmotion)?.name}
                        </div>
                        <div className="text-muted-foreground">
                          Intensité: {emotionIntensity[0]}/10
                        </div>
                      </div>
                      <Progress 
                        value={emotionIntensity[0] * 10} 
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="h-5 w-5 text-blue-500" />
                      Météo Émotionnelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-3">
                      {(() => {
                        const mood = getMoodWeather(emotionIntensity[0]);
                        return (
                          <>
                            <mood.icon className={`h-12 w-12 mx-auto ${mood.color}`} />
                            <div className="text-lg font-medium">{mood.text}</div>
                            <div className="text-sm text-muted-foreground">
                              Votre climat émotionnel du moment
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommandations IA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="font-medium text-blue-800">
                          Exercice de respiration
                        </div>
                        <div className="text-sm text-blue-600">
                          Basé sur votre état actuel
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <div className="font-medium text-green-800">
                          Musique relaxante
                        </div>
                        <div className="text-sm text-green-600">
                          Playlist personnalisée
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution des Émotions</CardTitle>
                  <CardDescription>Les 30 derniers jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={emotionDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {emotionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Évolution Hebdomadaire</CardTitle>
                  <CardDescription>Score de bien-être moyen</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendances Émotionnelles</CardTitle>
                <CardDescription>Analyse de votre évolution émotionnelle</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Moyenne Hebdomadaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">7.4</div>
                  <div className="text-sm text-muted-foreground">
                    +0.8 par rapport à la semaine dernière
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Émotion Dominante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">😊</span>
                    <div>
                      <div className="font-bold">Joie</div>
                      <div className="text-sm text-muted-foreground">35% du temps</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trigger Principal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-bold">Travail</div>
                  <div className="text-sm text-muted-foreground">
                    Mentionné dans 60% des entrées
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique Émotionnel</CardTitle>
                <CardDescription>Vos dernières entrées émotionnelles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emotionHistory.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getEmotionIcon(entry.emotion)}</span>
                          <div>
                            <div className="font-medium capitalize">{entry.emotion}</div>
                            <div className="text-sm text-muted-foreground">
                              Intensité: {entry.intensity}/10
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {entry.timestamp.toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {entry.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      
                      {entry.triggers.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {entry.triggers.map((trigger) => (
                            <Badge key={trigger} variant="secondary" className="text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {entry.notes && (
                        <div className="mt-3 p-2 bg-muted rounded text-sm">
                          {entry.notes}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default EmotionsPage;
