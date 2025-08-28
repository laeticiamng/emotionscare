
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, User, Shield, Users, Settings } from 'lucide-react';
import { Routes } from '@/routerV2';

interface PageAccess {
  path: string;
  name: string;
  description: string;
  requiredRole?: string;
  requiredMode?: string;
  accessible: boolean;
  reason?: string;
  category: 'core' | 'feature' | 'admin' | 'b2b';
}

const AccessDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();

  const getPageAccess = (): PageAccess[] => {
    const currentRole = user?.role;
    const currentMode = userMode;

    return [
      // Pages principales
      {
        path: Routes.home(),
        name: 'Accueil',
        description: 'Page d\'accueil publique',
        accessible: true,
        category: 'core'
      },
      {
        path: Routes.b2cLanding(),
        name: 'Sélection du mode',
        description: 'Choix du mode utilisateur',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'core'
      },

      // Dashboards
      {
        path: Routes.consumerHome(),
        name: 'Dashboard B2C',
        description: 'Tableau de bord particulier',
        requiredMode: 'b2c',
        accessible: currentMode === 'b2c',
        reason: currentMode !== 'b2c' ? 'Mode B2C requis' : undefined,
        category: 'core'
      },
      {
        path: Routes.employeeHome(),
        name: 'Dashboard Collaborateur',
        description: 'Tableau de bord collaborateur',
        requiredMode: 'b2b_user',
        accessible: currentMode === 'b2b_user',
        reason: currentMode !== 'b2b_user' ? 'Mode collaborateur requis' : undefined,
        category: 'b2b'
      },
      {
        path: Routes.managerHome(),
        name: 'Dashboard Admin RH',
        description: 'Tableau de bord administrateur RH',
        requiredMode: 'b2b_admin',
        accessible: currentMode === 'b2b_admin',
        reason: currentMode !== 'b2b_admin' ? 'Mode admin RH requis' : undefined,
        category: 'admin'
      },

      // Fonctionnalités communes
      {
        path: Routes.scan(),
        name: 'Scanner d\'émotions',
        description: 'Analyse des émotions',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },
      {
        path: Routes.music(),
        name: 'Musicothérapie',
        description: 'Thérapie par la musique',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },
      {
        path: Routes.coach(),
        name: 'Coach virtuel',
        description: 'Assistant bien-être IA',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },
      {
        path: Routes.journal(),
        name: 'Journal personnel',
        description: 'Journal intime numérique',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },
      {
        path: Routes.vr(),
        name: 'Réalité virtuelle',
        description: 'Expériences immersives VR',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },
      {
        path: Routes.leaderboard(),
        name: 'Gamification',
        description: 'Défis et récompenses',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },
      {
        path: Routes.socialCocon(),
        name: 'Cocon social',
        description: 'Communauté et échanges',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },

      // Pages administrateur
      {
        path: Routes.teams(),
        name: 'Gestion des équipes',
        description: 'Administration des équipes',
        requiredRole: 'b2b_admin',
        accessible: currentRole === 'b2b_admin',
        reason: currentRole !== 'b2b_admin' ? 'Rôle admin RH requis' : undefined,
        category: 'admin'
      },
      {
        path: Routes.adminReports(),
        name: 'Rapports',
        description: 'Rapports et analyses',
        requiredRole: 'b2b_admin',
        accessible: currentRole === 'b2b_admin',
        reason: currentRole !== 'b2b_admin' ? 'Rôle admin RH requis' : undefined,
        category: 'admin'
      },
      {
        path: Routes.adminEvents(),
        name: 'Événements',
        description: 'Gestion des événements',
        requiredRole: 'b2b_admin',
        accessible: currentRole === 'b2b_admin',
        reason: currentRole !== 'b2b_admin' ? 'Rôle admin RH requis' : undefined,
        category: 'admin'
      },
      {
        path: Routes.adminOptimization(),
        name: 'Optimisation',
        description: 'Outils d\'optimisation',
        requiredRole: 'b2b_admin',
        accessible: currentRole === 'b2b_admin',
        reason: currentRole !== 'b2b_admin' ? 'Rôle admin RH requis' : undefined,
        category: 'admin'
      },
      {
        path: Routes.settingsGeneral(),
        name: 'Paramètres',
        description: 'Configuration système',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'core'
      }
    ];
  };

  const pageAccess = getPageAccess();
  const accessiblePages = pageAccess.filter(page => page.accessible);
  const restrictedPages = pageAccess.filter(page => !page.accessible);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <Settings className="h-4 w-4" />;
      case 'feature': return <User className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'b2b': return <Users className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-800';
      case 'feature': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'b2b': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Résumé de l'accès */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">{accessiblePages.length}</p>
              <p className="text-sm text-muted-foreground">Pages accessibles</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">{restrictedPages.length}</p>
              <p className="text-sm text-muted-foreground">Pages restreintes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{pageAccess.length}</p>
              <p className="text-sm text-muted-foreground">Total des pages</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des pages accessibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Pages accessibles ({accessiblePages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {accessiblePages.map((page) => (
              <div key={page.path} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium">{page.name}</h4>
                    <p className="text-sm text-muted-foreground">{page.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(page.category)}>
                    {getCategoryIcon(page.category)}
                    {page.category}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => navigate(page.path)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accéder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste des pages restreintes */}
      {restrictedPages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Pages restreintes ({restrictedPages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {restrictedPages.map((page) => (
                <div key={page.path} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <h4 className="font-medium text-gray-700">{page.name}</h4>
                      <p className="text-sm text-muted-foreground">{page.description}</p>
                      {page.reason && (
                        <p className="text-sm text-red-600 font-medium">{page.reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(page.category)}>
                      {getCategoryIcon(page.category)}
                      {page.category}
                    </Badge>
                    <Button size="sm" variant="outline" disabled>
                      Accès refusé
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccessDashboard;
