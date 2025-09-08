/**
 * 🔒 POLITIQUE DE CONFIDENTIALITÉ
 */

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface PrivacyPageProps {
  'data-testid'?: string;
}

export default function PrivacyPage({ 'data-testid': testId }: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-background" data-testid={testId}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>
        <div className="prose max-w-4xl">
          <p>Chez EmotionsCare, nous respectons votre vie privée et protégeons vos données personnelles.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}