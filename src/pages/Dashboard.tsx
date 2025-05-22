
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Welcome message when dashboard is loaded
    toast.success(`Bienvenue, ${user?.name || 'utilisateur'}!`);
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return <UserDashboard user={user} />;
};

export default Dashboard;
