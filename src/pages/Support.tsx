import React from 'react';
import PremiumSupportAssistant from '@/components/support/PremiumSupportAssistant';
import HelpCenter from '@/components/support/HelpCenter';
import Shell from '@/Shell';

const SupportPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Support</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PremiumSupportAssistant />
          </div>

          <div className="space-y-6">
            <HelpCenter />
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default SupportPage;
