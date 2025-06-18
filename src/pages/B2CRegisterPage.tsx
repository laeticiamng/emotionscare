import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, User, Shield, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm from '@/components/auth/RegisterForm';
import LoginForm from '@/components/auth/LoginForm';
import { PostLoginTransition } from '@/components/auth/PostLoginTransition';

const B2CRegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(false);
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
        }}
      />
    );
  }

  const handleAuthSuccess = () => {
    setShowTransition(true);
    sessionStorage.setItem('just_logged_in', 'true');
  };

  const benefits = [
    "Accès à tous les modules de bien-être",
    "Suivi personnalisé de votre évolution",
    "Communauté bienveillante et sécurisée",
    "Recommandations IA personnalisées",
    "Support client dédié"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <div className="hidden md:block">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Rejoignez EmotionsCare
              </h1>
              <p className="text-lg text-muted-foreground">
                Transformez votre bien-être émotionnel avec notre plateforme innovante
              </p>
            </div>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                🎉 Offre de lancement : 30 jours d'essai gratuit !
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
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
              
              <h2 className="text-2xl font-bold">
                Créer votre compte
              </h2>
              <p className="text-muted-foreground mt-2">
                Commencez votre parcours vers le bien-être
              </p>
            </div>

            {/* Form Card */}
            <Card>
              <CardContent className="pt-6">
                {isLoginMode ? (
                  <LoginForm onToggleMode={() => setIsLoginMode(false)} />
                ) : (
                  <RegisterForm onToggleMode={() => setIsLoginMode(true)} />
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="mt-6 bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Données sécurisées et conformes RGPD</span>
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
      </div>
    </div>
  );
};

export default B2CRegisterPage;