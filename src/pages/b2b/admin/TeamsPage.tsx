
import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Settings, BarChart3, Filter } from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';

const TeamsPage: React.FC = () => {
  const teams = [
    {
      name: "Équipe Marketing",
      members: 12,
      manager: "Sophie Martin",
      wellnessScore: 85,
      status: "Actif"
    },
    {
      name: "Développement",
      members: 8,
      manager: "Thomas Dubois",
      wellnessScore: 78,
      status: "Actif"
    },
    {
      name: "Service Client",
      members: 15,
      manager: "Marie Leroy",
      wellnessScore: 92,
      status: "Actif"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Gestion des Équipes
            </h1>
            <p className="text-lg text-muted-foreground">
              Supervisez le bien-être de vos équipes et collaborateurs
            </p>
          </div>
          <div className="flex gap-4">
            <PremiumButton variant="secondary">
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </PremiumButton>
            <PremiumButton variant="primary">
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter une équipe
            </PremiumButton>
          </div>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <PremiumCard className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-2xl font-bold text-blue-600">35</h3>
            <p className="text-muted-foreground">Collaborateurs</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-2xl font-bold text-green-600">85%</h3>
            <p className="text-muted-foreground">Score Bien-être</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-2xl font-bold text-purple-600">3</h3>
            <p className="text-muted-foreground">Équipes Actives</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <UserPlus className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <h3 className="text-2xl font-bold text-orange-600">5</h3>
            <p className="text-muted-foreground">Nouveaux ce mois</p>
          </PremiumCard>
        </div>

        {/* Liste des équipes */}
        <PremiumCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Équipes</h3>
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nom de l'équipe</th>
                  <th className="text-left py-3 px-4">Manager</th>
                  <th className="text-left py-3 px-4">Membres</th>
                  <th className="text-left py-3 px-4">Score Bien-être</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 font-medium">{team.name}</td>
                    <td className="py-4 px-4">{team.manager}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        {team.members}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-20">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${team.wellnessScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{team.wellnessScore}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {team.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <PremiumButton variant="ghost" size="sm">
                          Voir
                        </PremiumButton>
                        <PremiumButton variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </PremiumButton>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
};

export default TeamsPage;
