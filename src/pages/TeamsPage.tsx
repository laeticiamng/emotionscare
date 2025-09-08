import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Plus, 
  Settings, 
  TrendingUp,
  Heart,
  Brain,
  Shield
} from 'lucide-react';

export default function TeamsPage() {
  const [teams] = useState([
    {
      id: '1',
      name: 'Équipe Marketing',
      members: 8,
      wellnessScore: 85,
      mood: 'Positif',
      lastActivity: '2 heures'
    },
    {
      id: '2', 
      name: 'Développement',
      members: 12,
      wellnessScore: 78,
      mood: 'Concentré',
      lastActivity: '30 minutes'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Gestion d'Équipe
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Outils collaboratifs pour le bien-être d'équipe et l'intelligence émotionnelle collective
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4 mb-8 justify-center"
        >
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-500">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Équipe
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
        </motion.div>

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{team.name}</span>
                    <Badge variant="outline">{team.members} membres</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Score bien-être</span>
                    </div>
                    <span className="font-bold text-green-600">{team.wellnessScore}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">Humeur générale</span>
                    </div>
                    <span className="text-sm text-gray-600">{team.mood}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Dernière activité</span>
                    </div>
                    <span className="text-sm text-gray-600">{team.lastActivity}</span>
                  </div>

                  <Button variant="outline" className="w-full">
                    Voir les détails
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Analytics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-indigo-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" />
                Vue d'ensemble organisationnelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">20</div>
                  <div className="text-sm text-gray-600">Équipes actives</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">82%</div>
                  <div className="text-sm text-gray-600">Score moyen</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-gray-600">Membres</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">94%</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}