import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Heart, 
  Eye, 
  EyeOff, 
  Mail, 
  User, 
  Building, 
  Users,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  userType: 'b2c' | 'b2b_user' | 'b2b_admin';
  acceptTerms: boolean;
  acceptNewsletter: boolean;
}

export default function SignupPage() {
  const { signUp, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    userType: 'b2c',
    acceptTerms: false,
    acceptNewsletter: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  // Redirection si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Nom d\'affichage requis';
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Au moins 2 caractères requis';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Au moins 8 caractères requis';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Doit contenir majuscule, minuscule et chiffre';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      handleNext();
      return;
    }

    if (!validateStep2()) {
      return;
    }

    const { error } = await signUp(formData.email, formData.password, {
      display_name: formData.displayName,
      user_type: formData.userType,
      accept_newsletter: formData.acceptNewsletter
    });

    if (!error) {
      navigate('/login', { 
        state: { 
          message: 'Inscription réussie ! Vérifiez votre email pour confirmer votre compte.' 
        } 
      });
    }
  };

  const handleInputChange = (field: keyof SignupFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const userTypeOptions = [
    {
      value: 'b2c',
      label: 'Particulier',
      description: 'Usage personnel pour votre bien-être',
      icon: User
    },
    {
      value: 'b2b_user',
      label: 'Employé/Étudiant',
      description: 'Membre d\'une organisation ou établissement',
      icon: Users
    },
    {
      value: 'b2b_admin',
      label: 'Administrateur',
      description: 'Gestionnaire d\'organisation ou éducateur',
      icon: Building
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur">
          <CardHeader className="text-center space-y-4">
            <motion.div 
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            
            <div>
              <CardTitle className="text-2xl font-bold">
                Rejoignez EmotionsCare
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Créez votre compte pour commencer votre parcours bien-être
              </CardDescription>
            </div>

            {/* Indicateur d'étape */}
            <div className="flex items-center justify-center space-x-2">
              <div className={cn(
                "w-3 h-3 rounded-full transition-colors",
                step >= 1 ? "bg-primary" : "bg-muted"
              )} />
              <div className={cn(
                "w-8 h-1 rounded transition-colors",
                step >= 2 ? "bg-primary" : "bg-muted"
              )} />
              <div className={cn(
                "w-3 h-3 rounded-full transition-colors",
                step >= 2 ? "bg-primary" : "bg-muted"
              )} />
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        aria-invalid={errors.email ? 'true' : 'false'}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Nom d'affichage */}
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nom d'affichage</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="displayName"
                        placeholder="Comment souhaitez-vous être appelé ?"
                        className="pl-10"
                        value={formData.displayName}
                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                        aria-invalid={errors.displayName ? 'true' : 'false'}
                      />
                    </div>
                    {errors.displayName && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.displayName}
                      </p>
                    )}
                  </div>

                  {/* Mot de passe */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Au moins 8 caractères"
                        className="pr-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        aria-invalid={errors.password ? 'true' : 'false'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirmation mot de passe */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Retapez votre mot de passe"
                        className="pr-10"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Continuer
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Type d'utilisateur */}
                  <div className="space-y-4">
                    <Label>Type de compte</Label>
                    <RadioGroup
                      value={formData.userType}
                      onValueChange={(value) => handleInputChange('userType', value)}
                    >
                      {userTypeOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <div key={option.value} className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Icon className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                              <Label htmlFor={option.value} className="font-medium cursor-pointer">
                                {option.label}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  {/* Conditions d'utilisation */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                        aria-invalid={errors.acceptTerms ? 'true' : 'false'}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="acceptTerms" className="text-sm cursor-pointer">
                          J'accepte les{' '}
                          <Link to="/terms" className="text-primary hover:underline">
                            conditions d'utilisation
                          </Link>{' '}
                          et la{' '}
                          <Link to="/privacy" className="text-primary hover:underline">
                            politique de confidentialité
                          </Link>
                        </Label>
                        {errors.acceptTerms && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.acceptTerms}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="acceptNewsletter"
                        checked={formData.acceptNewsletter}
                        onCheckedChange={(checked) => handleInputChange('acceptNewsletter', checked)}
                      />
                      <Label htmlFor="acceptNewsletter" className="text-sm cursor-pointer">
                        Je souhaite recevoir des actualités et conseils bien-être par email (optionnel)
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Retour
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Créer mon compte
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Déjà un compte ?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}