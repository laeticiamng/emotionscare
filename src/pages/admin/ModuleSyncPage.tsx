/**
 * Page admin pour la synchronisation et le monitoring des modules
 * Route: /admin/module-sync
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModuleSyncDashboard from '@/components/admin/ModuleSyncDashboard';

const ModuleSyncPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Synchronisation Modules | Admin EmotionsCare</title>
        <meta name="description" content="Dashboard de synchronisation et monitoring des modules front/back" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Layers className="h-8 w-8 text-primary" />
              Synchronisation Modules
            </h1>
            <p className="text-muted-foreground mt-1">
              Vérifiez la cohérence front/back de tous les modules
            </p>
          </div>
        </div>
        
        <ModuleSyncDashboard />
      </div>
    </>
  );
};

export default ModuleSyncPage;
