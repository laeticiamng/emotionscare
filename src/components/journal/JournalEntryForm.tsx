
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Sparkles, Brain, Shield, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { analyzeEmotionalJournal } from '@/lib/ai/journal-service';
import { Confetti } from '@/components/ui/confetti';
import { useMusic } from '@/contexts/MusicContext';

interface JournalEntryFormProps {
  onSubmit: (data: any) => void;
  isSaving?: boolean;
  initialData?: {
    title?: string;
    content?: string;
    mood?: string;
  };
}

const WRITING_MODES = {
  free: 'Libre',
  guided: 'Guidé',
  emotional: 'Émotionnel',
  inspired: 'Inspiré'
};

type WritingMode = keyof typeof WRITING_MODES;

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  onSubmit,
  isSaving = false,
  initialData = {}
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [mood, setMood] = useState(initialData.mood || '');
  const [writingMode, setWritingMode] = useState<WritingMode>('free');
  const [showPrompt, setShowPrompt] = useState(false);
  const [writingPrompt, setWritingPrompt] = useState('');
  const [zenMode, setZenMode] = useState(false);
  const [emotionalAnalysis, setEmotionalAnalysis] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [entrySubmitted, setEntrySubmitted] = useState(false);
  const [backgroundGradient, setBackgroundGradient] = useState('');
  const { toast } = useToast();
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();

  // Generate a background gradient based on mood
  useEffect(() => {
    if (mood) {
      const gradients = {
        happy: 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-800/30',
        calm: 'bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/30 dark:to-sky-800/30',
        sad: 'bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/30 dark:to-blue-800/30',
        anxious: 'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-800/30',
        angry: 'bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/30 dark:to-orange-800/30',
        tired: 'bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900/30 dark:to-slate-800/30',
        energetic: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30',
      };
      setBackgroundGradient(gradients[mood as keyof typeof gradients] || gradients.calm);
    }
  }, [mood]);

  // Get writing prompts based on selected mode
  useEffect(() => {
    if (writingMode !== 'free' && !showPrompt) {
      generatePrompt();
    }
  }, [writingMode]);

  const generatePrompt = () => {
    // Simulated prompts - in a real app, these would come from an AI service
    const prompts = {
      guided: [
        "Qu'est-ce qui vous a apporté de la joie aujourd'hui ?",
        "Comment vous êtes-vous connecté avec les autres aujourd'hui ?",
        "Quels défis avez-vous rencontrés et comment les avez-vous abordés ?"
      ],
      emotional: {
        happy: "Décrivez ce qui vous rend heureux aujourd'hui et pourquoi.",
        calm: "Explorez ce qui vous apporte de la sérénité en ce moment.",
        sad: "Exprimez ce qui vous attriste et comment vous pourriez vous réconforter.",
        anxious: "Identifiez ce qui vous préoccupe et imaginez la résolution positive.",
        angry: "Décrivez ce qui vous frustre et comment vous pourriez transformer cette énergie.",
        tired: "Explorez les sources de votre fatigue et ce qui pourrait vous revitaliser.",
        energetic: "Canalisez votre énergie en décrivant ce que vous souhaitez accomplir."
      },
      inspired: [
        "Écrivez à propos d'un souvenir d'enfance lié à l'eau.",
        "Imaginez un dialogue avec votre futur soi dans 10 ans.",
        "Décrivez un lieu où vous vous sentez totalement en paix."
      ]
    };

    let selectedPrompt = '';
    if (writingMode === 'guided') {
      selectedPrompt = prompts.guided[Math.floor(Math.random() * prompts.guided.length)];
    } else if (writingMode === 'emotional' && mood) {
      selectedPrompt = prompts.emotional[mood as keyof typeof prompts.emotional] || 
        "Exprimez comment vous vous sentez en ce moment.";
    } else if (writingMode === 'inspired') {
      selectedPrompt = prompts.inspired[Math.floor(Math.random() * prompts.inspired.length)];
    }

    setWritingPrompt(selectedPrompt);
    setShowPrompt(true);
  };

  const analyzeEmotion = async () => {
    if (content.trim().length < 20) {
      toast({
        title: "Texte trop court",
        description: "Veuillez écrire au moins 20 caractères pour l'analyse émotionnelle.",
        variant: "destructive"
      });
      return;
    }

    setShowAnalysis(true);
    try {
      const analysis = await analyzeEmotionalJournal(content);
      setEmotionalAnalysis(analysis.message);
    } catch (error) {
      console.error("Error analyzing journal:", error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser votre texte pour le moment.",
        variant: "destructive"
      });
      setShowAnalysis(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez saisir un titre pour votre entrée de journal",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Contenu requis",
        description: "Veuillez saisir du contenu pour votre entrée de journal",
        variant: "destructive"
      });
      return;
    }
    
    if (!mood) {
      toast({
        title: "Humeur requise",
        description: "Veuillez sélectionner une humeur",
        variant: "destructive"
      });
      return;
    }
    
    const data = {
      title,
      content,
      mood,
      date: new Date().toISOString(),
      emotional_analysis: emotionalAnalysis
    };
    
    onSubmit(data);
    setEntrySubmitted(true);
  };

  const playMoodMusic = () => {
    if (mood) {
      loadPlaylistForEmotion(mood);
      setOpenDrawer(true);
      toast({
        title: "Musique activée",
        description: `Profitez d'une ambiance musicale adaptée à votre humeur: ${mood}`,
      });
    } else {
      toast({
        title: "Sélectionnez une humeur",
        description: "Veuillez d'abord choisir une humeur pour générer une musique adaptée.",
        variant: "warning"
      });
    }
  };

  if (zenMode) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Exprimez-vous librement..."
            className="min-h-[70vh] text-lg p-8 shadow-none border-none focus-visible:ring-0 bg-transparent resize-none"
            autoFocus
          />
          <div className="flex justify-between mt-4">
            <Button variant="ghost" onClick={() => setZenMode(false)}>
              Quitter le mode zen
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              Enregistrer
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (entrySubmitted) {
    return (
      <div className="text-center py-12">
        <Confetti duration={3000} />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="mb-6"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Entrée enregistrée !</h2>
          <p className="text-muted-foreground mb-6">Votre réflexion a été sauvegardée avec succès.</p>
        </motion.div>
        
        {emotionalAnalysis && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto mb-8 p-6 bg-primary/5 rounded-xl"
          >
            <h3 className="font-medium mb-2">Analyse émotionnelle</h3>
            <p className="text-sm text-muted-foreground">{emotionalAnalysis}</p>
          </motion.div>
        )}
        
        <div className="flex justify-center gap-4 flex-wrap">
          <Button onClick={() => window.location.href = "/journal"}>
            Voir toutes mes entrées
          </Button>
          <Button variant="outline" onClick={playMoodMusic}>
            <Music className="mr-2 h-4 w-4" />
            Écouter une musique adaptée
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 rounded-xl p-1 transition-all ${backgroundGradient}`}>
      <Card className="bg-card/80 backdrop-blur-sm border-none shadow-lg p-6">
        {/* Writing Mode Selector */}
        <div className="mb-6">
          <Label className="mb-2 block">Mode d'écriture</Label>
          <Tabs defaultValue={writingMode} onValueChange={(value) => setWritingMode(value as WritingMode)} className="w-full">
            <TabsList className="grid grid-cols-4 mb-2">
              {Object.entries(WRITING_MODES).map(([key, label]) => (
                <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
              ))}
            </TabsList>
            {showPrompt && writingPrompt && writingMode !== 'free' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-muted p-4 rounded-md my-2 text-sm italic"
              >
                {writingPrompt}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2" 
                  onClick={generatePrompt}
                >
                  <Sparkles className="h-3 w-3 mr-1" /> Nouvelle suggestion
                </Button>
              </motion.div>
            )}
          </Tabs>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de votre entrée"
                required
                className="text-lg"
              />
            </div>
            
            <div className="ml-4 flex items-center space-x-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setZenMode(true)}
                className="flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Mode Zen</span>
              </Button>
              
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={playMoodMusic}
                className="flex items-center gap-1"
              >
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">Musique</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mood">Humeur</Label>
            <Select value={mood} onValueChange={setMood} required>
              <SelectTrigger id="mood">
                <SelectValue placeholder="Sélectionnez votre humeur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="happy">Heureux(se)</SelectItem>
                <SelectItem value="calm">Calme</SelectItem>
                <SelectItem value="sad">Triste</SelectItem>
                <SelectItem value="anxious">Anxieux(se)</SelectItem>
                <SelectItem value="angry">En colère</SelectItem>
                <SelectItem value="tired">Fatigué(e)</SelectItem>
                <SelectItem value="energetic">Énergique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comment vous sentez-vous aujourd'hui ?"
              className="min-h-[200px] text-lg font-light"
              required
            />
          </div>

          {content.length > 20 && !showAnalysis && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={analyzeEmotion}
                className="flex items-center gap-1"
              >
                <Brain className="h-4 w-4" /> 
                Analyser mon texte
              </Button>
            </motion.div>
          )}

          {showAnalysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-primary/5 p-4 rounded-lg"
            >
              {emotionalAnalysis ? (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4" /> 
                    Analyse émotionnelle
                  </h3>
                  <p className="text-sm text-muted-foreground">{emotionalAnalysis}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          <Button 
            type="submit" 
            disabled={isSaving} 
            className="w-full"
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default JournalEntryForm;
