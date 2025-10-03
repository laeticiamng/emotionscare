import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Sparkles, Image as ImageIcon, ChevronRight, RotateCcw, Award, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import confetti from 'canvas-confetti';

interface StoryChoice {
  text: string;
  emotion: string;
  consequence: string;
}

interface StoryChapter {
  id: number;
  title: string;
  content: string;
  imagePrompt: string;
  choices: StoryChoice[];
  emotion: string;
}

const generateStoryChapter = (previousChoice?: string): StoryChapter => {
  const chapters = [
    {
      id: 1,
      title: "L'Éveil",
      content: "Tu te réveilles dans une forêt mystérieuse baignée de lumière dorée. Les arbres semblent murmurer des secrets anciens. Un sentier se divise en trois directions devant toi.",
      imagePrompt: "Forêt magique avec lumière dorée",
      emotion: "curious",
      choices: [
        { text: "Suivre le sentier de lumière", emotion: "hopeful", consequence: "Découvrir un temple ancien" },
        { text: "Explorer l'ombre dense", emotion: "brave", consequence: "Rencontrer une créature mystérieuse" },
        { text: "Grimper à l'arbre le plus haut", emotion: "adventurous", consequence: "Voir un paysage époustouflant" }
      ]
    },
    {
      id: 2,
      title: "La Rencontre",
      content: "Ton chemin te mène à une clairière où une créature de lumière t'attend. Elle semble connaître ton nom et parle d'une quête qui pourrait changer ton destin.",
      imagePrompt: "Créature lumineuse dans une clairière magique",
      emotion: "wonder",
      choices: [
        { text: "Accepter la quête avec enthousiasme", emotion: "excited", consequence: "Recevoir un pouvoir spécial" },
        { text: "Poser des questions prudemment", emotion: "thoughtful", consequence: "Obtenir des réponses profondes" },
        { text: "Partager tes propres rêves", emotion: "vulnerable", consequence: "Créer un lien puissant" }
      ]
    },
    {
      id: 3,
      title: "L'Épreuve",
      content: "Un défi se présente : tu dois traverser un pont de cristal suspendu au-dessus d'un gouffre étoilé. Chaque pas fait résonner une note musicale différente.",
      imagePrompt: "Pont de cristal suspendu dans l'espace étoilé",
      emotion: "challenged",
      choices: [
        { text: "Avancer avec confiance", emotion: "determined", consequence: "Le pont s'illumine sous tes pas" },
        { text: "Danser sur le pont", emotion: "joyful", consequence: "Créer une symphonie magique" },
        { text: "Méditer avant de traverser", emotion: "calm", consequence: "Découvrir un passage caché" }
      ]
    },
    {
      id: 4,
      title: "La Révélation",
      content: "De l'autre côté, une vision t'est révélée : tout ce voyage était en toi depuis le début. Tu comprends maintenant que tu as le pouvoir de créer ta propre réalité.",
      imagePrompt: "Silhouette illuminée entourée d'énergie cosmique",
      emotion: "enlightened",
      choices: [
        { text: "Embrasser cette nouvelle sagesse", emotion: "grateful", consequence: "Transformation complète" },
        { text: "Partager cette découverte", emotion: "generous", consequence: "Illuminer d'autres âmes" },
        { text: "Créer un nouveau monde", emotion: "creative", consequence: "Devenir un créateur" }
      ]
    }
  ];

  return chapters[Math.min(Math.floor(Math.random() * chapters.length), chapters.length - 1)];
};

export default function StorySynthJourneyPage() {
  const [storyStarted, setStoryStarted] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<StoryChapter | null>(null);
  const [chapterNumber, setChapterNumber] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [emotionalScore, setEmotionalScore] = useState(0);
  const [creativityScore, setCreativityScore] = useState(0);

  const startStory = () => {
    const chapter = generateStoryChapter();
    setCurrentChapter(chapter);
    setChapterNumber(1);
    setStoryStarted(true);
    setChoices([]);
  };

  const makeChoice = (choice: StoryChoice) => {
    setChoices(prev => [...prev, choice.text]);
    setEmotionalScore(prev => prev + 10);
    setCreativityScore(prev => prev + 15);

    if (chapterNumber < 4) {
      setTimeout(() => {
        const nextChapter = generateStoryChapter(choice.text);
        setCurrentChapter(nextChapter);
        setChapterNumber(prev => prev + 1);
      }, 1000);
    } else {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  const restart = () => {
    setStoryStarted(false);
    setCurrentChapter(null);
    setChapterNumber(0);
    setChoices([]);
    setEmotionalScore(0);
    setCreativityScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Book className="w-12 h-12" />
            Story Synth Lab
          </h1>
          <p className="text-white/80 text-lg">Crée ton histoire interactive et émotionnelle</p>
        </motion.div>

        {!storyStarted ? (
          <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 text-center">
            <Sparkles className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Commence Ton Aventure</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Tu vas vivre une histoire unique qui s'adapte à tes choix. Chaque décision façonne ton voyage émotionnel et crée une expérience qui n'appartiendra qu'à toi.
            </p>
            
            <div className="mb-6 max-w-md mx-auto">
              <Textarea
                placeholder="Optionnel : décris le type d'histoire que tu veux vivre... (ex: 'une aventure dans l'espace', 'un conte féerique', 'une quête de sagesse')"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="mb-4"
                rows={3}
              />
            </div>

            <Button
              onClick={startStory}
              size="lg"
              className="h-16 px-8 text-lg bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Lancer L'Histoire
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Story */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="wait">
                {currentChapter && (
                  <motion.div
                    key={chapterNumber}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-3xl font-bold text-white">{currentChapter.title}</h2>
                        <span className="text-white/70">Chapitre {chapterNumber}/4</span>
                      </div>

                      {/* Story Image Placeholder */}
                      <div className="relative h-64 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                        <ImageIcon className="w-16 h-16 text-white/30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white/60 text-sm italic">{currentChapter.imagePrompt}</p>
                        </div>
                      </div>

                      {/* Story Content */}
                      <p className="text-white text-lg leading-relaxed mb-6">
                        {currentChapter.content}
                      </p>

                      {/* Choices */}
                      {chapterNumber < 4 ? (
                        <div className="space-y-3">
                          <p className="text-white/80 font-medium mb-3">Que fais-tu ?</p>
                          {currentChapter.choices.map((choice, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Button
                                onClick={() => makeChoice(choice)}
                                variant="outline"
                                className="w-full h-auto p-4 text-left justify-start bg-white/5 hover:bg-white/20 border-white/20"
                              >
                                <ChevronRight className="w-5 h-5 mr-3 flex-shrink-0" />
                                <div>
                                  <div className="text-white font-medium">{choice.text}</div>
                                  <div className="text-white/60 text-sm mt-1">{choice.emotion}</div>
                                </div>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-center">
                          <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-white mb-3">Histoire Complétée!</h3>
                          <p className="text-white/80 mb-4">
                            Tu as créé une histoire unique et émotionnellement riche. Ton parcours restera gravé dans ton journal.
                          </p>
                          <Button
                            onClick={restart}
                            className="bg-gradient-to-r from-purple-500 to-pink-500"
                          >
                            <RotateCcw className="w-5 h-5 mr-2" />
                            Nouvelle Histoire
                          </Button>
                        </Card>
                      )}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Progress */}
              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">📖 Progression</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">Chapitres</span>
                      <span className="text-white font-bold">{chapterNumber}/4</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${(chapterNumber / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Emotional Score */}
              <Card className="p-6 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-lg border-pink-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-8 h-8 text-pink-400" />
                  <span className="text-white/80">Impact Émotionnel</span>
                </div>
                <div className="text-4xl font-bold text-white">{emotionalScore}</div>
              </Card>

              {/* Creativity Score */}
              <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border-yellow-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-8 h-8 text-yellow-400" />
                  <span className="text-white/80">Créativité</span>
                </div>
                <div className="text-4xl font-bold text-white">{creativityScore}</div>
              </Card>

              {/* Choice History */}
              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
                <h3 className="text-lg font-bold text-white mb-3">🗺️ Tes Choix</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {choices.map((choice, index) => (
                    <div
                      key={index}
                      className="text-white/70 text-sm px-3 py-2 bg-white/5 rounded"
                    >
                      {index + 1}. {choice}
                    </div>
                  ))}
                  {choices.length === 0 && (
                    <p className="text-white/50 text-sm text-center py-4">
                      Tes décisions apparaîtront ici
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
