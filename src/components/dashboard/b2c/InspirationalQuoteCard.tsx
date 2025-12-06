
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface InspirationalQuoteCardProps {
  className?: string;
}

const InspirationalQuoteCard: React.FC<InspirationalQuoteCardProps> = ({ className = '' }) => {
  const [quote, setQuote] = useState({ text: "", author: "" });

  const quotes = [
    { text: "Le secret du changement est de concentrer toute votre énergie non pas à lutter contre l'ancien, mais à construire le nouveau.", author: "Socrate" },
    { text: "La vie n'est pas d'attendre que les orages passent, c'est d'apprendre comment danser sous la pluie.", author: "Sénèque" },
    { text: "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il découle de vos propres actions.", author: "Dalaï Lama" },
    { text: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas, c'est parce que nous n'osons pas qu'elles sont difficiles.", author: "Sénèque" }
  ];

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="bg-primary/10 p-2 rounded-full mr-4">
            <Quote className="h-5 w-5 text-primary" />
          </div>
          <div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-lg italic mb-2"
            >
              "{quote.text}"
            </motion.p>
            <p className="text-sm text-muted-foreground">— {quote.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspirationalQuoteCard;
