
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from './SidebarContext';

const SidebarFooter: React.FC = () => {
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <div className="p-2 border-t border-border">
      <Button 
        variant="outline" 
        size={collapsed ? "icon" : "sm"}
        className={`${collapsed ? '' : 'w-full justify-between'} mt-2`}
        onClick={toggleCollapsed}
      >
        {!collapsed && <span className="text-xs">Réduire</span>}
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </Button>
    </div>
  );
};

export default SidebarFooter;
