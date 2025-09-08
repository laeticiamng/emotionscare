/**
 * 🚀 UNIFIED DASHBOARD PAGE - EmotionsCare
 * Page principale du tableau de bord unifié
 */

import React from 'react';
import { UnifiedDashboard } from '@/components/unified';
import { KeyboardNavigation } from '@/components/accessibility';

const UnifiedDashboardPage: React.FC = () => {
  return (
    <KeyboardNavigation>
      <main id="main-content" className="container mx-auto px-4 py-8">
        <UnifiedDashboard />
      </main>
    </KeyboardNavigation>
  );
};

export default UnifiedDashboardPage;