import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationItem } from '@/config/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbProps {
  items: NavigationItem[];
  className?: string;
}

/**
 * Composant de fil d'Ariane (breadcrumb)
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  if (!items.length) return null;

  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)}>
      {/* Icône d'accueil */}
      <Link
        to="/"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {/* Items du breadcrumb */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={item.id}>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            
            {isLast ? (
              <span className="flex items-center space-x-1 text-foreground font-medium">
                <Icon className="h-3 w-3" />
                <span>{item.title}</span>
              </span>
            ) : (
              <Link
                to={item.path}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="h-3 w-3" />
                <span>{item.title}</span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};