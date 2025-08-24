import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen,
  Mic,
  MicOff,
  Sparkles,
  Brain,
  Heart,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  Eye,
  PenTool,
  Save,
  Lock,
  Unlock,
  Camera,
  Smile,
  Frown,
  Meh,
  BarChart3,
  Target,
  Zap,
  Moon,
  Sun,
  Cloud,
  Activity,
  MessageCircle,
  Tag,
  Clock,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TypewriterEffect from '@/components/chat/TypewriterEffect';

interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: 'positive' | 'neutral' | 'negative';
  emotions: string[];
  aiInsights: string[];
  isPrivate: boolean;
  voiceNote?: {
    duration: number;
    transcript: string;
  };
  biometricData?: {
    heartRate: number;
    stress: number;
    energy: number;
  };
  aiSuggestions?: string[];
  tags: string[];
  readingTime: number;
}

interface EmotionalAnalysis {
  dominantEmotion: string;
  confidence: number;
  emotionalProfile: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  insights: string[];
  recommendations: string[];
}

const EnhancedJournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<string>('');
  const [entryTitle, setEntryTitle] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMood, setCurrentMood] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [emotionalAnalysis, setEmotionalAnalysis] = useState<EmotionalAnalysis | null>(null);
  const [viewMode, setViewMode] = useState<'write' | 'entries' | 'analytics'>('write');
  const [filterMood, setFilterMood] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [aiCoachActive, setAiCoachActive] = useState(true);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const availableTags = [
    'gratitude', 'stress', 'travail', 'famille', 'amis', 'santé', 'objectifs', 
    'créativité', 'méditation', 'sport', 'nature', 'rêves', 'peurs', 'joies'
  ];

  const moodEmojis = {
    positive: { icon: Smile, color: 'text-green-500', bg: 'bg-green-50' },
    neutral: { icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    negative: { icon: Frown, color: 'text-red-500', bg: 'bg-red-50' }
  };

  // Simulation analyse IA en temps réel
  useEffect(() => {
    if (currentEntry.length > 50 && aiCoachActive) {
      const timer = setTimeout(() => {
        analyzeEntry();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentEntry, aiCoachActive]);

  const analyzeEntry = async () => {
    setIsAnalyzing(true);
    
    // Simulation analyse IA
    setTimeout(() => {
      const mockAnalysis: EmotionalAnalysis = {
        dominantEmotion: ['joie', 'sérénité', 'réflexion', 'espoir'][Math.floor(Math.random() * 4)],
        confidence: 75 + Math.random() * 20,
        emotionalProfile: {
          joy: Math.random() * 40 + 30,
          sadness: Math.random() * 20 + 5,
          anger: Math.random() * 15 + 5,
          fear: Math.random() * 15 + 5,
          surprise: Math.random() * 25 + 10,
          disgust: Math.random() * 10 + 5
        },
        insights: [
          "Votre écriture révèle une perspective positive et réfléchie",
          "Les thèmes de croissance personnelle sont récurrents",
          "Une belle progression dans la gestion émotionnelle"
        ],
        recommendations: [
          "Continuez à explorer ces pensées positives",
          "Considérez une méditation de gratitude",
          "Partagez ces réflexions avec votre coach IA"
        ]
      };
      
      setEmotionalAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const saveEntry = () => {
    if (!currentEntry.trim()) return;

    const newEntry: JournalEntry = {
      id: `entry_${Date.now()}`,
      date: new Date(),
      title: entryTitle || `Entrée du ${new Date().toLocaleDateString()}`,
      content: currentEntry,
      mood: currentMood,
      emotions: emotionalAnalysis ? [emotionalAnalysis.dominantEmotion] : [],
      aiInsights: emotionalAnalysis?.insights || [],
      isPrivate,
      tags: selectedTags,
      readingTime: Math.ceil(currentEntry.split(' ').length / 200),
      biometricData: {
        heartRate: 70 + Math.random() * 20,
        stress: Math.random() * 50,
        energy: Math.random() * 100
      },
      aiSuggestions: emotionalAnalysis?.recommendations || []
    };

    setEntries(prev => [newEntry, ...prev]);
    setCurrentEntry('');
    setEntryTitle('');
    setSelectedTags([]);
    setEmotionalAnalysis(null);
    
    toast({
      title: "Entrée sauvegardée !",
      description: `Votre réflexion a été enregistrée avec ${newEntry.aiInsights.length} insights IA`
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Enregistrement démarré",
        description: "Parlez naturellement, votre voix sera retranscrite automatiquement"
      });
      
      // Simulation de transcription vocale
      setTimeout(() => {
        const mockTranscript = "Aujourd'hui j'ai eu une journée vraiment enrichissante. J'ai eu l'occasion de réfléchir sur mes objectifs et je me sens plus aligné avec mes valeurs...";
        setCurrentEntry(prev => prev + (prev ? ' ' : '') + mockTranscript);
        setIsRecording(false);
        toast({
          title: "Transcription terminée",
          description: "Votre note vocale a été convertie en texte"
        });
      }, 3000);
    }
  };

  const WritingInterface: React.FC = () => (
    <div className="space-y-6">
      {/* Interface d'écriture principale */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-6 w-6 text-primary" />
              Journal Intelligent
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPrivate(!isPrivate)}
              >
                {isPrivate ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAiCoachActive(!aiCoachActive)}
              >
                <Brain className={`h-4 w-4 ${aiCoachActive ? 'text-primary' : 'text-muted-foreground'}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Titre de l'entrée */}
          <div>
            <input
              type="text"
              placeholder="Titre de votre réflexion..."
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
              className="w-full text-lg font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Zone d'écriture */}
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Partagez vos pensées, ressentis, réflexions... L'IA vous accompagne dans votre introspection."
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              className="min-h-[300px] resize-none text-base leading-relaxed"
            />
            
            {/* Compteur de mots et temps de lecture */}
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {currentEntry.split(' ').filter(word => word.length > 0).length} mots • 
              {Math.ceil(currentEntry.split(' ').length / 200)} min de lecture
            </div>
          </div>

          {/* Contrôles audio */}
          <div className="flex items-center gap-4">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              onClick={toggleRecording}
              className="flex items-center gap-2"
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Arrêter l'enregistrement
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Note vocale
                </>
              )}
            </Button>
            
            {isRecording && (
              <div className="flex items-center gap-2 text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Enregistrement en cours...</span>
              </div>
            )}
          </div>

          {/* Sélection d'humeur */}
          <div className="space-y-3">
            <h4 className="font-medium">Comment vous sentez-vous ?</h4>
            <div className="flex gap-3">
              {Object.entries(moodEmojis).map(([mood, config]) => {
                const Icon = config.icon;
                return (
                  <Button
                    key={mood}
                    variant={currentMood === mood ? "default" : "outline"}
                    onClick={() => setCurrentMood(mood as any)}
                    className={`flex items-center gap-2 ${currentMood === mood ? '' : config.bg}`}
                  >
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    {mood === 'positive' ? 'Positif' : mood === 'neutral' ? 'Neutre' : 'Négatif'}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <h4 className="font-medium">Tags (optionnel)</h4>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          <Button
            onClick={saveEntry}
            disabled={!currentEntry.trim()}
            className="w-full h-12 text-lg"
          >
            <Save className="mr-2 h-5 w-5" />
            Sauvegarder cette réflexion
          </Button>
        </CardContent>
      </Card>

      {/* Analyse IA en temps réel */}
      <AnimatePresence>
        {(emotionalAnalysis || isAnalyzing) && aiCoachActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="backdrop-blur-sm bg-gradient-to-r from-blue-50/90 to-purple-50/90 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary animate-pulse" />
                  Assistant IA - Analyse en temps réel
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full"></div>
                    <TypewriterEffect 
                      text="Analyse de votre écriture en cours... Détection des émotions et génération d'insights personnalisés..."
                      speed={30}
                    />
                  </div>
                ) : emotionalAnalysis && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge className="px-3 py-1">
                        Émotion dominante: {emotionalAnalysis.dominantEmotion}
                      </Badge>
                      <Badge variant="outline">
                        Confiance: {emotionalAnalysis.confidence.toFixed(0)}%
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Insights personnalisés:</h4>
                      <ul className="space-y-1">
                        {emotionalAnalysis.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommandations:</h4>
                      <ul className="space-y-1">
                        {emotionalAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Target className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const EntriesList: React.FC = () => {
    const filteredEntries = entries.filter(entry => {
      const matchesMood = filterMood === 'all' || entry.mood === filterMood;
      const matchesSearch = searchQuery === '' || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesMood && matchesSearch;
    });

    return (
      <div className="space-y-6">
        {/* Filtres et recherche */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher dans vos entrées..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {(['all', 'positive', 'neutral', 'negative'] as const).map(mood => (
                  <Button
                    key={mood}
                    variant={filterMood === mood ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterMood(mood)}
                  >
                    {mood === 'all' ? 'Toutes' : mood === 'positive' ? 'Positives' : mood === 'neutral' ? 'Neutres' : 'Négatives'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des entrées */}
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => {
            const moodConfig = moodEmojis[entry.mood];
            const MoodIcon = moodConfig.icon;
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* En-tête de l'entrée */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">{entry.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {entry.date.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {entry.readingTime} min
                            </div>
                            {entry.isPrivate && (
                              <Lock className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-full ${moodConfig.bg}`}>
                            <MoodIcon className={`h-4 w-4 ${moodConfig.color}`} />
                          </div>
                        </div>
                      </div>

                      {/* Contenu préview */}
                      <p className="text-muted-foreground line-clamp-3">
                        {entry.content}
                      </p>

                      {/* Tags */}
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Insights IA */}
                      {entry.aiInsights.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Insights IA</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {entry.aiInsights[0]}
                          </p>
                        </div>
                      )}

                      {/* Biométrie si disponible */}
                      {entry.biometricData && (
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span>{entry.biometricData.heartRate.toFixed(0)} BPM</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span>Stress: {entry.biometricData.stress.toFixed(0)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span>Énergie: {entry.biometricData.energy.toFixed(0)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredEntries.length === 0 && (
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune entrée trouvée</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterMood !== 'all' 
                  ? 'Modifiez vos filtres pour voir plus d\'entrées'
                  : 'Commencez votre première réflexion pour voir vos entrées ici'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const AnalyticsDashboard: React.FC = () => (
    <div className="space-y-6">
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analyse de votre parcours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold">{entries.length}</div>
              <p className="text-sm text-muted-foreground">Entrées totales</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold">
                {entries.reduce((acc, entry) => acc + entry.readingTime, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Minutes d'introspection</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold">
                {Math.round(entries.filter(e => e.mood === 'positive').length / entries.length * 100) || 0}%
              </div>
              <p className="text-sm text-muted-foreground">Entrées positives</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graphique d'évolution émotionnelle */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
        <CardHeader>
          <CardTitle>Évolution émotionnelle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-center gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div 
                  className="bg-gradient-to-t from-primary to-primary/50 rounded-t"
                  style={{ 
                    width: '20px', 
                    height: `${Math.random() * 200 + 20}px` 
                  }}
                />
                <span className="text-xs text-muted-foreground">
                  {new Date(2024, i, 1).toLocaleDateString('fr-FR', { month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900/20 via-amber-900/10 to-yellow-900/20 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Journal Intelligent
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Votre espace d'introspection avec analyse IA émotionnelle et insights personnalisés
          </p>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center">
          <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
            {[
              { id: 'write', label: 'Écrire', icon: PenTool },
              { id: 'entries', label: 'Entrées', icon: BookOpen },
              { id: 'analytics', label: 'Analyse', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={viewMode === id ? "default" : "ghost"}
                onClick={() => setViewMode(id as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'write' && <WritingInterface />}
            {viewMode === 'entries' && <EntriesList />}
            {viewMode === 'analytics' && <AnalyticsDashboard />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedJournalPage;