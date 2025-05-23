import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, Users, Shield } from 'lucide-react';

interface GlobalOverviewTabProps {
  className?: string;
  userRole?: string;
}

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ className, userRole }) => {
  const isB2BUser = userRole === 'b2b_user';
  
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4">
        {isB2BUser ? 'Ma vue d\'ensemble' : 'Vue globale'}
      </h2>
      
      {isB2BUser ? (
        // Vue limitée pour les collaborateurs - uniquement données personnelles
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Mon activité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">78%</p>
              <p className="text-sm text-muted-foreground">Score de bien-être personnel</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                Ma progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">+5%</p>
              <p className="text-sm text-muted-foreground">Amélioration cette semaine</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-500" />
                Confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Vos données personnelles sont protégées et ne sont jamais partagées individuellement. 
                Seules des statistiques anonymisées et agrégées sont utilisées pour améliorer le bien-être collectif.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Vue complète pour les autres rôles
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Membres actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24/32</p>
              <p className="text-sm text-muted-foreground">Utilisateurs actifs cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">78%</p>
              <p className="text-sm text-muted-foreground">Score moyen d'engagement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                Progression globale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">+12%</p>
              <p className="text-sm text-muted-foreground">Amélioration du bien-être général</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GlobalOverviewTab;
