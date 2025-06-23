
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Mail, Lock } from 'lucide-react';

const B2CLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-100 dark:bg-blue-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Connexion Particulier
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Accédez à votre espace personnel
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">
              Se connecter
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-300">
              Pas encore de compte ?{' '}
              <Link to="/b2c/register" className="text-blue-600 hover:text-blue-700">
                S'inscrire
              </Link>
            </p>
            <Link to="/choose-mode" className="text-sm text-gray-500 hover:text-gray-700 mt-2 block">
              ← Retour au choix de mode
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CLoginPage;
