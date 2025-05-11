
import React, { useEffect } from 'react';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import { SegmentProvider } from '@/contexts/SegmentContext';
import Shell from '@/Shell';
import { useUserMode } from '@/contexts/UserModeContext';
import { useToast } from '@/hooks/use-toast';

const AdminDashboardPage: React.FC = () => {
  const { setUserMode, userMode } = useUserMode();
  const { toast } = useToast();
  
  // Make sure user mode is set to b2b-admin
  useEffect(() => {
    setUserMode('b2b-admin');
    console.log('AdminDashboardPage is setting userMode to b2b-admin');
    
    toast({
      title: "Tableau de bord administrateur",
      description: "Bienvenue dans votre espace de gestion"
    });
  }, [setUserMode, toast]);
  
  console.log('AdminDashboardPage rendering with userMode:', userMode);
  
  return (
    <div className="container mx-auto p-4">
      <SegmentProvider>
        <AdminDashboard />
      </SegmentProvider>
    </div>
  );
};

export default AdminDashboardPage;
