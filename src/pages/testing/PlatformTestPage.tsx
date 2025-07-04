import React, { useState } from 'react';
import { PlatformTester } from '@/components/testing/PlatformTester';
import { AutoFixer } from '@/components/testing/AutoFixer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PlatformTestPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <Tabs defaultValue="tester" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tester">Testeur</TabsTrigger>
            <TabsTrigger value="fixer">Correcteur</TabsTrigger>
          </TabsList>
          <TabsContent value="tester">
            <PlatformTester />
          </TabsContent>
          <TabsContent value="fixer">
            <AutoFixer />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default PlatformTestPage;