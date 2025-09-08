/**
 * 📝 PAGE D'INSCRIPTION PREMIUM
 * Onboarding sécurisé et guidé pour nouveaux utilisateurs
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Shield, Zap } from 'lucide-react';
import { useState } from 'react';

export const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const features = [
    { icon: Zap, text: "Analyse émotionnelle IA avancée" },
    { icon: Shield, text: "Données chiffrées et sécurisées" },
    { icon: Sparkles, text: "Coach personnel 24/7" },
  ];

  return (
    <>
      <Helmet>
        <title>Créer un Compte Premium - EmotionsCare</title>
        <meta name="description" content="Rejoignez EmotionsCare et découvrez la puissance de l'intelligence émotionnelle avec notre plateforme premium alimentée par l'IA." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <Card className="shadow-xl border-primary/20">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex justify-center"
              >
                <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
              
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Rejoignez EmotionsCare
              </CardTitle>
              
              <p className="text-muted-foreground text-sm">
                Créez votre compte premium et transformez votre bien-être émotionnel
              </p>

              <div className="flex flex-wrap gap-2 justify-center">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <feature.icon className="h-3 w-3" />
                      {feature.text}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    J'accepte les{' '}
                    <Button variant="link" className="p-0 h-auto text-primary">
                      conditions d'utilisation
                    </Button>
                    {' '}et la{' '}
                    <Button variant="link" className="p-0 h-auto text-primary">
                      politique de confidentialité
                    </Button>
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
                  disabled={isLoading || !acceptTerms}
                >
                  {isLoading ? 'Création du compte...' : 'Créer mon compte premium'}
                </Button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                    OU
                  </span>
                </div>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    Déjà un compte ?{' '}
                  </span>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Se connecter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6 text-xs text-muted-foreground"
          >
            🔒 Vos données sont chiffrées et protégées selon les standards RGPD
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;