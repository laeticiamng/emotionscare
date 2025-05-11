
import React from 'react';

export interface GamificationWidgetProps {
  collapsed: boolean;
  onToggle: () => void;
  userId?: string;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({ collapsed, onToggle, userId }) => {
  return (
    <div>
      <p>Gamification Widget</p>
    </div>
  );
};

export default GamificationWidget;
