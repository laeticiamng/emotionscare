
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Extract token from URL parameters
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      setIsValidating(true);
      
      if (!token) {
        setIsTokenValid(false);
        setIsValidating(false);
        return;
      }
      
      try {
        // Dans une vraie implémentation, nous vérifierions la validité du token via une API
        // Pour la démo, on simule une vérification
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Pour la démo, on considère les tokens commençant par "valid" comme valides
        const isValid = token.startsWith('valid');
        setIsTokenValid(isValid);
        
        if (!isValid) {
          toast({
            title: "Token invalide",
            description: "Ce lien de réinitialisation est invalide ou a expiré.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erreur lors de la validation du token:", error);
        setIsTokenValid(false);
        toast({
          title: "Erreur de validation",
          description: "Impossible de valider votre lien de réinitialisation.",
          variant: "destructive"
        });
      } finally {
        setIsValidating(false);
      }
    };
    
    validateToken();
  }, [token, toast]);

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (newPassword.length >= 8) strength += 25;
    
    // Contains numbers
    if (/\d/.test(newPassword)) strength += 25;
    
    // Contains lowercase letters
    if (/[a-z]/.test(newPassword)) strength += 25;
    
    // Contains uppercase letters or special characters
    if (/[A-Z]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)) strength += 25;
    
    setPasswordStrength(strength);
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nouveau mot de passe",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordStrength < 50) {
      toast({
        title: "Mot de passe trop faible",
        description: "Veuillez choisir un mot de passe plus fort",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Dans une vraie implémentation, nous enverrions le token et le nouveau mot de passe à une API
      // Mais nous simulons simplement un délai et un succès
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast({
        title: "Mot de passe réinitialisé",
        description: "Votre mot de passe a été modifié avec succès !",
      });
      
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser votre mot de passe. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display password strength color
  const getStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500";
    if (passwordStrength < 50) return "bg-orange-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Display password strength text
  const getStrengthText = () => {
    if (passwordStrength < 25) return "Très faible";
    if (passwordStrength < 50) return "Faible";
    if (passwordStrength < 75) return "Moyen";
    return "Fort";
  };

  // Render loading state while validating token
  if (isValidating) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFBFC] to-[#E8F1FA]">
        <Card className="w-full max-w-md shadow-lg border-[#E8F1FA]">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Validation de votre lien de réinitialisation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render invalid token state
  if (isTokenValid === false) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFBFC] to-[#E8F1FA]">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="shadow-lg border-[#E8F1FA]">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Lien invalide ou expiré</CardTitle>
              </div>
              <CardDescription>
                Ce lien de réinitialisation est invalide ou a expiré
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              <p className="text-muted-foreground">
                Pour des raisons de sécurité, les liens de réinitialisation sont valables seulement 24 heures.
                Veuillez demander un nouveau lien de réinitialisation.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate('/forgot-password')}
              >
                Demander un nouveau lien
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFBFC] to-[#E8F1FA]">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft className="mr-2" size={16} />
            Retour à la connexion
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-[#1B365D] mb-1">
              EmotionsCare<span className="text-xs align-super">™</span>
            </h1>
            <p className="text-slate-600">Réinitialisation de mot de passe</p>
          </div>
        </div>

        <Card className="shadow-lg border-[#E8F1FA]">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Créer un nouveau mot de passe</CardTitle>
            </div>
            <CardDescription>
              Définissez un nouveau mot de passe sécurisé pour votre compte
            </CardDescription>
          </CardHeader>

          {isSuccess ? (
            <CardContent className="space-y-4 py-6">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-green-700 mb-2">Mot de passe modifié avec succès</h3>
                <p className="text-muted-foreground mb-6">
                  Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </p>
                <Button
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Se connecter
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nouveau mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="border border-muted"
                  />
                  
                  {newPassword && (
                    <div className="space-y-1">
                      <Progress value={passwordStrength} className={`h-1 ${getStrengthColor()}`} />
                      <p className="text-xs text-muted-foreground flex justify-between">
                        <span>Sécurité: {getStrengthText()}</span>
                        <span>{passwordStrength}%</span>
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="border border-muted"
                  />
                  
                  {newPassword && confirmPassword && (
                    <div className="flex items-center gap-2 text-sm">
                      {newPassword === confirmPassword ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">Les mots de passe correspondent</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-red-600">Les mots de passe ne correspondent pas</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Recommandations pour un mot de passe fort:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Minimum 8 caractères</li>
                    <li>Combinez des lettres, des chiffres et des symboles</li>
                    <li>Évitez les informations personnelles facilement devinables</li>
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-6 pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white"
                  disabled={isSubmitting || newPassword !== confirmPassword || passwordStrength < 50}
                >
                  {isSubmitting ? 'Réinitialisation en cours...' : 'Réinitialiser mon mot de passe'}
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>Votre mot de passe est chiffré et sécurisé</span>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
