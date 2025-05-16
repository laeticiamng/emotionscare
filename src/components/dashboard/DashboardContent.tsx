
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';

interface DashboardContentProps {
  className?: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ className = '' }) => {
  const { user } = useAuth();
  
  // Determine content based on user role
  const renderContent = () => {
    // Default content for all users
    let content = <DefaultDashboard />;
    
    // Check user role and override content if needed
    if (user && user.role) {
      if (user.role === 'b2b_user') {
        content = <B2BUserDashboard />;
      } else if (user.role === 'b2b_admin') {
        content = <B2BAdminDashboard />;
      }
    }
    
    return content;
  };
  
  return (
    <div className={`p-6 ${className}`}>
      {renderContent()}
    </div>
  );
};

const DefaultDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tableau de bord</h2>
      <p className="text-muted-foreground">
        Bienvenue sur votre tableau de bord personnel.
      </p>
    </div>
  );
};

const B2BUserDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tableau de bord Collaborateur</h2>
      <p className="text-muted-foreground">
        Bienvenue sur votre tableau de bord collaborateur. 
        Vous avez accès aux fonctionnalités d'équipe.
      </p>
    </div>
  );
};

const B2BAdminDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tableau de bord Administrateur</h2>
      <p className="text-muted-foreground">
        Bienvenue sur votre tableau de bord administrateur. 
        Vous avez accès à toutes les fonctionnalités d'administration.
      </p>
    </div>
  );
};

export default DashboardContent;
