/**
 * AuthDebugPage - Page de debug pour l'authentification
 * Aide à diagnostiquer les problèmes de connexion
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

const AuthDebugPage: React.FC = () => {
  const { user, session, isLoading, isAuthenticated, signOut } = useAuth();
  const { userMode, role, isLoading: modeLoading } = useUserMode();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Debug Authentification</h1>
          <p className="text-muted-foreground">
            Informations sur l'état de votre session
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* État d'authentification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                État d'authentification
              </CardTitle>
              <CardDescription>
                Informations sur votre session actuelle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Chargement:</span>
                <Badge variant={isLoading ? "destructive" : "secondary"}>
                  {isLoading ? "En cours" : "Terminé"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Authentifié:</span>
                <Badge variant={isAuthenticated ? "default" : "destructive"}>
                  {isAuthenticated ? "Oui" : "Non"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="text-sm">{user?.email || 'Non disponible'}</span>
              </div>
              <div className="flex justify-between">
                <span>ID Utilisateur:</span>
                <span className="text-xs font-mono">{user?.id || 'Non disponible'}</span>
              </div>
              <div className="flex justify-between">
                <span>Session valide:</span>
                <Badge variant={session ? "default" : "destructive"}>
                  {session ? "Oui" : "Non"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Mode utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle>Mode utilisateur</CardTitle>
              <CardDescription>
                Configuration du rôle et permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Chargement mode:</span>
                <Badge variant={modeLoading ? "destructive" : "secondary"}>
                  {modeLoading ? "En cours" : "Terminé"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Mode actuel:</span>
                <Badge variant="outline">
                  {userMode || 'Non défini'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Rôle:</span>
                <Badge variant="outline">
                  {role || 'Non défini'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Détails de session */}
          {session && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Détails de la session</CardTitle>
                <CardDescription>
                  Informations techniques de votre session Supabase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Token créé:</span>
                    <span>{new Date(session.token_type === 'bearer' ? Date.now() : Date.now()).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expire:</span>
                    <span>{session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type de token:</span>
                    <span>{session.token_type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-4">
          {isAuthenticated ? (
            <>
              <Button asChild>
                <Link to="/app">Accéder à l'application</Link>
              </Button>
              <Button asChild>
                <Link to="/app/home">Tableau de bord</Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Se déconnecter
              </Button>
            </>
          ) : (
            <>
              <Button asChild>
                <Link to="/login">Se connecter</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/signup">S'inscrire</Link>
              </Button>
            </>
          )}
          <Button asChild variant="secondary">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>

        {/* Message d'aide */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Problème d'accès ?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Si vous ne pouvez pas accéder à l'application malgré une authentification réussie, 
              essayez ces solutions :
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Actualisez la page (F5 ou Ctrl+R)</li>
              <li>Videz le cache de votre navigateur</li>
              <li>Déconnectez-vous et reconnectez-vous</li>
              <li>Vérifiez que JavaScript est activé</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthDebugPage;