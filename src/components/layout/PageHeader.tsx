
import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  icon?: ReactNode; // Added icon prop to support using icons in header
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description,
  children,
  icon // Add icon to the destructured props
}) => {
  return (
    <div className="pb-4 mb-6 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>} {/* Render the icon when provided */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
