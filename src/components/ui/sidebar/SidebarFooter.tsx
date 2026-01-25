import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from './SidebarContext';

export function SidebarFooter() {
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <div className="mt-auto p-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleCollapsed}
        className="w-full justify-center"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        <span className="sr-only">Toggle sidebar</span>
      </Button>
    </div>
  );
}
