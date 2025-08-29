
/**
 * Page de gamification B2C
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Zap, Crown, Award } from "lucide-react";

const B2CGamificationPage = () => {
  const userStats = {
    level: 12,
    xp: 3420,
    nextLevelXp: 4000,
    streak: 15,
    achievements: 8,
    rank: "Gold"
  };

  const achievements = [
    { id: 1, title: "Premier Scan", description: "Effectuer votre premier scan d'émotion", unlocked: true, icon: "🎯" },
    { id: 2, title: "Série de 7", description: "7 jours consécutifs d'activité", unlocked: true, icon: "🔥" },
    { id: 3, title: "Explorateur VR", description: "Essayer l'expérience VR", unlocked: true, icon: "🥽" },
    { id: 4, title: "Musicothérapeute", description: "Compléter 5 sessions musicales", unlocked: false, icon: "🎵" },
    { id: 5, title: "Coach Émotionnel", description: "Interagir avec l'IA 20 fois", unlocked: false, icon: "🤖" }
  ];

  const leaderboard = [
    { rank: 1, name: "Alex M.", level: 18, xp: 5240 },
    { rank: 2, name: "Emma D.", level: 15, xp: 4890 },
    { rank: 3, name: "Vous", level: 12, xp: 3420 },
    { rank: 4, name: "Lucas T.", level: 11, xp: 3100 },
    { rank: 5, name: "Sophie L.", level: 10, xp: 2950 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Trophy className="inline-block mr-3 text-yellow-600" />
            Espace Gamification
          </h1>
          <p className="text-xl text-gray-600">
            Votre progression et récompenses EmotionsCare
          </p>
        </div>

        {/* Stats utilisateur */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Crown className="text-yellow-600" />
              Votre Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">Niveau {userStats.level}</div>
                <p className="text-sm text-gray-600">Rang actuel</p>
                <Badge className="mt-2 bg-yellow-100 text-yellow-800">{userStats.rank}</Badge>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{userStats.xp}</div>
                <p className="text-sm text-gray-600">Points d'expérience</p>
                <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{userStats.streak}</div>
                <p className="text-sm text-gray-600">Jours consécutifs</p>
                <div className="text-2xl mt-2">🔥</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{userStats.achievements}</div>
                <p className="text-sm text-gray-600">Succès débloqués</p>
                <Award className="mx-auto mt-2 text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Succès */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="text-yellow-600" />
                Succès & Récompenses
              </CardTitle>
              <CardDescription>Débloquez des récompenses en utilisant EmotionsCare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-4 border rounded-lg ${
                    achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h3 className={`font-medium ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                      {achievement.unlocked ? (
                        <Badge className="bg-green-100 text-green-800">Débloqué</Badge>
                      ) : (
                        <Badge variant="secondary">Verrouillé</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Classement */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="text-blue-600" />
                Classement Communautaire
              </CardTitle>
              <CardDescription>Votre position dans la communauté EmotionsCare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((player) => (
                  <div key={player.rank} className={`flex items-center justify-between p-3 rounded-lg ${
                    player.name === "Vous" ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        player.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        player.rank === 2 ? 'bg-gray-100 text-gray-600' :
                        player.rank === 3 ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {player.rank}
                      </div>
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-gray-600">Niveau {player.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{player.xp.toLocaleString()} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Défis quotidiens */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-purple-600" />
              Défis Quotidiens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-medium text-blue-800 mb-2">Scanner 3 émotions</h3>
                <p className="text-sm text-blue-600 mb-3">Progression: 1/3</p>
                <Progress value={33} className="mb-2" />
                <Badge className="bg-blue-100 text-blue-800">+50 XP</Badge>
              </div>
              <div className="p-4 border rounded-lg bg-green-50">
                <h3 className="font-medium text-green-800 mb-2">Session VR complète</h3>
                <p className="text-sm text-green-600 mb-3">Progression: 0/1</p>
                <Progress value={0} className="mb-2" />
                <Badge className="bg-green-100 text-green-800">+100 XP</Badge>
              </div>
              <div className="p-4 border rounded-lg bg-purple-50">
                <h3 className="font-medium text-purple-800 mb-2">Coach IA utilisé</h3>
                <p className="text-sm text-purple-600 mb-3">Progression: 1/1</p>
                <Progress value={100} className="mb-2" />
                <Badge className="bg-purple-100 text-purple-800">Terminé ✓</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center">
          <Button size="lg" className="mr-4">
            Voir Plus de Défis
          </Button>
          <Button variant="outline" size="lg">
            Historique des Récompenses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2CGamificationPage;
