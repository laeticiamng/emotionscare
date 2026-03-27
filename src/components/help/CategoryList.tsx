// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { type Section } from '@/store/help.store';
import { useNavigate } from 'react-router-dom';

interface CategoryListProps {
  items: Section[];
}

export const CategoryList: React.FC<CategoryListProps> = ({ items }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    navigate(`/help/section/${slug}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((section) => (
        <Card 
          key={section.id}
          className="cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => handleCategoryClick(section.slug)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                {section.icon && (
                  <span className="text-lg" role="img" aria-hidden="true">
                    {section.icon}
                  </span>
                )}
                {section.name}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <CardDescription className="text-sm">
              {section.slug === 'modules' && "Guides d'utilisation des modules EmotionsCare"}
              {section.slug === 'account' && "Gestion de votre compte et préférences"}
              {section.slug === 'rgpd' && "Vos données, export et suppression RGPD"}
              {section.slug === 'technical' && "Problèmes techniques et compatibilité"}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};