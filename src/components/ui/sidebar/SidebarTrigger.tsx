
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeft, PanelRight } from 'lucide-react';
import { useSidebar } from './SidebarContext';

interface SidebarTriggerProps {
  className?: string;
}

const SidebarTrigger: React.FC<SidebarTriggerProps> = ({ className = "" }) => {
  const { open, toggle } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggle}
      className={className}
    >
      {open ? <PanelLeft className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
    </Button>
  );
};

export default SidebarTrigger;
