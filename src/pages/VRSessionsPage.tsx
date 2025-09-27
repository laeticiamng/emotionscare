import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Eye, Headphones, Calendar, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface VRSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: 'relaxation' | 'adventure' | 'therapy' | 'meditation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completedTimes: number;
  lastCompleted?: Date;
  thumbnail: string;
  rating: number;
}

const VRSessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState<VRSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessions] = useState<VRSession[]>([
    {
      id: '1',
      title: 'Forêt Enchantée',
      description: 'Promenade immersive dans une forêt mystique pour apaiser l\'esprit',
      duration: 15,
      category: 'relaxation',
      difficulty: 'beginner',
      completedTimes: 3,
      lastCompleted: new Date('2024-01-15'),
      thumbnail: '🌲',
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Océan Profond',
      description: 'Exploration sous-marine relaxante avec sons apaisants',
      duration: 20,
      category: 'meditation',
      difficulty: 'beginner',
      completedTimes: 1,
      thumbnail: '🌊',
      rating: 4.9,
    },
    {
      id: '3',
      title: 'Sommet Himalaya',
      description: 'Défi de respiration en altitude avec vue panoramique',
      duration: 25,
      category: 'therapy',
      difficulty: 'advanced',
      completedTimes: 0,
      thumbnail: '🏔️',
      rating: 4.7,
    },
    {
      id: '4',
      title: 'Galaxie Lointaine',
      description: 'Voyage spatial pour élargir sa perspective',
      duration: 30,
      category: 'adventure',
      difficulty: 'intermediate',
      completedTimes: 2,
      thumbnail: '🌌',
      rating: 4.6,
    },
  ]);

  const categoryColors = {
    relaxation: 'bg-green-100 text-green-700',
    meditation: 'bg-purple-100 text-purple-700', 
    therapy: 'bg-blue-100 text-blue-700',
    adventure: 'bg-orange-100 text-orange-700',
  };

  const difficultyColors = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  const startSession = (session: VRSession) => {
    setActiveSession(session);
    setIsPlaying(true);
    setProgress(0);
    
    // Simulation du progrès
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 100;
        }
        return prev + (100 / (session.duration * 60)); // Progrès par seconde
      });
    }, 1000);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSession = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">Sessions VR</h1>
              <p className="text-sm text-white/70">Expériences immersives thérapeutiques</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-white/70" />
            <Headphones className="w-5 h-5 text-white/70" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Session Active */}
        {activeSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{activeSession.thumbnail}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{activeSession.title}</h3>
                    <p className="text-white/70">{activeSession.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetSession}
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={togglePlayPause}
                    size="sm"
                    className="bg-white text-black hover:bg-white/90"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Progrès</span>
                  <span>{Math.round(progress)}% • {activeSession.duration}min</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Sessions Disponibles */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Sessions Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer">
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2">{session.thumbnail}</div>
                    <h3 className="font-semibold text-white">{session.title}</h3>
                    <p className="text-sm text-white/70 mt-1">{session.description}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <Badge className={categoryColors[session.category]}>
                        {session.category}
                      </Badge>
                      <Badge className={difficultyColors[session.difficulty]}>
                        {session.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {session.completedTimes}x
                      </div>
                    </div>
                    
                    {session.lastCompleted && (
                      <div className="flex items-center gap-1 text-xs text-white/50">
                        <Calendar className="w-3 h-3" />
                        Dernière: {session.lastCompleted.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => startSession(session)}
                    className="w-full"
                    disabled={activeSession?.id === session.id && isPlaying}
                  >
                    {activeSession?.id === session.id && isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        En cours...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Démarrer
                      </>
                    )}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Vos Statistiques VR</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">6</div>
              <div className="text-sm text-white/70">Sessions terminées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">2h 15m</div>
              <div className="text-sm text-white/70">Temps total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">4.8</div>
              <div className="text-sm text-white/70">Note moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">3</div>
              <div className="text-sm text-white/70">Sessions favorites</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VRSessionsPage;