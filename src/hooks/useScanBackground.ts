// @ts-nocheck

import { useState, useEffect } from 'react';

export function useScanBackground(activeTab: string) {
  const [backgroundAnimation, setBackgroundAnimation] = useState(0);
  
  // Change background animation based on active tab
  useEffect(() => {
    if (activeTab === 'scan') {
      setBackgroundAnimation(1);
    } else if (activeTab === 'history') {
      setBackgroundAnimation(2);
    } else {
      setBackgroundAnimation(3);
    }
  }, [activeTab]);

  // Get background style based on active tab
  const getBackgroundStyle = () => {
    switch (activeTab) {
      case 'scan':
        return "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30";
      case 'history':
        return "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-800/30";
      case 'team':
        return "bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-800/30";
      default:
        return "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30";
    }
  };

  return {
    backgroundAnimation,
    getBackgroundStyle
  };
}
