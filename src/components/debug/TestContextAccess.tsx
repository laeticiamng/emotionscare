
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Composant de test pour vérifier l'accès aux contextes
 * Ce composant peut être utilisé pour déboguer les problèmes d'accès aux contextes
 */
const TestContextAccess: React.FC = () => {
  // Accès aux contextes
  const theme = useTheme();
  const auth = useAuth();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Test d'accès aux contextes</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            ThemeContext
            <Badge variant={theme.isDarkMode ? "destructive" : "default"}>
              {theme.theme}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><strong>Theme:</strong> {theme.theme}</div>
            <div><strong>Is Dark Mode:</strong> {theme.isDarkMode ? 'Oui' : 'Non'}</div>
            <div><strong>Font Size:</strong> {theme.fontSize || 'Non défini'}</div>
            <div><strong>Font Family:</strong> {theme.fontFamily || 'Non défini'}</div>
            <div><strong>Sound Enabled:</strong> {theme.soundEnabled ? 'Oui' : 'Non'}</div>
            <div><strong>Reduce Motion:</strong> {theme.reduceMotion ? 'Oui' : 'Non'}</div>
            <div><strong>System Theme:</strong> {theme.systemTheme || 'Non détecté'}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            AuthContext
            <Badge variant={auth.isAuthenticated ? "success" : "outline"}>
              {auth.isAuthenticated ? 'Connecté' : 'Déconnecté'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><strong>Authenticated:</strong> {auth.isAuthenticated ? 'Oui' : 'Non'}</div>
            <div><strong>Loading:</strong> {auth.isLoading ? 'Oui' : 'Non'}</div>
            <div><strong>Error:</strong> {auth.error ? auth.error.message : 'Aucune erreur'}</div>
            
            {auth.user && (
              <div className="mt-4 space-y-2 border p-4 rounded-md">
                <div><strong>User ID:</strong> {auth.user.id}</div>
                <div><strong>Name:</strong> {auth.user.name || 'Non défini'}</div>
                <div><strong>Email:</strong> {auth.user.email}</div>
                <div><strong>Role:</strong> {auth.user.role || 'Non défini'}</div>
                <div>
                  <strong>Preferences:</strong>
                  <pre className="mt-2 p-2 bg-muted rounded-md overflow-auto text-xs">
                    {JSON.stringify(auth.user.preferences, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Boutons pour tester les fonctions du contexte */}
      <div className="flex flex-wrap gap-4">
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => theme.setTheme(theme.theme === 'dark' ? 'light' : 'dark')}
        >
          Changer le thème
        </button>
        
        {auth.isAuthenticated ? (
          <button
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md"
            onClick={() => auth.logout()}
          >
            Déconnexion
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => auth.login('test@example.com', 'password')}
          >
            Connexion (test)
          </button>
        )}
      </div>
    </div>
  );
};

export default TestContextAccess;
