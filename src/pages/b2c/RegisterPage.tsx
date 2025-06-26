
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

const B2CRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    acceptTerms: false
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    navigate('/b2c/dashboard');
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-pink-900 dark:via-rose-900 dark:to-red-900 flex items-center justify-center p-6">
      <div className="container mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Inscription
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Créez votre compte EmotionsCare personnel
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-center text-slate-800 dark:text-slate-100">
                Commencez votre parcours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">Prénom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        placeholder="Jean"
                        className="pl-10 bg-white/50 border-slate-200 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Nom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder="Dupont"
                        className="pl-10 bg-white/50 border-slate-200 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="votre@email.com"
                      className="pl-10 bg-white/50 border-slate-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-white/50 border-slate-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleChange('acceptTerms', checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                    J'accepte les{' '}
                    <a href="#" className="text-pink-600 hover:text-pink-700">
                      conditions d'utilisation
                    </a>{' '}
                    et la{' '}
                    <a href="#" className="text-pink-600 hover:text-pink-700">
                      politique de confidentialité
                    </a>
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={!formData.acceptTerms}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  Créer mon compte
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Déjà un compte ?
                  </span>
                  <button
                    onClick={() => navigate('/b2c/login')}
                    className="text-sm font-medium text-pink-600 hover:text-pink-700"
                  >
                    Se connecter
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/choose-mode')}
            className="text-slate-600 hover:text-slate-800"
          >
            ← Retour au choix du mode
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CRegisterPage;
