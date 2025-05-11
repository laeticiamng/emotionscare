
import React from 'react';

export interface SocialCocoonWidgetProps {
  collapsed: boolean;
  onToggle: () => void;
  userId?: string;
}

const SocialCocoonWidget: React.FC<SocialCocoonWidgetProps> = ({ collapsed, onToggle, userId }) => {
  return (
    <div>
      <p>Social Cocoon Widget</p>
    </div>
  );
};

export default SocialCocoonWidget;
