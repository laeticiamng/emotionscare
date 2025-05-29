
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-card border-r">
      <Card className="h-full rounded-none border-0">
        <CardContent className="p-4">
          <nav className="space-y-2">
            <h2 className="text-lg font-semibold mb-4">Navigation</h2>
            <div className="space-y-1">
              <a href="/" className="block px-3 py-2 rounded-md hover:bg-muted">
                Accueil
              </a>
            </div>
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
};
