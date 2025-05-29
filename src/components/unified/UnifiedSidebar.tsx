
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UnifiedSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({ isOpen, onToggle }) => {
  return (
    <aside className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r transition-transform duration-200 z-40",
      "md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <Card className="h-full rounded-none border-0">
        <CardContent className="p-4">
          <nav className="space-y-2">
            <h2 className="text-lg font-semibold mb-4">Navigation</h2>
            <div className="space-y-1">
              <a href="/" className="block px-3 py-2 rounded-md hover:bg-muted">
                Tableau de bord
              </a>
              <a href="#" className="block px-3 py-2 rounded-md hover:bg-muted">
                Sessions VR
              </a>
              <a href="#" className="block px-3 py-2 rounded-md hover:bg-muted">
                Paramètres
              </a>
            </div>
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
};

export default UnifiedSidebar;
