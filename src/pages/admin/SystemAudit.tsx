
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductionAudit from '@/components/admin/ProductionAudit';
import AccountValidation from '@/components/admin/AccountValidation';
import { Rocket, Users } from 'lucide-react';

const SystemAudit: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Système Complet</h1>
          <p className="text-gray-600">
            Vérification technique et validation manuelle pour la mise en production
          </p>
        </div>
        
        <Tabs defaultValue="technical" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Audit Technique
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Validation Manuelle
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="technical" className="space-y-6">
            <ProductionAudit />
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-6">
            <AccountValidation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemAudit;
