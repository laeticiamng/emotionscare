
import React from 'react';
import { Helmet } from 'react-helmet-async';
import JournalTab from '@/components/dashboard/tabs/JournalTab';

const B2CJournalPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Journal - EmotionsCare</title>
        <meta name="description" content="Suivez vos émotions et réflexions dans votre journal personnel" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <JournalTab />
      </div>
    </>
  );
};

export default B2CJournalPage;
