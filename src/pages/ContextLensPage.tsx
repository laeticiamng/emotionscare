/**
 * Context Lens Page
 * Page principale du module Context Lens
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ContextLensDashboard } from '@/features/context-lens';

const ContextLensPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Context Lens | EmotionsCare</title>
        <meta
          name="description"
          content="Analyse de vos patterns émotionnels et insights personnalisés avec l'IA"
        />
      </Helmet>

      <div className="container py-6">
        <ContextLensDashboard />
      </div>
    </>
  );
};

export default ContextLensPage;
