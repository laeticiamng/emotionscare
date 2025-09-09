/**
 * JournalPage - Module Journal Vocal (/app/journal)
 * Expression émotionnelle libre et analyse IA
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { 
  Mic, 
  MicOff,
  Type,
  Play,
  Pause,
  Square,
  Save,
  Heart,
  Lock,
  Calendar as CalendarIcon,
  TrendingUp,
  FileText,
  ArrowLeft,
  Volume2,
  Download,
  Share2,
  Sparkles,
  Brain,
  Eye,
  EyeOff,
  Search,
  Filter
} from 'lucide-react';

interface JournalEntry {
  id: string;
  date: Date;
  type: 'voice' | 'text';
  title: string;
  content: string;
  duration?: string;
  mood: string;
  emotions: string[];
  insights: string[];
  isPrivate: boolean;
  audioUrl?: string;
}

interface EmotionAnalysis {
  dominantEmotion: string;
  confidence: number;
  emotionalTrends: string[];
  insights: string[];
  recommendations: string[];
}

const JournalPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textContent, setTextContent] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'voice' | 'text' | 'history'>('voice');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<EmotionAnalysis | null>(null);
  const [showPrivate, setShowPrivate] = useState(true);

  // Exemple d'entrées de journal
  const [journalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date(),
      type: 'voice',
      title: 'Réflexions du matin',
      content: 'Session vocale de 3min 24s',
      duration: '3:24',
      mood: 'Optimiste',
      emotions: ['Motivation', 'Confiance', 'Sérénité'],
      insights: [
        'Sentiment de progression dans vos objectifs',
        'Énergie positive stable',
        'Prêt pour de nouveaux défis'
      ],
      isPrivate: true,
      audioUrl: '/audio/journal-1.mp3'
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000),
      type: 'text',
      title: 'Journée intense au travail',
      content: 'Aujourd\'hui a été particulièrement chargé avec la présentation client...',
      mood: 'Fatigué mais satisfait',
      emotions: ['Accomplissement', 'Fatigue', 'Fierté'],
      insights: [
        'Gestion du stress efficace',
        'Satisfaction du travail accompli',
        'Besoin de récupération'
      ],
      isPrivate: true
    },
    {
      id: '3',
      date: new Date(Date.now() - 172800000),
      type: 'voice',
      title: 'Weekend détente',
      content: 'Session vocale de 2min 15s',
      duration: '2:15',
      mood: 'Paisible',
      emotions: ['Relaxation', 'Gratitude', 'Joie'],
      insights: [
        'Moment de pause bénéfique',
        'Reconnexion avec soi-même',
        'Équilibre vie pro-perso'
      ],
      isPrivate: false,
      audioUrl: '/audio/journal-3.mp3'
    }
  ]);

  // Minuteur d'enregistrement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
  };

  const pauseRecording = () => {
    setIsPaused(true);
  };

  const resumeRecording = () => {
    setIsPaused(false);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    analyzeContent();
  };

  const analyzeContent = () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse IA
    setTimeout(() => {
      setCurrentAnalysis({
        dominantEmotion: 'Réfléchi',
        confidence: 87,
        emotionalTrends: ['Croissance personnelle', 'Introspection', 'Optimisme'],
        insights: [
          'Vous montrez une grande capacité de réflexion',
          'Votre expression révèle une évolution positive',
          'Bonne gestion de vos émotions'
        ],
        recommendations: [
          'Continuez cette pratique d\'expression libre',
          'Explorez vos insights plus profondément',
          'Partagez vos réflexions si vous le souhaitez'
        ]
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveEntry = () => {
    // Logique de sauvegarde
    console.log('Sauvegarde de l\'entrée...');
  };

  const filteredEntries = journalEntries.filter(entry => 
    showPrivate || !entry.isPrivate
  );

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Mic className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Journal Émotionnel</h1>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                100% Privé
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowPrivate(!showPrivate)}>
                {showPrivate ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {showPrivate ? 'Tout voir' : 'Public seulement'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="space-y-6">
          {/* Introduction */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Votre espace d'expression libre
                </h2>
                <p className="text-muted-foreground">
                  Exprimez-vous librement par la voix ou l'écriture. Vos pensées sont analysées pour vous aider dans votre développement personnel.
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Vocal
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Écrit
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Historique
              </TabsTrigger>
            </TabsList>

            {/* JOURNAL VOCAL */}
            <TabsContent value="voice" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="h-5 w-5" />
                      Enregistrement Vocal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Interface d'enregistrement */}
                    <div className="text-center space-y-4">
                      <div className="relative w-32 h-32 mx-auto">
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                          isRecording ? 'bg-red-100 dark:bg-red-950/50' : 'bg-primary/10'
                        } transition-colors`}>
                          {isRecording ? (
                            <div className="relative">
                              <Mic className="h-12 w-12 text-red-600" />
                              {!isPaused && (
                                <div className="absolute inset-0 w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              )}
                            </div>
                          ) : (
                            <Mic className="h-12 w-12 text-primary" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-2xl font-mono font-bold">
                          {formatRecordingTime(recordingTime)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isRecording ? (
                            isPaused ? 'Enregistrement en pause' : 'Enregistrement en cours...'
                          ) : (
                            'Prêt à enregistrer'
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Contrôles d'enregistrement */}
                    <div className="flex items-center justify-center gap-4">
                      {!isRecording ? (
                        <Button onClick={startRecording} size="lg" className="gap-2">
                          <Mic className="h-4 w-4" />
                          Commencer
                        </Button>
                      ) : (
                        <>
                          <Button 
                            onClick={isPaused ? resumeRecording : pauseRecording}
                            variant="outline"
                            size="lg"
                            className="gap-2"
                          >
                            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                            {isPaused ? 'Reprendre' : 'Pause'}
                          </Button>
                          
                          <Button onClick={stopRecording} size="lg" className="gap-2">
                            <Square className="h-4 w-4" />
                            Terminer
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Conseils */}
                    <div className="text-center">
                      <h4 className="font-medium mb-2">Conseils pour un bon enregistrement</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Trouvez un endroit calme</li>
                        <li>• Exprimez-vous naturellement</li>
                        <li>• Parlez de vos ressentis actuels</li>
                        <li>• Prenez votre temps</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Analyse et résultats */}
                {(isAnalyzing || currentAnalysis) && (
                  <Card className="animate-scale-in">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Analyse Émotionnelle
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isAnalyzing ? (
                        <div className="text-center space-y-4 py-6">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p className="text-sm text-muted-foreground">
                            Analyse de votre expression en cours...
                          </p>
                        </div>
                      ) : currentAnalysis && (
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">
                              {currentAnalysis.dominantEmotion}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Confiance: {currentAnalysis.confidence}%
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Tendances émotionnelles :</h4>
                              <div className="flex gap-2 flex-wrap">
                                {currentAnalysis.emotionalTrends.map((trend, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {trend}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-sm mb-2">Insights :</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {currentAnalysis.insights.map((insight, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <Sparkles className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-medium text-sm mb-2">Recommandations :</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {currentAnalysis.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <Heart className="h-3 w-3 mt-0.5 text-green-600 shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button size="sm" onClick={saveEntry} className="flex-1 gap-2">
                              <Save className="h-4 w-4" />
                              Sauvegarder
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2">
                              <Share2 className="h-4 w-4" />
                              Partager
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* JOURNAL ÉCRIT */}
            <TabsContent value="text" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Expression Écrite
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Comment vous sentez-vous aujourd'hui ?
                      </label>
                      <Textarea
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        placeholder="Exprimez librement vos pensées, vos émotions, vos réflexions du moment... Qu'est-ce qui vous traverse l'esprit ?"
                        className="min-h-[200px] resize-none"
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{textContent.length} caractères</span>
                        <span>Recommandé : au moins 100 caractères pour une bonne analyse</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={analyzeContent}
                        disabled={textContent.length < 20}
                        className="flex-1 gap-2"
                      >
                        <Brain className="h-4 w-4" />
                        Analyser & Sauvegarder
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Save className="h-4 w-4" />
                        Brouillon
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Suggestions d'expression</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                        <h4 className="font-medium mb-1">💭 Questions introspectives</h4>
                        <p className="text-muted-foreground italic">
                          "Qu'est-ce qui m'a le plus marqué aujourd'hui ?"<br/>
                          "Quelle émotion domine en ce moment ?"
                        </p>
                      </div>
                      
                      <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <h4 className="font-medium mb-1">🌟 Moments de gratitude</h4>
                        <p className="text-muted-foreground italic">
                          "Je suis reconnaissant(e) pour..."<br/>
                          "Aujourd'hui j'ai apprécié..."
                        </p>
                      </div>
                      
                      <div className="p-3 bg-orange-50 dark:bg-orange-950/50 rounded-lg">
                        <h4 className="font-medium mb-1">🎯 Réflexions d'objectifs</h4>
                        <p className="text-muted-foreground italic">
                          "Mes priorités pour demain sont..."<br/>
                          "J'aimerais améliorer..."
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* HISTORIQUE */}
            <TabsContent value="history" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Calendrier
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      locale={fr}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Vos entrées</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Rechercher
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrer
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredEntries.map(entry => (
                      <Card key={entry.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                entry.type === 'voice' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                              }`}>
                                {entry.type === 'voice' ? 
                                  <Mic className="h-4 w-4" /> : 
                                  <Type className="h-4 w-4" />
                                }
                              </div>
                              <div>
                                <h4 className="font-medium">{entry.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{format(entry.date, 'dd MMM yyyy', { locale: fr })}</span>
                                  {entry.duration && (
                                    <>
                                      <span>•</span>
                                      <span>{entry.duration}</span>
                                    </>
                                  )}
                                  {entry.isPrivate && <Lock className="h-3 w-3" />}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className={`${
                              entry.mood === 'Optimiste' ? 'text-green-600' :
                              entry.mood === 'Paisible' ? 'text-blue-600' :
                              'text-orange-600'
                            }`}>
                              {entry.mood}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">
                            {entry.content}
                          </p>

                          <div className="space-y-2">
                            <div className="flex gap-1 flex-wrap">
                              {entry.emotions.map((emotion, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {emotion}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                {entry.type === 'voice' && (
                                  <Button size="sm" variant="outline" className="gap-1">
                                    <Volume2 className="h-3 w-3" />
                                    Écouter
                                  </Button>
                                )}
                                <Button size="sm" variant="outline" className="gap-1">
                                  <Eye className="h-3 w-3" />
                                  Détails
                                </Button>
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost">
                                  <Download className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Share2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Statistiques */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold text-primary">47</div>
                <div className="text-sm text-muted-foreground">Entrées ce mois</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Mic className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-blue-600">23h</div>
                <div className="text-sm text-muted-foreground">Temps d'expression</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-600">Positif</div>
                <div className="text-sm text-muted-foreground">Humeur moyenne</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JournalPage;