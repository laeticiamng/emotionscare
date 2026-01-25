import { PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from './SidebarContext';
import { cn } from '@/lib/utils';

interface SidebarTriggerItemProps {
  className?: string;
  title?: string;
}

export function SidebarTriggerItem({ className, title = "Toggle Sidebar" }: SidebarTriggerItemProps) {
  const { toggle, collapsed } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={cn(className, "w-full justify-center")}
      title={title}
    >
      {!collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
      <span className="sr-only">{title}</span>
    </Button>
  );
}
