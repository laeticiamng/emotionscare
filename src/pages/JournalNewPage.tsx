
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import JournalPageHeader from '@/components/journal/JournalPageHeader';
import BackgroundAnimation from '@/components/journal/BackgroundAnimation';
import { useJournalEntry } from '@/hooks/useJournalEntry';

const JournalNewPage: React.FC = () => {
  const { isSaving, backgroundGradient, setRandomGradient, handleSave } = useJournalEntry();

  useEffect(() => {
    setRandomGradient();
  }, []);

  return (
    <div className={`container mx-auto py-8 min-h-[80vh] relative ${backgroundGradient}`}>
      <BackgroundAnimation />

      <JournalPageHeader title="Nouvelle Entrée de Journal" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <JournalEntryForm onSubmit={handleSave} isSaving={isSaving} />
      </motion.div>
    </div>
  );
};

export default JournalNewPage;
