import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  slug: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Questions fréquentes</h3>
      
      <Accordion type="single" collapsible className="space-y-2">
        {items.map((faq) => (
          <AccordionItem 
            key={faq.id} 
            value={faq.id}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger 
              className="text-left hover:no-underline py-4"
              aria-controls={`faq-content-${faq.id}`}
            >
              <span className="font-medium">{faq.question}</span>
            </AccordionTrigger>
            
            <AccordionContent 
              id={`faq-content-${faq.id}`}
              className="pb-4 text-muted-foreground"
            >
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          Vous ne trouvez pas votre réponse ? {' '}
          <button 
            className="text-primary hover:underline"
            onClick={() => window.location.href = 'mailto:support@emotionscare.com'}
          >
            Contactez-nous
          </button>
        </p>
      </div>
    </div>
  );
};