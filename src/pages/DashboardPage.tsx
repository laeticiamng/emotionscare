
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  
  useEffect(() => {
    // Check user role and redirect to the appropriate dashboard
    const userRole = localStorage.getItem('user_role');
    
    if (userRole === 'b2b-admin') {
      navigate('/admin/dashboard');
    } else if (userRole === 'b2b-collaborator') {
      navigate('/b2b/user/dashboard');
    } else {
      navigate('/b2c/dashboard');
    }
  }, [userMode, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Redirection en cours...</p>
    </div>
  );
};

export default DashboardPage;
