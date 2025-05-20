
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedFormField from '@/components/auth/AnimatedFormField';
import B2CAuthLayout from '@/components/auth/B2CAuthLayout';
import AnimatedButton from '@/components/auth/AnimatedButton';
import { Mail, User, Lock, ArrowRight } from 'lucide-react';

const B2CRegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  const [passwordError, setPasswordError] = useState('');
  
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setPasswordStrength('weak');
      return false;
    } else if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) {
      setPasswordStrength('strong');
      return true;
    } else {
      setPasswordStrength('medium');
      return true;
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) validatePassword(newPassword);
    else setPasswordStrength('');
    
    // Check if passwords match when confirm password is already filled
    if (confirmPassword && confirmPassword !== newPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
    } else {
      setPasswordError('');
    }
  };
  
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPass = e.target.value;
    setConfirmPassword(confirmPass);
    
    if (password && confirmPass && password !== confirmPass) {
      setPasswordError('Les mots de passe ne correspondent pas');
    } else {
      setPasswordError('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (!termsAccepted) {
      toast({
        title: "Veuillez accepter les conditions d'utilisation",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await register(name, email, password);
      
      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue sur EmotionsCare !",
      });
      
      navigate('/onboarding');
    } catch (error: any) {
      toast({
        title: "Erreur lors de l'inscription",
        description: error.message || "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <B2CAuthLayout
      title="Créer un compte"
      subtitle="Rejoignez la communauté EmotionsCare"
      backgroundImage="/lovable-uploads/9758de91-3129-47ab-9074-ae033c24878a.png"
    >
      <Card className="border-none shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <AnimatedFormField
                id="name"
                label="Nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                icon={<User className="h-4 w-4" />}
              />
              
              <AnimatedFormField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="h-4 w-4" />}
              />
              
              <div className="space-y-1">
                <AnimatedFormField
                  id="password"
                  label="Mot de passe"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  hint="8 caractères minimum, avec majuscule et chiffre recommandés"
                  icon={<Lock className="h-4 w-4" />}
                />
                
                {passwordStrength && (
                  <div className="mt-1">
                    <div className="h-1 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          passwordStrength === 'weak' ? 'bg-red-500 w-1/3' :
                          passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' :
                          'bg-green-500 w-full'
                        }`}
                      ></div>
                    </div>
                    <p className={`text-xs mt-1 ${
                      passwordStrength === 'weak' ? 'text-red-500' :
                      passwordStrength === 'medium' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {passwordStrength === 'weak' ? 'Mot de passe faible' :
                       passwordStrength === 'medium' ? 'Mot de passe moyen' :
                       'Mot de passe fort'}
                    </p>
                  </div>
                )}
              </div>
              
              <AnimatedFormField
                id="confirmPassword"
                label="Confirmer le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                error={passwordError}
                icon={<Lock className="h-4 w-4" />}
              />
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  required
                />
                <Label htmlFor="terms" className="text-sm">
                  J'accepte les <a href="#" className="text-primary hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-primary hover:underline">politique de confidentialité</a>
                </Label>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <AnimatedButton 
                type="submit" 
                className="w-full" 
                isLoading={loading}
                loadingText="Création du compte..."
                disabled={!termsAccepted || !!passwordError}
              >
                <span className="flex items-center justify-center">
                  S'inscrire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </AnimatedButton>
              
              <div className="text-sm text-center text-muted-foreground">
                Déjà inscrit ?{" "}
                <button
                  type="button"
                  onClick={() => navigate('/b2c/login')}
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Se connecter
                </button>
              </div>
            </CardFooter>
          </form>
        </motion.div>
      </Card>
    </B2CAuthLayout>
  );
};

export default B2CRegisterPage;
