
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  actions
}) => {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:justify-between md:items-center mb-6">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary/80">{icon}</div>}
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
