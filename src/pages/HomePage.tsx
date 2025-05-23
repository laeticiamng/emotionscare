
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from './LandingPage';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Si l'utilisateur est authentifié, le rediriger vers son tableau de bord
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const dashboardRoute = 
        user.role === 'b2c' 
          ? '/b2c/dashboard' 
          : user.role === 'b2b_user' 
            ? '/b2b/user/dashboard' 
            : '/b2b/admin/dashboard';
      
      navigate(dashboardRoute);
    }
  }, [isLoading, isAuthenticated, user, navigate]);
  
  // Pendant le chargement, afficher un indicateur
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Si l'utilisateur n'est pas authentifié, afficher la page d'accueil
  return <LandingPage />;
};

export default HomePage;
