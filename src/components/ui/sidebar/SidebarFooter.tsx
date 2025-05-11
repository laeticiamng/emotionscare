
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from './SidebarContext';

const SidebarFooter: React.FC = () => {
  const { collapsed, toggleCollapsed } = useSidebar();

  console.log("SidebarFooter rendering, collapsed:", collapsed);

  return (
    <div className="p-2 border-t border-border mt-auto">
      <Button 
        variant="outline" 
        size={collapsed ? "icon" : "sm"}
        className={`${collapsed ? 'w-full' : 'w-full justify-between'} mt-2`}
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Développer la sidebar" : "Réduire la sidebar"}
      >
        {!collapsed && <span className="text-xs">Réduire</span>}
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </Button>
    </div>
  );
};

export default SidebarFooter;
