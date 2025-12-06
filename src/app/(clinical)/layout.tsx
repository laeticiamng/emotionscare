'use client';

import React from 'react';

import { ConsentGate } from '@/features/clinical-optin/ConsentGate';

interface ClinicalLayoutProps {
  children: React.ReactNode;
}

export default function ClinicalLayout({ children }: ClinicalLayoutProps) {
  return <ConsentGate>{children}</ConsentGate>;
}

