
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('/');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        if (error) {
          throw new Error(error);
        }

        if (!code) {
          throw new Error('Code d\'autorisation manquant');
        }

        // Simuler le traitement du callback
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Déterminer la redirection selon le state
        let redirectPath = '/';
        if (state) {
          try {
            const decodedState = JSON.parse(atob(state));
            redirectPath = decodedState.redirectTo || '/';
          } catch {
            // Fallback si le state n'est pas valide
          }
        }

        setStatus('success');
        setMessage('Authentification réussie ! Redirection en cours...');
        setRedirectUrl(redirectPath);

        // Redirection automatique après 2 secondes
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 2000);

      } catch (error) {
        console.error('Erreur lors du callback d\'authentification:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  const handleManualRedirect = () => {
    navigate(redirectUrl, { replace: true });
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-gray-900">EmotionsCare</div>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {status === 'loading' && (
                <div className="p-3 bg-blue-100 rounded-full">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              )}
              {status === 'success' && (
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              )}
              {status === 'error' && (
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              )}
            </div>
            
            <CardTitle className="text-2xl">
              {status === 'loading' && 'Authentification...'}
              {status === 'success' && 'Connexion réussie !'}
              {status === 'error' && 'Erreur d\'authentification'}
            </CardTitle>
            
            <CardDescription>
              {status === 'loading' && 'Traitement de votre authentification en cours...'}
              {status === 'success' && 'Vous allez être redirigé vers votre espace personnel'}
              {status === 'error' && 'Une erreur est survenue lors de l\'authentification'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                {message}
              </p>
            </div>

            {status === 'loading' && (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-xs text-gray-500">
                  Veuillez patienter pendant que nous finalisons votre connexion
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Redirection automatique dans quelques secondes...
                  </p>
                </div>
                <Button onClick={handleManualRedirect} className="w-full bg-green-600 hover:bg-green-700">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Continuer maintenant
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800">
                    Nous n'avons pas pu finaliser votre authentification.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => navigate('/login')} className="w-full">
                    Retour à la connexion
                  </Button>
                  <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                    Retour à l'accueil
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Vous rencontrez des difficultés ?{' '}
            <a href="/contact" className="text-blue-600 hover:underline">
              Contactez notre support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
