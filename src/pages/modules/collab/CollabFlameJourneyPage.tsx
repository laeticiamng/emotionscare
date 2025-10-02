// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Users, Target, Award, TrendingUp, Zap, Heart, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import confetti from 'canvas-confetti';
import { useChallengeModule } from '@/hooks/useChallengeModule';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  contribution: number;
  mood: number; // 0-100
  lastActive: Date;
}

interface CollabChallenge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  targetContributions: number;
  duration: number; // minutes
  reward: number;
  flameColor: string;
}

const challenges: CollabChallenge[] = [
  {
    id: '1',
    name: 'Étincelle d\'Équipe',
    emoji: '✨',
    description: 'Premier défi collaboratif',
    targetContributions: 5,
    duration: 10,
    reward: 50,
    flameColor: '#FFD700'
  },
  {
    id: '2',
    name: 'Flamme Naissante',
    emoji: '🔥',
    description: 'Créez une vraie synergie',
    targetContributions: 10,
    duration: 15,
    reward: 100,
    flameColor: '#FF6347'
  },
  {
    id: '3',
    name: 'Brasier Collectif',
    emoji: '🌋',
    description: 'L\'équipe s\'enflamme',
    targetContributions: 20,
    duration: 20,
    reward: 200,
    flameColor: '#FF4500'
  },
  {
    id: '4',
    name: 'Inferno Collaboratif',
    emoji: '🔥🔥',
    description: 'Puissance maximale',
    targetContributions: 30,
    duration: 30,
    reward: 500,
    flameColor: '#FF0000'
  },
];

export default function CollabFlameJourneyPage() {
  const {
    activeChallenges,
    startChallenge: startChallengeHook,
    completeChallenge,
    updateProgress: updateChallengeProgress,
    sessionData,
    achievements,
  } = useChallengeModule('collab-flame');

  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Toi', avatar: '😊', contribution: 0, mood: 80, lastActive: new Date() },
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [totalContributions, setTotalContributions] = useState(0);
  const [flameIntensity, setFlameIntensity] = useState(0);
  const [timeLeft, setTimeLeft] = useState(challenges[0].duration * 60);
  const [isActive, setIsActive] = useState(false);

  const challenge = challenges[currentChallenge];
  const progress = (totalContributions / challenge.targetContributions) * 100;
  const teamMoodAverage = teamMembers.reduce((sum, m) => sum + m.mood, 0) / teamMembers.length;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            checkChallengeCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Animate flame intensity based on contributions
  useEffect(() => {
    setFlameIntensity(Math.min(100, (totalContributions / challenge.targetContributions) * 100));
  }, [totalContributions, challenge]);

  const addTeamMember = () => {
    if (!newMemberName.trim()) return;

    const avatars = ['😊', '😎', '🤓', '😇', '🥳', '🦸', '🧙', '🦊', '🦉', '🐱'];
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberName,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      contribution: 0,
      mood: 70 + Math.random() * 30,
      lastActive: new Date(),
    };

    setTeamMembers(prev => [...prev, newMember]);
    setNewMemberName('');
  };

  const contribute = (memberId: string) => {
    if (!isActive) return;

    setTeamMembers(prev =>
      prev.map(member => {
        if (member.id === memberId) {
          return {
            ...member,
            contribution: member.contribution + 1,
            mood: Math.min(100, member.mood + 2),
            lastActive: new Date(),
          };
        }
        return member;
      })
    );

    setTotalContributions(prev => prev + 1);

    // Small celebration
    if (Math.random() > 0.7) {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.7 },
        colors: [challenge.flameColor],
      });
    }
  };

  const checkChallengeCompletion = async () => {
    setIsActive(false);
    
    if (totalContributions >= challenge.targetContributions) {
      await completeChallenge(challenge.id, {
        teamSize: teamMembers.length,
        contributions: totalContributions,
        teamMood: Math.round(teamMoodAverage)
      });

      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: [challenge.flameColor, '#FFD700', '#FF6347'],
      });

      if (currentChallenge < challenges.length - 1) {
        setTimeout(() => {
          setCurrentChallenge(prev => prev + 1);
          setTimeLeft(challenges[currentChallenge + 1].duration * 60);
          setTotalContributions(0);
        }, 3000);
      }
    }
  };

  const startChallenge = async () => {
    setIsActive(true);
    setTotalContributions(0);
    setTeamMembers(prev => prev.map(m => ({ ...m, contribution: 0 })));
    
    await startChallengeHook({
      id: challenge.id,
      type: 'collaborative',
      difficulty: 'medium',
      duration: challenge.duration * 60
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-red-950 to-yellow-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Flame className="w-12 h-12" />
            Collab Flame Hub
          </h1>
          <p className="text-white/80 text-lg">Ensemble, créez une flamme collective inoubliable</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Flame */}
          <Card className="lg:col-span-2 p-6 bg-black/30 backdrop-blur-lg border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{challenge.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{challenge.name}</h2>
                  <p className="text-white/70">{challenge.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{formatTime(timeLeft)}</div>
                <div className="text-white/70 text-sm">Temps restant</div>
              </div>
            </div>

            {/* Flame Visualization */}
            <div className="relative h-96 bg-gradient-to-b from-black/50 to-transparent rounded-xl overflow-hidden mb-6 flex items-end justify-center">
              <motion.div
                className="relative"
                animate={{
                  scale: [1, 1.1, 1],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="text-center"
                  style={{
                    fontSize: `${50 + flameIntensity * 2}px`,
                    filter: `drop-shadow(0 0 ${flameIntensity}px ${challenge.flameColor})`,
                  }}
                >
                  🔥
                </motion.div>
                
                {/* Contribution particles */}
                {[...Array(Math.floor(flameIntensity / 10))].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100 - 50}px`,
                      bottom: '0',
                    }}
                    animate={{
                      y: [-100, -200],
                      opacity: [1, 0],
                      scale: [1, 0.5],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  >
                    <span style={{ color: challenge.flameColor }}>✨</span>
                  </motion.div>
                ))}
              </motion.div>

              <div className="absolute top-4 left-4 right-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Contributions</span>
                  <span className="text-white font-bold">{totalContributions}/{challenge.targetContributions}</span>
                </div>
                <Progress value={progress} className="h-4" />
              </div>
            </div>

            {/* Team Actions */}
            <div className="space-y-3">
              {!isActive ? (
                <Button
                  onClick={startChallenge}
                  className="w-full h-14 text-lg"
                  style={{
                    background: `linear-gradient(135deg, ${challenge.flameColor}, ${challenge.flameColor}dd)`,
                  }}
                  disabled={teamMembers.length < 1}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Lancer le Défi
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {teamMembers.slice(0, 4).map((member) => (
                    <Button
                      key={member.id}
                      onClick={() => contribute(member.id)}
                      variant="outline"
                      className="h-16 flex flex-col items-center justify-center"
                    >
                      <div className="text-2xl mb-1">{member.avatar}</div>
                      <div className="text-sm">{member.name} ({member.contribution})</div>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {progress >= 100 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4"
              >
                <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-center">
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-2">Défi Réussi!</h3>
                  <p className="text-white/70">+{challenge.reward} points d'équipe</p>
                </Card>
              </motion.div>
            )}
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Team Mood */}
            <Card className="p-6 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-lg border-pink-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-8 h-8 text-pink-400" />
                <span className="text-white/80">Mood d'Équipe</span>
              </div>
              <div className="text-4xl font-bold text-white">{Math.round(teamMoodAverage)}%</div>
            </Card>

            {/* Add Team Member */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Équipe ({teamMembers.length})
              </h3>
              
              <div className="flex gap-2 mb-4">
                <Input
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Nom du membre"
                  className="bg-white/5 border-white/20 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
                />
                <Button onClick={addTeamMember} variant="outline">
                  +
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 bg-white/5 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{member.avatar}</span>
                      <div>
                        <div className="text-white font-medium">{member.name}</div>
                        <div className="text-white/60 text-xs">Contrib: {member.contribution}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/70 text-xs">Mood</div>
                      <div className="text-white font-bold">{Math.round(member.mood)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Défi actuel</span>
                  <span className="text-white font-bold">{currentChallenge + 1}/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Défis complétés</span>
                  <span className="text-white font-bold">{sessionData.challengesCompleted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Points</span>
                  <span className="text-white font-bold">{sessionData.totalPoints || 0}</span>
                </div>
              </div>
            </Card>

            {achievements.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-center">
                  <Award className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-2">Maîtres de la Flamme!</h3>
                  <p className="text-white/70">Votre équipe est légendaire 🔥</p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Challenge Timeline */}
        <Card className="mt-6 p-6 bg-white/5 backdrop-blur-lg border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Parcours de Flamme Collective</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {challenges.map((c, index) => (
              <div
                key={c.id}
                className={`p-4 rounded-lg text-center transition-all ${
                  index === currentChallenge
                    ? 'bg-orange-500/30 border-2 border-orange-400 scale-105'
                    : index < currentChallenge
                    ? 'bg-green-500/20 border-2 border-green-400'
                    : 'bg-white/10 border-2 border-white/20'
                }`}
              >
                <div className="text-4xl mb-2">{c.emoji}</div>
                <div className="text-white font-bold mb-1">{c.name}</div>
                <div className="text-white/60 text-xs mb-2">{c.targetContributions} contributions</div>
                <div className="text-white/60 text-xs">{c.duration} minutes</div>
                {index < currentChallenge && (
                  <div className="text-green-400 text-xs mt-2">✓ Réussi</div>
                )}
                {index === currentChallenge && (
                  <div className="text-orange-400 text-xs mt-2">● En cours</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
