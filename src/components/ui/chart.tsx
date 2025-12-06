import React from 'react';

// Chart container component
export const ChartContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children,
  className,
  ...props 
}) => {
  return (
    <div 
      className={`w-full h-[300px] flex items-center justify-center overflow-hidden ${className || ''}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// Export additional chart components here
export const ChartLegend: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children,
  className,
  ...props 
}) => {
  return (
    <div 
      className={`flex flex-wrap gap-2 items-center justify-center mt-4 ${className || ''}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const ChartTooltip: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children,
  className,
  ...props 
}) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 p-2 shadow-md rounded border border-gray-200 dark:border-gray-700 ${className || ''}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// Ajout des composants manquants
export const ChartInteractiveLegend: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children,
  className,
  ...props 
}) => {
  return (
    <div 
      className={`flex flex-wrap gap-2 items-center justify-center mt-4 ${className || ''}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const ZoomableChart: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children,
  className,
  ...props 
}) => {
  return (
    <div 
      className={`w-full h-full overflow-hidden ${className || ''}`} 
      {...props}
    >
      {children}
    </div>
  );
};
