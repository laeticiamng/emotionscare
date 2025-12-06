// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search, Star, BookOpen, Video, Download, ExternalLink } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    id: '1',
    question: "Comment modifier mes préférences émotionnelles ?",
    answer: "Accédez à votre profil en cliquant sur votre avatar en haut à droite, puis sélectionnez 'Préférences'. Vous pourrez y personnaliser toutes vos préférences d'analyse émotionnelle.",
    category: "account"
  },
  {
    id: '2',
    question: "Comment exporter mes données d'analyse ?",
    answer: "Dans votre tableau de bord, cliquez sur 'Synthèse', puis sur 'Exporter'. Vous pourrez choisir le format de vos données et la période concernée.",
    category: "data"
  },
  {
    id: '3',
    question: "Comment fonctionne l'analyse émotionnelle ?",
    answer: "Notre système utilise une IA avancée pour analyser vos expressions et communications. Il détecte les émotions à travers le texte, la voix et les expressions faciales si vous l'autorisez.",
    category: "features"
  },
  {
    id: '4',
    question: "Comment puis-je contacter l'assistance ?",
    answer: "Vous pouvez contacter notre équipe via le chat d'assistance en bas à droite de votre écran, ou en envoyant un email à support@emotionscare.com.",
    category: "support"
  },
  {
    id: '5',
    question: "Comment protéger ma confidentialité ?",
    answer: "Accédez aux paramètres de confidentialité dans votre profil. Vous pouvez y définir qui peut voir vos données, activer le mode privé ou anonymiser certaines analyses.",
    category: "privacy"
  }
];

const CATEGORIES = [
  { id: "all", label: "Tout", icon: BookOpen },
  { id: "account", label: "Compte", icon: Star },
  { id: "data", label: "Données", icon: Download },
  { id: "features", label: "Fonctionnalités", icon: Video },
  { id: "privacy", label: "Confidentialité", icon: Star },
  { id: "support", label: "Assistance", icon: ExternalLink },
];

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredFAQs = FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    const cat = CATEGORIES.find(c => c.id === category);
    if (!cat) return null;
    const Icon = cat.icon;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Centre d'aide
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans l'aide..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>
        
        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <Search className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">Aucun résultat trouvé pour "{searchTerm}"</p>
            <Button variant="link" onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}>
              Réinitialiser la recherche
            </Button>
          </div>
        )}

        <Accordion type="multiple" className="w-full">
          {filteredFAQs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-b-0">
              <AccordionTrigger className="text-left hover:no-underline py-3 pr-3">
                <div className="flex flex-1 items-center gap-2">
                  <CategoryIcon category={faq.category} />
                  <span>{faq.question}</span>
                </div>
                <Badge variant="outline" className="ml-auto text-xs whitespace-nowrap">
                  {CATEGORIES.find(c => c.id === faq.category)?.label || 'Général'}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="text-muted-foreground">{faq.answer}</div>
                <div className="flex justify-end mt-2">
                  <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    En savoir plus
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default HelpCenter;
