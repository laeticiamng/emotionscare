
import React from 'react';
import { 
  Heart, 
  Activity, 
  Users, 
  Scan, 
  MessageCircle, 
  Glasses,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { useAuth } from '@/contexts/AuthContext';

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <UserDashboard user={user} />
    </div>
  );
};

export default B2BUserDashboardPage;
