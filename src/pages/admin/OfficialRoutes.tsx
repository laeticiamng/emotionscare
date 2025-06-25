
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import OfficialRoutesStatus from '@/components/admin/OfficialRoutesStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Target
} from 'lucide-react';

const OfficialRoutesPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Vérifier les permissions admin
  const isAdmin = user?.user_metadata?.role === 'b2b_admin' || user?.user_metadata?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/choose-mode" replace />;
  }

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        {/* En-tête de la page */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Audit des Routes Officielles</h1>
              <p className="text-muted-foreground">
                Validation complète des 52 routes de production
              </p>
            </div>
          </div>
          
          {/* Badges d'état */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Production Ready
            </Badge>
            <Badge variant="outline">
              <Target className="h-3 w-3 mr-1" />
              52 Routes Officielles
            </Badge>
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              Temps Réel
            </Badge>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                Objectif de Production
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Validation que toutes les 52 routes officielles sont <strong>100% fonctionnelles</strong> 
                pour des utilisateurs réels créant leurs comptes et utilisant l'application.
              </p>
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <div className="text-sm font-medium text-green-800">✅ Comptes Test Validés:</div>
                <div className="text-sm text-green-700">• B2C • B2B User • B2B Admin</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <AlertCircle className="h-5 w-5" />
                Critères de Validation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Création de compte et confirmation email</li>
                <li>• Authentification complète</li>
                <li>• Navigation sans erreur 404</li>
                <li>• Contenu fonctionnel sur chaque page</li>
                <li>• Performance optimale (&lt; 2s)</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Composant principal d'audit */}
        <OfficialRoutesStatus />

        {/* Actions de suivi */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Actions de Suivi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">✅ Si Score ≥ 95%</h4>
                <p className="text-sm text-muted-foreground">
                  Application prête pour le lancement. Procéder au déploiement final.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-yellow-700 mb-2">⚠️ Si Score 80-94%</h4>
                <p className="text-sm text-muted-foreground">
                  Corriger les routes signalées avant mise en production.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-red-700 mb-2">❌ Si Score &lt; 80%</h4>
                <p className="text-sm text-muted-foreground">
                  Révision majeure nécessaire. Différer le lancement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfficialRoutesPage;
