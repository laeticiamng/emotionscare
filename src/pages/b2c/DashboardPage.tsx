
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { CardContent, Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Meh, Frown, MusicIcon, ArrowRight, Calendar, BookOpen, Settings, User } from 'lucide-react';
import { useUserModeHelpers } from '@/hooks/useUserModeHelpers';

// Dummy data for the dashboard
const QUOTES = [
  "La sérénité commence lorsque vous arrêtez de vivre dans le passé ou le futur et commencez à vivre dans le présent.",
  "Chaque émotion est un message. Écoutez ce message avec bienveillance.",
  "Le bonheur n'est pas l'absence de problèmes, mais la capacité à les surmonter.",
  "Être heureux ne signifie pas que tout est parfait. Cela signifie que vous avez décidé de regarder au-delà des imperfections.",
];

const MOOD_COLORS = {
  happy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  neutral: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  sad: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
};

const PLAYLIST_MOODS = [
  { id: 1, title: "Énergie matinale", tracks: 12, duration: "42 min", color: "from-orange-500 to-yellow-500" },
  { id: 2, title: "Calme et concentration", tracks: 8, duration: "35 min", color: "from-blue-500 to-cyan-500" },
  { id: 3, title: "Détente du soir", tracks: 10, duration: "50 min", color: "from-purple-500 to-pink-500" }
];

const UPCOMING_ACTIVITIES = [
  { id: 1, title: "Séance de méditation guidée", date: "Aujourd'hui, 18:00", type: "Bien-être" },
  { id: 2, title: "Analyse de journal émotionnel", date: "Demain, 10:00", type: "Journal" },
  { id: 3, title: "Session avec coach IA", date: "12 mai, 14:00", type: "Coaching" }
];

const B2CDashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [currentMood, setCurrentMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');
  const [quote, setQuote] = useState("");
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const { normalizedMode } = useUserModeHelpers();

  useEffect(() => {
    if (!isLoading && user) {
      // In a real app this would fetch personalized modules or stats
      setIsDataLoading(false);
    }
  }, [isLoading, user]);
  
  // Set a random inspirational quote on load
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);
  
  const handleMoodSelect = (mood: 'happy' | 'neutral' | 'sad') => {
    setCurrentMood(mood);
    setShowMoodSelector(false);
  };

  if (isLoading || isDataLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header with greeting and user info */}
      <header className="relative bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5">
        <div className="absolute inset-0 bg-grid-white/10 dark:bg-grid-white/5"></div>
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex justify-between items-center">
            <div>
              <motion.h1 
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Bonjour, {user?.name?.split(' ')[0] || 'Bienvenue'}
              </motion.h1>
              <motion.p 
                className="text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Mode {normalizedMode === 'b2c' ? 'Particulier' : 'Professionnel'}
              </motion.p>
            </div>
            
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button size="sm" variant="ghost" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Quote of the day */}
          <motion.div 
            className="mt-6 max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <blockquote className="italic text-lg">
              "{quote}"
            </blockquote>
          </motion.div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Mood selection or current mood display */}
        <section className="mb-8">
          <AnimatePresence mode="wait">
            {showMoodSelector ? (
              <motion.div
                key="mood-selector"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <h2 className="text-xl font-medium mb-4">Comment vous sentez-vous aujourd'hui ?</h2>
                <div className="flex gap-4 flex-wrap">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-auto py-6 hover:bg-green-50 dark:hover:bg-green-900/20"
                    onClick={() => handleMoodSelect('happy')}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Smile className="h-8 w-8 text-green-500" />
                      <span className="text-green-700 dark:text-green-300">Bien</span>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex-1 h-auto py-6 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={() => handleMoodSelect('neutral')}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Meh className="h-8 w-8 text-blue-500" />
                      <span className="text-blue-700 dark:text-blue-300">Neutre</span>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex-1 h-auto py-6 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    onClick={() => handleMoodSelect('sad')}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Frown className="h-8 w-8 text-purple-500" />
                      <span className="text-purple-700 dark:text-purple-300">Pas bien</span>
                    </div>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="current-mood"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${MOOD_COLORS[currentMood]}`}>
                  {currentMood === 'happy' && <Smile className="h-5 w-5 mr-2" />}
                  {currentMood === 'neutral' && <Meh className="h-5 w-5 mr-2" />}
                  {currentMood === 'sad' && <Frown className="h-5 w-5 mr-2" />}
                  <span>
                    {currentMood === 'happy' ? 'Vous vous sentez bien aujourd\'hui' : 
                     currentMood === 'neutral' ? 'Votre humeur est neutre aujourd\'hui' : 
                     'Vous ne vous sentez pas bien aujourd\'hui'}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 h-6 rounded-full"
                    onClick={() => setShowMoodSelector(true)}
                  >
                    Modifier
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Tab sections */}
            <Tabs defaultValue="recommended" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="recommended">Recommandé</TabsTrigger>
                <TabsTrigger value="activity">Activités</TabsTrigger>
                <TabsTrigger value="favorites">Favoris</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommended" className="space-y-6">
                {/* Music playlists */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Playlists musicales</h2>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Voir tout <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {PLAYLIST_MOODS.map((playlist) => (
                      <motion.div 
                        key={playlist.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                          <div className={`h-2 bg-gradient-to-r ${playlist.color}`}></div>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{playlist.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {playlist.tracks} pistes · {playlist.duration}
                                </p>
                              </div>
                              <Button size="sm" variant="ghost" className="rounded-full p-0 w-8 h-8">
                                <MusicIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </section>
                
                {/* Quick access */}
                <section>
                  <h2 className="text-xl font-medium mb-4">Accès rapide</h2>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: <BookOpen className="h-6 w-6" />, label: "Journal" },
                      { icon: <MusicIcon className="h-6 w-6" />, label: "Musique" },
                      { icon: <Calendar className="h-6 w-6" />, label: "Agenda" },
                      { icon: <Settings className="h-6 w-6" />, label: "Réglages" }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline" 
                          className="w-full h-auto flex-col gap-2 py-6 hover:bg-primary/5"
                        >
                          <div className="rounded-full bg-primary/10 p-3">
                            {item.icon}
                          </div>
                          <span>{item.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </TabsContent>
              
              <TabsContent value="activity">
                <div className="space-y-6">
                  <h2 className="text-xl font-medium mb-4">Activités à venir</h2>
                  
                  <div className="space-y-4">
                    {UPCOMING_ACTIVITIES.map((activity) => (
                      <Card key={activity.id} className="overflow-hidden">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{activity.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-muted-foreground">{activity.date}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {activity.type}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Détails
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="favorites">
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-muted-foreground">Vous n'avez pas encore de favoris.</p>
                  <Button variant="outline" className="mt-4">
                    Explorer le contenu
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Prochaines sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Méditation guidée</h3>
                      <p className="text-sm text-muted-foreground">Aujourd'hui, 18:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Analyse de journal</h3>
                      <p className="text-sm text-muted-foreground">Demain, 10:00</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Voir l'agenda complet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Sticky music player */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="bg-card shadow-xl rounded-full px-4 py-3 flex items-center gap-3 border">
          <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
            <MusicIcon className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            <p className="font-medium">Lecture musicale</p>
            <p className="text-xs text-muted-foreground">Calme et concentration</p>
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 8-9.04 4.52a.5.5 0 0 0 0 .91L12 18"></path><path d="m15 6-3 1.5v9l3 1.5"></path><path d="M18 8c2 .5 3 1.5 3 3s-1 2.5-3 3"></path></svg>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg>
            </Button>
            <Button size="icon" className="rounded-full h-8 w-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></svg>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 8 9.04 4.52a.5.5 0 0 1 0 .91L12 18"></path><path d="m9 6 3 1.5v9l-3 1.5"></path><path d="M6 8c-2 .5-3 1.5-3 3s1 2.5 3 3"></path></svg>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default B2CDashboardPage;
