import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, User, Shield, Users, Settings } from '@/lib/icons';
import { routes } from '@/routerV2';

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
        path: routes.public.home(),
        name: 'Accueil',
        description: 'Page d\'accueil publique',
        accessible: true,
        category: 'core'
      },
      {
        path: routes.b2c.home(),
        name: 'Sélection du mode',
        description: 'Choix du mode utilisateur',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'core'
      },

      // Dashboards
      {
        path: routes.b2c.dashboard(),
        name: 'Dashboard B2C',
        description: 'Espace personnel utilisateur',
        accessible: isAuthenticated && (currentMode === 'b2c' || currentRole === 'b2c'),
        reason: !isAuthenticated ? 'Connexion requise' : currentMode !== 'b2c' ? 'Rôle B2C requis' : undefined,
        category: 'core'
      },
      {
        path: routes.b2b.user.dashboard(),
        name: 'Dashboard Employé',
        description: 'Espace collaborateur B2B',
        accessible: isAuthenticated && (currentMode === 'b2b_user' || currentRole === 'b2b_user'),
        reason: !isAuthenticated ? 'Connexion requise' : currentMode !== 'b2b_user' ? 'Rôle employé requis' : undefined,
        category: 'b2b'
      },
      {
        path: routes.b2b.admin.dashboard(),
        name: 'Dashboard Manager',
        description: 'Espace de pilotage RH',
        accessible: isAuthenticated && (currentMode === 'b2b_admin' || currentRole === 'b2b_admin'),
        reason: !isAuthenticated ? 'Connexion requise' : currentMode !== 'b2b_admin' ? 'Rôle administrateur requis' : undefined,
        category: 'admin'
      },

      // Features B2C
      {
        path: routes.b2c.scan(),
        name: 'Scanner Émotionnel',
        description: 'Analyse des émotions instantanée',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },
      {
        path: routes.b2c.music(),
        name: 'Musicothérapie',
        description: 'Sons apaisants personnalisés',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },
      {
        path: routes.b2c.coach(),
        name: 'Coach IA',
        description: 'Accompagnement personnalisé',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },
      {
        path: routes.b2c.journal(),
        name: 'Journal Personnel',
        description: 'Réflexion et suivi humeurs',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },
      {
        path: routes.b2c.vr(),
        name: 'Réalité Virtuelle',
        description: 'Expériences immersives',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },
      {
        path: routes.b2c.bossLevel(),
        name: 'Gamification Douce',
        description: 'Progression bienveillante',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },
      {
        path: routes.b2c.community(),
        name: 'Social Cocoon',
        description: 'Communauté sécurisée',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Connexion requise' : undefined,
        category: 'feature'
      },

      // Features B2B
      {
        path: routes.b2b.teams(),
        name: 'Gestion Équipes',
        description: 'Collaboration et bien-être collectif',
        accessible: isAuthenticated && (currentRole === 'b2b_admin' || currentRole === 'b2b_user'),
        reason: !isAuthenticated ? 'Connexion requise' : 'Rôle B2B requis',
        category: 'b2b'
      },
      {
        path: routes.b2b.reports(),
        name: 'Rapports Agrégés',
        description: 'Analytics anonymisés',
        accessible: isAuthenticated && (currentRole === 'b2b_admin' || currentRole === 'b2b_user'),
        reason: !isAuthenticated ? 'Connexion requise' : 'Rôle B2B requis',
        category: 'b2b'
      },
      {
        path: routes.b2b.events(),
        name: 'Événements Bien-être',
        description: 'Organisation activités',
        accessible: isAuthenticated && (currentRole === 'b2b_admin' || currentRole === 'b2b_user'),
        reason: !isAuthenticated ? 'Connexion requise' : 'Rôle B2B requis',
        category: 'b2b'
      },
      {
        path: routes.b2b.admin.analytics(),
        name: 'Optimisation RH',
        description: 'Amélioration continue',
        accessible: isAuthenticated && currentRole === 'b2b_admin',
        reason: !isAuthenticated ? 'Connexion requise' : currentRole !== 'b2b_admin' ? 'Rôle administrateur requis' : undefined,
        category: 'admin'
      },
      {
        path: routes.b2c.settings(),
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