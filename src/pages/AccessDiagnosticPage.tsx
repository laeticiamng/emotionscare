
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Settings, ArrowLeft, RefreshCw } from 'lucide-react';
import AccessDashboard from '@/components/access/AccessDashboard';

const AccessDiagnosticPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { userMode, changeUserMode } = useUserMode();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-500" />
            Diagnostic d'accès
          </h1>
          <p className="text-muted-foreground">
            Vérifiez vos permissions et l'accès aux différentes pages de l'application
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Informations utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations de l'utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Statut de connexion</p>
              <Badge className={isAuthenticated ? 'bg-green-500' : 'bg-red-500'}>
                {isAuthenticated ? 'Connecté' : 'Non connecté'}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email || 'Non disponible'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Mode utilisateur</p>
              <Badge variant="outline">
                {userMode || 'Non défini'}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rôle</p>
              <Badge variant="outline">
                {user?.role || 'Non défini'}
              </Badge>
            </div>
          </div>

          {userMode && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">Mode actuel</h3>
                  <p className="text-sm text-blue-700">
                    {userMode === 'b2c' && 'Vous utilisez l\'application en tant que particulier'}
                    {userMode === 'b2b_user' && 'Vous utilisez l\'application en tant que collaborateur'}
                    {userMode === 'b2b_admin' && 'Vous utilisez l\'application en tant qu\'administrateur RH'}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/choose-mode')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Changer
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dashboard d'accès */}
      <AccessDashboard />

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {!isAuthenticated && (
              <Button onClick={() => navigate('/auth')} className="h-20 flex-col">
                <User className="h-6 w-6 mb-2" />
                Se connecter
              </Button>
            )}
            
            {isAuthenticated && !userMode && (
              <Button onClick={() => navigate('/choose-mode')} className="h-20 flex-col">
                <Settings className="h-6 w-6 mb-2" />
                Choisir un mode
              </Button>
            )}
            
            {userMode === 'b2c' && (
              <Button onClick={() => navigate('/b2c/dashboard')} className="h-20 flex-col">
                <User className="h-6 w-6 mb-2" />
                Dashboard B2C
              </Button>
            )}
            
            {userMode === 'b2b_user' && (
              <Button onClick={() => navigate('/b2b/user/dashboard')} className="h-20 flex-col">
                <User className="h-6 w-6 mb-2" />
                Dashboard Collaborateur
              </Button>
            )}
            
            {userMode === 'b2b_admin' && (
              <Button onClick={() => navigate('/b2b/admin/dashboard')} className="h-20 flex-col">
                <Shield className="h-6 w-6 mb-2" />
                Dashboard Admin RH
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDiagnosticPage;
