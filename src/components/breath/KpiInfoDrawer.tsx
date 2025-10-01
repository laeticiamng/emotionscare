// @ts-nocheck
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

interface Props {
  title: string;
  children: React.ReactNode;
}

const KpiInfoDrawer: React.FC<Props> = ({ title, children }) => (
  <Drawer>
    <DrawerTrigger asChild>
      <button aria-label="info" className="ml-2 text-sm">i</button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
      </DrawerHeader>
      <div className="p-4 text-sm">{children}</div>
    </DrawerContent>
  </Drawer>
);

export default KpiInfoDrawer;
