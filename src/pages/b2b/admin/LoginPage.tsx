
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, Lock, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BAdminLoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminCode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('B2B Admin Login:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 dark:from-purple-950 dark:to-blue-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-2xl text-purple-800 dark:text-purple-200">
              Connexion Administrateur
            </CardTitle>
            <CardDescription>
              Accès sécurisé à l'interface de gestion RH
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email administrateur</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@entreprise.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="adminCode" className="text-sm font-medium">Code administrateur</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="adminCode"
                    name="adminCode"
                    placeholder="Code d'accès sécurisé"
                    value={formData.adminCode}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Accéder à l'administration
              </Button>
            </form>
            <div className="mt-4 text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <Link to="/b2b/selection" className="text-purple-600 hover:underline">
                  ← Retour à la sélection
                </Link>
              </p>
            </div>
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-xs text-purple-800 dark:text-purple-200 text-center">
                🔒 Accès restreint aux administrateurs RH autorisés
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BAdminLoginPage;
