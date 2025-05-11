import React from 'react';
import { VRSessionTemplate } from '@/types/vr';

export interface VRHistoryListProps {
  onSelect: (template: VRSessionTemplate) => void;
  templates?: VRSessionTemplate[];
  title?: string;
  emptyMessage?: string;
  className?: string;
  limit?: number;
}

const VRHistoryList: React.FC<VRHistoryListProps> = ({ 
  onSelect,
  templates = [],
  title = "Session History",
  emptyMessage = "No previous sessions found",
  className = "",
  limit
}) => {
  const displayTemplates = limit ? templates.slice(0, limit) : templates;
  
  return (
    <div className={`vr-history-list ${className}`}>
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      
      {displayTemplates.length > 0 ? (
        <div className="space-y-2">
          {displayTemplates.map(template => (
            <div 
              key={template.id}
              onClick={() => onSelect(template)}
              className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="font-medium">{template.name}</div>
              {template.description && (
                <div className="text-sm text-muted-foreground">{template.description}</div>
              )}
              {template.lastUsed && (
                <div className="text-xs text-muted-foreground mt-1">
                  Last used: {new Date(template.lastUsed).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

export default VRHistoryList;
