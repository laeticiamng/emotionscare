
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Star } from 'lucide-react';

const GamificationPage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Gamification & Défis
          </h1>
          <p className="text-muted-foreground">
            Améliorez votre bien-être en relevant des défis et en débloquant des succès
          </p>
        </div>
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Bienvenue dans votre espace gamification !
              </h2>
              <p className="text-muted-foreground">
                Relevez des défis quotidiens, hebdomadaires et spéciaux pour améliorer votre bien-être 
                et débloquer de nouveaux succès. Chaque action compte pour votre progression !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contexte selon le mode utilisateur */}
      {(userMode === 'b2b_admin' || userMode === 'b2b_user') && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Target className="h-5 w-5" />
              <p className="font-medium">
                {userMode === 'b2b_admin' 
                  ? 'Mode Administrateur RH : Suivez les performances de votre équipe et encouragez la participation'
                  : 'Mode Collaborateur : Participez aux défis d\'équipe et améliorez le bien-être collectif'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard */}
      <GamificationDashboard />
    </div>
  );
};

export default GamificationPage;
