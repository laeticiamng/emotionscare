
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { ArrowRight, AtSign, Lock, Eye, EyeOff, Building } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import { toast } from 'sonner';

const B2BUserPremiumLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const navigate = useNavigate();
  
  // Set time of day for theming
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) setTimeOfDay('morning');
    else if (hours >= 12 && hours < 18) setTimeOfDay('afternoon');
    else if (hours >= 18 && hours < 22) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);
  
  useEffect(() => {
    trackEvent('View B2B User Login', { properties: { variant: 'premium' } });
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    try {
      // Mock login - in a real app, this would call your authentication service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Connexion réussie ! Redirection vers votre tableau de bord.");
      
      trackEvent('User Login Success', {
        properties: {
          method: 'password',
          userType: 'b2b_user'
        }
      });
      
      setTimeout(() => {
        navigate('/b2b/user/dashboard');
      }, 800);
      
    } catch (error) {
      toast.error("Échec de la connexion. Veuillez vérifier vos identifiants.");
      
      trackEvent('User Login Failed', {
        properties: {
          reason: 'invalid_credentials',
          userType: 'b2b_user'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 bg-${timeOfDay}`}>
      {/* Ambient background elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 rounded-full bg-blue-500/10 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-full bg-indigo-500/10 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="w-full max-w-md">
        {/* Logo & Back Button */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mb-2">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Espace Collaborateur
            </h1>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Card className="glass-card p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email professionnel
                </Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="prenom.nom@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Se souvenir de moi
                  </label>
                </div>
                
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>
              
              <Button
                type="submit"
                className="w-full button-premium bg-gradient-to-r from-blue-600 to-green-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Connexion en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Se connecter</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                <a href="#" className="font-medium text-primary hover:underline">
                  Besoin d'aide pour vous connecter ?
                </a>
              </div>
            </form>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground"
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BUserPremiumLogin;
