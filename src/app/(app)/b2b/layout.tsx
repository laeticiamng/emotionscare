import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { B2BLayoutShell } from './layout-shell';

export const metadata: Metadata = {
  title: 'Suite B2B — EmotionsCare',
  robots: {
    index: false,
    follow: false,
  },
};

export default function B2BLayout({ children }: { children: ReactNode }) {
  return <B2BLayoutShell>{children}</B2BLayoutShell>;
}
