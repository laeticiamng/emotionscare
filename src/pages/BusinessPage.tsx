
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Shield, ArrowLeft } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import Shell from '@/Shell';

const BusinessPage = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  
  const handleUserAccess = () => {
    setUserMode('b2b-collaborator');
    localStorage.setItem('userMode', 'b2b-collaborator');
    // In a real app, this would redirect to the login page
    // For test purposes, we're going to simulate a successful login
    localStorage.setItem('auth_session', 'mock_token_collaborateur');
    localStorage.setItem('user_role', 'b2b-collaborator');
    navigate('/dashboard');
  };
  
  const handleAdminAccess = () => {
    setUserMode('b2b-admin');
    localStorage.setItem('userMode', 'b2b-admin');
    // In a real app, this would redirect to the login page
    // For test purposes, we're going to simulate a successful login
    localStorage.setItem('auth_session', 'mock_token_admin');
    localStorage.setItem('user_role', 'b2b-admin');
    navigate('/admin/dashboard');
  };
  
  return (
    <Shell>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-purple-900/20">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Espace Entreprise</h1>
            <p className="text-muted-foreground">Veuillez sélectionner votre type d'accès</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={handleUserAccess}
              className="w-full h-16 text-lg"
            >
              <User className="mr-3 h-6 w-6" />
              Collaborateur
              <span className="ml-2 text-xs opacity-70">(collaborateur@exemple.fr / admin)</span>
            </Button>
            
            <Button 
              onClick={handleAdminAccess}
              className="w-full h-16 text-lg"
              variant="secondary"
            >
              <Shield className="mr-3 h-6 w-6" />
              Administration / RH
              <span className="ml-2 text-xs opacity-70">(admin@exemple.fr / admin)</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              className="w-full mt-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default BusinessPage;
