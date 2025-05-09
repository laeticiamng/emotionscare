
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import { saveJournalEntry } from '@/lib/journalService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const JournalNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [backgroundGradient, setBackgroundGradient] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Set a random gradient from a set of calming gradients
    const gradients = [
      'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20',
      'bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20',
      'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-800/20',
      'bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-800/20',
    ];
    
    setBackgroundGradient(gradients[Math.floor(Math.random() * gradients.length)]);
  }, []);

  const handleSave = async (entryData: any) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour enregistrer une entrée de journal",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const enrichedData = {
        ...entryData,
        user_id: user.id
      };
      
      const result = await saveJournalEntry(enrichedData);
      console.log('Journal entry saved:', result);
      // We don't navigate away immediately because the form will show the success animation
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre entrée de journal",
        variant: "destructive"
      });
      setIsSaving(false);
    }
  };

  return (
    <div className={`container mx-auto py-8 min-h-[80vh] relative ${backgroundGradient}`}>
      {/* Subtle animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(148,187,233,0.3) 0%, rgba(238,174,202,0.1) 100%)',
            backgroundSize: '400% 400%',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center"
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/journal')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour
        </Button>
        
        <h1 className="text-2xl font-semibold inline-flex items-center">
          <BookOpen className="mr-2 h-5 w-5" /> 
          Nouvelle Entrée de Journal
        </h1>
      </motion.div>

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
