/**
 * 📋 CONDITIONS D'UTILISATION
 */

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface TermsPageProps {
  'data-testid'?: string;
}

export default function TermsPage({ 'data-testid': testId }: TermsPageProps) {
  return (
    <div className="min-h-screen bg-background" data-testid={testId}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Conditions d'Utilisation</h1>
        <div className="prose max-w-4xl">
          <p>Dernière mise à jour : {new Date().toLocaleDateString()}</p>
          <h2>1. Acceptation des conditions</h2>
          <p>En utilisant EmotionsCare, vous acceptez ces conditions d'utilisation.</p>
          <h2>2. Services fournis</h2>
          <p>EmotionsCare fournit des services d'analyse émotionnelle et de thérapie musicale.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}