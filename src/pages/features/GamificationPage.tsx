
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Award, TrendingUp, Calendar, Star } from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';

const GamificationPage: React.FC = () => {
  const achievements = [
    { title: "Premier Pas", description: "Première séance complétée", icon: "🎯", unlocked: true },
    { title: "Régularité", description: "7 jours consécutifs", icon: "📅", unlocked: true },
    { title: "Explorateur", description: "5 modules différents testés", icon: "🧭", unlocked: false },
    { title: "Maître Zen", description: "50 séances de méditation", icon: "🧘", unlocked: false }
  ];

  const challenges = [
    { title: "Défi du Mois", description: "Méditer 20 minutes par jour", progress: 65, reward: "Badge Sérénité" },
    { title: "Exploration", description: "Essayer 3 nouveaux modules", progress: 33, reward: "Points XP x2" },
    { title: "Constance", description: "15 jours sans interruption", progress: 80, reward: "Avatar Doré" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Gamification & Récompenses
          </h1>
          <p className="text-lg text-muted-foreground">
            Transformez votre parcours bien-être en aventure ludique
          </p>
        </div>

        {/* Stats générales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <PremiumCard className="text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-bold text-yellow-600">1,250</h3>
            <p className="text-muted-foreground">Points XP</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-2xl font-bold text-blue-600">Niveau 8</h3>
            <p className="text-muted-foreground">Explorateur</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-2xl font-bold text-purple-600">12</h3>
            <p className="text-muted-foreground">Badges</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-2xl font-bold text-green-600">24</h3>
            <p className="text-muted-foreground">Série de jours</p>
          </PremiumCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Succès */}
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Succès Débloqués</h3>
              <Award className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`flex items-center p-4 rounded-lg ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-2xl mr-4">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Star className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              ))}
            </div>
          </PremiumCard>

          {/* Défis actuels */}
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Défis en Cours</h3>
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-6">
              {challenges.map((challenge, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{challenge.title}</h4>
                    <span className="text-sm text-blue-600">{challenge.progress}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Récompense: {challenge.reward}</span>
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>

        {/* Boutique de récompenses */}
        <PremiumCard>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Boutique de Récompenses</h3>
            <p className="text-muted-foreground">Échangez vos points XP contre des récompenses exclusives</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="font-bold mb-2">Thème Premium</h4>
              <p className="text-sm text-muted-foreground mb-4">Interface personnalisée exclusive</p>
              <PremiumButton variant="accent" size="sm">
                500 XP
              </PremiumButton>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border">
              <div className="text-4xl mb-4">🔮</div>
              <h4 className="font-bold mb-2">Module VR Bonus</h4>
              <p className="text-sm text-muted-foreground mb-4">Accès à des expériences exclusives</p>
              <PremiumButton variant="primary" size="sm">
                800 XP
              </PremiumButton>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border">
              <div className="text-4xl mb-4">👑</div>
              <h4 className="font-bold mb-2">Statut VIP</h4>
              <p className="text-sm text-muted-foreground mb-4">Avantages exclusifs pendant 1 mois</p>
              <PremiumButton variant="secondary" size="sm">
                1200 XP
              </PremiumButton>
            </div>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
};

export default GamificationPage;
