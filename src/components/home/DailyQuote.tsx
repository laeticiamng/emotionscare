// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Quote {
  text: string;
  author: string;
}

// Fallback quotes
const fallbackQuotes: Quote[] = [
  { text: "La vie est un mystère qu'il faut vivre, et non un problème à résoudre.", author: "Gandhi" },
  { text: "Le bonheur n'est pas une destination, mais une façon de voyager.", author: "Margaret Lee Runbeck" },
  { text: "La paix commence par un sourire.", author: "Mère Teresa" },
  { text: "L'émotion est la principale source de toute prise de conscience.", author: "Carl Jung" },
  { text: "Ce n'est pas ce qui nous arrive, mais notre réaction à ce qui nous arrive qui est importante.", author: "Épictète" },
  { text: "Le meilleur moyen de prédire l'avenir est de le créer.", author: "Peter Drucker" },
  { text: "La beauté commence au moment où vous décidez d'être vous-même.", author: "Coco Chanel" },
  { text: "L'art de vivre consiste en un subtil mélange entre lâcher prise et tenir bon.", author: "Henri Lewis" },
  { text: "Chaque jour est une nouvelle chance de changer votre vie.", author: "Anonyme" },
  { text: "La conscience est la boussole de l'âme.", author: "Vincent van Gogh" },
  { text: "La musique peut changer le monde car elle peut changer les personnes.", author: "Bono" },
  { text: "Lorsque vous écoutez avec empathie une autre personne, vous lui donnez de l'espace pour respirer.", author: "Nancy Kline" }
];

const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState<Quote>({ text: '', author: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDailyQuote = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');

        // Get today's date to select a consistent quote for the day
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);

        // Try to fetch quotes from Supabase
        const { data: quotesData } = await supabase
          .from('daily_quotes')
          .select('text, author')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        const quotes = quotesData && quotesData.length > 0 ? quotesData : fallbackQuotes;
        const quoteIndex = dayOfYear % quotes.length;
        const selectedQuote = quotes[quoteIndex];

        setQuote(selectedQuote);
        setLoading(false);
      } catch (error) {
        console.error('Error loading daily quote:', error);
        // Use fallback quotes
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
        const quoteIndex = dayOfYear % fallbackQuotes.length;
        setQuote(fallbackQuotes[quoteIndex]);
        setLoading(false);
      }
    };

    loadDailyQuote();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QuoteIcon className="h-5 w-5 text-primary" />
          Citation du jour
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse h-24 flex flex-col justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between space-y-4"
          >
            <p className="text-lg italic">"{quote.text}"</p>
            <p className="text-right font-medium text-muted-foreground">— {quote.author}</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyQuote;
