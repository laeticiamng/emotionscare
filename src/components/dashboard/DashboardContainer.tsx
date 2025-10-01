// @ts-nocheck

import React from 'react';

interface DashboardContainerProps {
  children: React.ReactNode;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => {
  return (
    <div className="w-full animate-fade-in">
      {children}
    </div>
  );
};

export default DashboardContainer;
