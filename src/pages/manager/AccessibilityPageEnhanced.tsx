import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Palette, 
  MousePointer, 
  Keyboard,
  Play,
  Settings,
  CheckCircle,
  AlertTriangle,
  Monitor,
  RefreshCw,
  Zap
} from 'lucide-react';

interface AccessibilityTest {
  category: string;
  test: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  description: string;
  impact: 'low' | 'moderate' | 'serious' | 'critical';
}

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  focusIndicators: boolean;
  audioDescriptions: boolean;
  fontSize: number;
  lineHeight: number;
}

const AccessibilityPageEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isScanning, setIsScanning] = useState(false);
  const [overallScore, setOverallScore] = useState(87);
  
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: true,
    focusIndicators: true,
    audioDescriptions: false,
    fontSize: 16,
    lineHeight: 1.5
  });

  const [tests, setTests] = useState<AccessibilityTest[]>([
    {
      category: 'Contraste',
      test: 'Ratio de contraste des couleurs',
      status: 'pass',
      score: 95,
      description: 'Tous les textes respectent le ratio minimum de 4.5:1',
      impact: 'serious'
    },
    {
      category: 'Navigation',
      test: 'Navigation clavier',
      status: 'pass',
      score: 92,
      description: 'Tous les éléments sont accessibles au clavier',
      impact: 'critical'
    },
    {
      category: 'Sémantique',
      test: 'Structure HTML',
      status: 'warning',
      score: 78,
      description: 'Quelques améliorations possibles dans les titres',
      impact: 'moderate'
    },
    {
      category: 'Images',
      test: 'Textes alternatifs',
      status: 'pass',
      score: 88,
      description: 'La plupart des images ont des alt appropriés',
      impact: 'serious'
    },
    {
      category: 'Formulaires',
      test: 'Labels et descriptions',
      status: 'fail',
      score: 65,
      description: 'Certains champs manquent de labels explicites',
      impact: 'critical'
    },
    {
      category: 'Médias',
      test: 'Sous-titres et transcriptions',
      status: 'warning',
      score: 70,
      description: 'Transcriptions disponibles, sous-titres en cours',
      impact: 'moderate'
    }
  ]);

  const wcagLevels = {
    A: { passed: 23, total: 25, percentage: 92 },
    AA: { passed: 18, total: 22, percentage: 82 },
    AAA: { passed: 8, total: 15, percentage: 53 }
  };

  const handleRunAccessibilityScan = async () => {
    setIsScanning(true);
    // Simulate accessibility scan
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update scores randomly to simulate scan results
    const newTests = tests.map(test => ({
      ...test,
      score: Math.max(50, Math.min(100, test.score + (Math.random() - 0.5) * 20))
    }));
    setTests(newTests);
    
    const newOverallScore = Math.round(newTests.reduce((sum, test) => sum + test.score, 0) / newTests.length);
    setOverallScore(newOverallScore);
    setIsScanning(false);
  };

  const getStatusIcon = (status: AccessibilityTest['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: AccessibilityTest['status']) => {
    switch (status) {
      case 'pass': return 'text-green-600';
      case 'fail': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
    }
  };

  const getImpactBadge = (impact: AccessibilityTest['impact']) => {
    const variants: Record<string, any> = {
      low: 'secondary',
      moderate: 'outline',
      serious: 'default',
      critical: 'destructive'
    };
    return variants[impact] || 'outline';
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Apply settings to document
    if (key === 'highContrast') {
      document.documentElement.classList.toggle('high-contrast', value);
    }
    if (key === 'reducedMotion') {
      document.documentElement.classList.toggle('reduce-motion', value);
    }
    if (key === 'fontSize') {
      document.documentElement.style.fontSize = `${value}px`;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Eye className="h-8 w-8 text-primary" />
            Centre d'Accessibilité
          </h1>
          <p className="text-muted-foreground mt-2">
            Conformité WCAG et expérience utilisateur inclusive
          </p>
        </div>
        <Button onClick={handleRunAccessibilityScan} disabled={isScanning}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Analyse...' : 'Scanner'}
        </Button>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Score d'Accessibilité Global
              <Badge variant={overallScore >= 90 ? "default" : overallScore >= 70 ? "secondary" : "destructive"}>
                {overallScore}/100
              </Badge>
            </CardTitle>
            <CardDescription>
              Évaluation selon les critères WCAG 2.1
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallScore} className="h-3 mb-6" />
            
            {/* WCAG Levels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(wcagLevels).map(([level, data]) => (
                <div key={level} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold mb-2">WCAG {level}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {data.passed}/{data.total} critères
                  </div>
                  <Progress value={data.percentage} className="h-2" />
                  <div className="text-xs mt-1">{data.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="tests">Tests Détaillés</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="tools">Outils</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test, index) => (
              <motion.div
                key={test.test}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{test.category}</CardTitle>
                      {getStatusIcon(test.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{test.test}</span>
                          <span className={`text-sm font-bold ${getStatusColor(test.status)}`}>
                            {test.score}%
                          </span>
                        </div>
                        <Progress value={test.score} className="h-2" />
                      </div>
                      <p className="text-xs text-muted-foreground">{test.description}</p>
                      <Badge variant={getImpactBadge(test.impact)} className="text-xs">
                        Impact {test.impact}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Tests Tab */}
        <TabsContent value="tests" className="space-y-4">
          {tests.map((test, index) => (
            <motion.div
              key={test.test}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(test.status)}
                        <h4 className="font-semibold">{test.test}</h4>
                        <Badge variant="outline">{test.category}</Badge>
                        <Badge variant={getImpactBadge(test.impact)}>
                          {test.impact}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{test.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Progress value={test.score} className="w-24 h-2" />
                          <span className={`font-medium ${getStatusColor(test.status)}`}>
                            {test.score}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Tester
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres Visuels
                </CardTitle>
                <CardDescription>
                  Configuration de l'affichage pour l'accessibilité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Contraste élevé</label>
                    <p className="text-sm text-muted-foreground">
                      Améliore la lisibilité des textes
                    </p>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(value) => updateSetting('highContrast', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Texte large</label>
                    <p className="text-sm text-muted-foreground">
                      Augmente la taille des textes
                    </p>
                  </div>
                  <Switch
                    checked={settings.largeText}
                    onCheckedChange={(value) => updateSetting('largeText', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Animations réduites</label>
                    <p className="text-sm text-muted-foreground">
                      Limite les mouvements
                    </p>
                  </div>
                  <Switch
                    checked={settings.reducedMotion}
                    onCheckedChange={(value) => updateSetting('reducedMotion', value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Taille de police: {settings.fontSize}px</label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={(value) => updateSetting('fontSize', value[0])}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Hauteur de ligne: {settings.lineHeight}</label>
                  <Slider
                    value={[settings.lineHeight]}
                    onValueChange={(value) => updateSetting('lineHeight', value[0])}
                    min={1}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Paramètres Audio
                </CardTitle>
                <CardDescription>
                  Configuration pour les technologies d'assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Lecteur d'écran</label>
                    <p className="text-sm text-muted-foreground">
                      Optimisations pour NVDA, JAWS, etc.
                    </p>
                  </div>
                  <Switch
                    checked={settings.screenReader}
                    onCheckedChange={(value) => updateSetting('screenReader', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Indicateurs de focus</label>
                    <p className="text-sm text-muted-foreground">
                      Améliore la navigation clavier
                    </p>
                  </div>
                  <Switch
                    checked={settings.focusIndicators}
                    onCheckedChange={(value) => updateSetting('focusIndicators', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Descriptions audio</label>
                    <p className="text-sm text-muted-foreground">
                      Pour le contenu multimédia
                    </p>
                  </div>
                  <Switch
                    checked={settings.audioDescriptions}
                    onCheckedChange={(value) => updateSetting('audioDescriptions', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Simulateur Daltonisme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Testez votre interface avec différents types de daltonisme
                </p>
                <Button className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Activer la simulation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Navigation Clavier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Testez la navigation sans souris
                </p>
                <Button className="w-full">
                  <MousePointer className="h-4 w-4 mr-2" />
                  Mode clavier seul
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Lecteur d'Écran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Simulez l'expérience avec un lecteur d'écran
                </p>
                <Button className="w-full">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Démarrer simulation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Analyseur de Contraste
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Vérifiez les ratios de contraste en temps réel
                </p>
                <Button className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Analyser les couleurs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Validateur HTML
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Vérifiez la sémantique et la structure
                </p>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Valider le code
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Test Automatisé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyse complète avec axe-core
                </p>
                <Button 
                  className="w-full" 
                  onClick={handleRunAccessibilityScan}
                  disabled={isScanning}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                  {isScanning ? 'Analyse...' : 'Lancer les tests'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Ces outils sont des aides au développement. Un test manuel avec de vrais utilisateurs 
              reste indispensable pour garantir une accessibilité optimale.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccessibilityPageEnhanced;