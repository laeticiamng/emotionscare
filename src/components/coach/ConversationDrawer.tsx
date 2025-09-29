
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

interface ConversationDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  renderContent: () => React.ReactNode;
}

const ConversationDrawer: React.FC<ConversationDrawerProps> = ({
  isOpen,
  onOpenChange,
  renderContent
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu de conversation</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="h-[80vh]">
          {renderContent()}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ConversationDrawer;
