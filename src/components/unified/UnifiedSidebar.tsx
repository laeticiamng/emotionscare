
import React from 'react';
import MainNavigationMenu from '@/components/navigation/MainNavigationMenu';

interface UnifiedSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({ isOpen, onToggle }) => {
  return (
    <MainNavigationMenu isOpen={isOpen} onToggle={onToggle} />
  );
};

export default UnifiedSidebar;
