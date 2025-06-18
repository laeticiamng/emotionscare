import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { PostLoginTransition } from '@/components/auth/PostLoginTransition';

const B2CLoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  // Redirection si déjà connecté
  if (isAuthenticated && !showTransition) {
    return <Navigate to="/home" replace />;
  }

  // Affichage de la transition post-login
  if (showTransition) {
    return (
      <PostLoginTransition 
        onComplete={() => {
          setShowTransition(false);
          // Navigation vers le dashboard B2C sera gérée par le contexte
        }}
      />
    );
  }

  const handleAuthSuccess = () => {
    setShowTransition(true);
    // Marquer la connexion récente pour la persistance
    sessionStorage.setItem('just_logged_in', 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la sélection
          </Link>
          
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Espace Particulier
          </h1>
          <p className="text-muted-foreground mt-2">
            Accès à votre plateforme de bien-être émotionnel
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className="pt-6">
            {isRegisterMode ? (
              <RegisterForm onToggleMode={() => setIsRegisterMode(false)} />
            ) : (
              <LoginForm onToggleMode={() => setIsRegisterMode(true)} />
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Connexion sécurisée - Données protégées RGPD</span>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <div className="text-center mt-6 space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-center gap-4">
            <Link to="/about" className="hover:text-primary">
              À propos
            </Link>
            <Link to="/privacy" className="hover:text-primary">
              Confidentialité
            </Link>
            <Link to="/contact" className="hover:text-primary">
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CLoginPage;