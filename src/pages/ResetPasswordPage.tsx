/**
 * ResetPasswordPage — Allows users to set a new password after clicking
 * the reset link sent by Supabase.  The link redirects here with a
 * `type=recovery` fragment in the URL; Supabase client picks it up
 * automatically via `detectSessionInUrl`.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import SharedHeader from '@/components/layout/SharedHeader';
import { usePageSEO } from '@/hooks/usePageSEO';

const ResetPasswordPage: React.FC = () => {
  usePageSEO({
    title: 'Nouveau mot de passe | EmotionsCare',
    description: 'Définissez votre nouveau mot de passe EmotionsCare.',
    noIndex: true,
  });

  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecoverySession, setIsRecoverySession] = useState(false);

  // Detect recovery event from Supabase auth
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoverySession(true);
      }
    });

    // Also check current hash for type=recovery
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecoverySession(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        logger.error('Erreur de réinitialisation', updateError, 'AUTH');
        setError(updateError.message === 'New password should be different from the old password.'
          ? 'Le nouveau mot de passe doit être différent de l\'ancien.'
          : 'Une erreur est survenue. Veuillez réessayer.');
        return;
      }

      setIsSuccess(true);
      toast({
        title: 'Mot de passe mis à jour',
        description: 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
      });

      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } catch (err) {
      logger.error('Erreur inattendue lors du reset', err as Error, 'AUTH');
      setError('Une erreur inattendue est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <SharedHeader />
      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-20">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                EmotionsCare
              </h1>
            </div>
          </div>

          <Card className="shadow-xl border-2 border-muted">
            <CardHeader className="space-y-1 pb-4 text-center">
              <CardTitle className="text-2xl font-bold">
                {isSuccess ? 'Mot de passe mis à jour ✓' : 'Nouveau mot de passe'}
              </CardTitle>
              <CardDescription>
                {isSuccess
                  ? 'Redirection vers la connexion...'
                  : 'Choisissez un nouveau mot de passe sécurisé'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center gap-4 py-6">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                  <p className="text-sm text-muted-foreground text-center">
                    Votre mot de passe a été mis à jour avec succès.
                    Vous allez être redirigé vers la page de connexion.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isRecoverySession && (
                    <div className="flex items-center gap-2 p-3 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-500/20" role="alert">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <p className="text-sm">
                        Lien invalide ou expiré. <a href="/login" className="underline font-medium">Demandez un nouveau lien.</a>
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(null); }}
                        className="pl-10 pr-10 h-11"
                        placeholder="8 caractères minimum"
                        required
                        minLength={8}
                        disabled={isSubmitting || !isRecoverySession}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                        className="pl-10 h-11"
                        placeholder="Confirmez le mot de passe"
                        required
                        minLength={8}
                        disabled={isSubmitting || !isRecoverySession}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20" role="alert">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    disabled={isSubmitting || !isRecoverySession}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Mise à jour...
                      </div>
                    ) : (
                      'Mettre à jour le mot de passe'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
