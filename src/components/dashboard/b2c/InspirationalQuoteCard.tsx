import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export interface InspirationalQuote {
  text: string;
  author: string;
}

interface InspirationalQuoteCardProps {
  quote: InspirationalQuote;
}

const InspirationalQuoteCard: React.FC<InspirationalQuoteCardProps> = ({ quote }) => (
  <Card className="overflow-hidden bg-gradient-to-br from-green-50/80 to-teal-50/80 dark:from-green-900/10 dark:to-teal-900/20 border-green-100 dark:border-green-900/50">
    <CardHeader>
      <CardTitle className="flex items-center">
        <BookCheck className="h-6 w-6 mr-2 text-green-500" />
        Citation inspirante
      </CardTitle>
      <CardDescription>Pour vous accompagner aujourd'hui</CardDescription>
    </CardHeader>
    <CardContent>
      <blockquote className="p-6 bg-white/60 dark:bg-white/5 rounded-lg border border-green-100 dark:border-green-900/30 relative">
        <motion.div
          className="absolute top-2 left-2 text-5xl text-green-200 dark:text-green-900/30 font-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          "
        </motion.div>
        <motion.p
          className="italic text-lg relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {quote.text}
        </motion.p>
        <motion.footer
          className="mt-4 text-right text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          — {quote.author}
        </motion.footer>
      </blockquote>
    </CardContent>
  </Card>
);

export default InspirationalQuoteCard;
