import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Target, Trophy, Flame, Award, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';
import { useAmbition } from '@/hooks/useAmbition';

interface BossChallenge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  difficulty: number;
  hp: number;
  rewards: number;
  weaknesses: string[];
  attacks: string[];
}

const bossChallenges: BossChallenge[] = [
  {
    id: '1',
    name: 'Le Doute',
    emoji: '😰',
    description: 'Première épreuve : vaincre tes propres doutes',
    difficulty: 1,
    hp: 100,
    rewards: 50,
    weaknesses: ['Confiance', 'Action'],
    attacks: ['Hésitation', 'Peur du jugement']
  },
  {
    id: '2',
    name: 'La Procrastination',
    emoji: '😴',
    description: 'Ton ennemi juré qui vole ton temps',
    difficulty: 2,
    hp: 150,
    rewards: 75,
    weaknesses: ['Organisation', 'Motivation'],
    attacks: ['Distraction', 'Fausse urgence']
  },
  {
    id: '3',
    name: 'Le Perfectionnisme',
    emoji: '🎯',
    description: 'Celui qui empêche de commencer',
    difficulty: 2,
    hp: 200,
    rewards: 100,
    weaknesses: ['Progression', 'Acceptation'],
    attacks: ['Standards impossibles', 'Paralysie analytique']
  },
  {
    id: '4',
    name: 'La Comparaison',
    emoji: '👥',
    description: 'Le voleur de joie',
    difficulty: 3,
    hp: 250,
    rewards: 150,
    weaknesses: ['Authenticité', 'Gratitude'],
    attacks: ['Envie', 'Dévalorisation']
  },
  {
    id: '5',
    name: 'L\'Échec',
    emoji: '💥',
    description: 'L\'illusion qui bloque ta progression',
    difficulty: 3,
    hp: 300,
    rewards: 200,
    weaknesses: ['Résilience', 'Apprentissage'],
    attacks: ['Découragement', 'Abandon']
  },
  {
    id: '6',
    name: 'L\'Imposteur',
    emoji: '🎭',
    description: 'Le syndrome qui nie tes réussites',
    difficulty: 4,
    hp: 400,
    rewards: 300,
    weaknesses: ['Reconnaissance', 'Légitimité'],
    attacks: ['Auto-sabotage', 'Minimisation']
  },
  {
    id: '7',
    name: 'Le Chaos Final',
    emoji: '🌪️',
    description: 'Boss ultime : tous tes obstacles réunis',
    difficulty: 5,
    hp: 500,
    rewards: 500,
    weaknesses: ['Persévérance', 'Sagesse', 'Force intérieure'],
    attacks: ['Tempête émotionnelle', 'Doute ultime', 'Épuisement']
  },
];

export default function BossGritJourneyPage() {
  const [currentBoss, setCurrentBoss] = useState(0);
  const [bossHp, setBossHp] = useState(bossChallenges[0].hp);
  const [playerHp, setPlayerHp] = useState(100);
  const [combo, setCombo] = useState(0);
  const [totalDamage, setTotalDamage] = useState(0);
  const [shield, setShield] = useState(0);
  const [isAttacking, setIsAttacking] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const { goals, createGoal, completeLevel } = useAmbition();

  const boss = bossChallenges[currentBoss];
  const progress = ((boss.hp - bossHp) / boss.hp) * 100;
  const playerProgress = (playerHp / 100) * 100;

  const addLog = (message: string) => {
    setBattleLog(prev => [message, ...prev.slice(0, 4)]);
  };

  const attack = (weaponType: 'sword' | 'shield' | 'strategy') => {
    if (isAttacking || bossHp <= 0) return;
    
    setIsAttacking(true);
    
    const baseDamage = weaponType === 'sword' ? 25 : weaponType === 'shield' ? 15 : 20;
    const comboBonus = Math.floor(combo * 2);
    const damage = baseDamage + comboBonus + Math.floor(Math.random() * 10);
    
    setBossHp(prev => Math.max(0, prev - damage));
    setTotalDamage(prev => prev + damage);
    setCombo(prev => prev + 1);
    
    if (weaponType === 'shield') {
      setShield(prev => Math.min(100, prev + 20));
      addLog(`🛡️ +${damage} dégâts + 20 bouclier`);
    } else if (weaponType === 'strategy') {
      addLog(`🎯 Attaque stratégique : ${damage} dégâts (combo x${combo})`);
    } else {
      addLog(`⚔️ Coup puissant : ${damage} dégâts!`);
    }

    // Boss counter-attack
    setTimeout(() => {
      if (bossHp > damage) {
        const bossAttack = boss.attacks[Math.floor(Math.random() * boss.attacks.length)];
        const bossDamage = Math.max(0, Math.floor(Math.random() * 15 + 10) - shield);
        
        if (bossDamage > 0) {
          setPlayerHp(prev => Math.max(0, prev - bossDamage));
          addLog(`${boss.emoji} ${bossAttack} : -${bossDamage} HP`);
        } else {
          addLog(`${boss.emoji} ${bossAttack} : BLOQUÉ par le bouclier!`);
        }
        setShield(prev => Math.max(0, prev - 10));
      }
      setIsAttacking(false);
    }, 800);
  };

  useEffect(() => {
    if (bossHp <= 0 && currentBoss < bossChallenges.length) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
      addLog(`🎉 ${boss.name} vaincu! +${boss.rewards} XP`);
    }
  }, [bossHp]);

  const nextBoss = () => {
    if (currentBoss < bossChallenges.length - 1) {
      setCurrentBoss(prev => prev + 1);
      setBossHp(bossChallenges[currentBoss + 1].hp);
      setPlayerHp(100);
      setCombo(0);
      setShield(0);
      setBattleLog([]);
    }
  };

  const heal = () => {
    setPlayerHp(prev => Math.min(100, prev + 30));
    setCombo(0);
    addLog(`💚 Repos : +30 HP restaurés`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Sword className="w-12 h-12" />
            Boss Grit Arena
          </h1>
          <p className="text-white/80 text-lg">Affronte tes obstacles intérieurs et deviens plus fort</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Battle Arena */}
          <Card className="lg:col-span-2 p-6 bg-black/30 backdrop-blur-lg border-red-500/30">
            {/* Boss */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{boss.emoji}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{boss.name}</h2>
                    <p className="text-white/70">{boss.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 mb-1">
                    {[...Array(boss.difficulty)].map((_, i) => (
                      <Flame key={i} className="w-5 h-5 text-red-400" />
                    ))}
                  </div>
                  <div className="text-white/70 text-sm">Difficulté</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">HP Boss</span>
                  <span className="text-white font-bold">{bossHp}/{boss.hp}</span>
                </div>
                <Progress value={progress} className="h-4 bg-white/20" />
              </div>
            </div>

            {/* Battle Animation Area */}
            <div className="relative h-64 bg-gradient-to-b from-red-950/50 to-orange-950/50 rounded-xl mb-6 overflow-hidden">
              <motion.div
                animate={isAttacking ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="text-9xl">{boss.emoji}</div>
              </motion.div>
              
              {isAttacking && (
                <motion.div
                  initial={{ scale: 0, x: -100 }}
                  animate={{ scale: [0, 1.5, 0], x: [0, 100, 200] }}
                  transition={{ duration: 0.8 }}
                  className="absolute left-1/4 top-1/2 text-6xl"
                >
                  ⚔️
                </motion.div>
              )}
            </div>

            {/* Player Status */}
            <div className="mb-6 p-4 bg-white/10 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  Ton Statut
                </span>
                <span className="text-white/70">Combo: x{combo}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">❤️ HP</span>
                  <span className="text-white font-bold">{playerHp}/100</span>
                </div>
                <Progress value={playerProgress} className="h-3 bg-white/20" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">🛡️ Bouclier</span>
                  <span className="text-white font-bold">{shield}/100</span>
                </div>
                <Progress value={shield} className="h-2 bg-white/20" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Button
                onClick={() => attack('sword')}
                disabled={isAttacking || bossHp <= 0 || playerHp <= 0}
                className="h-16 bg-gradient-to-br from-red-500 to-red-700"
              >
                <Sword className="w-5 h-5 mr-2" />
                Attaquer
              </Button>
              <Button
                onClick={() => attack('shield')}
                disabled={isAttacking || bossHp <= 0 || playerHp <= 0}
                className="h-16 bg-gradient-to-br from-blue-500 to-blue-700"
              >
                <Shield className="w-5 h-5 mr-2" />
                Défendre
              </Button>
              <Button
                onClick={() => attack('strategy')}
                disabled={isAttacking || bossHp <= 0 || playerHp <= 0}
                className="h-16 bg-gradient-to-br from-purple-500 to-purple-700"
              >
                <Target className="w-5 h-5 mr-2" />
                Stratégie
              </Button>
            </div>

            {playerHp <= 30 && playerHp > 0 && (
              <Button onClick={heal} variant="outline" className="w-full mb-4">
                💚 Se Reposer (+30 HP)
              </Button>
            )}

            {bossHp <= 0 && currentBoss < bossChallenges.length - 1 && (
              <Button onClick={nextBoss} className="w-full h-14 text-lg bg-gradient-to-r from-yellow-500 to-orange-500">
                <Trophy className="w-5 h-5 mr-2" />
                Boss Suivant
              </Button>
            )}

            {bossHp <= 0 && currentBoss === bossChallenges.length - 1 && (
              <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-center">
                <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-2">Victoire Totale!</h3>
                <p className="text-white/70">Tu as vaincu tous tes obstacles!</p>
              </Card>
            )}
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Boss vaincus</span>
                  <span className="text-white font-bold">{currentBoss}/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Dégâts totaux</span>
                  <span className="text-white font-bold">{totalDamage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Meilleur combo</span>
                  <span className="text-white font-bold">x{combo}</span>
                </div>
              </div>
            </Card>

            {/* Weaknesses */}
            <Card className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border-green-500/30">
              <h3 className="text-lg font-bold text-white mb-3">🎯 Faiblesses</h3>
              <div className="space-y-2">
                {boss.weaknesses.map((weakness, i) => (
                  <div key={i} className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm">
                    {weakness}
                  </div>
                ))}
              </div>
            </Card>

            {/* Battle Log */}
            <Card className="p-6 bg-black/30 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">📜 Journal de Combat</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {battleLog.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-white/80 text-sm px-3 py-2 bg-white/5 rounded"
                    >
                      {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </div>
        </div>

        {/* Boss Progress */}
        <Card className="mt-6 p-6 bg-white/5 backdrop-blur-lg border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Ton Parcours de Guerrier</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {bossChallenges.map((b, index) => (
              <div
                key={b.id}
                className={`p-4 rounded-lg text-center transition-all ${
                  index === currentBoss
                    ? 'bg-red-500/30 border-2 border-red-400 scale-105'
                    : index < currentBoss
                    ? 'bg-green-500/20 border-2 border-green-400'
                    : 'bg-white/10 border-2 border-white/20'
                }`}
              >
                <div className="text-4xl mb-2">{b.emoji}</div>
                <div className="text-white text-sm font-medium mb-1">{b.name}</div>
                <div className="flex gap-1 justify-center">
                  {[...Array(b.difficulty)].map((_, i) => (
                    <Flame key={i} className="w-3 h-3 text-orange-400" />
                  ))}
                </div>
                {index < currentBoss && (
                  <div className="text-green-400 text-xs mt-2">✓ Vaincu</div>
                )}
                {index === currentBoss && (
                  <div className="text-red-400 text-xs mt-2">● Combat</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
