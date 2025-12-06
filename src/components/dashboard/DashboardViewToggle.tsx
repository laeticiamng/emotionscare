// @ts-nocheck

import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Rows3 } from 'lucide-react';

interface DashboardViewToggleProps {
  minimalView: boolean;
  onToggle: () => void;
}

const DashboardViewToggle: React.FC<DashboardViewToggleProps> = ({
  minimalView,
  onToggle
}) => {
  return (
    <div className="flex items-center gap-2 bg-muted/40 rounded-lg p-1">
      <Button
        variant={minimalView ? "ghost" : "default"}
        size="sm"
        onClick={() => minimalView && onToggle()}
        className="flex items-center gap-1"
      >
        <LayoutDashboard className="h-4 w-4" />
        <span className="hidden sm:inline">Complet</span>
      </Button>
      <Button
        variant={minimalView ? "default" : "ghost"}
        size="sm"
        onClick={() => !minimalView && onToggle()}
        className="flex items-center gap-1"
      >
        <Rows3 className="h-4 w-4" />
        <span className="hidden sm:inline">Minimal</span>
      </Button>
    </div>
  );
};

export default DashboardViewToggle;
