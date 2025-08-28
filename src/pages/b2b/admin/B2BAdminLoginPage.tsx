
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Lock, Eye, EyeOff, Building } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin, FaMicrosoft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Routes } from '@/routerV2';
import { useAuthFlow } from '@/hooks/useAuth';

const B2BAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminKey: ''
  });

  const { login, isLoading } = useAuthFlow();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ ...formData, segment: 'b2b', adminKey: formData.adminKey });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-slate-600 to-blue-700 rounded-2xl flex items-center justify-center"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent">
              Connexion Administrateur RH
            </CardTitle>
            <p className="text-muted-foreground">
              Accès sécurisé à la console administrateur
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminKey">Clé administrateur</Label>
                <div className="relative">
                  <Input
                    id="adminKey"
                    type="password"
                    placeholder="Clé d'accès administrateur"
                    value={formData.adminKey}
                    onChange={(e) => setFormData({...formData, adminKey: e.target.value})}
                    className="pl-10"
                    required
                  />
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email administrateur</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@entreprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe sécurisé"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 pr-10"
                    required
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-slate-600 to-blue-700 hover:from-slate-700 hover:to-blue-800" disabled={isLoading}>
                {isLoading ? 'Connexion...' : 'Accéder à la console'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Connexion SSO</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="hover:bg-slate-50">
                <FcGoogle className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="hover:bg-slate-50">
                <FaLinkedin className="h-5 w-5 text-blue-600" />
              </Button>
              <Button variant="outline" className="hover:bg-slate-50">
                <FaMicrosoft className="h-5 w-5 text-blue-500" />
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Besoin d'aide ?{' '}
                <Link to={Routes.help()} className="text-blue-600 hover:underline font-medium">
                  Centre d'aide
                </Link>
              </p>
              <Link to={Routes.home()} className="text-sm text-muted-foreground hover:underline">
                ← Retour au choix du mode
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BAdminLoginPage;
