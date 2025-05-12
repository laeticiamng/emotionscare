
import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description,
  children 
}) => {
  return (
    <div className="pb-4 mb-6 border-b">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
