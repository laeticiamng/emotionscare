
import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  className = '',
  icon
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {icon && <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
