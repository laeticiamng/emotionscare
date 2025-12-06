/**
 * Exchange Hub Page
 * Route: /exchange
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ExchangeHub } from '@/modules/exchange';

const ExchangeHubPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Exchange Hub | EmotionsCare</title>
        <meta 
          name="description" 
          content="Découvrez le Exchange Hub - La première plateforme mondiale où émotions, temps, confiance et progression deviennent des valeurs interactives." 
        />
      </Helmet>
      <ExchangeHub />
    </>
  );
};

export default ExchangeHubPage;
