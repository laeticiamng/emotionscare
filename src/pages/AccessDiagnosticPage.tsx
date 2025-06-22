
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BarChart3,
  Settings,
  Zap,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import AccessVerifier from '@/components/access/AccessVerifier';
import AdaptiveNavigation from '@/components/navigation/AdaptiveNavigation';

const AccessDiagnosticPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  
  const currentRole = user?.role || userMode || 'guest';
  
  const diagnosticSummary = {
    authentication: isAuthenticated ? 'success' : 'warning',
    roleDefinition: currentRole !== 'guest' ? 'success' : 'error',
    accessLevel: currentRole === 'b2b_admin' ? 'high' : currentRole === 'b2b_user' ? 'medium' : 'basic'
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'basic': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Diagnostic d'Accès EmotionsCare</h1>
        <p className="text-muted-foreground">
          Vérifiez votre niveau d'accès et explorez toutes les fonctionnalités disponibles
        </p>
      </div>
      
      {/* État global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {getStatusIcon(diagnosticSummary.authentication)}
              <div>
                <h3 className="font-semibold">Authentification</h3>
                <p className="text-sm text-muted-foreground">
                  {isAuthenticated ? 'Connecté' : 'Non connecté'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {getStatusIcon(diagnosticSummary.roleDefinition)}
              <div>
                <h3 className="font-semibold">Rôle Défini</h3>
                <p className="text-sm text-muted-foreground">
                  {currentRole === 'b2c' ? 'Particulier' : 
                   currentRole === 'b2b_user' ? 'Collaborateur' : 
                   currentRole === 'b2b_admin' ? 'Admin RH' : 
                   'Non défini'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Niveau d'Accès</h3>
                <Badge className={getAccessLevelColor(diagnosticSummary.accessLevel)}>
                  {diagnosticSummary.accessLevel === 'high' ? 'Élevé' :
                   diagnosticSummary.accessLevel === 'medium' ? 'Moyen' : 'Basique'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="access">Vérification d'accès</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="optimization">Optimisation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Profil Utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Nom:</span>
                  <span className="text-sm">{user?.name || 'Non défini'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{user?.email || 'Non défini'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rôle:</span>
                  <Badge variant="outline">
                    {currentRole === 'b2c' ? 'Particulier' : 
                     currentRole === 'b2b_user' ? 'Collaborateur' : 
                     currentRole === 'b2b_admin' ? 'Admin RH' : 'Invité'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Statut:</span>
                  <Badge variant={isAuthenticated ? "success" : "secondary"}>
                    {isAuthenticated ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Statistiques d'Accès
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pages accessibles:</span>
                    <Badge variant="success">
                      {currentRole === 'b2b_admin' ? '15/15' : 
                       currentRole === 'b2b_user' ? '11/15' : 
                       currentRole === 'b2c' ? '11/15' : '0/15'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fonctionnalités premium:</span>
                    <Badge variant={currentRole !== 'guest' ? "success" : "secondary"}>
                      {currentRole !== 'guest' ? 'Activées' : 'Limitées'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Outils d'administration:</span>
                    <Badge variant={currentRole === 'b2b_admin' ? "success" : "secondary"}>
                      {currentRole === 'b2b_admin' ? 'Disponibles' : 'Restreints'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {!isAuthenticated && (
                  <Button 
                    onClick={() => navigate('/choose-mode')}
                    className="flex items-center gap-2"
                  >
                    Se connecter
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Actualiser
                </Button>
                {currentRole === 'b2c' && (
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/choose-mode')}
                    className="flex items-center gap-2"
                  >
                    Mode B2B
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="access">
          <AccessVerifier />
        </TabsContent>
        
        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Adaptative</CardTitle>
              <p className="text-sm text-muted-foreground">
                Explorez toutes les fonctionnalités disponibles selon votre rôle
              </p>
            </CardHeader>
            <CardContent>
              <AdaptiveNavigation 
                variant="grid"
                showCategories={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Recommandations d'Optimisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isAuthenticated && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2">Authentification recommandée</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    Connectez-vous pour débloquer toutes les fonctionnalités premium d'EmotionsCare.
                  </p>
                  <Button size="sm" onClick={() => navigate('/choose-mode')}>
                    Se connecter maintenant
                  </Button>
                </div>
              )}
              
              {currentRole === 'b2c' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Mode B2B disponible</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Passez en mode B2B pour accéder aux fonctionnalités d'équipe et de collaboration.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => navigate('/choose-mode')}>
                    Découvrir le mode B2B
                  </Button>
                </div>
              )}
              
              {currentRole === 'b2b_user' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Accès collaborateur optimal</h4>
                  <p className="text-sm text-green-700">
                    Vous avez accès à toutes les fonctionnalités collaboratives. Explorez les outils de bien-être d'équipe !
                  </p>
                </div>
              )}
              
              {currentRole === 'b2b_admin' && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Accès administrateur complet</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Vous disposez de tous les privilèges administrateur. Utilisez les outils d'analytics et de gestion d'équipe.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => navigate('/reports')}>
                    Voir les rapports
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccessDiagnosticPage;
