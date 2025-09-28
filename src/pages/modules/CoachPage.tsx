import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  BookOpen,
  MessageCircle,
  Lightbulb,
  Heart,
  Send,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { getOptimizedUniverse } from '@/data/universes/config';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';

interface CoachResponse {
  id: string;
  question: string;
  answer: string;
  mantraCard: string;
  category: 'stress' | 'confiance' | 'énergie' | 'clarté';
  timestamp: Date;
}

const quickSuggestions = [
  "Je stresse pour demain",
  "J'ai du mal à me concentrer",
  "Je me sens fatigué",
  "Comment me motiver ?",
  "J'ai besoin de confiance",
  "Comment mieux dormir ?"
];

const CoachPage: React.FC = () => {
  const { toast } = useToast();
  
  // Get optimized universe config
  const universe = getOptimizedUniverse('journal'); // Using journal universe for now
  
  // Universe state
  const [isEntering, setIsEntering] = useState(true);
  const [universeEntered, setUniverseEntered] = useState(false);
  
  // Coach state
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [response, setResponse] = useState<CoachResponse | null>(null);
  const [showReward, setShowReward] = useState(false);

  // Optimized animations
  const { entranceVariants, cleanupAnimation } = useOptimizedAnimation({
    enableComplexAnimations: true,
    useCSSAnimations: true,
  });

  // Handle universe entrance
  const handleUniverseEnterComplete = () => {
    setUniverseEntered(true);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAnimation();
    };
  }, [cleanupAnimation]);

  const generateCoachResponse = (question: string): CoachResponse => {
    // Simple AI-like response generation based on keywords
    let answer = '';
    let mantraCard = '';
    let category: CoachResponse['category'] = 'clarté';

    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('stress') || lowerQuestion.includes('anxieu') || lowerQuestion.includes('peur')) {
      category = 'stress';
      answer = "Je comprends cette tension. Une pause respiration peut t'aider à retrouver ton centre. Essaie 3 respirations profondes maintenant.";
      mantraCard = "Je respire, je me centre, je trouve ma paix intérieure";
    } else if (lowerQuestion.includes('confiance') || lowerQuestion.includes('doute') || lowerQuestion.includes('peur')) {
      category = 'confiance';
      answer = "Ta valeur ne dépend pas de tes doutes. Chaque petit pas compte. Rappelle-toi une réussite récente, même minime.";
      mantraCard = "Je suis capable, je progresse à mon rythme";
    } else if (lowerQuestion.includes('fatigué') || lowerQuestion.includes('énergie') || lowerQuestion.includes('motivation')) {
      category = 'énergie';
      answer = "L'énergie se cultive doucement. Commence par une chose simple qui te fait plaisir. Parfois, moins faire c'est plus avancer.";
      mantraCard = "Mon énergie renaît à chaque moment présent";
    } else if (lowerQuestion.includes('concentration') || lowerQuestion.includes('focus') || lowerQuestion.includes('distrait')) {
      category = 'clarté';
      answer = "L'esprit papillon est normal aujourd'hui. Essaie la technique Pomodoro : 15min focalisées, puis pause. La régularité surpasse l'intensité.";
      mantraCard = "Ma concentration grandit pas à pas, sans jugement";
    } else {
      answer = "Je t'entends. Chaque questionnement mérite bienveillance. Prends un moment pour respirer et écouter ce que ton cœur te dit.";
      mantraCard = "J'accueille mes questions avec douceur et sagesse";
    }

    return {
      id: `response-${Date.now()}`,
      question,
      answer,
      mantraCard,
      category,
      timestamp: new Date()
    };
  };

  const askQuestion = () => {
    if (currentQuestion.trim().length < 5) {
      toast({
        title: "Question trop courte",
        description: "Partage un peu plus tes pensées pour que je puisse t'aider 💙",
        variant: "destructive",
      });
      return;
    }

    setIsThinking(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const coachResponse = generateCoachResponse(currentQuestion);
      setResponse(coachResponse);
      setIsThinking(false);
      
      toast({
        title: "Conseil reçu ✨",
        description: "Ton mentor t'accompagne avec bienveillance",
      });

      // Show reward after response
      setTimeout(() => {
        setShowReward(true);
      }, 3000);
    }, 2000);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setCurrentQuestion(suggestion);
  };

  const handleRewardComplete = () => {
    setShowReward(false);
    setResponse(null);
    setCurrentQuestion('');
  };

  const getCategoryColor = (category: CoachResponse['category']) => {
    switch (category) {
      case 'stress': return 'hsl(200, 70%, 60%)';
      case 'confiance': return 'hsl(280, 60%, 65%)';
      case 'énergie': return 'hsl(30, 80%, 60%)';
      case 'clarté': return 'hsl(140, 60%, 60%)';
      default: return 'hsl(220, 60%, 60%)';
    }
  };

  if (showReward && response) {
    return (
      <RewardSystem
        reward={{
          type: 'lantern',
          name: 'Carte Mantra',
          description: "Sagesse bienveillante à emporter partout",
          moduleId: 'coach'
        }}
        badgeText="On avance pas à pas 🧭"
        onComplete={handleRewardComplete}
      />
    );
  }

  return (
    <UniverseEngine
      universe={universe}
      isEntering={isEntering}
      onEnterComplete={handleUniverseEnterComplete}
      enableParticles={true}
      enableAmbianceSound={false}
      className="min-h-screen"
    >
      {/* Header */}
      <header className="relative z-50 p-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/app" 
            className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Retour</span>
          </Link>
          
          <div className="flex items-center space-x-2 text-foreground">
            <BookOpen className="h-6 w-6 text-amber-600" />
            <h1 className="text-xl font-light tracking-wide">Le Salon du Mentor</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!response && !isThinking ? (
            <motion.div
              key="question"
              variants={entranceVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-12"
            >
              {/* Introduction */}
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{ 
                    background: `linear-gradient(135deg, hsl(25, 60%, 55%), hsl(35, 70%, 65%))` 
                  }}
                >
                  <MessageCircle className="h-10 w-10 text-white" />
                </motion.div>
                
                <h2 className="text-4xl font-light text-foreground tracking-wide">
                  Ton Mentor Personnel
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                  Partage ce qui te préoccupe. Ton mentor t'écoute avec bienveillance 
                  et t'offre des conseils personnalisés, sans jugement.
                </p>
              </div>

              {/* Question Input */}
              <div className="max-w-2xl mx-auto space-y-6">
                <Card className="bg-card/90 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-400" />
                        Que ressens-tu en ce moment ?
                      </h3>
                      
                      <Textarea
                        value={currentQuestion}
                        onChange={(e) => setCurrentQuestion(e.target.value)}
                        placeholder="Ex: Je stresse pour ma présentation demain, j'ai du mal à me concentrer..."
                        className="min-h-24 border-none bg-transparent resize-none focus:ring-0 text-base leading-relaxed"
                      />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {currentQuestion.length} caractères
                        </span>
                        
                        <Button
                          onClick={askQuestion}
                          disabled={currentQuestion.trim().length < 5}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Demander conseil
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick suggestions */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground text-center">
                    Ou choisis une question fréquente :
                  </h4>
                  
                  <div className="grid gap-2 md:grid-cols-2">
                    {quickSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickSuggestion(suggestion)}
                          className="w-full text-left justify-start h-auto py-2 px-3 text-sm"
                        >
                          <MessageCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                          {suggestion}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : isThinking ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto text-center space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BookOpen className="h-8 w-8 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-light text-foreground">
                  Ton mentor réfléchit...
                </h2>
                
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Il consulte sa sagesse bienveillante
                  </p>
                  <div className="flex justify-center space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-amber-500 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          delay: i * 0.2 
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <Card className="bg-card/90 backdrop-blur-md">
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground italic">
                    "Chaque question mérite une réponse thoughtful et personnalisée..."
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="response"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              {/* Coach Response */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mb-4">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-light text-foreground">
                  Conseil bienveillant
                </h2>
              </div>

              {response && (
                <div className="space-y-6">
                  {/* Question reminder */}
                  <Card className="bg-card/50 backdrop-blur-md border-l-4" style={{ borderLeftColor: getCategoryColor(response.category) }}>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground italic">
                        "{response.question}"
                      </p>
                    </CardContent>
                  </Card>

                  {/* Answer */}
                  <Card className="bg-card/90 backdrop-blur-md">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <Badge 
                          variant="secondary"
                          style={{ 
                            backgroundColor: `${getCategoryColor(response.category)}20`,
                            color: getCategoryColor(response.category)
                          }}
                        >
                          {response.category}
                        </Badge>
                        
                        <p className="text-foreground leading-relaxed">
                          {response.answer}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mantra Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <Card 
                      className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50"
                    >
                      <CardContent className="p-6 text-center">
                        <div className="space-y-3">
                          <Sparkles className="w-6 h-6 mx-auto text-amber-600" />
                          <h4 className="font-medium text-foreground">Ta carte mantra</h4>
                          <p 
                            className="font-light italic text-lg leading-relaxed"
                            style={{ color: getCategoryColor(response.category) }}
                          >
                            "{response.mantraCard}"
                          </p>
                          <p className="text-xs text-muted-foreground">
                            À garder dans ton portefeuille virtuel ✨
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </UniverseEngine>
  );
};

export default CoachPage;