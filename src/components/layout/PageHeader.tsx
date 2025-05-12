
import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  actions,
  children
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between pb-4 mb-4 border-b">
      <div className="flex items-center">
        {icon && <div className="mr-2 text-primary">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
      {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
      {children}
    </div>
  );
};

export { PageHeader };
export default PageHeader;
