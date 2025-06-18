
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Brain, 
  Smile, 
  Frown, 
  Meh,
  Angry,
  Zap,
  Play,
  Pause,
  Volume2,
  Mic,
  Camera,
  BarChart3,
  History,
  TrendingUp,
  Users,
  Calendar,
  MessageCircle
} from 'lucide-react';

const ScanPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);

  const emotions = [
    { name: 'Joyeux', icon: Smile, color: 'text-yellow-500', level: 85 },
    { name: 'Calme', icon: Heart, color: 'text-blue-500', level: 70 },
    { name: 'Énergique', icon: Zap, color: 'text-orange-500', level: 60 },
    { name: 'Pensif', icon: Brain, color: 'text-purple-500', level: 45 },
    { name: 'Neutre', icon: Meh, color: 'text-gray-500', level: 30 },
    { name: 'Triste', icon: Frown, color: 'text-blue-600', level: 20 },
    { name: 'Stressé', icon: Angry, color: 'text-red-500', level: 15 }
  ];

  const recentScans = [
    { date: '2024-06-18', time: '14:30', emotion: 'Joyeux', score: 85 },
    { date: '2024-06-18', time: '09:15', emotion: 'Calme', score: 70 },
    { date: '2024-06-17', time: '16:45', emotion: 'Énergique', score: 60 },
    { date: '2024-06-17', time: '11:20', emotion: 'Pensif', score: 45 }
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulation d'un scan
    setTimeout(() => {
      setCurrentEmotion('Joyeux');
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Scanner d'Émotions
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Analysez votre état émotionnel en temps réel grâce à notre technologie avancée d'IA
        </p>
      </div>

      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scan">Scanner</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6">
          {/* Zone de scan principal */}
          <Card className="relative overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Brain className="h-6 w-6" />
                Analyse Émotionnelle
              </CardTitle>
              <CardDescription>
                Utilisez votre voix, votre visage ou du texte pour analyser vos émotions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Boutons de scan */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-20 flex flex-col gap-2"
                  onClick={handleStartScan}
                  disabled={isScanning}
                >
                  <Mic className="h-6 w-6" />
                  Scan Vocal
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-20 flex flex-col gap-2"
                  onClick={handleStartScan}
                  disabled={isScanning}
                >
                  <Camera className="h-6 w-6" />
                  Scan Facial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-20 flex flex-col gap-2"
                  onClick={handleStartScan}
                  disabled={isScanning}
                >
                  <MessageCircle className="h-6 w-6" />
                  Scan Textuel
                </Button>
              </div>

              {/* Zone de résultat */}
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                {isScanning ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <Brain className="h-16 w-16 mx-auto text-primary" />
                    </div>
                    <p className="text-lg font-medium">Analyse en cours...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                ) : currentEmotion ? (
                  <div className="space-y-4">
                    <div className="text-6xl">😊</div>
                    <h3 className="text-2xl font-bold text-primary">Joyeux</h3>
                    <p className="text-lg">Score de bien-être: 85/100</p>
                    <Badge variant="secondary" className="text-sm">
                      Excellente humeur détectée
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Heart className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="text-lg text-muted-foreground">
                      Cliquez sur l'un des boutons ci-dessus pour commencer une analyse
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Émotions détectées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Palette Émotionnelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {emotions.map((emotion) => {
                  const IconComponent = emotion.icon;
                  return (
                    <div key={emotion.name} className="text-center space-y-2">
                      <div className={`p-3 rounded-full bg-muted ${emotion.color}`}>
                        <IconComponent className="h-6 w-6 mx-auto" />
                      </div>
                      <p className="text-sm font-medium">{emotion.name}</p>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-primary h-1 rounded-full" 
                          style={{width: `${emotion.level}%`}}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground">{emotion.level}%</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScans.map((scan, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {scan.emotion === 'Joyeux' ? '😊' : 
                         scan.emotion === 'Calme' ? '😌' : 
                         scan.emotion === 'Énergique' ? '⚡' : '🤔'}
                      </div>
                      <div>
                        <p className="font-medium">{scan.emotion}</p>
                        <p className="text-sm text-muted-foreground">
                          {scan.date} à {scan.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{scan.score}/100</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tendance Hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">+15%</p>
                    <p className="text-sm text-muted-foreground">Amélioration</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Score Moyen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">72</p>
                  <p className="text-sm text-muted-foreground">Cette semaine</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scans Réalisés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-sm text-muted-foreground">Ce mois-ci</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Vue d'Équipe
              </CardTitle>
              <CardDescription>
                Aperçu anonymisé du bien-être de votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">Score d'équipe moyen</h4>
                    <p className="text-2xl font-bold text-green-600">78/100</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Participation</h4>
                    <p className="text-2xl font-bold text-blue-600">89%</p>
                  </div>
                </div>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Données agrégées et anonymisées conformément au RGPD
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScanPage;
