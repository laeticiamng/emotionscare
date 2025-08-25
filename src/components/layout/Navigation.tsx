import React from 'react';
import { NAV_SCHEMA } from '@/lib/nav-schema';
import { NavButton } from '@/components/navigation/NavButton';
import { cn } from '@/lib/utils';

export function Navigation() {
  return (
    <nav className="sticky top-16 z-40 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-1">
            {NAV_SCHEMA.map((node) => (
              <NavButton 
                key={node.id} 
                node={node}
                variant="ghost"
                size="sm"
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <NavButton 
              node={{
                id: "account",
                labelKey: "nav.account",
                icon: "User",
                action: { type: "route", to: "/account" },
                guard: { requiresAuth: true }
              }}
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}